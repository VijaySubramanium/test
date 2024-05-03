import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ProjectDetailsService } from 'src/app/services/project-details.service';
import { UsermanagementService } from 'src/app/services/user-management.service';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { NgForm, FormControl } from '@angular/forms';
import { historicalData } from '../view-models/historicalData';
import { HistoricalDataService } from 'src/app/services/historical-data.service';
import { Table } from 'primeng/table';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Title } from '@angular/platform-browser';
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';

interface users {
  user_id: string,
  user_name: string,
  gtt_id: string
};

@Component({
  selector: 'app-historical-data',
  templateUrl: './historical-data.component.html',
  providers: [MessageService, DatePipe],
  styleUrls: ['./historical-data.component.css']
})

export class HistoricalDataComponent implements OnInit {
  // @ViewChild(Table) dt: Table;
  rightSideMenus: any = [];
  public loggedInRoleName: string;
  public user: any = '';
  public roles: any = [];
  public accessRoleNames: any = [];
  public generatedLinkAccess: any = [];
  public loggedInRoleId: number;
  public currentLoginUserId: number;
  currentTab1: string = 'Historical Data';
  @ViewChild('studentFile') studentFile;
  public listofProject: any = [];
  public listofBatches: any = [];
  public listofUsers: any = [];
  UserData = new historicalData();
  selectedUsers: any = [];
  batchUsers: any = [];
  userFiles: any = [];
  userFileMessage: string = null;
  historicalDataTable: boolean = false;

  //View

  public listofViewYears: any = [];
  public listofViewBatches: any = [];
  public selectedViewUsers: any = [];
  public selectViewListUsers: users[];
  // public selectViewListUsers: any = [];

  public viewData = {
    'projectId': "",
    'year': "",
    'batchId': "",
    'userId': []
  }




  // Table Declartion
  exportHistoricalName: string = 'Historical-Details';
  public HistoricalSearchFilter: any = [];
  public selectedHistoricalDetails: any = [];
  public studentFileDetails: any;
  public folderStudentsFiles: any;
  public cols: any[];
  public exportColumns: any[];
  public exportCols: any[];
  public columns: any[];
  _selectedProjectColumns: { field: string; header: string; align: string }[];
  _selectedFieldColumns: any[];
  _selectedColumnsDup: any[];


  constructor(
    public projectService: ProjectDetailsService,
    public datepipe: DatePipe,
    private titleService: Title,
    public messageService: MessageService,
    private UsermanagementService: UsermanagementService,
    private HistoricalDataService: HistoricalDataService,
    private http: HttpClient
  ) {

    this.user = localStorage.getItem('userId');
    this.roles = JSON.parse(localStorage.getItem('roles'));
    this.loggedInRoleId = JSON.parse(this.user).user_role.role_id;
    let loggedInRoleName = JSON.parse(this.user).user_role.role;
    this.currentLoginUserId = JSON.parse(this.user).id;
    this.loggedInRoleName = loggedInRoleName
      .replace(/\w+/g, function (txt) {
        return txt.toUpperCase();
      })
      .replace(/\s/g, '_');
    this.accessRoleNames = ['GTT_ADMIN'];
    this.generatedLinkAccess = ['GTT_ADMIN', 'PROJECT_MANAGER'];
    // this.getProjectList();
    this.projectNameList();

  }

  ngOnInit(): void {
    $('.spinner').hide();



    this._selectedProjectColumns = [
      { field: 'gttid', header: 'Gtt Id', align: 'center' },
      {
        field: 'username',
        header: 'User Name',
        align: 'center',
      },
      { field: 'filename', header: 'File Name', align: 'center' },
    ];

    this._selectedColumnsDup = this._selectedProjectColumns;

    this.setTitle('TJM-Historical Data');
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }


  onListOfRightMenus(eventData: string) {
    let arr = JSON.parse(eventData);
    Object.entries(arr).forEach(([key, value]) =>
      this.rightSideMenus.push(value)
    );
  }

  columnFilter($event: any) {
    if ($event.value.length == 0) {
      this._selectedProjectColumns = this._selectedColumnsDup;
    }
  }

