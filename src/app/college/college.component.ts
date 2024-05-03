import { Component, Input, OnInit, Inject, ViewChild } from '@angular/core';
import { CollegeService } from 'src/app/services/college.service';
import { UsermanagementService } from 'src/app/services/user-management.service';
import { MessageService } from 'primeng/api';
import { CommonService } from '../common.service';
import { College } from 'src/app/view-models/collegereg';
import { collegeStatus } from '../view-models/collegechangestatus';
import { ToastrService } from 'ngx-toastr';
import { StudentProfile } from '../view-models/student-profile';
import { MultiSelectModule } from 'primeng/multiselect';
import * as FileSaver from 'file-saver';
import { ExportToCsv } from 'export-to-csv';
import { NgForm } from '@angular/forms';
import * as jsPDF from 'jspdf';
import * as xlsx from 'xlsx';
import 'jspdf-autotable';
import { collegeProjectAssign } from '../view-models/assignproject';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { toInteger } from '@ng-bootstrap/ng-bootstrap/util/util';
import { SelectItem } from 'primeng/api';
import { Title } from '@angular/platform-browser';
import { ClipboardService } from 'ngx-clipboard';
import { Table } from 'primeng/table';

interface City {
  name: string;
  code: string;
}

interface academicInstitution {
  academicInstitutionId: string;
  academicInstitutionName: string;
  cityname: string;
  cityid: string;
  state: string;
  stateid: string;
  TPOUserName: string;
  TPOuserid: string;
  KAMUserName: string;
  KAMuserid: string;
  agree: string;
}

@Component({
  selector: 'app-college',
  templateUrl: './college.component.html',
  providers: [MessageService],
  styleUrls: ['./college.component.css'],
})
export class CollegeComponent implements OnInit {


  @ViewChild(Table) dt: Table;
  cities: City[];
  selectedCollege: any;
  collegeNewDetails: any[];
  readonlyField: boolean;
  disabledTPOOption: boolean = false;
  disabledTPOName: string;

  userModel = new College('', '', '', '', '', '', '', '', '', '', '', '', '');
  collegeAssign = new collegeProjectAssign([], []);
  status: string;
  changecollegeStatus = new collegeStatus();
  ProfileName = new StudentProfile();
  receivedmessage: any;
  expotheader: any;
  exportCollege: string = 'College-Details';
  globalFilters: any = [];
  user: any = '';
  selectedIds: any = [];
  projectdropdownSettings: IDropdownSettings = {};
  projectdropdownList: { item_id: number; item_text: string }[];
  public successmsg: boolean = true;
  public tpoDetails: any = [];
  loggedInRoleId: number;
  accessRoleId: any;
  roles: any = [];
  public loggedInRoleName: string;
  public accessRoleNames: any = [];
  selectedCollegeDetails: any = [];
  stuProBulkUploadMsg: boolean = false;
  @ViewChild('stuProFileInput') stuProFileInput;
  stuProUploadError: boolean = true;
  tpoDisabled: boolean = false;

  // Bulk Upload
  public files: any;
  public bulkUploadFile: any;
  public selectedrows: any = [];
  rightSideMenus: any = [];

  /*Assign project*/
  projectddl: any = [];
  listOfErrors: any;
  codestatus: any;
  collegename: any = [];
  // collegeNewDetails: any = [];

  constructor(
    public collegeService: CollegeService,
    private titleService: Title,
    private messageService: MessageService,
    private toastr: ToastrService,
    public commonservice: CommonService,
    private clipboardService: ClipboardService,
    private UsermanagementService: UsermanagementService
  ) {
    /*Profile Name */
    // this.user = localStorage.getItem('userId');
    // this.loggedInRoleId = JSON.parse(this.user).user_role.role;
    // this.accessRoleId=['GTT Admin']

    this.user = localStorage.getItem('userId');
    this.roles = JSON.parse(localStorage.getItem('roles'));
    this.loggedInRoleId = JSON.parse(this.user).user_role.role_id;
    let loggedInRoleName = JSON.parse(this.user).user_role.role;
    this.loggedInRoleName = loggedInRoleName
      .replace(/\w+/g, function (txt) {
        return txt.toUpperCase();
      })
      .replace(/\s/g, '_');

    this.accessRoleNames = ['GTT_ADMIN'];

    this.getAdminCollegeDetails();
    this.listOfState();

    // this.listOfCollege();

  }

  collegeDetails: any = [];
  ddCollegeDetails: any = [];
  cols: any[];
  manualSearchCols: any[];
  _selectedColumns: any[];
  _selectedColumnsDup: any[];
  searchCols: any[];
  _selectedSearchColumns: any[];
  _searchedColumns: any[] = [];
  searchError: boolean = false;
  columns: any = [];
  exportColumns: any[];
  exportCols: any[];
  cityDetails: any = [];
  stateDetails: any = [];
  nameDetails: any = [];
  kamNameDetails: any = [];
  topNameDetails: any = [];
  editTPONameDetails: any = [];
  editKamNameDetails: any = [];
  currentCollegeId: number;
  college_id: number;
  kamEmailId: string;

