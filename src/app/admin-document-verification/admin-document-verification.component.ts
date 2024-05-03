import { Component, OnInit, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DocumentVerificationService } from '../services/document-verification.service';
import { ProjectDetailsService } from 'src/app/services/project-details.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import * as xlsx from 'xlsx';
import * as FileSaver from 'file-saver';
import { ExportToCsv } from 'export-to-csv';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-admin-document-verification',
  templateUrl: './admin-document-verification.component.html',
  providers: [MessageService],
  styleUrls: ['./admin-document-verification.component.css']
})
export class AdminDocumentVerificationComponent implements OnInit {

  constructor(
    private httpClient: HttpClient,
    public documentverificationService: DocumentVerificationService,
    private messageService: MessageService,
    public projectService: ProjectDetailsService,
    private titleService: Title,
  ) {

    this.listOfProjects();

    this._selectedProjectColumns = [
      { field: 'gtt_id', header: 'Gtt Id', align: 'center' },
      { field: 'first_name', header: 'First Name', align: 'center' },
      { field: 'last_name', header: 'Last Name', align: 'center' },
    ];

    this._selectedProjectColumnsDub = this._selectedProjectColumns;

  }

  rightSideMenus: any = [];
  activeProjects: any = [];
  currentTabProjectCols: any[];
  currentTabProjectColumns: any = [];
  currentTabProjectDetails: any = [];
  currentTabWithOutFieldName: any = [];
  currentTabActiveAdditionalFields: any = [];
  currentTabFieldArr: any = [];
  currentTabGlobalFilter: any = [];
  currentTabProjectName: string = '';

  selectedTabProjectDetails: any = [];
  _selectedProjectColumns: any = [];
  _selectedProjectColumnsDub: any = [];



  /* view options */
  currentTabViewDetails: any = [];
  currentUserId: number;
  withoutValidationFile: any = [];
  selectedview: any = [];
  validOptions: any = [];
  myFiles: any = [];
  currentUploadDocIds: any = [];
  validSelect: boolean = false;


  dynamicTabs: { title: string, content: string }[] = [];
  activeIndex: number = 0;
  currentProjectInx: number = 0;
  scrollableTabs: any[];
  dbStatus: any = [];


  ngOnInit(): void {
    this.dbStatus = ['Yet to verify', 'Yes'];
  }

  /*Side menu */
  onListOfRightMenus(eventData: string) {
    let fieldArr = JSON.parse(eventData);
    Object.entries(fieldArr).forEach(
      ([key, value]) => this.rightSideMenus.push(value)
    );
  }

  onChangeMultiSelect($event) {
    if ($event.value.length == 0) {
      this._selectedProjectColumns = this._selectedProjectColumnsDub;
    }
  }

  // Tabs
  getDocumentTab($event: any) {
    this.activeIndex = $event.index;
    this.currentProjectInx = this.activeIndex;
    this.currentTabProjectName = this.activeProjects[this.currentProjectInx].projectName;
    this.currentTabActiveAdditionalFields = this.activeProjects[this.currentProjectInx].additionalFields;
    this.currentTabWithOutFieldName = this.activeProjects[this.currentProjectInx].withOutAdditionalFields;
    this.getActiveDocumentList(this.activeProjects[this.currentProjectInx].projectId);
  }

  //Title
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  @Input() get selectedProjectColumns(): any[] {
    return this._selectedProjectColumns;
  }

  set selectedProjectColumns(val: any[]) {
    this._selectedProjectColumns = this.currentTabProjectCols.filter(col => val.includes(col));
  }