  addFolderReset(addFolder: NgForm, viewFile: NgForm) {
    addFolder.resetForm();
    viewFile.resetForm();
    this.studentFile.nativeElement.value = '';
    viewFile.form.value.viewprojectname = '';
    viewFile.form.value.viewyear = '';
    viewFile.form.value.viewbatch = '';
    this.viewData.batchId = '';
    this.viewData.projectId = '';
    this.viewData.year = '';
    this.listofBatches = [];
    this.listofViewBatches = [];
    this.listofViewYears = [];
    this.listofUsers = [];
    this.selectViewListUsers = [];
    this.historicalDataTable = false;
  }

  getBatchDetails(projectValue) {
    $('.spinner').show();
    this.listofBatches = [];
    let projectId = projectValue.split('_');
    this.UsermanagementService.getProjectBasedBatchList(projectId[0]).subscribe((response) => {
      $('.spinner').hide();
      const batchDetails = response.data.sort((a: any, b: any) =>
        a.project_name > b.project_name ? 1 : -1
      );
      batchDetails.forEach((elem: any, index: number) => {
        let batchCode = this.listofBatches.findIndex((x: any) => {
          return x.batch_code == elem.batch_code;
        });
        if (batchCode == -1) {
          this.listofBatches.push({
            'batch_id': elem.batch_id,
            'batch_code': elem.batch_code
          });
        }
      });

    });
  }


  getUserDetails(batchId) {
    $('.spinner').show();
    this.listofUsers = [];
    this.UsermanagementService.getBatchBasedUserList(batchId).subscribe((response) => {
      $('.spinner').hide();

      const userDetails = response.data.user_details.sort((a: any, b: any) =>
        a.user_name > b.user_name ? 1 : -1
      );

      userDetails.forEach((elem: any, index: number) => {
        this.listofUsers.push({
          'user_id': elem.user_id,
          'user_name': elem.user_name,
          'gtt_id': elem.gttid
        });
      });
    });
  }