  ngOnInit(): void {
    $('.dropdown-submenu a.submenu-a').on('click', function (e) {
      $('ul').find('.show-submenu').removeClass('show-submenu');
      $(this).next('ul').toggleClass('show-submenu');
      e.stopPropagation();
      e.preventDefault();
    });

    // $('.spinner').show();

    this._selectedColumns = [
      // { field: 'academic_institution_id', header: 'Id', align: 'center' },
      {
        field: 'academic_institution_name',
        header: 'Academic Institution Name',
        align: 'center',
      },
      // { field: 'city', header: 'Academic Instituion City', align: 'center' },
      // { field: 'state', header: 'State', align: 'center' },
      { field: 'project_name', header: 'Project Name', align: 'center' },
      // {
      //   field: 'project_manager_name',
      //   header: 'Project Manager Name',
      //   align: 'center',
      // },
      { field: 'tPO_name', header: 'TPO Name', align: 'center' },
      { field: 'tPO_mobile', header: 'TPO Mobile No', align: 'center' },
      { field: 'status', header: 'Status', align: 'center' },
    ];
    this._selectedColumnsDup = this._selectedColumns;
    this.globalFilters = [
      'academic_institution_name',
      'tPO_name',
      'tPO_mobile',
      'tPO_email',
      'kAM_name',
      'status',
    ];

    this.projectdropdownList = [];
    this.projectdropdownSettings = {
      idField: 'project_id',
      textField: 'project_name',
    };

    this.setTitle('TJM-College Management');
  }


  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  clearEvent(clgForm) {
    clgForm.resetForm();
    this.selectedCollege = null;
    this.disabledTPOOption = false;
  }

  searchClose() {
    debugger
    if (this._searchedColumns.length == 0) {
      this._selectedSearchColumns = [];
    } else {
      this._selectedSearchColumns = this._searchedColumns;
    }
    this.searchError = false;
    console.log(this._selectedSearchColumns)
  }


  searchHolder(field) {
    switch (field) {
      case "status":
        return "Search ('Active/Inactive')";
        break;
      default:
        return "Search";
        break;
    }
  }


  clearSearch() {
    this._selectedSearchColumns = [];
    this.searchCols = [...this.manualSearchCols].map(item => ({ ...item }));
    this.searchError = false;
    if (this._searchedColumns.length > 0) {
      this.getAdminCollegeDetails();
    }
    this._searchedColumns = [];
  }

  onChangeSearchKey($event) {
    if (this._selectedSearchColumns.length == 1) {
      this.searchError = false;
    }
  }


