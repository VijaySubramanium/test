// import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Component, Input, OnInit, Inject, ViewChild } from '@angular/core';
import { ProjectDetailsService } from 'src/app/services/project-details.service';
import { UsermanagementService } from 'src/app/services/user-management.service';
import { ProgramDetailsService } from 'src/app/services/program-details.service';
import { projectDetails } from '../view-models/project-details';
import { editprojectDetails } from '../view-models/editprojectdetails';
import { addProjectDetails } from '../view-models/addproject';
import { FieldsMappingModel } from '../view-models/fieldsmapping-model';
import { projectStatus } from '../view-models/changeprojectstatus';
import { ToastrService } from 'ngx-toastr';
import * as jsPDF from 'jspdf';
import { ExportToCsv } from 'export-to-csv';
import * as xlsx from 'xlsx';
import 'jspdf-autotable';
import * as FileSaver from 'file-saver';
import { Validators, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { StudentProfile } from '../view-models/student-profile';
import { MessageService } from 'primeng/api';
import { CommonService } from '../common.service';
import { DatePipe } from '@angular/common';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { NgForm, FormControl } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Table } from 'primeng/table';
import { elementAt } from 'rxjs';
import { CalendarModule } from 'primeng/calendar';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  providers: [MessageService, DatePipe],
  styleUrls: ['./project-details.component.css'],
})
export class ProjectDetailsComponent implements OnInit {
  projectDetails: any;
  proDetails = new projectDetails();
  _selectedProjectColumns: { field: string; header: string; align: string }[];
  _selectedFieldColumns: any[];
  @ViewChild(Table) dt: Table;
  @ViewChild(Table) ct: Table;
  @ViewChild(Table) kt: Table;
  @ViewChild('projectFileBulkUpload') projectFileBulkUpload;
  projectBulkUploadMsg: boolean = false;
  projectFileUploadError: boolean = true;

  cols: any[];
  first: number = 0;
  exportColumns: any[];
  exportCols: any[];

  fieldsCols: any[];
  exportfieldsColumns: any[];
  exportFieldsCols: any[];

  columns: any[] = [];
  columnsFields: any[] = [];
  project_id: any;
  disable = false;
  updatedisabled = false;
  rightSideMenus: any = [];
  ProfileName = new StudentProfile();
  getEditDetails = new editprojectDetails('', '', '', '', '', [], '', '', '', '');

  changeprojectStatus = new projectStatus();
  addProject = new addProjectDetails();
  addFields = new FieldsMappingModel();
  receivedmessage: string | undefined;
  stustatus: string;
  listOfErrors: any;
  projectmanagerddl: any;
  expotheader: any[];
  user: any = '';
  loggedInRoleId: number;
  accessRoleId: any;
  selectedProjectDetails: any = [];
  generatedLink: any = '';
  public files: any;
  public editFiles: any;
  public editExistsUploadFileName: string;
  public bulkUploadFile: any;
  names: any[];
  roles: any = [];
  public loggedInRoleName: string;
  public accessRoleNames: any = [];
  public generatedLinkAccess: any = [];
  public viewIconAccess: any = [];
  dateTime = new Date();
  exportProjectName: string = 'Project-Details';
  exportField: string = 'Field-Mapping';
  public projectSearchFilter: any = [];
  public stuProGlobalFilter: any = [];
  projectdropdownSettings: IDropdownSettings = {};
  currentTab1: string = 'Project';
  currentTab2: string = '';
  currentTab3: string = '';
  public userDetails: any = [];
  public projectFieldDetails: any = [];
  selectedUserDetails: any = [];
  projectddl: any;
  activeProjectList: any;
  initialProjectId: any;
  _selectedColumnsDup: any[];
  _registrationReportColumns: any = [];
  _registrationReportColumnHeader: any[];
  _registrationReportColumnTitle: any[];
  _registrationReportColumnDataKey: any[];
  _registrationReportDefaultColumns: any[];
  _registrationReportDefaultColumnsCopy: any[];
  public _registrationReportFilter: any = [];
  public selectedProjectIds: any = [];
  public selectedProjectManagerLists: any[]
  public editSelectedProjectManagerLists: any[]
  public currentLoginUserId: number;
  dynamicFieldName: string;
  public uploadOption: boolean = true;

  addFieldsForm: FormGroup;
  addFieldsSubmitted = false;

  message: string | undefined;
  editMessage: string | undefined;

  searchCols: any[];
  _selectedSearchColumns: any[];
  _searchedColumns: any[] = [];
  searchError: boolean = false;
  manualSearchCols: any = [];
  documentFieldStatus: any = "";
  currentDocFields: any;


  constructor(
    public projectService: ProjectDetailsService,
    private titleService: Title,
    private toastr: ToastrService,
    private messageService: MessageService,
    public commonservice: CommonService,
    public datepipe: DatePipe,
    public programService: ProgramDetailsService,
    private UsermanagementService: UsermanagementService,
    private fb: FormBuilder,
    private clipboardService: ClipboardService,
    private router: Router //private messageService: MessageService
  ) {
    this._registrationReportDefaultColumns = [
      { field: 'fieldName', header: 'Field Name' },
      { field: 'project', header: 'Project' },
      { field: 'mandatory', header: 'Mandatory' },
      { field: 'fieldType', header: 'Field Type' },
      { field: 'validation', header: 'Validation' },
      { field: 'is_active', header: 'Status' },
    ];
    this._registrationReportDefaultColumnsCopy =
      this._registrationReportDefaultColumns;
    this._registrationReportFilter = [
      'fieldName',
      'project',
      'mandatory',
      'fieldType',
      'validation',
      'is_active'
    ];
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
    this.generatedLinkAccess = ['GTT_ADMIN', 'PROJECT_MANAGER', 'TRAINING_COORDINATOR'];
    this.viewIconAccess = ['GTT_ADMIN', 'PROJECT_MANAGER', 'TRAINING_COORDINATOR', 'PROGRAM_LEAD']
  }


  get dropDownOptionControl(): FormArray {
    return this.addFieldsForm.get("dropDownOptions") as FormArray;
  }