  addFolderSubmit(addFolder, viewFile) {

    if (addFolder.form.valid && this.userFileMessage == null && this.userFiles.length > 0) {
      let userIds = [];
      let gttIds = [];
      addFolder.form.value.users.forEach((el, ix) => {
        if (el.gtt_id != '' && el.gtt_id != null) {
          if (!userIds.includes(el.user_id.toString())) {
            userIds.push(el.user_id.toString());
          }
          if (!gttIds.includes(el.gtt_id.toString())) {
            gttIds.push(el.gtt_id.toString())
          }
        }
      });

      let params = {
        'projectid': addFolder.form.value.projectid,
        'year': addFolder.form.value.year,
        'batchid': addFolder.form.value.batchid,
        'userid': userIds,
        'gttid': gttIds
      }

      $('.spinner').show();
      this.HistoricalDataService.saveFiles(params, this.userFiles).subscribe({
        next: response => {
          if (response.status.toLowerCase() == "success") {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
            $('.spinner').hide();
            ($('#addfolder') as any).modal('hide');
            this.addFolderReset(addFolder, viewFile);
            viewFile.resetForm();
            viewFile.form.value.viewprojectname = '';
            viewFile.form.value.viewyear = '';
            viewFile.form.value.viewbatch = '';
            this.viewData.batchId = '';
            this.viewData.projectId = '';
            this.viewData.year = '';
            this.listofBatches = [];
            this.listofViewBatches = [];
            this.listofViewYears = [];
            this.listofUsers = [];
            this.selectViewListUsers = [];
            this.historicalDataTable = false;
          } else {
            $('.spinner').hide();
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        },
        error: response => {
          $('.spinner').hide();
          this.messageService.add({ severity: 'error', summary: 'Error', detail: (response.error.message == null) ? response.error.error : response.error.message });
        }
      });
    }
  }


  getProjectViewFolders(projectId) {

    $('.spinner').show();
    this.listofViewYears = [];
    this.listofViewBatches = [];
    this.selectViewListUsers = [];
    this.selectedViewUsers = [];
    this.viewData.batchId = "";
    this.viewData.year = "";
    this.HistoricalDataService.getProjectViewFolders(projectId).subscribe((response) => {
      $('.spinner').hide();
      console.log(response);
      response.data.forEach((elem: any, index: number) => {
        this.listofViewYears.push({
          'year': elem.year,
        });
      });
    });
  }


  getFolderViewBatches(year) {
    $('.spinner').show();
    this.listofViewBatches = [];
    this.selectViewListUsers = [];
    this.selectedViewUsers = [];
    this.viewData.batchId = "";
    this.HistoricalDataService.getFolderViewBatches(year, this.viewData.projectId).subscribe((response) => {
      $('.spinner').hide();
      response.data.forEach((elem: any, index: number) => {
        this.listofViewBatches.push({
          'batch_id': elem.batchid,
          'batch_code': elem.batchcode
        });
      });
    });
  }

  getBatchViewStudents(viewFile: NgForm) {
    $('.spinner').show();
    this.selectViewListUsers = [];
    this.HistoricalDataService.getBatchViewStudents(viewFile).subscribe((response) => {
      $('.spinner').hide();
      console.log(response);
      response.data.forEach((elem: any, index: number) => {
        this.selectViewListUsers.push({
          'user_id': elem.userid,
          'user_name': elem.username,
          'gtt_id': elem.gttid,
        });
      });
    });
  }


  getBatchViewStudentFiles(viewFile: NgForm) {

    let userids = [];
    if (viewFile.form.valid && this.selectedViewUsers != null) {
      if (this.selectedViewUsers.length > 0) {
        this.selectedViewUsers.forEach((elem, indx) => {
          userids.push(elem.user_id.toString());
        });

        let params = {
          'projectid': viewFile.form.value.viewprojectname,
          'foldername': viewFile.form.value.viewyear,
          'batchid': viewFile.form.value.viewbatch,
          'userid': userids
        }

        debugger

        $('.spinner').show();
        this.HistoricalDataService.getBatchViewStudentFiles(params).subscribe({
          next: response => {
            let fileList = {};
            if (response.status.toLowerCase() == "success") {
              $('.spinner').hide();
              this.studentFileDetails = [];
              this.folderStudentsFiles = [];
              let studentsFolderFiles = {};
              this.columns = [];
              this.cols = [];
              let uniqueValues = [];
              if (response.data.length > 0) {
                this.historicalDataTable = true;
                response.data.forEach((elem, indx) => {

                  // if (!studentsFolderFiles.hasOwnProperty(elem.userid)) {
                  //   studentsFolderFiles[elem.userid] = [];
                  // }

                  // if (!studentsFolderFiles[elem.userid].hasOwnProperty(elem.historyid)) {
                  //   studentsFolderFiles[elem.userid][elem.historyid] = [];
                  // }

                  // studentsFolderFiles[elem.userid][elem.historyid].push(elem.filename);

                  if (!uniqueValues.includes(elem.filename + '_' + elem.userid)) {
                    uniqueValues.push(elem.filename + '_' + elem.userid);
                    this.studentFileDetails.push(elem);
                  }
                });

                console.log(studentsFolderFiles);

                // this.studentFileDetails = response.data;
                console.log(this.studentFileDetails);
                var result = Object.keys(this.studentFileDetails[0]).map(function (
                  key: string
                ) {
                  return key;
                });

                result.forEach((elem: any, key: any) => {
                  let headerName = this.humanize(elem);

                  if (
                    elem != 'historyid' &&
                    elem != 'azureurl' &&
                    elem != 'userid'
                  ) {
                    this.columns.push({
                      field: elem,
                      header: headerName,
                      align: 'center',
                    });
                  }
                });

                this.cols = this.columns;
                this.exportColumns = this.cols.map((col) => ({
                  title: col.header,
                  dataKey: col.field,
                }));

                this.exportCols = this.cols.map((col) => ({ dataKey: col.field }));
              }






              // response.data.forEach((elem, indx) => {
              //   if (!fileList.hasOwnProperty(elem.userid)) {
              //     fileList[elem.userid] = [];
              //   }
              //   fileList[elem.userid].push(elem);
              // });



            } else {
              $('.spinner').hide();
              this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
            }
          },
          error: response => {
            $('.spinner').hide();
            this.messageService.add({ severity: 'error', summary: 'Error', detail: (response.error.message == null) ? response.error.error : response.error.message });
          }
        });
      }
    }
  }

  downloadFiles() {
    if (this.selectedHistoricalDetails.length > 0) {
      let userArr = [];
      let fileList = {}
      this.selectedHistoricalDetails.forEach((el, ix) => {
        // if (!fileList.hasOwnProperty(el.userid)) {
        //   fileList[el.userid] = [];
        // }
        // fileList[el.userid].push(el.historyid);
        // userArr.push({
        //   'userid': el.userid,
        //   'historyid': fileList[el.userid]
        // })
        userArr.push(el.userid + '-' + el.historyid);
      });

      let historyIds = this.selectedHistoricalDetails.map((x: { historyid: any }) => x.historyid);
      var multi_download = environment.BASE_API_URL + 'historicaldata/v2/document-download-files/' + userArr.toString();
      window.open(multi_download, '_blank');
      this.selectedHistoricalDetails = [];
      // console.log(JSON.stringify(params));


      // $('.spinner').show();
      // this.HistoricalDataService.getDownloadFiles(params).subscribe({
      //   next: response => {

      //   },
      //   error: response => {
      //     $('.spinner').hide();
      //     console.log(response.error.text);
      //     const jszip = new JSZip();
      //     jszip.file('Hello.zip', response.error.text);

      //     jszip.generateAsync({ type: 'blob' }).then(function (content) {
      //       // see FileSaver.js
      //       FileSaver.saveAs(content, 'example.zip');
      //     });
      //     this.messageService.add({ severity: 'error', summary: 'Error', detail: (response.error.message == null) ? response.error.error : response.error.message });
      //   }
      // });

      // let historyIds = this.selectedHistoricalDetails.map((x: { historyid: any }) => x.historyid);
      // var multi_download = environment.BASE_API_URL + 'historicaldata/document-download-files?historyId=' + historyIds.toString();
      // window.open(multi_download, '_blank');
      // this.selectedHistoricalDetails = [];
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select atleast one files' });
    }
  }

  myGroup = new FormGroup({
    file: new FormControl(),
  });

  onAddUseFileChange(event: any) {
    let files = event.target.files;
    this.userFiles = [];
    this.userFileMessage = null;
    for (var i = 0; i < files.length; i++) {
      const file = files[i];
      var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
      let _validFileExtensions = ['jpeg', 'xlsx', 'jpg', 'pdf', 'doc', 'png', 'xls', 'docx', 'PNG', 'JPEG', 'JPG', 'csv', 'CSV', 'PPT', 'ppt'];
      this.userFileMessage = null;
      if (_validFileExtensions.includes(ext)) {
        if (file.size > 10000000) {
          this.userFileMessage = 'File size less than 10MB';
        } else {
          this.userFileMessage = null;
          this.userFiles.push(files[i])
        }
      } else {
        this.userFileMessage = 'Invalid file format';
        this.userFiles = [];
      }
    }
  }


  columnFilterFields($event: any) {
    this._selectedFieldColumns = $event.value;
  }


  humanize(string: any) {
    let titleCaseString = string
      .replace(/(_|-)/g, ' ')
      .trim()
      .replace(/\w\S*/g, function (str: any) {
        return str.charAt(0).toUpperCase() + str.substr(1);
      })
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');

    return titleCaseString;
  }

  /*Project details tab navigation*/
  getHistoricalDetails($event: any) {
    if (!$event.index) {
      this.currentTab1 = 'Project';
    }
  }

  @Input() get selectedProjectColumns(): any[] {
    return this._selectedProjectColumns;
  }
  set selectedProjectColumns(val: any[]) {
    this._selectedProjectColumns = this.cols.filter((col) => val.includes(col));
  }


  /* Display Project list*/
  projectNameList() {
    $('.spinner').show();
    this.HistoricalDataService.getProjectList().subscribe((data) => {
      $('.spinner').hide();
      const project = data.data.sort((a: any, b: any) =>
        a.project_name > b.project_name ? 1 : -1
      );

      project.forEach((elem: any, index: number) => {
        if (elem.project_name != null && elem.status == 'Active') {
          this.listofProject.push(elem);
        }
      });
    });
  }


}