  submitSearch() {

    this.searchError = false;
    var searchCoulumns = [];
    this._selectedSearchColumns.forEach((column, index) => {
      if (column.condition == 'AND') {
        searchCoulumns.unshift(column);
      } else {
        searchCoulumns.push(column);
      }
    });

    console.log(searchCoulumns);


    var searchJsonArray = [];
    searchCoulumns.forEach((column, index) => {

      if (searchCoulumns.length != 1) {
        if (column.search && column.condition) {
          var obj = {
            Operation: index == 0 ? "" : column.condition,
            fieldName: column.field,
            value: column.search.trim()
          }
          searchJsonArray.push(obj);
        } else {
          this.searchError = true;
          return;
        }
      } else {
        if (column.search) {
          var obj = {
            Operation: index == 0 ? "" : column.condition,
            fieldName: column.field,
            value: column.search.trim()
          }
          searchJsonArray.push(obj);
        } else {
          this.searchError = true;
          return;
        }
      }

    });
    debugger;
    console.log(this._selectedSearchColumns);

    if (!this.searchError) {
      console.log(searchJsonArray);
      let searchJson = {
        Input: searchJsonArray
      }

      $('.spinner').show();

      this.collegeService.multiSearchUser(searchJson).subscribe({
        next: (response) => {
          $('.spinner').hide();
          if (response.status == 'Success') {
            this.collegeDetails = [];
            this.columns = [];
            this.manualSearchCols = [];
            console.log(this._selectedSearchColumns);
            this._searchedColumns = this._selectedSearchColumns;
            this.pushCollegeDetails(
              response.data,
              this.collegeDetails
            );
            ($('#collegeSearch') as any).modal('hide');
            this.dt.reset();

          }
        },
        error: (response) => {
          $('.spinner').hide();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              response.error.message == null
                ? response.error.error
                : response.error.message,
          });
        },
      });
    }
  }


  changeCollege($event, clgForm) {
    if (
      $event.value != null &&
      $event.value.tpo_status != null &&
      $event.value.tpo_status
    ) {
      this.readonlyField = true;
      this.disabledTPOOption = true;
      this.userModel.address = $event.value.address_line;
      this.userModel.state = $event.value.state_id + '_' + $event.value.state;
      if ($event.value.state_id != null) {
        this.collegeService
          .getFilterCity($event.value.state_id)
          .subscribe((response: any) => {
            if (response.data != null) {
              $('.spinner').hide();
              const citySorted = response.data.sort((a: any, b: any) =>
                a.cityname > b.cityname ? 1 : -1
              );
              this.cityDetails = citySorted;
              this.userModel.city = '';
              this.userModel.city =
                $event.value.city_id + '_' + $event.value.city;
            }
          });
      }
      this.disabledTPOName = $event.value.tPO_name;
      this.userModel.tpoUserid =
        $event.value.tpo_user_id + '_' + $event.value.tPO_name;
      this.userModel.tpoContactNumber = $event.value.tPO_mobile;
      this.userModel.tpoEmailId = $event.value.tPO_email;
      this.userModel.kamUserId =
        $event.value.kam_user_id + '_' + $event.value.kAM_name;
      this.userModel.academicInstitutionShortName =
        $event.value.academic_institution_short_name;
      this.userModel.statusvalue = $event.value.status;
      this.userModel.agree = 'true';
    } else {
      this.readonlyField = false;
      if (
        this.selectedCollege != null &&
        this.selectedCollege.academic_institution_name == 'Others'
      ) {
        clgForm.resetForm();
        this.selectedCollege = {
          academic_institution_id: 0,
          academic_institution_name: 'Others',
        };
        this.disabledTPOOption = false;
      } else {
        clgForm.resetForm();
        this.selectedCollege = $event.value;
        this.disabledTPOOption = false;
      }
    }
  }

  /* get College Details */
  getCollegeDetails(collegeId: any) {
    this.collegeService.getCollegeDetails().subscribe({
      next: (response) => {
        let CollegeDetails = response.data;
        var collegeInfo = CollegeDetails.filter(function (el) {
          return el.academic_institution_name == collegeId;
        });
        this.userModel.address = collegeInfo[0].address_line;
        this.userModel.state =
          collegeInfo[0].state != null
            ? collegeInfo[0].state_id + '_' + collegeInfo[0].state
            : '';
        this.userModel.city =
          collegeInfo[0].city != null
            ? collegeInfo[0].city_id + '_' + collegeInfo[0].city
            : '';
        this.userModel.academicInstitutionShortName =
          collegeInfo[0].academic_institution_short_name;
        this.userModel.tpoUserid =
          collegeInfo[0].tpo_firstname != null
            ? collegeInfo[0].tpo_user_id + '_' + collegeInfo[0].tpo_firstname
            : '';
        this.userModel.tpoContactNumber = collegeInfo[0].tpo_mobile;
        this.userModel.tpoEmailId = collegeInfo[0].tpo_email;
        this.userModel.kamUserId =
          collegeInfo[0].kam_firstname != null
            ? collegeInfo[0].kam_user_id + '_' + collegeInfo[0].kam_firstname
            : '';
      },
    });
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

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  columnFilter($event: any) {
    if ($event.value.length == 0) {
      this._selectedColumns = this._selectedColumnsDup;
    } else {
      this._selectedColumns = $event.value;
    }
  }

  FilterCity(value: any, type: string) {
    let stateDetails = value.split('_', 2);
    $('.spinner').show();
    this.collegeService
      .getFilterCity(stateDetails[0])
      .subscribe((response: any) => {
        if (response.data != null) {
          $('.spinner').hide();
          const citySorted = response.data.sort((a: any, b: any) =>
            a.cityname > b.cityname ? 1 : -1
          );
          this.cityDetails = citySorted;
          if (type == 'add') {
            this.userModel.city = '';
          }
        }
      });
  }

  onSelectCollege(value: any) {
    console.log(value);
  }

  deleteCurrentCollege(rowData: any) {
    this.currentCollegeId = rowData.academic_institution_id;
  }

  /* Bulk Upload collegesDetails */
  onBulkUplaod() {

    let fi = this.stuProFileInput.nativeElement;
    if (fi.files && fi.files[0] && this.stuProUploadError == true) {
      $('.spinner').show();

      this.collegeService.onBulkUpload(this.bulkUploadFile).subscribe({
        next: (result) => {
          $('.spinner').hide();
          var erFile: string = "";
          let str = 'Hello World!\nThis is my string';

          if (result.data == null && result.status == 'Failed') {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: result.message,
            });
            return false;
          }

          if (result.data != null && result.data.failureRecords > 0) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Upload Error Please check the downloaded file',
            });

            if (result.data.validationResults) {
              result.data.validationResults.forEach(
                (val: any, index: any, arValue: any) => {
                  val.messages.forEach((error: any) => {
                    erFile += val.rowNumber + ' - ' + error + ` \r\n`;
                  });
                  if (arValue.length == index + 1) {
                    this.dyanmicDownloadByHtmlTags('Bulk upload error logs', erFile);
                  }
                }
              );
            }
          } else {
            this.getAdminCollegeDetails();
            ($('#addcollege') as any).modal('hide');
            this.messageService.add({
              severity: 'success',
              summary: 'Sucess',
              detail: 'Successfully Uploaded',
            });
          }
        },
        error: (err) => {
          ($('#addcollege') as any).modal('hide');
          $('.spinner').hide();
          this.stuProFileInput.nativeElement.value = '';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              err.error.message == null ? err.error.error : err.error.message,
          });

          var erFile: string = "";
          if (err.error.data.validationResults) {
            err.error.data.validationResults.forEach(
              (val: any, index: any, arValue: any) => {
                val.messages.forEach((error: any) => {
                  erFile += 'Row ' + val.rowNumber + ' - ' + error + ` \r\n`;
                });
                if (arValue.length == index + 1) {
                  this.dyanmicDownloadByHtmlTags('Bulk upload error logs', erFile);
                }
              }
            );
          }
        },
      });
    } else {
      this.stuProBulkUploadMsg = true;
    }
  }

  onBulkUploadChange(event: any) {
    this.stuProBulkUploadMsg = false;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.bulkUploadFile = file;
      var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
      let _validFileExtensions = ['xlsx'];
      if (event.target.files.length > 0 && _validFileExtensions.includes(ext)) {
        if (this.bulkUploadFile.size > 5000000) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'File size should be less than 5MB',
          });
          this.stuProUploadError = false;
        } else {
          this.stuProUploadError = true;
        }
        this.stuProUploadError = true;
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Invalid file format',
        });
        this.stuProUploadError = false;
      }
    }
  }

  private setting = {
    element: {
      dynamicDownload: null as unknown as HTMLElement,
    },
  };

  // private dyanmicDownloadByHtmlTag(arg: { fileName: string; text: string }) {
  //   if (!this.setting.element.dynamicDownload) {
  //     this.setting.element.dynamicDownload = document.createElement('a');
  //   }
  //   const element = this.setting.element.dynamicDownload;
  //   const fileType =
  //     arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/javascript';
  //   element.setAttribute(
  //     'href',
  //     `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`
  //   );
  //   element.setAttribute('download', arg.fileName);

  //   var event = new MouseEvent('click');
  //   element.dispatchEvent(event);
  // }

  private dyanmicDownloadByHtmlTags(fileName, text) {

    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType = fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute(
      'href',
      `data:${fileType};charset=utf-8,${encodeURIComponent(text)}`
    );
    element.setAttribute('download', 'Bulk upload error logs');
    var event = new MouseEvent('click');
    element.dispatchEvent(event);
  }

  resetUserForm(addcollege: NgForm) {
    addcollege.resetForm();
  }
  resetAssignProject(assignproject: NgForm) {
    assignproject.resetForm();
  }
  /* List of colleges */
  listOfCollege() {
    this.collegeService.getDeRegisterCollege().subscribe((response: any) => {
      if (response.data != null) {
        this.collegename = [];
        response.data.forEach((elem: any, index: any) => {
          if (elem.status == 'Active') {
            this.collegename.push({
              academic_institution_id: elem.academicInstitutionId,
              academic_institution_name: elem.academicInstitutionName,
            });
          }
        });

        const academicSorted = this.collegename.sort((a: any, b: any) =>
          a.academic_institution_name > b.academic_institution_name ? 1 : -1
        );
        this.ddCollegeDetails = academicSorted;

        console.log(this.ddCollegeDetails);
      }
    });
  }

  /* list Of Projects*/
  projectNameList() {
    this.UsermanagementService.getProjectList().subscribe((data) => {
      let projects: any = [];
      data.data.forEach((elm, inx) => {
        if (elm.status == 'Active') {
          projects.push(elm);
        }
      });

      const project = projects.sort((a: any, b: any) =>
        a.project_name > b.project_name ? 1 : -1
      );
      this.projectddl = project;
    });
  }

  /* list Of City */
  listOfCity() {
    this.collegeService.getCity().subscribe((response: any) => {
      if (response.data != null) {
        const citySorted = response.data.sort((a: any, b: any) =>
          a.cityname > b.cityname ? 1 : -1
        );
        this.cityDetails = citySorted;
      }
      this.listOfTPOName();

    });
  }

  /* state based city*/
  listOfState() {
    this.collegeService.getState().subscribe((response: any) => {
      if (response.data != null) {
        const stateSorted = response.data.sort((a: any, b: any) =>
          a.state > b.state ? 1 : -1
        );
        this.stateDetails = stateSorted;
      }
      this.listOfCity();
    });
  }

  /* list of KAM Name */
  listOfKAMName() {
    this.kamNameDetails = [];
    this.collegeService.getKamName().subscribe((response: any) => {
      if (response.data != null) {
        const sortedKAMName = response.data.sort((a: any, b: any) =>
          a.firstname > b.firstname ? 1 : -1
        );
        sortedKAMName.forEach((elem: any, index: number) => {
          if (elem.firstname != null) {
            this.kamNameDetails.push(elem);
          }
        });

      }
      this.projectNameList();
    });

    console.log(this.kamNameDetails);
  }

  /* list of TPO Name */
  listOfTPOName() {
    this.topNameDetails = [];
    this.collegeService.getTpoName().subscribe((response: any) => {
      if (response.data != null) {
        console.log(response.data);

        response.data.forEach((elem: any, index: number) => {
          if (elem.firstname != null) {
            this.topNameDetails.push(elem);
          }
        });

        const sortedTPOName = this.topNameDetails.sort((a: any, b: any) =>
          a.firstname > b.firstname ? 1 : -1
        );

        this.topNameDetails = sortedTPOName;
      }
      this.listOfKAMName();
    });
  }

  /* get TPO UserDetails */
  getTPODetails(tpo: any) {
    $('.spinner').show();
    let tpoDetails = tpo.split('_', 2);
    this.UsermanagementService.getUser(tpoDetails[0]).subscribe((response) => {
      let TPOInfo = response.data.user;
      $('.spinner').hide();
      this.userModel.tpoContactNumber = TPOInfo.mobile;
      this.userModel.tpoEmailId = TPOInfo.email;
    });
  }

  /* get KAM UserDetails */
  getKAMDetails(kam: any) {
    let kamDetails = kam.split('_', 2);
    this.UsermanagementService.getUser(kamDetails[0]).subscribe((response) => {
      let KAMInfo = response.data.user;
      this.kamEmailId = KAMInfo.email;
    });

  }

  StatusModal() {
    $('.form-check-input').addClass('radio_css');
  }

  changeStatusCss() {
    $('.form-check-input').removeClass('radio_css');
  }

  onListOfRightMenus(eventData: string) {
    let arr = JSON.parse(eventData);
    Object.entries(arr).forEach(([key, value]) =>
      this.rightSideMenus.push(value)
    );
  }

  /* Export Pdf */
  exportPdf(dt: any) {
    // var pdfsize = 'a2';
    // var doc: any = new jsPDF.default('l', 'pt', pdfsize);
    var doc: any = new jsPDF.default('p', 'pt', 'a1', true);
    this.exportColumns = [];
    Object.keys(this._selectedColumns).forEach((key) => {
      this.exportColumns.push({
        title: this._selectedColumns[key].header,
        dataKey: this._selectedColumns[key].field,
      });
    });
    doc.autoTable(this.exportColumns, this.selectedCollegeDetails, {
      bodyStyles: { valign: 'middle' },
      styles: { overflow: 'linebreak', columnWidth: '1000' },
      columnStyles: {
        text: {
          cellWidth: '100',
        },
        description: {
          cellWidth: '107',
        },
      },
    });

    doc.save('College-Details.pdf');
  }


  ExportToCsv() {
    let collegeDetailsExcelDetails: any = [];
    let columns: any = [];
    this.selectedCollegeDetails.forEach((elem, inx) => {
      if (!collegeDetailsExcelDetails.hasOwnProperty(inx)) {
        collegeDetailsExcelDetails[inx] = {};
      }
      this._selectedColumns.forEach((elm, indx) => {
        // let headerName = elm.header.replace(/\s/g, '');
        let headerName = elm.header;
        collegeDetailsExcelDetails[inx][headerName] = (elem[elm.field] != null || elem[elm.field] != undefined) ? elem[elm.field].toString() : null;
      });
    });

    if (this.selectedCollegeDetails.length == 0) {
      this._selectedColumns.forEach((elm, indx) => {
        // let headerName = elm.header.replace(/\s/g, '');
        let headerName = elm.header;
        columns[headerName] = '';
      });
      collegeDetailsExcelDetails.push(columns);
    }

    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      filename: 'College-Details',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(collegeDetailsExcelDetails);
    this.selectedCollegeDetails = [];
  }

  /* Export Excel */
  exportExcel(dt: any) {
    let collegeDetailsExcelDetails: any = [];
    let columns: any = [];

    this.selectedCollegeDetails.forEach((elem, inx) => {
      if (!collegeDetailsExcelDetails.hasOwnProperty(inx)) {
        collegeDetailsExcelDetails[inx] = {};
      }
      this._selectedColumns.forEach((elm, indx) => {
        // let headerName = elm.header.replace(/\s/g, '');
        let headerName = elm.header;
        collegeDetailsExcelDetails[inx][headerName] = (elem[elm.field] != null || elem[elm.field] != undefined) ? elem[elm.field].toString() : null;
      });
    });

    if (this.selectedCollegeDetails.length == 0) {
      this._selectedColumns.forEach((elm, indx) => {
        // let headerName = elm.header.replace(/\s/g, '');
        let headerName = elm.header;
        columns[headerName] = '';
      });
      collegeDetailsExcelDetails.push(columns);
    }

    const worksheet = xlsx.utils.json_to_sheet(collegeDetailsExcelDetails);
    const workbook = { Sheets: { 'College-Details': worksheet }, SheetNames: ['College-Details'] };
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'College-Details');
  }

  /* Excel Template */
  downloadTemplate() {
    let headerNames = [
      'academicInstitutionName',
      'address',
      'state',
      'city',
      'academicInstitutionShortName',
      'tpoName',
      'tpoEmailId',
      'kamName',
      'KamEmailId',
    ];

    const worksheet = xlsx.utils.json_to_sheet([headerNames], {
      skipHeader: true,
    });
    const workbook = {
      Sheets: { 'College Registration': worksheet },
      SheetNames: ['College Registration'],
    };
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'BulkCollegeRegistrationTemplate');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + EXCEL_EXTENSION
    );
    this.selectedCollegeDetails = [];
  }

  /* Push collegesDetails */
  pushCollegeDetails(responseData: any, college: any) {
    let headerName = '';
    this.collegeNewDetails = [];
    responseData.forEach((elem: any, index: any) => {
      // if (elem.status == "Active") {
      if (elem.project_managers != null) {
        var projectManagerNames = Object.keys(elem.project_managers).map(
          function (k) {
            return elem.project_managers[k].project_manager_name;
          }
        );

        var projectManagerIds = Object.keys(elem.project_managers).map(
          function (k) {
            return elem.project_managers[k].project_manager_id;
          }
        );
      }

      if (elem.projects != null) {
        var projectIds = Object.keys(elem.projects).map(function (k) {
          return elem.projects[k].project_id;
        });

        var projectNames = Object.keys(elem.projects).map(function (k) {
          return elem.projects[k].project_name;
        });
      }

      // if (elem.status == "Active") {
      let kamLastName = (elem.kam_lastname != null && elem.kam_lastname != '') ? elem.kam_lastname : '';
      let tpoLastName = (elem.tpo_lastname != null && elem.tpo_lastname != '') ? elem.tpo_lastname : '';
      if (elem.tpo_firstname != null && elem.status != null && elem.status.toLowerCase() == 'active') {
        console.log(elem.status);
        this.collegeNewDetails.push({
          academic_institution_id: elem.academic_institution_id,
          academic_institution_name: elem.academic_institution_name,
          academic_institution_short_name: elem.academicInstitutionShortName,
          address_line: elem.address_line,
          city_id: elem.city_id,
          city: elem.city,
          kam_user_id: elem.kam_user_id,
          kAM_name:
            elem.kam_firstname != '' && elem.kam_firstname != null
              ? elem.kam_firstname + ' ' + kamLastName
              : '',
          project_id: projectIds,
          project_name: projectNames,
          project_manager_id: projectManagerIds,
          project_manager_name: projectManagerNames,
          state_id: elem.state_id,
          state: elem.state,
          status_id: elem.status_id,
          status: elem.status,
          tpo_user_id: elem.tpo_user_id,
          tPO_email: elem.tpo_email,
          tPO_name:
            elem.tpo_firstname != null && elem.tpo_firstname != ''
              ? elem.tpo_firstname + ' ' + tpoLastName
              : '',
          tPO_mobile: elem.tpo_mobile,
          tpo_status: true,
        });
      } else {
        if (elem.status != null && elem.status.toLowerCase() == 'active') {
          // console.log(elem.status);
          this.collegeNewDetails.push({
            academic_institution_id: elem.academic_institution_id,
            academic_institution_name: elem.academic_institution_name,
            academic_institution_short_name: elem.academicInstitutionShortName,
            address_line: elem.address_line,
            city_id: elem.city_id,
            city: elem.city,
            kam_user_id: elem.kam_user_id,
            kAM_name:
              elem.kam_firstname != '' && elem.kam_firstname != null
                ? elem.kam_firstname + ' ' + kamLastName
                : '',
            project_id: projectIds,
            project_name: projectNames,
            project_manager_id: projectManagerIds,
            project_manager_name: projectManagerNames,
            state_id: elem.state_id,
            state: elem.state,
            status_id: elem.status_id,
            status: elem.status,
            tpo_user_id: elem.tpo_user_id,
            tPO_email: elem.tpo_email,
            tPO_name:
              elem.tpo_firstname != null && elem.tpo_firstname != ''
                ? elem.tpo_firstname + ' ' + tpoLastName
                : '',
            tPO_mobile: elem.tpo_mobile,
            tpo_status: false,
          });
        }
      }
      // }


      college.push({
        academic_institution_id: elem.academic_institution_id,
        academic_institution_name: elem.academic_institution_name,
        academic_institution_short_name: elem.academicInstitutionShortName,
        address_line: elem.address_line,
        city_id: elem.city_id,
        city: elem.city,
        kam_user_id: elem.kam_user_id,
        kAM_name:
          elem.kam_firstname != '' && elem.kam_firstname != null
            ? elem.kam_firstname + ' ' + kamLastName
            : '',
        project_id: projectIds,
        project_name: projectNames,
        project_manager_id: projectManagerIds,
        project_manager_name: projectManagerNames,
        state_id: elem.state_id,
        state: elem.state,
        status_id: elem.status_id,
        status: elem.status,
        tpo_user_id: elem.tpo_user_id,
        tPO_email: elem.tpo_email,
        tPO_name:
          elem.tpo_firstname != null && elem.tpo_firstname != ''
            ? elem.tpo_firstname + ' ' + tpoLastName
            : '',
        tPO_mobile: elem.tpo_mobile,
      });
      // }
    });


    const academicSorted = this.collegeNewDetails.sort((a: any, b: any) =>
      a.academic_institution_name > b.academic_institution_name ? 1 : -1
    );

    this.collegeNewDetails = academicSorted;

    this.collegeNewDetails.push({
      academic_institution_id: 0,
      academic_institution_name: 'Others',
    });


    console.log(this.collegeDetails);
    if (this.collegeDetails.length > 0) {
      var result = Object.keys(this.collegeDetails[0]).map(function (
        key: string
      ) {
        return key;
      });

      result.forEach((elem: any, key: any) => {
        headerName = this.humanize(elem);

        let newElm = '';
        if (elem == 'academic_institution_name') {
          newElm = 'collegename';
        } else if (elem == 'academic_institution_short_name') {
          newElm = 'collegeshortname';
        } else if (elem == 'address_line') {
          newElm = 'addressline';
        } else if (elem == 'city') {
          newElm = 'cityname';
        }

        if (elem == 'address_line') {
          headerName = 'Address';
        } else if (elem == 'city') {
          headerName = 'Academic Instituion City';
        } else if (elem == 'tPO_mobile') {
          headerName = 'TPO Mobile No';
        } else if (elem == 'tPO_email') {
          headerName = 'TPO Email Id';
        }

        if (
          elem != 'id' &&
          elem != 'city_id' &&
          elem != 'state_id' &&
          elem != 'status_id' &&
          elem != 'tpo_user_id' &&
          elem != 'kam_user_id' &&
          elem != 'project_id' &&
          elem != 'project_manager_id' &&
          elem != 'academic_institution_id'
        ) {
          this.columns.push({
            field: elem,
            header: headerName,
            align: 'center',
          });

          this.manualSearchCols.push({
            field: (newElm == '') ? elem : newElm,
            header: headerName,
          });

        }
      });
    }



    this.cols = this.columns;
    if (this._searchedColumns.length == 0) {
      this.searchCols = [...this.manualSearchCols].map(item => ({ ...item }));
    }

    this.searchCols = this.searchCols.sort((a: any, b: any) =>
      a.header > b.header ? 1 : -1
    );

    this.exportColumns = this.cols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
    this.exportCols = this.cols.map((col) => ({ dataKey: col.field }));

  }

  /* Get collegesDetails */
  getAdminCollegeDetails() {
    $('.spinner').show();
    this.collegeService.getCollegeDetails().subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.status == 'Success') {
          this.collegeDetails = [];
          this.columns = [];
          this.manualSearchCols = [];
          console.log(response.data);
          this.pushCollegeDetails(
            response.data,
            this.collegeDetails
          );
        }
      },
      error: (response) => {
        $('.spinner').hide();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            response.error.message == null
              ? response.error.error
              : response.error.message,
        });
      },
    });
  }

  /* Add collegesDetails */
  onAddCollegeSubmit(f: NgForm) {
    debugger
    if (f.form.valid == true) {
      let tpoUser = this.userModel.tpoUserid.split('_', 2);
      let kamName = this.userModel.kamUserId.split('_', 2);
      let state = this.userModel.state.split('_', 2);
      let city = this.userModel.city.split('_', 2);

      let params = {
        academicInstitutionId: f.form.value.collegename.academic_institution_id,
        academicInstitutionName:
          f.form.value.collegename.academic_institution_id != 0
            ? f.form.value.collegename.academic_institution_name
            : this.userModel.otherAcademicInstitutionName,
        address: this.userModel.address,
        state: state[0],
        city: city[0],
        academicInstitutionShortName:
          this.userModel.academicInstitutionShortName,
        tpoUserid: +tpoUser[0],
        tpoName: tpoUser[1],
        tpoEmailId: this.userModel.tpoEmailId,
        tpoContactNumber: this.userModel.tpoContactNumber,
        kamUserId: +kamName[0],
        kamName: kamName[1],
        kamEmailId: this.kamEmailId,
        isdb: 1,
        isactive: this.userModel.statusvalue == 'Active' ? 1 : 0,
        status: this.userModel.statusvalue,
      };

      $('.spinner').show();
      this.collegeService.insertCollegeDetails(params).subscribe({
        next: (response) => {
          $('.spinner').hide();
          if (response.status == 'Success') {
            this.listOfTPOName();
            this.getAdminCollegeDetails();
            ($('#addcollege') as any).modal('hide');
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: response.message,
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.message,
            });
          }
        },
        error: (response) => {
          $('.spinner').hide();
          let message = '';

          if (response.error.message != null) {
            message = response.error.message;
          } else {
            message = response.message;
          }

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
          });
        },
      });
    }
  }

  /* Edit collegesDetails */
  editCollegeDetails(rowData: any, editCollegeForm: NgForm) {

    console.log(rowData);
    this.userModel.city = null;
    this.userModel.state = null;
    ($('#edit_college_details') as any).modal('show');
    $('.spinner').show();

    // this.FilterCity(state, 'Edit');
    this.collegeService.getFilterCity(rowData.state_id).subscribe((response: any) => {
      if (response.data != null) {
        $('.spinner').hide();
        const citySorted = response.data.sort((a: any, b: any) =>
          a.cityname > b.cityname ? 1 : -1
        );
        this.cityDetails = citySorted;
        this.userModel.state = rowData.state_id + '_' + rowData.state;
        this.userModel.city = rowData.city_id != null ? rowData.city_id + '_' + rowData.city : '';

      }
    });

    this.readonlyField = true;
    this.collegeService
      .getEditCollegeDetails(rowData.academic_institution_id)
      .subscribe({
        next: (response) => {
          if (response.status == 'Success') {

            if (response.data[0].tpo_userid != null) {
              this.tpoDisabled = true;
              this.editTPONameDetails.push({
                email: response.data[0].tpo_email,
                firstname: response.data[0].tpo_firstname,
                lastname: response.data[0].tpo_lastname,
                mobile: response.data[0].tpo_mobile,
                userid: response.data[0].tpo_userid,
              });
            } else {

              this.collegeService.getTpoName().subscribe((response: any) => {
                if (response.data != null) {
                  $('.spinner').hide();
                  response.data.forEach((elem: any, index: number) => {
                    if (elem.firstname != null) {
                      this.topNameDetails.push(elem);
                    }
                  });

                  const sortedTPOName = this.topNameDetails.sort(
                    (a: any, b: any) => (a.firstname > b.firstname ? 1 : -1)
                  );

                  this.topNameDetails = sortedTPOName;
                  this.editTPONameDetails = this.topNameDetails;
                  this.tpoDisabled = false;
                  this.userModel.agree = 'true';
                }
              });
            }

            this.kamNameDetails = [];

            this.collegeService.getKamName().subscribe((kamRes: any) => {
              $('.spinner').hide();
              if (kamRes.data != null) {
                const sortedKAMName = kamRes.data.sort((a: any, b: any) =>
                  a.firstname > b.firstname ? 1 : -1
                );

                sortedKAMName.forEach((elem: any, index: number) => {
                  if (elem.firstname != null) {
                    this.kamNameDetails.push(elem);
                  }
                });


                this.kamNameDetails.push({
                  email: response.data[0].kam_email,
                  firstname: response.data[0].kam_firstname,
                  lastname: response.data[0].kam_lastname,
                  mobile: response.data[0].kam_mobile,
                  userid: response.data[0].kam_userid,
                });

                let kamLastName = (response.data[0].kam_lastname != null) ? response.data[0].kam_lastname : ''
                this.userModel.kamUserId =
                  response.data[0].kam_firstname != null
                    ? response.data[0].kam_userid +
                    '_' +
                    response.data[0].kam_firstname + ' ' + kamLastName
                    : '';

              }
            });

            // this.userModel.city =
            //   response.data[0].city_id != null
            //     ? response.data[0].city_id + '_' + response.data[0].city_name.trim()
            //     : '';
            let collegeIndx = this.collegeNewDetails.findIndex((x: any) => {
              return x.academic_institution_id == response.data[0].college_id;
            });
            this.selectedCollege = this.collegeNewDetails[collegeIndx];
            this.userModel.address = response.data[0].address_line;
            this.college_id = response.data[0].college_id;
            this.userModel.tpoUserid =
              response.data[0].tpo_firstname != null
                ? response.data[0].tpo_userid +
                '_' +
                response.data[0].tpo_firstname
                : '';

            this.userModel.academicInstitutionShortName =
              response.data[0].college_short_name;
            this.userModel.tpoContactNumber = response.data[0].tpo_mobile;
            this.userModel.tpoEmailId = response.data[0].tpo_email;
          }
        },
        error: (response) => {
          $('.spinner').hide();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              response.error.message == null
                ? response.error.error
                : response.error.message,
          });
        },
      });
  }

  /* Update collegesDetails */
  onUpdateCollege(formvalue: any) {
    if (formvalue.valid == true) {
      let tpoUser = this.userModel.tpoUserid.split('_', 4);
      let kamName = this.userModel.kamUserId.split('_', 3);
      let state = this.userModel.state.split('_', 2);
      let city = this.userModel.city.split('_', 2);

      let params = {
        academicInstitutionId:
          formvalue.value.collegename.academic_institution_id,
        academicInstitutionName:
          formvalue.value.collegename.academic_institution_id != 0
            ? formvalue.value.collegename.academic_institution_name
            : this.userModel.otherAcademicInstitutionName,
        address: this.userModel.address,
        state: state[0],
        city: city[0],
        academicInstitutionShortName:
          this.userModel.academicInstitutionShortName,
        tpoUserid: +tpoUser[0],
        tpoName: tpoUser[1],
        tpoEmailId: this.userModel.tpoEmailId,
        tpoContactNumber: this.userModel.tpoContactNumber,
        kamUserId: +kamName[0],
        kamName: kamName[1],
        kamEmailId: this.kamEmailId,
        updatedBy: 0,
        updatedTime: new Date(),
        isdb: 0,
        isactive: 1,
        // code: this.userModel.code,
      };

      $('.spinner').show();

      this.collegeService.updateCollgeDetails(params).subscribe({
        next: (response) => {
          $('.spinner').hide();
          if (response.status == 'Success') {
            this.getAdminCollegeDetails();
            ($('#edit_college_details') as any).modal('hide');
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: response.message,
            });
          }
        },
        error: (response) => {
          $('.spinner').hide();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              response.error.message == null
                ? response.error.error
                : response.error.message,
          });
        },
      });
    }
  }

  /* Delete collegesDetails */
  deleteCollege(academic_institution_id: any) {
    $('.spinner').show();
    this.collegeService.deleteCollege(academic_institution_id).subscribe({
      next: (delresponse) => {
        if (delresponse.status == 'Success') {
          this.collegeService.getCollegeDetails().subscribe({
            next: (response) => {
              $('.spinner').hide();
              if (response.status == 'Success') {
                ($('#delete') as any).modal('hide');
                this.collegeDetails = [];
                this.columns = [];
                this.manualSearchCols = [];
                this.pushCollegeDetails(
                  response.data,
                  this.collegeDetails
                );
                this.listOfTPOName();
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: delresponse.message,
                });
              }
            },
            error: (response) => {
              $('.spinner').hide();
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail:
                  response.error.message == null
                    ? response.error.error
                    : response.error.message,
              });
            },
          });
        }
      },
      error: (response) => {
        $('.spinner').hide();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            response.error.message == null
              ? response.error.error
              : response.error.message,
        });
      },
    });
  }

  /* Status Change collegesDetails */
  changeStatus(dt: any) {
    $('.spinner').show();
    let academic_institution_ids = this.selectedrows.map(
      (x: { academic_institution_id: any }) => x.academic_institution_id
    );

    let params = {
      status: this.status,
      collegeIds: academic_institution_ids,
    };

    this.collegeService.changeStatus(params).subscribe({
      next: (changeStatusResponse) => {
        if (changeStatusResponse.status.toLowerCase() == 'success') {

          ($('#change-status') as any).modal('hide');
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: changeStatusResponse.message,
          });

          this.collegeService.getCollegeDetails().subscribe({
            next: (response) => {
              $('.spinner').hide();
              if (response.status == 'Success') {
                this.collegeDetails = [];
                this.columns = [];
                this.manualSearchCols = [];
                this.pushCollegeDetails(
                  response.data,
                  this.collegeDetails
                );

                this.selectedrows = [];

              }
            },
            error: (response) => {
              $('.spinner').hide();
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail:
                  response.error.message == null
                    ? response.error.error
                    : response.error.message,
              });
            },
          });
        }
      },
      error: (changeStatusErrResponse) => {
        $('.spinner').hide();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            changeStatusErrResponse.error.message == null
              ? changeStatusErrResponse.error.error
              : changeStatusErrResponse.error.message,
        });
      },
    });
  }

  /* Assign Project in collegesDetails */
  onAssignProject(formvalue: any, dt: any) {
    if (formvalue.valid) {
      let college_ids = dt._selection.map(
        (x: { academic_institution_id: any }) => x.academic_institution_id
      );
      let project_ids = formvalue.value.assign_project.map(
        (x: { project_id: any }) => x.project_id
      );
      let params = {
        colleges: college_ids,
        projects: project_ids,
      };

      $('.spinner').show();
      this.collegeService.addAssignProject(params).subscribe({
        next: (data) => {
          $('.spinner').hide();
          this.codestatus = data.status;
          this.receivedmessage = data.message;
          if (this.codestatus == 'Success') {
            this.successmsg = false;
            this.getAdminCollegeDetails();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: data.message,
            });
            ($('#assignproject') as any).modal('hide');
            dt._selection = [];
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: data.message,
            });
          }
        },
        error: (data) => {
          $('.spinner').hide();
          this.listOfErrors = data.error.data;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: data.error.data,
          });
        },
      });
    }
  }

  /*Copy Academic Institution Name */
  Copy(rowData: any) {
    let text = rowData.academic_institution_name;
    this.fallbackCopyTextToClipboard(text);
    // navigator.clipboard.writeText(rowData.academic_institution_name);
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Copied',
    });
  }

  fallbackCopyTextToClipboard(text) {
    console.log(text);
    this.clipboardService.copyFromContent(text);
    // var textarea = document.createElement('textarea');
    // textarea.textContent = text;
    // document.body.appendChild(textarea);

    // var selection = document.getSelection();
    // var range = document.createRange();
    // //  range.selectNodeContents(textarea);
    // range.selectNode(textarea);
    // selection.removeAllRanges();
    // selection.addRange(range);

    // console.log('copy success', document.execCommand('copy'));
    // selection.removeAllRanges();

    // document.body.removeChild(textarea);
  }


}