  ngOnInit(): void {
    this.setTitle('TJM-Project');
    this.getProjectList();

    // this.getProjectField(this.initialProjectId);

    this.projectdropdownSettings = {
      idField: 'item_id',
      textField: 'item_text',
    };


    this.addFieldsForm = this.fb.group({
      fieldName: ['', Validators.required],
      project: ['', [Validators.required]],
      mandatory: ['', [Validators.required]],
      fieldType: ['', [Validators.required]],
      validation: [''],
      dropDownOptions: this.fb.array([], [Validators.required])
    });


    this.projectSearchFilter = [
      'overall_status',
      'project_name',
      'status',
      'project_manager_name',
    ];

    this.stuProGlobalFilter = [
      'firstName',
      'lastName',
      'email',
      'mobile',
      'whatsappNumber',
      'collegeCity',
      'academiciInstitutionName',
      'currentLocation',
      'roleName',
      'pincode',
      'disabilityType',
      'educationalQualification',
      'status',
      'experienceYears',
    ];

    this._selectedFieldColumns = [
      // { field: 'id', header: 'Id' },
      { field: 'firstName', header: 'First Name' },
      { field: 'lastName', header: 'Last Name' },
      { field: 'email', header: 'Email' },
      { field: 'mobile', header: 'Mobile' },
      { field: 'status', header: 'Status' },
    ];

    this._selectedProjectColumns = [
      { field: 'project_name', header: 'Project Name', align: 'center' },
      {
        field: 'project_manager_name',
        header: 'Project Manager Name',
        align: 'center',
      },
      { field: 'status', header: 'Status', align: 'center' },
      { field: 'start_date', header: 'Start Date', align: 'center' },
      // { field: 'end_date', header: 'End Date', align: 'center' },
    ];

    this._selectedColumnsDup = this._selectedProjectColumns;
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }


  searchClose() {
    if (this._searchedColumns.length == 0) {
      this._selectedSearchColumns = [];
    } else {
      this._selectedSearchColumns = this._searchedColumns;
    }
    this.searchError = false;
    console.log(this._selectedSearchColumns)
  }

  viewDocumentField(documentFieldDetails) {
    ($('#viewActiveStatus') as any).modal('show');
    this.currentDocFields = documentFieldDetails;
    this.documentFieldStatus = documentFieldDetails.is_active;
    console.log(documentFieldDetails);
  }

  changeStatusCss() {
    $('.form-check-input').removeClass('radio_css');
  }