  listOfProjects() {
    $('.spinner').show();
    this.projectService.getProjectDetails().subscribe({
      next: (response) => {
        let projectIds: any = [];
        if (response.status == 'Success' && response.data.length > 0) {
          response.data.forEach((ele, inx) => {
            if (ele.status.toLowerCase() == 'active') {
              projectIds.push(ele.project_id);
            }
          });

          let params = {
            "projectids": projectIds
          };

          if (projectIds.length > 0) {

            this.projectService.getProjectAdditionalFields(params).subscribe({
              next: (addresponse) => {

                if (addresponse.status == 'Success' && addresponse.data.length > 0) {
                  this.activeProjects = [];
                  addresponse.data.forEach((el, ix) => {
                    let additionalFields = [];
                    let withOutAdditionalFields = [];
                    if (el.projectBasedFields.length > 0) {
                      el.projectBasedFields.forEach((elv, elz) => {
                        if ((elv.fieldType != null && elv.fieldType.toLowerCase() == 'file upload') || (elv.fieldType != null && elv.fieldType.toLowerCase() == 'video')) {
                          additionalFields.push(elv.documentFieldName);
                        } else if (elv.fieldType != null && elv.fieldType.toLowerCase() != 'file upload') {
                          withOutAdditionalFields.push(elv.documentFieldName);
                        }
                      });

                      if (additionalFields.length > 0) {

                        this.dynamicTabs.push({
                          'title': el.project_Name,
                          'content': el.project_Name
                        });

                        this.activeProjects.push({
                          'projectId': el.project_Id,
                          'projectName': el.project_Name,
                          'additionalFields': additionalFields,
                          'withOutAdditionalFields': withOutAdditionalFields
                        });

                      }
                    }

                  });
                  this.currentTabActiveAdditionalFields = this.activeProjects[this.currentProjectInx].additionalFields;
                  this.currentTabWithOutFieldName = this.activeProjects[this.currentProjectInx].withOutAdditionalFields;
                  this.currentTabProjectName = this.activeProjects[this.currentProjectInx].projectName;
                  this.getActiveDocumentList(this.activeProjects[this.currentProjectInx].projectId);
                  // this.dynamicTabs.splice(0,1);
                  console.log(this.dynamicTabs);


                }
              },
              error: (ErrResponse) => {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Error',
                  detail: ErrResponse.error.data,
                });
              },
            });
          }
        }
      },
      error: (ErrResponse) => {
        $('.spinner').hide();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: ErrResponse.error.data,
        });
      },
    });
  }


  /*Get document details*/
  getActiveDocumentList(projectid: any) {
    $('.spinner').show();
    this.documentverificationService.getActiveDocumentDetails(projectid).subscribe({
      next: response => {
        console.log(response);
        $('.spinner').hide();

        if (response.status == "Success") {

          this.currentTabProjectCols = [];
          this.currentTabProjectColumns = [];
          this.currentTabProjectDetails = [];
          this.currentTabFieldArr = [];

          response.data.projectAddtionalFields.forEach((elem: any, index: any) => {
            let arrNew = [];
            if (!this.currentTabProjectDetails.hasOwnProperty(index)) {
              this.currentTabProjectDetails[index] = {};
            }

            elem.fields.forEach((elm, inx) => {
              if (!arrNew.hasOwnProperty(index)) {
                arrNew[index] = {};
              }

              if (this.currentTabActiveAdditionalFields.includes(elm.documentFieldName)) {
                if (this.currentTabWithOutFieldName.includes(elm.documentFieldName)) {
                  arrNew[index][elm.lable] = elm.documentValue;
                } else {
                  arrNew[index][elm.lable] = elm.verificationStatus;
                }
              }
            });

            const count1 = Object.values(arrNew[index]).filter(x => x == "Yet to verify").length;
            const count2 = Object.values(arrNew[index]).filter(x => x == "Yes").length;
            const count3 = Object.values(arrNew[index]).filter(x => x == "No").length;

            if (count1 > 0 || count2 > 0 || count3 > 0) {
              this.currentTabProjectDetails[index]['action'] = "true"
            } else {
              this.currentTabProjectDetails[index]['action'] = "false"
            }

            this.currentTabFieldArr[index] = arrNew[index];
            this.currentTabProjectDetails[index]['user_id'] = elem.user_id;
            this.currentTabProjectDetails[index]['gtt_id'] = elem.gtt_id;
            this.currentTabProjectDetails[index]['first_name'] = elem.first_name;
            this.currentTabProjectDetails[index]['last_name'] = elem.last_name;

          });

          console.log(this.currentTabFieldArr);
          console.log(this.currentTabProjectDetails);

          let arrNek = [];
          for (let key in this.currentTabFieldArr) {
            arrNek.push(this.currentTabFieldArr[key]);
          }

          let resultArr = [];
          resultArr = this.currentTabProjectDetails.map((item, i) => Object.assign({}, item, arrNek[i]));
          this.currentTabProjectDetails = resultArr;

          console.log(this.currentTabFieldArr);
          console.log(this.currentTabProjectDetails);

          if (resultArr.length > 0) {
            var result = Object.keys(resultArr[0]).map(function (
              key: string
            ) {
              return key;
            });

            this.currentTabGlobalFilter = [];
            result.forEach((elem: any, key: any) => {
              let headerName = this.headerCaseString(elem);
              if (elem != 'user_id' && elem != 'action' && elem != 'null') {
                this.currentTabProjectColumns.push({
                  field: elem,
                  header: headerName,
                  align: 'center',
                });
                this.currentTabGlobalFilter.push(elem);
              }
            });

            this.currentTabProjectCols = this.currentTabProjectColumns;

          }

        }
      },
      error: response => {
        $('.spinner').hide();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: (response.error.message == null) ? response.error.error : response.error.message });
      }
    });
  }


  headerCaseString(string: any) {
    let titleCaseString = string
      .replace(/(_|-)/g, ' ')
      .trim()
      .replace(/\w\S*/g, function (str: any) {
        return str.charAt(0).toUpperCase() + str.substr(1)
      })
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');

    return titleCaseString;
  }


  // Export
  exportCurrentTabExcel() {

    let currentExcelDetails: any = [];
    let columns: any = [];

    this.selectedTabProjectDetails.forEach((elem, inx) => {
      if (!currentExcelDetails.hasOwnProperty(inx)) {
        currentExcelDetails[inx] = {};
      }
      this._selectedProjectColumns.forEach((elm, indx) => {
        currentExcelDetails[inx][elm.header] = elem[elm.field];
      })
    });

    if (this.selectedTabProjectDetails.length == 0) {
      this._selectedProjectColumns.forEach((elm, indx) => {
        columns[elm.header] = "";
      })
      currentExcelDetails.push(columns);
    }

    const worksheet = xlsx.utils.json_to_sheet(currentExcelDetails);
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, this.activeProjects[this.currentProjectInx].projectName + "- Details");
    this.selectedTabProjectDetails = [];
  }

  exportCurrentTabCSV() {

    let currentCSVDetails: any = [];
    let columns: any = [];

    this.selectedTabProjectDetails.forEach((elem, inx) => {
      if (!currentCSVDetails.hasOwnProperty(inx)) {
        currentCSVDetails[inx] = {};
      }
      this._selectedProjectColumns.forEach((elm, indx) => {
        // let headerName = elm.header.replace(/\s/g, '');
        let headerName = elm.header;
        currentCSVDetails[inx][headerName] =
          elem[elm.field] != '' && elem[elm.field] != null
            ? elem[elm.field].toString()
            : '';
      });
    });

    if (this.selectedTabProjectDetails.length == 0) {
      this._selectedProjectColumns.forEach((elm, indx) => {
        // let headerName = elm.header.replace(/\s/g, '');
        let headerName = elm.header;
        columns[headerName] = '';
      });
      currentCSVDetails.push(columns);
    }

    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      filename: this.activeProjects[this.currentProjectInx].projectName + ' - Details',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(currentCSVDetails);
    this.selectedTabProjectDetails = [];

  }


  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }




  viewDocumentDetails(rowData: any) {
    this.currentTabViewDetails = [];
    $('.spinner').show();
    this.currentUserId = rowData.user_id;
    this.withoutValidationFile = [];
    this.documentverificationService.getviewAtosDocumentDetails(rowData.user_id).subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.status == 'Success' && response.data.doumentFileds.length > 0) {
          ($('#view') as any).modal('show');
          this.currentTabViewDetails = [];
          this.selectedview = [];
          this.validOptions = [];
          response.data.doumentFileds.forEach((elem: any, index: any) => {

            if (this.currentTabActiveAdditionalFields.includes(elem.document_field_name)) {
              let field_type = this.currentTabViewDetails.findIndex((x: any) => { return x.document_field_name == elem.document_field_name });
              if (field_type == -1) {
                this.currentTabViewDetails.push({
                  document_field_index: index,
                  document_detail_id: elem.document_detail_id,
                  document_id: elem.document_id,
                  document_field_name: elem.document_field_name,
                  document_value: elem.document_value,
                  document_url: elem.document_url,
                  document_type: elem.document_value.substr(elem.document_value.lastIndexOf('.') + 1),
                  download_path: environment.BASE_API_URL + 'document-validator/document-download?fileName=' + elem.dowload_path,
                  verification_Status: elem.verification_Status
                });
              }

              console.log(this.currentTabViewDetails);
            }
          });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Additional field not mapped this user" });
        }
      },
      error: (response) => {
        $('.spinner').hide();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: response.message,
        });
      },
    });
  }


  onChangeFilesNo($event: any, value, index, docId, docFieldName: any, documentFileName: any) {

    if (value == "Yes") {
      this.validSelect = true;
      this.currentTabViewDetails[index].verification_Status = "Yes";
      let fileArray = this.myFiles;
      let validOpts = this.validOptions;
      fileArray.forEach((elem, indx) => {
        if (Object.keys(elem)[0] == docId) {
          this.myFiles.splice(indx, 1);
        }
      });

      this.validOptions.push({
        'fileName': documentFileName,
        'name': docFieldName,
        'valid': "Yes"
      });

      const withoutFileIndex = this.withoutValidationFile.indexOf(docFieldName);
      if (withoutFileIndex > -1) { // only splice array when item is found
        this.withoutValidationFile.splice(withoutFileIndex, 1); // 2nd parameter means remove one item only
      }

    } else {
      this.validSelect = true;
      this.currentTabViewDetails[index].verification_Status = "No";
      this.withoutValidationFile.push(docFieldName);
      this.validOptions.forEach((elem, indx) => {
        if (elem.fileName == documentFileName) {
          this.validOptions.splice(indx, 1);
        }
      });

      this.validOptions.push({
        'fileName': documentFileName,
        'name': docFieldName,
        'valid': "No"
      });

    }
  }


  selectFiles($event: any, verification_status, documentFileName: any) {
    debugger
    this.validOptions.forEach((elem, indx) => {
      if (elem.fileName == documentFileName) {
        this.validOptions.splice(indx, 1);
      }
    });

    const file = $event.target.files[0];
    var OrgExt = documentFileName.substr(documentFileName.lastIndexOf('.') + 1);
    var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
    let videoExtensions = ['MPEG','MPEG4', 'MP4', 'MOV', 'WMV', 'AVI', 'AVCHD','MTS', 'MKV', 'WEBM', 'mpeg', 'mpeg4', 'mp4', 'mts', 'mov', 'wmv', 'avi', 'avchd', 'mkv', 'webm']
    let _validFileExtensions = ['jpeg', 'xlsx', 'jpg', 'pdf', 'doc', 'png', 'xls', 'docx', 'PNG', 'JPEG', 'JPG'];
    if ($event.target.files.length > 0) {

      if (_validFileExtensions.includes(OrgExt)) {
        this.normalFileExn(ext, _validFileExtensions, file, $event);
      } else if (videoExtensions.includes(OrgExt)) {
        this.videoFileExn(ext, videoExtensions, file, $event);
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Invalid file format" });
    }
  }

  videoFileExn(ext, videoExtensions, file, $event) {

    if (videoExtensions.includes(ext)) {
      if (file.size > 60000000) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "File size is more than 60MB" });
        this.validSelect = false;
      } else {
        let searchFiles = this.myFiles.filter(FileData => Object.keys(FileData)[0] == $event.target.id)
        console.log(searchFiles);
        this.validSelect = true;
        const withoutFileIndex = this.withoutValidationFile.indexOf($event.target.name);
        if (withoutFileIndex > -1) { // only splice array when item is found
          this.withoutValidationFile.splice(withoutFileIndex, 1); // 2nd parameter means remove one item only
        }

        console.log(this.withoutValidationFile);

        if (searchFiles.length > 0) {
          this.myFiles.forEach((fielData, index) => {
            var obj = { [$event.target.id]: file }
            console.log(Object.keys(fielData)[0]);
            if (Object.keys(fielData)[0] == $event.target.id) {
              this.myFiles[index] = obj;
              let documentFileName = $event.target.name.replace(/ /g, '_');
              this.currentUploadDocIds[index] = { 'documentFieldId': $event.target.id, 'documentFieldName': $event.target.name, 'documentFileName': documentFileName + '.' + ext };
            }
          })
        } else {
          var obj = { [$event.target.id]: file }
          this.myFiles.push(obj);
          let documentFileName = $event.target.name.replace(/ /g, '_');
          this.currentUploadDocIds.push({ 'documentFieldId': $event.target.id, 'documentFieldName': $event.target.name, 'documentFileName': documentFileName + '.' + ext });
        }
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Invalid file format" });
      this.validSelect = false;
      return false;
    }
  }



  normalFileExn(ext, _validFileExtensions, file, $event) {

    if (_validFileExtensions.includes(ext)) {
      if (file.size > 2000000) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "File size is more than 2MB" });
        this.validSelect = false;
      } else {

        let searchFiles = this.myFiles.filter(FileData => Object.keys(FileData)[0] == $event.target.id)
        console.log(searchFiles);
        this.validSelect = true;
        const withoutFileIndex = this.withoutValidationFile.indexOf($event.target.name);
        if (withoutFileIndex > -1) { // only splice array when item is found
          this.withoutValidationFile.splice(withoutFileIndex, 1); // 2nd parameter means remove one item only
        }

        console.log(this.withoutValidationFile);

        if (searchFiles.length > 0) {
          this.myFiles.forEach((fielData, index) => {
            var obj = { [$event.target.id]: file }
            console.log(Object.keys(fielData)[0]);
            if (Object.keys(fielData)[0] == $event.target.id) {
              this.myFiles[index] = obj;
              let documentFileName = $event.target.name.replace(/ /g, '_');
              this.currentUploadDocIds[index] = { 'documentFieldId': $event.target.id, 'documentFieldName': $event.target.name, 'documentFileName': documentFileName + '.' + ext };
            }
          })
        } else {
          var obj = { [$event.target.id]: file }
          this.myFiles.push(obj);
          let documentFileName = $event.target.name.replace(/ /g, '_');
          this.currentUploadDocIds.push({ 'documentFieldId': $event.target.id, 'documentFieldName': $event.target.name, 'documentFileName': documentFileName + '.' + ext });
        }
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Invalid file format" });
      this.validSelect = false;
    }
  }



  showLogout(document_type) {
    if (document_type == 'pdf' || document_type == 'png' || document_type == 'jpeg' || document_type == 'jpg' || document_type == 'PNG' || document_type == 'JPEG' || document_type == 'JPG' || document_type == 'mp4' || document_type == 'MP4' || document_type == 'WEBM' || document_type == 'webm')
      return true;
    else
      return false;
  }

  downloadProjectView() {
    let selected = this.selectedview;
    var multi_download = environment.BASE_API_URL + 'document-validator/document-download-all-files?userid=' + this.currentUserId + '&documentids=';
    for (var i = 0; i < selected.length; i++) {
      multi_download = multi_download + selected[i].document_id;
      if (selected.length != (i + 1)) {
        multi_download = multi_download + ','
      }
    }
    window.open(multi_download, '_blank');
  }

  onProjectFileUpload() {
    // if (this.myFiles.length > 0) {
    let uploadFiles: any = [];
    let documentReuploadList: any = [];
    for (var i = 0; i < this.myFiles.length; i++) {
      uploadFiles.push(this.myFiles[i][this.currentUploadDocIds[i].documentFieldId]);
      documentReuploadList.push({
        'fileName': this.currentUploadDocIds[i].documentFileName,
        'name': this.currentUploadDocIds[i].documentFieldName,
        'valid': "Yes"
      });
    }

    let documentList = documentReuploadList.concat(this.validOptions);
    let params = {
      'userid': this.currentUserId,
      'projectid': this.activeProjects[this.currentProjectInx].projectId,
      'documentReuploadList': documentList
    };

    $('.spinner').show();
    this.documentverificationService.saveProjectUploadFiles(params, uploadFiles).subscribe({
      next: response => {
        if (response.status == "Success") {
          $('.spinner').hide();
          // this.getActiveDocumentList(this.activeProjects[this.currentProjectInx].projectId);

          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.myFiles = [];
          this.validOptions = [];
          this.currentUploadDocIds = [];
          this.validSelect = false;
          ($('#view') as any).modal('hide');
          this.getActiveDocumentList(this.activeProjects[this.currentProjectInx].projectId);

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