  updateDocStatus() {
    $('.spinner').show();

    console.log(this.currentDocFields);
    debugger
    let params = {
      documentDetailId: this.currentDocFields.documentDetailId,
      status: this.documentFieldStatus,
    };

    this.projectService.fieldStatusChange(params).subscribe({
      next: (changeStatusResponse) => {
        if (changeStatusResponse.status.toLowerCase() == 'success') {
          ($('#viewActiveStatus') as any).modal('hide');
          this.getProjectField(this.initialProjectId);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: changeStatusResponse.message,
          });
        }
      },
      error: (changeStatusErrResponse) => {
        debugger
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


  searchHolder(field) {
    switch (field) {
      case "status":
        return "Search ('Active/Inactive')";
        break;
      case "start_date":
        return "Search ('yyyy-mm-dd')";
        break;
      case "end_date":
        return "Search ('yyyy-mm-dd')";
        break;
      case "terms_and_conditions":
        return "Search ('Yes/No')";
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
      this.getProjectList();
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
    var searchJsonArray = [];
    searchCoulumns.forEach((column, index) => {
      if (this._selectedSearchColumns.length != 1) {
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


    if (!this.searchError) {
      console.log(searchJsonArray);
      let searchJson = {
        Input: searchJsonArray
      }

      this.projectService.multiSearchUser(searchJson).subscribe({
        next: (response) => {
          $('.spinner').hide();
          if (response.status == 'Success') {
            this.projectDetails = [];
            this.selectedProjectIds = [];
            this.columns = [];
            this.cols = [];
            this.manualSearchCols = [];
            this._searchedColumns = this._selectedSearchColumns;
            this.projectsColumnAlign(response);
            ($('#projectSearch') as any).modal('hide');
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




  submitFormAddField() {

    this.addFieldsSubmitted = true;
    if (this.addFieldsForm.valid) {

      let options: any = [];
      if (this.addFieldsForm.value.fieldType == 'DropDown' || this.addFieldsForm.value.fieldType == 'Multiple') {
        this.addFieldsForm.value.dropDownOptions.forEach((elm, inx) => {
          options.push(elm.dropDownOptions);
        });
      }

      let params = {
        documentFieldName: this.addFieldsForm.value.fieldName,
        projectId: this.addFieldsForm.value.project,
        fieldType: this.addFieldsForm.value.fieldType,
        fieldOrder: '1',
        isMandatory: this.addFieldsForm.value.mandatory,
        validation: this.addFields.validation,
        drop_down_field_name: options
      };

      $('.spinner').show();
      this.projectService.addProjectFields(params).subscribe({
        next: (response) => {
          $('.spinner').hide();
          if (response.status == 'Sucess') {
            ($('#addfieldnames') as any).modal('hide');

            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: response.message,
            });
            this.selectedProjectIds = [];
            this.initialProjectId = this.addFieldsForm.value.project;
            this.getProjectField(this.addFieldsForm.value.project);
            this.addFieldsSubmitted = false;
            this.addFieldsForm.reset();
            this.addFieldsForm.value.project = "";
            this.addFieldsForm.value.mandatory = "";
            this.addFieldsForm.value.fieldType = "";
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

  get addFieldsFormControl() {
    return this.addFieldsForm.controls;
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

  onListOfRightMenus(eventData: string) {
    let arr = JSON.parse(eventData);
    Object.entries(arr).forEach(([key, value]) =>
      this.rightSideMenus.push(value)
    );
  }


  addOptionField(): void {
    this.dropDownOptionControl.push(
      this.fb.group({
        dropDownOptions: ['', [Validators.required]]
      })
    );
  }

  remove(index) {
    this.dropDownOptionControl.removeAt(index);
  }


  /*Project details tab navigation*/
  getprojectDetails($event: any) {
    if (!$event.index) {
      this.currentTab1 = 'Project';
      this.currentTab2 = '';
      this.currentTab3 = '';
      $('#inlineRadio_student1').trigger('click');
    } else if ($event.index == 1) {
      this.selectedProjectDetails = [];
      this.currentTab2 = 'Fields Mapping';
      this.currentTab1 = '';
      this.currentTab3 = '';
      $('#inlineRadio_coor1').trigger('click');
    }
  }

  columnFilter($event: any) {
    if ($event.value.length == 0) {
      this._selectedProjectColumns = this._selectedColumnsDup;
    }
  }
  columnFilterFields($event: any) {
    this._selectedFieldColumns = $event.value;
  }

  @Input() get selectedProjectColumns(): any[] {
    return this._selectedProjectColumns;
  }
  set selectedProjectColumns(val: any[]) {
    this._selectedProjectColumns = this.cols.filter((col) => val.includes(col));
  }

  @Input() get selectedFieldsColumns(): any[] {
    return this._selectedFieldColumns;
  }
  set selectedFieldsColumns(val: any[]) {
    this._selectedFieldColumns = this.fieldsCols.filter((col) =>
      val.includes(col)
    );
  }

  /* projectmanagerList  project details*/
  projectmanagerList() {
    this.projectService.getProjectMangaerList().subscribe((data) => {
      let projects: any = [];
      data.data.forEach((elm, inx) => {
        let lastname = (elm.lastname != null) ? elm.lastname : '';
        projects.push({
          item_id: elm.userid,
          item_text: elm.firstname + ' ' + lastname,
        });
      });
      this.projectmanagerddl = projects.sort((a: any, b: any) =>
        a.projectmanagername > b.projectmanagername ? 1 : -1
      );
      //this.cityddl.sort();
    });

    console.log(this.projectmanagerddl);
  }

  /* Display Project list*/
  projectNameList() {
    this.programService.getProjectList().subscribe((data) => {
      this.projectddl = data.data.sort((a: any, b: any) =>
        a.project_name > b.project_name ? 1 : -1
      );

      this.activeProjectList = this.projectddl.filter(function (el) {
        return el.status == 'Active';
      });

      this.initialProjectId = this.activeProjectList[0].project_id;
      $('.project-name-list').val(this.initialProjectId);
      this.getProjectField(this.initialProjectId);
    });
  }

  /*Delete current project details*/
  deleteCurrentProject(rowData: any) {
    this.project_id = rowData.project_id;
  }

  /*Delete  */
  copytoClipboard() {

    // navigator.clipboard.writeText(this.generatedLink);
    let text = this.generatedLink;
    this.fallbackCopyTextToClipboard(text)
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Copied',
    });
  }

  fallbackCopyTextToClipboard(text) {
    // console.log(text);
    // this.clipboardService.copyFromContent(text);

    var textarea = document.createElement('textarea');
    textarea.textContent = text;
    document.body.appendChild(textarea);

    var selection = document.getSelection();
    var range = document.createRange();
    //  range.selectNodeContents(textarea);
    range.selectNode(textarea);
    selection.removeAllRanges();
    selection.addRange(range);

    console.log('copy success', document.execCommand('copy'));
    selection.removeAllRanges();

    document.body.removeChild(textarea);

  }

  /*generateLink project details */
  generateLink(rowData: any) {

    if (rowData.generate_link) {
      this.generatedLink = rowData.generate_link;
    } else {
      this.generatedLink =
        window.location.origin +
        '/#/studentregistration?studentProjectAssignId=' +
        rowData.project_id + '&userId=' + this.currentLoginUserId;
      let data = {
        projectId: rowData.project_id,
        generateLink: this.generatedLink,
      };
      // this.projectService.generateLink(data).subscribe({
      //   next: (response) => { },
      // });
    }
  }

  /*Change status project details*/
  onchangeStatus(dt: any) {
    $('.spinner').show();
    this.updatedisabled = true;
    let sample = this.selectedProjectDetails.map(
      (x: { project_id: any }) => x.project_id
    );
    this.changeprojectStatus.projectIds = sample;
    this.projectService.changeStatus(this.changeprojectStatus).subscribe({
      next: (changeresponse) => {
        if (changeresponse.status.toLowerCase() == 'success') {

          ($('#changestatus') as any).modal('hide');
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: changeresponse.message,
          });



          this.projectService.getProjectDetails().subscribe({
            next: (response) => {
              if (response.status == 'Success') {
                if (response.data != null) {
                  $('.spinner').hide();

                  this.projectDetails = [];
                  response.data.forEach((elem: any, index: any) => {
                    this.projectDetails.push({
                      project_id: elem.project_id,
                      project_name: elem.project_name,
                      start_date: moment(elem.start_date).format('YYYY-MM-DD'),
                      end_date: moment(elem.end_date).format('YYYY-MM-DD'),
                      status: elem.status,
                      // project_manager_id: elem.project_manager_id,
                      project_manager_name: elem.project_manager_name,
                      project_manager_id: elem.project_manager_id,
                      overall_status: elem.overall_status,
                      generate_link: elem.generate_link,
                      terms_and_conditions: elem.terms_and_conditions,
                      term_upload_filename: (elem.terms_and_conditions != 'No') ? elem.file_name : '',
                      version: (elem.terms_and_conditions != 'No') ? elem.version : '',
                      terms_and_condition_url: elem.terms_and_condition_url
                    });
                  });

                  this.updatedisabled = false;
                  this.selectedProjectDetails = [];
                }
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
    });
  }

  resetProjectForm(p: NgForm) {
    p.resetForm();
    return true;
  }

  resetProjectFieldsForm(addfield: NgForm) {
    addfield.resetForm();
    return true;
  }

  /*Get project details*/
  getProjectList() {
    $('.spinner').show();
    this.projectService.getProjectDetails().subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.status == 'Success') {
          this.projectDetails = [];
          this.selectedProjectIds = [];
          this.columns = [];
          this.cols = [];
          this.manualSearchCols = []
          this.projectmanagerList();
          this.projectNameList();
          this.projectsColumnAlign(response);
        }
      },
      error: (response) => {
        $('.spinner').hide();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: (response.error.message == null) ? response.error.error : response.error.message });
      },
    });
  }

  changeTermStatus($event) {
    if ($event.target.value == 'Yes') {
      this.UploadCerticate(false);
    }
  }

  projectsColumnAlign(response) {

    response.data.forEach((elem: any, index: any) => {
      this.projectDetails.push({
        project_id: elem.project_id,
        project_name: elem.project_name,
        start_date: moment(elem.start_date).format('YYYY-MM-DD'),
        end_date: moment(elem.end_date).format('YYYY-MM-DD'),
        status: elem.status,
        // project_manager_id: elem.project_manager_id,
        project_manager_name: elem.project_manager_name,
        project_manager_id: elem.project_manager_id,
        overall_status: elem.overall_status,
        generate_link: elem.generate_link,
        terms_and_conditions: elem.terms_and_conditions,
        term_upload_filename: (elem.terms_and_conditions != 'No') ? elem.file_name : '',
        version: (elem.terms_and_conditions != 'No') ? elem.version : '',
        terms_and_condition_url: elem.terms_and_condition_url
      });
    });
    //this.projectDetails = response.data;
    var result = Object.keys(this.projectDetails[0]).map(function (
      key: string
    ) {
      return key;
    });

    result.forEach((elem: any, key: any) => {
      let headerName = this.humanize(elem);

      let newElm = '';
      if (elem == 'project_name') {
        newElm = 'projectname';
      } else if (elem == 'terms_and_conditions') {
        newElm = 'termsandcondition';
      } else if (elem == 'term_upload_filename') {
        newElm = 'filename';
      }

      if (
        elem != 'project_id' &&
        elem != 'user_id' &&
        elem != 'terms_and_condition_url' &&
        elem != 'project_manager_id' &&
        elem != 'generate_link' &&
        elem != 'overall_status'
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

  UploadCerticate(value) {
    this.uploadOption = value;
    if (value == true) {
      this.getEditDetails.terms_and_conditions = (this.editExistsUploadFileName != null && this.editExistsUploadFileName != undefined) ? this.editExistsUploadFileName : "";
      this.editMessage = '';
    }

  }

  myGroup = new FormGroup({
    file: new FormControl(),
  });

  editMyGroup = new FormGroup({
    file: new FormControl(),
  });


  onAddFileChange(event: any) {
    this.message = null;
    const file = event.target.files[0];
    this.files = file;
    var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
    let _validFileExtensions = ['pdf', 'PDF'];
    if (event.target.files.length > 0 && _validFileExtensions.includes(ext)) {
      this.message = '';
      if (this.files.size > 2000000) {
        this.message = 'File size less than 2MB';
      } else {
        this.message = '';
        this.addProject.term_and_conditions = file.name;
      }
    } else {
      this.message = 'Invalid file format';
      this.addProject.term_and_conditions = null;
    }
  }

  onEditFileChange(event: any) {
    this.editMessage = null;
    const file = event.target.files[0];
    this.editFiles = file;
    var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
    let _validFileExtensions = ['pdf', 'PDF'];
    if (event.target.files.length > 0 && _validFileExtensions.includes(ext)) {
      this.editMessage = '';
      if (this.editFiles.size > 2000000) {
        this.editMessage = 'File size less than 2MB';
      } else {
        this.editMessage = '';
        this.getEditDetails.terms_and_conditions = file.name;
        this.uploadOption = true;

      }
    } else {
      this.editMessage = 'Invalid file format';
      this.getEditDetails.terms_and_conditions = null;
    }
  }

  /*Add project details*/
  onAddProject(formvalue: any, p: NgForm) {
    debugger

    if ((formvalue.valid && formvalue.value.term_and_conditions == 'No') || (formvalue.valid && formvalue.value.term_and_conditions == 'Yes' && this.message == '')) {
      let projectManagerIds = [];
      if (formvalue.value.project_managers.length > 0) {
        projectManagerIds = formvalue.value.project_managers.map((x: { item_id: any }) => x.item_id);
      }
      let params = {
        project_name: formvalue.value.proname,
        start_date: this.datepipe.transform(
          formvalue.value.startdate,
          'yyyy-MM-dd'
        ),
        end_date: this.datepipe.transform(
          formvalue.value.enddate,
          'yyyy-MM-dd'
        ),
        status: formvalue.value.status,
        project_manager_id: projectManagerIds.toString(),
        terms_and_condition: formvalue.value.term_and_conditions,
        version: formvalue.value.version,
        created_by: +JSON.parse(this.user).id,
      };

      let files = this.files == null || this.files == undefined ? '' : this.files;

      //  this.disable=true;
      $('.spinner').show();
      this.projectService.addProject(params, files).subscribe({
        next: (data) => {
          if (data.status.toLowerCase() == 'success') {
            this.projectService.getProjectDetails().subscribe({
              next: (response) => {
                $('.spinner').hide();
                if (response.status.toLowerCase() == 'success') {
                  if (response.data != null) {
                    // $('.spinner').hide();
                    this.projectDetails = [];
                    response.data.forEach((elem: any, index: any) => {
                      this.projectDetails.push({
                        project_id: elem.project_id,
                        project_name: elem.project_name,
                        start_date: moment(elem.start_date).format('YYYY-MM-DD'),
                        end_date: moment(elem.end_date).format('YYYY-MM-DD'),
                        status: elem.status,
                        // project_manager_id: elem.project_manager_id,
                        project_manager_name: elem.project_manager_name,
                        project_manager_id: elem.project_manager_id,
                        overall_status: elem.overall_status,
                        generate_link: elem.generate_link,
                        terms_and_conditions: elem.terms_and_conditions,
                        term_upload_filename: (elem.terms_and_conditions != 'No') ? elem.file_name : '',
                        version: (elem.terms_and_conditions != 'No') ? elem.version : '',
                        terms_and_condition_url: elem.terms_and_condition_url
                      });
                    });

                    ($('#addproject') as any).modal('hide');
                    this.resetProjectForm(p);
                    this.selectedProjectDetails = [];
                    this.selectedProjectIds = [];
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Success',
                      detail: data.message,
                    });
                    this.projectNameList();
                  }
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
        error: (data) => {
          // this.disable=false;
          $('.spinner').hide();
          if (data.error != null) {
            this.listOfErrors = data.error.message;

            //this.toastr.error(this.listOfErrors)
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: data.error.message,
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: data.message,
            });
          }

          // setTimeout(function () { $("#db_error").hide(); });
        },
      });
    }
  }

  onSelectProjects($event) {
    if (!this.selectedProjectIds.includes(+$event.item_id)) {
      this.selectedProjectIds.push(+$event.item_id);
    }

    this.getEditDetails.project_manager_id = this.selectedProjectIds.toString();
    console.log(this.selectedProjectIds);
    console.log(this.getEditDetails.project_manager_id);

  }


  addFormFieldClose() {
    this.addFieldsSubmitted = false;
  }

  onDeSelectProjects($event) {
    var index = this.selectedProjectIds.indexOf(+$event.item_id);
    if (index !== -1) {
      this.selectedProjectIds.splice(index, 1);
    }

    this.getEditDetails.project_manager_id = this.selectedProjectIds.toString();
    console.log(this.selectedProjectIds);
    console.log(this.getEditDetails.project_manager_id);

  }

  onSelectAllProjects($event) {
    $event.forEach((elm, inx) => {
      if (!this.selectedProjectIds.includes(+elm.item_id)) {
        this.selectedProjectIds.push(+elm.item_id);
      }
    });

    this.getEditDetails.project_manager_id = this.selectedProjectIds.toString();
    console.log(this.selectedProjectIds);
    console.log(this.getEditDetails.project_manager_id);
  }

  onDeSelectAllProjects($event) {
    this.selectedProjectIds = [];
    this.getEditDetails.project_manager_id = '';
  }

  /*Edit project details*/
  editProjectDetails(rowData: any) {
    console.log(rowData);
    this.selectedProjectManagerLists = [];
    this.UploadCerticate(true)
    let proManIds = rowData.project_manager_id.split(',');
    let proManNames = rowData.project_manager_name.split(',');
    // this.selectedProjectIds = proManIds;
    let editPro: any = [];
    proManIds.forEach((e, i) => {

      let projectManagerInx = this.projectmanagerddl.findIndex((x: any) => {
        return x.item_id == +e;
      });

      if (projectManagerInx != -1) {
        editPro.push(this.projectmanagerddl[projectManagerInx]);
      }

      // this.selectedProjectIds.push(+e);
    });

    ($('#edit_project_details') as any).modal('show');
    this.getEditDetails.project_id = rowData.project_id;
    this.getEditDetails.project_name = rowData.project_name;
    this.getEditDetails.start_date = new Date(rowData.start_date);
    this.getEditDetails.end_date = new Date(rowData.end_date);
    this.getEditDetails.status = rowData.status;
    this.getEditDetails.project_manager_id = editPro;
    this.editSelectedProjectManagerLists = editPro;
    console.log(this.editSelectedProjectManagerLists)
    this.getEditDetails.terms_and_conditions_status = rowData.terms_and_conditions;
    if (this.getEditDetails.terms_and_conditions_status == 'No') {
      this.getEditDetails.terms_and_conditions = '';
      this.getEditDetails.version = '';
      this.editExistsUploadFileName = '';
    } else {
      this.getEditDetails.terms_and_conditions = rowData.term_upload_filename;
      this.getEditDetails.version = rowData.version;
      this.editExistsUploadFileName = rowData.term_upload_filename;
    }

  }

  /*Update project details*/
  onUpdateProject(formvalue: any) {

    let files = this.editFiles == null || this.editFiles == undefined ? '' : this.editFiles;
    let file_name = null;
    if (files.name == null && formvalue.value.edit_term_and_conditions.toLowerCase() == 'yes') {
      file_name = this.editExistsUploadFileName;
    } else {
      file_name = files.name;
    }


    if (formvalue.valid && this.uploadOption == true) {

      let projectManagerIds = [];
      if (formvalue.value.edit_project_managers.length > 0) {
        projectManagerIds = formvalue.value.edit_project_managers.map((x: { item_id: any }) => x.item_id);
      }

      let params = {
        project_id: +this.getEditDetails.project_id,
        project_name: formvalue.value.pname,
        project_manager_id: projectManagerIds.toString(),
        //project_manager_name: formvalue.value.ProjectManager,
        start_date: this.datepipe.transform(
          formvalue.value.sdate,
          'yyyy-MM-dd'
        ),
        end_date: this.datepipe.transform(formvalue.value.edate, 'yyyy-MM-dd'),
        status: formvalue.value.editstatus,
        terms_and_condition: formvalue.value.edit_term_and_conditions,
        file_name: file_name,
        version: formvalue.value.edit_version,
        updated_by: +JSON.parse(this.user).id,
        created_by: +JSON.parse(this.user).id,
        updated_time: new Date(),
        overall_status: formvalue.value.allstatus,
      };

      $('.spinner').show();
      this.projectService.updateProjectDetails(params, files).subscribe({
        next: (response) => {
          $('.spinner').hide();
          if (response.status == 'Success') {
            this.getProjectList();
            ($('#edit') as any).modal('hide');
            this.selectedProjectIds = [];
            this.selectedProjectDetails = [];
            this.files = "";
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

  StatusModal() {
    $('.form-check-input').addClass('radio_css');
  }

  /* viewProject  project details*/
  viewProject(rowData: any) {
    $('.spinner').show();
    ($('#view') as any).modal('hide');
    this.projectService.getViewProjectDetails(rowData.project_id).subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.status == 'Success')
          //this.viewexportprogram= response.data;
          // this. viewprogram = [];

          if (response.data.studentDetails.length > 0) {
            ($('#view') as any).modal('show');
            this.names = [];

            response.data.studentDetails.forEach((elem: any, index: any) => {
              let lastName = (elem.lastName != null) ? elem.lastName : '';
              this.names.push({
                studentName: elem.firstName + ' ' + lastName,
                email: elem.email,
                mobile: elem.mobile,
              });
            });
          } else {
            ($('#view') as any).modal('hide');
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: "Student not mapped in " + rowData.project_name + ' project',
            });
          }
      },
    });
  }

  /*exportPdf project details*/
  exportPdf(dt: any) {
    var doc: any = new jsPDF.default('p', 'pt', 'a1', true);
    this.exportColumns = [];
    Object.keys(this._selectedProjectColumns).forEach((key) => {
      this.exportColumns.push({
        title: this._selectedProjectColumns[key].header,
        dataKey: this._selectedProjectColumns[key].field,
      });
    });
    doc.autoTable(this.exportColumns, dt._selection, {
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
    doc.save('Project-Details.pdf');
  }

  exportCSV() {
    let columns: any = [];
    let projectExcelDetails: any = [];
    this.selectedProjectDetails.forEach((elem, inx) => {
      if (!projectExcelDetails.hasOwnProperty(inx)) {
        projectExcelDetails[inx] = {};
      }
      this._selectedProjectColumns.forEach((elm, indx) => {
        // let headerName = elm.header.replace(/\s/g, '');
        // headerName = this.humanize(headerName);
        let headerName = elm.header;
        projectExcelDetails[inx][headerName] = elem[elm.field];
      });
    });

    if (this.selectedProjectDetails.length == 0) {
      this._selectedProjectColumns.forEach((elm, indx) => {
        // let headerName = elm.header.replace(/\s/g, '');
        // headerName = this.humanize(headerName);
        let headerName = elm.header;
        columns[headerName] = '';
      });
      projectExcelDetails.push(columns);
    }

    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      filename: 'Project-Details',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(projectExcelDetails);
    this.selectedProjectDetails = [];
  }

  exportExcel(dt: any) {
    let columns: any = [];
    let projectExcelDetails: any = [];
    this.selectedProjectDetails.forEach((elem, inx) => {
      if (!projectExcelDetails.hasOwnProperty(inx)) {
        projectExcelDetails[inx] = {};
      }
      this._selectedProjectColumns.forEach((elm, indx) => {
        // let headerName = elm.header.replace(/\s/g, '');
        // headerName = this.humanize(headerName);
        let headerName = elm.header;
        projectExcelDetails[inx][headerName] = elem[elm.field];
      });
    });

    if (this.selectedProjectDetails.length == 0) {
      this._selectedProjectColumns.forEach((elm, indx) => {
        // let headerName = elm.header.replace(/\s/g, '');
        let headerName = elm.header;
        columns[headerName] = '';
      });
      projectExcelDetails.push(columns);
    }

    const worksheet = xlsx.utils.json_to_sheet(projectExcelDetails);
    const workbook = { Sheets: { 'Project-Details': worksheet }, SheetNames: ['Project-Details'] };
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'Project-Details');
  }
  /*saveAsExcelFile project details*/
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
  }

  /*downloadView project details*/
  downloadView() {
    // import('xlsx').then((xlsx) => {
    let excelData = [];
    this.names.forEach((elm, inx) => {
      excelData.push({
        'Student Name': elm.studentName,
        'Email Id': elm.email,
        'Mobile Number': elm.mobile
      })
    })

    const worksheet = xlsx.utils.json_to_sheet(excelData);
    const workbook = { Sheets: { 'Project Details': worksheet }, SheetNames: ['Project Details'] };
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'Project-Details');
    //this.saveAsExcelFile(excelBuffer, "BulkStudentRegistrationTemplate");
    // });
  }

  /*downloadTemplate project details*/
  downloadTemplate() {
    let headerNames = [
      'project_name',
      'project_manager_name',
      'start_date',
      'end_date',
      'status',
      // 'overall_status',
      // 'project_code',
      // 'email',
    ];

    const worksheet = xlsx.utils.json_to_sheet([headerNames], {
      skipHeader: true,
    });
    const workbook = {
      Sheets: { 'Project Bulkupload': worksheet },
      SheetNames: ['Project Bulkupload'],
    };
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'BulkProjectTemplate');
  }

  /* onBulkUplaod setting project details*/
  private setting = {
    element: {
      dynamicDownload: null as unknown as HTMLElement,
    },
  };

  /* dyanmicDownloadByHtmlTag  project details*/
  private dyanmicDownloadByHtmlTag(arg: { fileName: string; text: string }) {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType =
      arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute(
      'href',
      `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`
    );
    element.setAttribute('download', arg.fileName);

    var event = new MouseEvent('click');
    element.dispatchEvent(event);
  }

  /* onBulkUplaod  project details*/
  // onBulkUplaod() {
  //   $('.spinner').show();
  //   this.projectService
  //     .onBulkUpload(this.bulkUploadFile)
  //     .subscribe((result) => {
  //       $('.spinner').hide();
  //       var erFile: any = ``;
  //       let str = 'Hello World!\nThis is my string';
  //       if (result.data.failureRecords > 0) {
  //         // this.toastr.error("Upload Error Please check the downloaded file")
  //         this.messageService.add({
  //           severity: 'error',
  //           summary: 'Error',
  //           detail: 'Upload Error, Please check the downloaded file',
  //         });
  //         if (result.data.validationResults) {
  //           result.data.validationResults.forEach(
  //             (val: any, index: any, arValue: any) => {
  //               erFile += val.rowNumber + `\n `;
  //               val.messages.forEach((error: any) => {
  //                 erFile += error + `\n  `;
  //               });
  //               if (arValue.length == index + 1) {
  //                 this.dyanmicDownloadByHtmlTag({
  //                   fileName: 'Bulk upload error logs',
  //                   text: JSON.stringify(erFile),
  //                 });
  //               }
  //             }
  //           );
  //         }
  //       } else {
  //         //this.toastr.success("Upload success")

  //         this.getProjectList();
  //         ($('#addproject') as any).modal('hide');
  //         this.projectFileBulkUpload.nativeElement.value = '';

  //         this.messageService.add({
  //           severity: 'success',
  //           summary: 'Success',
  //           detail: 'Upload success',
  //         });
  //       }
  //     });
  // }


  bulkUplodClose(p: NgForm) {
    this.projectFileBulkUpload.nativeElement.value = '';
    p.resetForm();
  }

  onBulkUplaod() {
    let fi = this.projectFileBulkUpload.nativeElement;
    if (fi.files && fi.files[0] && this.projectFileUploadError == true) {
      $('.spinner').show();
      this.projectService.onBulkUpload(this.bulkUploadFile).subscribe({
        next: (result) => {
          $('.spinner').hide();
          var erFile: any = ``;
          let str = 'Hello World!\nThis is my string';

          if (result.data == null && result.status == 'Failed') {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: result.message,
            });
            this.projectFileBulkUpload.nativeElement.value = '';
            return false;
          }

          if (result.data != null && result.data.failureRecords > 0) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Upload Error Please check the downloaded file',
            });
            this.projectFileBulkUpload.nativeElement.value = '';
            this.getProjectList();
            ($('#addproject') as any).modal('hide');
            if (result.data.validationResults) {
              result.data.validationResults.forEach(
                (val: any, index: any, arValue: any) => {
                  erFile += val.rowNumber + `\n `;
                  val.messages.forEach((error: any) => {
                    erFile += error + `\n  `;
                  });
                  if (arValue.length == index + 1) {
                    this.dyanmicDownloadByHtmlTag({
                      fileName: 'Bulk upload error logs',
                      text: JSON.stringify(erFile),
                    });
                  }
                }
              );
            }
          } else {
            this.getProjectList();
            ($('#addproject') as any).modal('hide');
            this.projectFileBulkUpload.nativeElement.value = '';

            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Upload success',
            });
          }
        },
        error: (err) => {
          $('.spinner').hide();
          this.projectFileBulkUpload.nativeElement.value = '';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              err.error.message == null ? err.error.error : err.error.message,
          });
        },
      });
    } else {
      this.projectBulkUploadMsg = true;
    }
  }

  onBulkUploadChange(event: any) {
    this.projectBulkUploadMsg = false;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.bulkUploadFile = file;
      var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
      let _validFileExtensions = ['xlsx'];
      if (event.target.files.length > 0 && _validFileExtensions.includes(ext)) {
        if (this.bulkUploadFile.size > 20000000) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'File size should be less than 20MB',
          });
          this.projectFileUploadError = false;
        } else {
          this.projectFileUploadError = true;
        }
        this.projectFileUploadError = true;
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Invalid file format',
        });
        this.projectFileBulkUpload.nativeElement.value = '';
        this.projectFileUploadError = false;
      }
    }
  }



  /* onBulkUploadChange  project details*/
  // onBulkUploadChange(event: any) {
  //   if (event.target.files.length > 0) {
  //     const file = event.target.files[0];
  //     this.bulkUploadFile = file;
  //   }
  //   if (this.bulkUploadFile.size > 5000000) {
  //     //this.message = "File too big"
  //     //  upl.value = "";
  //   } else {
  //     //  this.message ="";
  //   }
  //   if (
  //     this.bulkUploadFile.type ==
  //     'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
  //     this.bulkUploadFile.type == 'text/plain' ||
  //     this.bulkUploadFile.type == 'image/png' ||
  //     this.bulkUploadFile.type == 'video/*' ||
  //     this.bulkUploadFile.type == ''
  //   ) {
  //     //  this.message ="Unsupported file format";
  //   } else {
  //     // this.message ="";
  //   }
  // }

  /* Get Registration Report List headerCaseString */
  headerCaseString(string: any) {
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

  /*Delete project details */
  deleteProject(project_id: any) {
    $('.spinner').show();
    this.projectService.deleteProject(this.project_id).subscribe({
      next: (delresponse) => {
        if (delresponse.status == 'Success') {
          this.receivedmessage = delresponse.message;
          this.projectService.getProjectDetails().subscribe({
            next: (response) => {
              $('.spinner').hide();
              if (response.status == 'Success') {
                ($('#delete') as any).modal('hide');
                this.projectDetails = response.data;
                // this.toastr.success(this.receivedmessage)
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: delresponse.message,
                });
                this.getProjectList();
              }
            },
            error: (response) => {
              $('.spinner').hide();
              //this.messageService.add({ severity: 'error', summary: 'Error', detail: (response.error.message == null) ? response.error.error : response.error.message });
            },
          });
        }
      },
      error: (response) => {
        $('.spinner').hide();
        //this.messageService.add({ severity: 'error', summary: 'Error', detail: (response.error.message == null) ? response.error.error : response.error.message });
      },
    });
  }
  /*Get Validations*/
  getValidationByFieldType(fieldType: any) {
    switch (fieldType) {
      case 'Text':
        this.addFields.validation = '^[a-zA-Z]*$';
        this.dropDownOptionControl.controls = [];
        this.addFieldsForm.get('dropDownOptions').clearValidators();
        this.addFieldsForm.get('dropDownOptions').updateValueAndValidity();
        break;
      case 'INT':
        this.addFields.validation = '^[0-9]+';
        this.dropDownOptionControl.controls = [];
        this.addFieldsForm.get('dropDownOptions').clearValidators();
        this.addFieldsForm.get('dropDownOptions').updateValueAndValidity();
        break;
      case 'File upload':
        this.addFields.validation = '';
        this.dropDownOptionControl.controls = [];
        this.addFieldsForm.get('dropDownOptions').clearValidators();
        this.addFieldsForm.get('dropDownOptions').updateValueAndValidity();
        break;
      case 'DropDown':
        this.addFields.validation = '';
        this.addOptionField();
        this.dynamicFieldName = 'Dropdown';
        this.addFieldsForm.get('dropDownOptions').setValidators([Validators.required]);
        this.addFieldsForm.get('dropDownOptions').updateValueAndValidity();
        break;
      case 'Multiple':
        this.addFields.validation = '';
        this.addOptionField();
        this.dynamicFieldName = 'Multiple';
        this.addFieldsForm.get('dropDownOptions').setValidators([Validators.required]);
        this.addFieldsForm.get('dropDownOptions').updateValueAndValidity();
        break;
      case 'Varchar 1':
        this.addFields.validation = '^[ A-Za-z0-9_@./#&+-]*$';
        this.dropDownOptionControl.controls = [];
        this.addFieldsForm.get('dropDownOptions').clearValidators();
        this.addFieldsForm.get('dropDownOptions').updateValueAndValidity();
        break;
      case 'Varchar 2':
        this.addFields.validation = '^[ A-Za-z_@./#&+-]*$';
        this.dropDownOptionControl.controls = [];
        this.addFieldsForm.get('dropDownOptions').clearValidators();
        this.addFieldsForm.get('dropDownOptions').updateValueAndValidity();
        break;
      case 'Varchar 3':
        this.addFields.validation = '^[ A-Za-z0-9]*$';
        this.dropDownOptionControl.controls = [];
        this.addFieldsForm.get('dropDownOptions').clearValidators();
        this.addFieldsForm.get('dropDownOptions').updateValueAndValidity();
        break;
      case 'Video':
        this.addFields.validation = '';
        this.dropDownOptionControl.controls = [];
        this.addFieldsForm.get('dropDownOptions').clearValidators();
        this.addFieldsForm.get('dropDownOptions').updateValueAndValidity();
        break;
      default:
        this.addFields.validation = '';
        this.dropDownOptionControl.controls = [];
        this.addFieldsForm.get('dropDownOptions').clearValidators();
        this.addFieldsForm.get('dropDownOptions').updateValueAndValidity();
        break;
    }
  }

  resetForm() {
    // this.addFieldsForm.reset();
    this.addFields.validation = '';
  }
  /*Add project Fields*/
  onAddField(formvalue: any, addfield: NgForm) {

    $('#submit_button').trigger('click');

    if (formvalue.valid == true) {
      let params = {
        documentFieldName: formvalue.value.fieldname,
        projectId: formvalue.value.project,
        fieldType: formvalue.value.fieldtype,
        fieldOrder: '1',
        isMandatory: formvalue.value.mandatory,
        validation: formvalue.value.validation,
      };

      $('.spinner').show();
      this.projectService.addProjectFields(params).subscribe({
        next: (response) => {
          $('.spinner').hide();
          if (response.status == 'Sucess') {
            ($('#addfields') as any).modal('hide');

            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: response.message,
            });
            this.selectedProjectIds = [];
            this.initialProjectId = formvalue.value.project;
            this.getProjectField(formvalue.value.project);
            this.addFieldsForm.reset();
            this.resetProjectFieldsForm(addfield);
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

  /*View project Fields*/
  getProjectField($event: any) {
    this.first = 0;
    let projectId = $event;
    $('.spinner').show();
    this.projectService.getProjectFields(projectId).subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.status == 'Success') {
          if (response.data != null) {
            this._registrationReportColumns = [];
            let projectInfoList = [];
            response.data.projectBasedFields.map((x) => {
              const data = {
                projectId: response.data.project_Id,
                projectName: response.data.project_Name,
                fields: x,
              };
              projectInfoList.push(data);
            });

            let finalDocumentList = [];
            projectInfoList.forEach((elem: any, index: any) => {
              finalDocumentList.push({
                documentDetailId: elem.fields.documentDetailId,
                fieldName: elem.fields.documentFieldName,
                project: elem.projectName,
                projectID: elem.projectId,
                mandatory: (elem.fields.ismandatory == 1 ? 'Yes' : 'No'),
                fieldType: elem.fields.fieldType,
                validation: elem.fields.validation,
                is_active: elem.fields.is_active == 1 ? 'Active' : 'Inactive',
              });
            });

            this.projectFieldDetails = finalDocumentList;

            if (this.projectFieldDetails.length > 0) {
              var result = Object.keys(this.projectFieldDetails[0]).map(
                function (key: string) {
                  return key;
                }
              );
              let headerName = '';

              result.forEach((elem: any, key: any) => {
                headerName = this.headerCaseString(elem);
                if (elem == 'fieldName') {
                  headerName = 'Field Name';
                } else if (elem == 'project') {
                  headerName = 'Project';
                } else if (elem == 'mandatory') {
                  headerName = 'Mandatory';
                } else if (elem == 'fieldType') {
                  headerName = 'Field Type';
                } else if (elem == 'validation') {
                  headerName = 'Validation';
                } else if (elem == 'is_active') {
                  headerName = 'Status';
                }

                if (
                  elem != 'active' &&
                  elem != 'projectID' &&
                  elem != 'documentDetailId'
                ) {
                  this._registrationReportColumns.push({
                    field: elem,
                    header: headerName,
                  });
                }
              });
              console.log(this._registrationReportColumns);
            }

            this._registrationReportColumnHeader = this._registrationReportColumns;
            this._registrationReportColumnTitle = this._registrationReportColumnHeader.map((col) => ({
              title: col.header,
              dataKey: col.field,
            }));

            this._registrationReportColumnDataKey =
              this._registrationReportColumnHeader.map((col) => ({
                dataKey: col.field,
              }));
          }
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

  @Input() get registrationReportColumns(): any[] {
    return this._registrationReportDefaultColumns;
  }
  set registrationReportColumns(val: any[]) {
    this._registrationReportDefaultColumns =
      this._registrationReportColumnHeader.filter((col) => val.includes(col));
  }

  registrationFilter($event: any) {
    if ($event.value.length == 0) {
      this._registrationReportDefaultColumns =
        this._registrationReportDefaultColumnsCopy;
    } else {
      this._registrationReportDefaultColumns = $event.value;
    }
  }

  deleteDocumentField(projectFieldDetail: any) {

    const documentDetailId = projectFieldDetail.documentDetailId;
    const projectId = projectFieldDetail.projectID;
    $('.spinner').show();
    this.projectService.deleteProjectFields(documentDetailId).subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.status == 'Success') {
          this.getProjectField(projectId);
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
