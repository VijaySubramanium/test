import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UsermanagementService } from 'src/app/services/user-management.service';
import * as FileSaver from 'file-saver';
import { MessageService } from 'primeng/api';
import { Coordinator } from 'src/app/view-models/coordinator';
import { UserAdmin } from 'src/app/view-models/useradmin';
import * as jsPDF from 'jspdf';
import * as xlsx from 'xlsx';
import 'jspdf-autotable';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../common.service';
import { FormControl, FormGroup } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { changeStatus } from '../view-models/changestatus';
import { sendMail } from '../view-models/sendmail';
import { PassReset } from '../sendpasswordreset';
import { StudentProfile } from '../view-models/student-profile';
import { CollegeService } from 'src/app/services/college.service';
import { UserAdminService } from 'src/app/services/user-admin.service';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { LoginService } from '../login.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Table } from 'primeng/table';
import { assign } from '../view-models/assignproject';
import { DatePipe } from '@angular/common';
import { ProfessionalModel } from '../view-models/professional-model';
import { StudentModel } from '../view-models/student-model';
import { Title } from '@angular/platform-browser';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { ChipsModule } from 'primeng/chips';
import { ExportToCsv } from 'export-to-csv';
import { debug } from 'console';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProjectDetailsService } from 'src/app/services/project-details.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  providers: [MessageService, DatePipe],
  styleUrls: ['./user-management.component.css'],
})

export class UserManagementComponent implements OnInit {
  @Input() adminDetails: any[];
  @ViewChild('customPaginator', { static: false }) paginator: Paginator;
  public checked: boolean = true;
  /* Student and Professional */
  userRowNum: any = 10;
  showCount: any = 10;
  pageNumber: any = 0;
  terms_and_conditions_url: string;
  userTotalRecords: any = 0;
  userTotalSearchRecords: any = 0;
  editStuDetails = new StudentModel();
  editProDetails = new ProfessionalModel();
  dropdownSettings: IDropdownSettings;
  studentdropdownSettings: IDropdownSettings = {};
  studentdropdownList: { item_id: number; item_text: string }[];
  public userDetails: any = [];
  public additionalUserDetails: any = [];
  public listOfAdditionalFields: any = [];
  cols: any[];
  searchCols: any[];
  columns: any = [];
  _selectedColumns: any[];
  _selectedSearchColumns: any[];
  _searchedColumns: any[] = [];
  searchError: boolean = false;
  _selectedColumnsDup: any[];
  exportColumns: any[];
  exportCols: any[];
  selectedUserDetails: any = [];
  currentUserId: string;
  stuUploadOption: boolean;
  proUploadOption: boolean;
  languageIds: any = [];
  currentAdditionFieldUserId: string;
  @ViewChild(Table) dt: Table;
  organizationNameList: any = [];

  exportUser: string = 'User-Management-Details';
  stuProfessionalRefersh: boolean = false;
  additionalFieldLabel: any = [];
  @ViewChild('stuProFileInput') stuProFileInput;
  @ViewChild('stuProFileUpdateInput') stuProFileUpdateInput;
  stuProBulkUploadMsg: boolean = false;
  stuProBulkUploadUpdateMsg: boolean = false;
  stuProUploadError: boolean = true;
  stuProUploadUpdateError: boolean = true;

  currentUserDetailsRowData = {
    id: '',
    gtt_id: '',
    role_id: '',
    role_name: '',
  };

  searchUserFields: any = [];
  selectedSearchFields: any = [];
  searchInputText: any;
  backUpUserFilterRecords: any = [];
  listOfCourseNames: any = [];
  listOfTrainerNames: any = [];
  listOfCourseIds: any = [];
  listOfTrainerIds: any = [];
  listOfBatchCodes: any = [];

  // editStuDetails: any;

  /* Coordinator Lists */
  coordinator = new Coordinator('', '', '', '', '', '', '', '', '', '', '', '');
  public coordinatorDetails: any = [];
  exportCoordinateName: string = 'Coordinator-Details';
  @ViewChild(Table) ct: Table;
  selectedCoordinatorDetails: any = [];
  coordinatorscols: any[];
  coordiantorscolumns: any = [];
  _coordinatorsSelectedColumns: any[];
  _coordinatorsSelectedColumnsDup: any[];
  coordinatorsExportColumns: any = [];
  coordinatorsExportCols: any[];
  currentCoordinatorRowData = {
    id: '',
    gtt_id: '',
    role_id: '',
    status: '',
  };
  coordinatorRefresh: boolean = false;
  @ViewChild('coorFileInput') coorFileInput;
  coordiantorBulkUploadMsg: boolean = false;
  CofileUploadError: boolean = true;


  @ViewChild('mailFileInput') mailFileInput;
  ccInput: boolean = false;
  ccMailLists: any = [];
  ccMailsSelected: any = [];
  ccMailMessage: string = '';

  bccInput: boolean = false;
  bccMailLists: any = [];
  bccMailMessage: string = '';
  bccMailsSelected: any = [];

  /* User Admin */
  userAdmin = new UserAdmin('', '', '', '', '', '', '', '', '', '', '');
  @ViewChild(Table) at: Table;
  userAdminRefresh: boolean = false;
  userAdminCols: any[];
  _selectedUserAdminColumns: any[];
  _selectedUserAdminColumnsDup: any[];
  userAdminColumns: any = [];
  userAdminExportColumns: any = [];
  userAdminExportCols: any[];
  exportAdminName: string = 'User-Admin-Details';
  selectedUserAdminDetails: any = [];
  currentUserAdminRowData = {
    id: '',
    gtt_id: '',
    role_id: '',
    status: '',
  };
  globalUserAdminFilter: any = [];
  @ViewChild('adminFileInput') adminFileInput;
  adminBulkUploadMsg: boolean = false;
  adminfileUploadError: boolean = true;
  filterCityNameList: any = [];
  userhead: any = [];
  mergeArr: any = [];
  templateToExcel: any = [];


  //Migrate to SA
  selectedInstantUrls: any = [];
  listOfInstantUrls: any = [];



  /* ===============
    Bulk Upload Template
  */

  _selectedUploadBulkTemplate: any[];
  _selectedUploadBulkTemplateDup: any[];
  bulkUploadTemplateDetails: any = [];
  bulkUploadTemplateCols: any[];
  selectedBulkUploadTemplateDetails: any = [];
  bulkUploadOption: boolean = true;
  bulkUploadFileName: any;
  bulkUploadTermOption: boolean = false;
  bulkUploadTermFileName: any;
  bulkTemplateFileError: boolean = true;
  bulkUploadTemplateFile: File;

  /* Project Assign */
  projectAssign = new assign([], [], '', '', '', '', '', '');

  currentTab1: string = 'studentprofessional';
  currentTab2: string = '';
  currentTab3: string = '';
  roles: any = [];
  courseIds: any = [];

  modalOptions: NgbModalOptions;
  currentRoleId: string;
  currentGttId: string;
  dateTime = new Date();
  loggedInRoleId: number;

  rightSideMenus: any = [];
  userModel = new changeStatus();
  passwordReset = new PassReset();
  sendMail = new sendMail();
  ProfileName = new StudentProfile();
  showForm: boolean = false;
  showSta: boolean = false;
  assign: boolean = false;
  receivedmessage: any;
  public code: any;
  public successmsg: boolean = true;
  public failuremsg: boolean = true;

  //public forgotpasswordstatus: any;
  public successmsgforgot: boolean = true;
  public failuremsgforgot: boolean = true;
  public receivedmessagereset: string = '';

  /* Password hide and show */
  show_button: boolean = false;
  show_eye: boolean = false;

  /* Confirm Password hide and show */
  confirm_show_button: boolean = false;
  confirm_show_eye: boolean = false;

  public files_s: any;
  stateDetails: any = [];
  cityDetails: any = [];
  collegeDetails: any = [];
  modalContent: any;
  closeResult: string | undefined;
  dropdownList: any = [];
  selectedLanguage: any = [];
  expotheader: any[];
  user: any = '';

  /*Assign project*/
  studentddl: any = [];
  projectddl: any = [];
  programddl: any = [];
  projectmanagerddl: any = [];
  batchddl: any = [];
  listOfErrors: any;
  status: any;
  trainerddl: any = [];
  trainingcorddl: any = [];
  listOfProjectManger: any = [];
  course_names: any = [];

  addAdminUserScreen: any = [];
  editAccessScreen: any = [];
  listOfPrograms: any = [];
  listOfCourses: any = [];
  roleDetails: any = [];

  listOfResponseProjects: any = [];


  termMessage: string | undefined;
  termDisable: boolean = false;
  termFileName: string;
  @ViewChild('termUploadFileInput') termUploadFileInput;
  locStorageTermFileName: string;
  locStorageTermFileVersion: string;

  public uploadOption: boolean = true;
  public termUploadFileName: string;
  public termUploadVerion: string;


  public files: any;
  public bulkUploadFile: any;
  public bulkUploadUpdateFile: any;
  public bulkCoorUploadFile: any;
  public bulkAdminUploadFile: any;

  public mailFiles: any = [];
  public mailMessage: string = '';

  public loggedInRoleName: string;
  public accessRoleNames: any = [];
  public accessAssignProjectRoleNames: any = [];
  public stuProGlobalFilter: any = [];
  public coordinatorFilter: any = [];
  public adminFilter: any = [];

  public listOfBatches: any = [];
  public listOfAssignTrainer: any = [];
  public listOfAssignProjectManager: any = [];
  public getBatchResponse: any = {};
  public currentLoginUserId: number;


  public finalProjectBasedReports: any = [];
  _projectBasedReportColumns: any = [];
  _projectBasedReportColumnHeader: any[];
  _projectBasedReportColumnDataKey: any[];
  _projectBasedReportColumnTitle: any[];
  _projectBasedDefaultColumns: any[];
  _projectBasedDefaultColumnsCopy: any[];

  mailUsers: any[];
  selectedMailedUsers: any[];
  ccMails: string[];
  listOfAllAdditionalFields: any = [];
  activeProjects: any = [];
  additionalFieldKeys: any = [];

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private titleService: Title,
    private toastr: ToastrService,
    public commonservice: CommonService,
    public collegeService: CollegeService,
    private UsermanagementService: UsermanagementService,
    private messageService: MessageService,
    private elementRef: ElementRef,
    private userAdminService: UserAdminService,
    private datepipe: DatePipe,
    public _loginservice: LoginService,
    public projectService: ProjectDetailsService,

  ) {

    this.listOfColleges();
    this.listOfInstantUrl();

    /*Profile Name */
    this.user = localStorage.getItem('userId');
    this.roles = JSON.parse(localStorage.getItem('roles'));

    this.roleDetails = [];
    this.roles.forEach((elem, indx) => {
      let roleName = elem.role_name
        .replace(/\w+/g, function (txt) {
          return txt.toUpperCase();
        })
        .replace(/\s/g, '_');
      if (
        !['GTT_ADMIN', 'ROLE_ADMIN', 'STUDENT', 'PROFESSIONAL'].includes(
          roleName.trim()
        )
      ) {
        this.roleDetails.push(elem);
      }
    });

    this.loggedInRoleId = JSON.parse(this.user).user_role.role_id;
    let loggedInRoleName = JSON.parse(this.user).user_role.role;
    this.currentLoginUserId = JSON.parse(this.user).id;


    this.loggedInRoleName = loggedInRoleName
      .replace(/\w+/g, function (txt) {
        return txt.toUpperCase();
      })
      .replace(/\s/g, '_');

    this.accessRoleNames = ['GTT_ADMIN'];
    this.addAdminUserScreen = [
      'GTT_ADMIN',
      'TRAINER',
      'TRAINING_COORDINATOR',
      'PROGRAM_LEAD',
      'PROJECT_MANAGER',
      'MIS',
      'RECRUITER',
    ];
    this.editAccessScreen = ['TRAINER', 'MIS'];
    this.accessAssignProjectRoleNames = ['GTT_ADMIN', 'TRAINING_COORDINATOR', 'PROGRAM_LEAD'];
    var headers = ['gttId', "firstName", "lastName", "gender", "DOB", "maritalStatus", "email", "mobile", "whatsappNumber", "password", "confirmPassword", "roleName", "isGraduated", "collegeCity", "academicInstitutionName", "aadharNumber", "educationalQualification", "graduationPassingYear", "subject", "profession", "currentLocation", "isPlaced", "vaccinationStatus", "termsAndConditions", "caste", "placedOrganization", "designation", "joiningMonth", "pursuingPostGraduate", "postGraduationQualification", "postGraduationPassingYear", "postGraduationInstitution", "alternateNumber", "fatherName", "motherName", "guardianName", "pincode", "typeofDisability ", "markPercent", "languageKnown", "isExperience", "experienceYears", "employer1", "employer2", "status", "stateName", "projectName"];
    this.searchUserFields = [];
    headers.forEach((el, ix) => {
      let els = this.humanize(el);
      this.searchUserFields.push({
        'keyName': el,
        'displayName': els
      })
    })

    $('#firstSpace').on('keypress', function (e) {
      if (e.which == 32) {
        console.log('Space Detected');
        return false;
      }
    });

    /*Assign project*/
    this.studentNameList();
    this.projectNameList();
    this.programNameList();
    this.projectmanagerNameList();
    // this.batchNameList();
    this.getOrganizationList();
    this.trainingCoordinatorNameList();
    // this.trainerNameList();

    this._selectedColumns = [
      // { field: 'id', header: 'Id' },
      { field: 'firstName', header: 'First Name' },
      { field: 'lastName', header: 'Last Name' },
      { field: 'email', header: 'Email Id' },
      { field: 'mobile', header: 'Mobile No' },
      { field: 'status', header: 'Status' },
    ];

    this._selectedColumnsDup = this._selectedColumns;

    this._selectedUploadBulkTemplate = [
      // { field: 'id', header: 'Id' },
      { field: 's_no', header: 'S No' },
      { field: 'module_name', header: 'Module Name' },
      { field: 'file_name', header: 'File Name' },
    ];

    this._selectedUploadBulkTemplateDup = this._selectedUploadBulkTemplate;
    this._coordinatorsSelectedColumns = [
      // { field: 'gtt_id', header: 'Gtt Id', align: "center" },
      { field: 'first_name', header: 'First Name', align: 'center' },
      { field: 'last_name', header: 'Last Name', align: 'center' },
      { field: 'email', header: 'Email Id', align: 'center' },
      { field: 'mobile', header: 'Mobile No', align: 'center' },
      { field: 'status', header: 'Status', align: 'center' },
    ];

    this._coordinatorsSelectedColumnsDup = this._coordinatorsSelectedColumns;

    this._selectedUserAdminColumns = [
      // { field: 'id', header: 'Id', align: "center" },
      // { field: 'gtt_id', header: 'Gtt Id', align: 'center' },
      { field: 'first_name', header: 'First Name', align: 'center' },
      { field: 'last_name', header: 'Last Name', align: 'center' },
      { field: 'email', header: 'Email Id', align: 'center' },
      { field: 'mobile', header: 'Mobile No', align: 'center' },
      { field: 'gender', header: 'Gender', align: 'center' },
      { field: 'status', header: 'Status', align: 'center' },
    ];

    this._selectedUserAdminColumnsDup = this._selectedUserAdminColumns;

    this._projectBasedDefaultColumns = [
      { field: 'gttId', header: 'Gtt Id' },
      { field: 'firstName', header: 'First Name' },
      { field: 'projectManagerName', header: 'Project Manager Name' },
      { field: 'projectName', header: 'Project Name' },
      { field: 'programName', header: 'Program Name' },
      { field: 'courseName', header: 'Course Name' },
      { field: 'batchName', header: 'Batch Name' },
      { field: 'trainerName', header: 'Trainer Name' },
    ];
    this._projectBasedDefaultColumnsCopy = this._projectBasedDefaultColumns;

    this.stuProGlobalFilter = [
      'firstName',
      'lastName',
      'email',
      'mobile',
      'status',
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
      'projects',
      'graduationPassingYear',
      'postGraduationPassingYear'
    ];
    this.coordinatorFilter = ['first_name', 'email', 'mobile', 'status', 'role_name'];
    this.adminFilter = ['first_name', 'email', 'mobile', 'status'];
  }

  ngOnInit(): void {
    this.setTitle('TJM-User Management');
    this.listOfPro();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 3,
    };

    this.dropdownList = [
      { item_id: 1, item_text: 'English' },
      { item_id: 2, item_text: 'Hindi' },
      { item_id: 3, item_text: 'Marathi' },
      { item_id: 4, item_text: 'Tamil' },
      { item_id: 5, item_text: 'Telugu' },
      { item_id: 6, item_text: 'Kannada' },
      { item_id: 7, item_text: 'Other' },
    ];

    this.bulkUploadTemplateDetails = [
      {
        s_no: 1,
        module_name: 'College Management',
        file_name: 'CollegeBulkRegistration.xlsx',
      },
      {
        s_no: 2,
        module_name: 'User Management - Student/Professional',
        file_name: 'StudentAndProfessional_bulkUpload.xlsx',
      },
      {
        s_no: 3,
        module_name: 'User Management - Coordinator',
        file_name: 'BulkUploadCoordinators.xlsx',
      },
      {
        s_no: 4,
        module_name: 'User Management - Admin',
        file_name: 'UserAdminBulkUpload.xlsx',
      },
      {
        s_no: 5,
        module_name: 'Project Management',
        file_name: 'ProjectBulk.xlsx',
      },
      {
        s_no: 6,
        module_name: 'Program Management',
        file_name: 'BulkProgram.xlsx',
      },
      {
        s_no: 7,
        module_name: 'Batch Management',
        file_name: 'BulkBatchTemplate.xlsx',
      },
    ];

    this.studentdropdownList = [];
    this.studentdropdownSettings = {
      idField: 'id',
      textField: 'firstName',
    };

    let paramRoleIds = this.getStuProRoleIds();
    if (this.loggedInRoleName == 'GTT_ADMIN') {
      // this.getUserManagementDetails(paramRoleIds);
      this.getUserManagementNewDetails(paramRoleIds, 0, this.showCount)
      let coParamRoleIds = this.getCoordinatorRoleIds();
      this.getCoordinatorLists(coParamRoleIds);
      this.getUserAdminDetails(this.loggedInRoleId);
    } else {
      this.getUserManagementNewDetails(paramRoleIds, 0, this.showCount);
      if (this.loggedInRoleName == 'PROJECT_MANAGER') {
        this.getCoordinatorLists(this.loggedInRoleId);
      }
    }
  }


  listOfPro() {

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
                    if (el.projectBasedFields.length > 0) {
                      el.projectBasedFields.forEach((elv, elz) => {
                        if (elv.fieldType != null) {
                          additionalFields.push(elv.documentFieldName);
                          this.listOfAllAdditionalFields.push(elv.documentFieldName);
                        }
                      });
                      if (additionalFields.length > 0) {
                        this.activeProjects.push({
                          'projectId': el.project_Id,
                          'projectName': el.project_Name,
                          'additionalFields': additionalFields,
                        });
                      }
                    }

                  });

                  let uNames = new Map(this.listOfAllAdditionalFields.map(s => [s.toLowerCase(), s]));
                  this.listOfAllAdditionalFields = [...uNames.values()];
                }
              },
              error: (ErrResponse) => {
                $('.spinner').show();
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



  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }


  ccOption() {
    if (this.ccInput == true) {
      this.ccInput = false;
      this.ccMailsSelected = [];
      this.ccMailMessage = '';
      this.ccMailLists = [];
    } else {
      this.ccInput = true
    }
  }

  bccOption() {
    if (this.bccInput == true) {
      this.bccInput = false;
      this.bccMailsSelected = [];
      this.bccMailMessage = '';
      this.bccMailLists = [];
    } else {
      this.bccInput = true
    }
  }

  checkBccRemove($event) {
    console.log($event.value);
    this.bccMailMessage = '';
    if (this.bccMailLists.length > 0) {
      this.bccMailLists.splice(this.bccMailLists.indexOf($event.value), 1);
    }
    console.log(this.bccMailLists);
  }


  onSearch(formvalue) {
    if (formvalue.valid == true) {
      $('.spinner').show();
      let params = {
        searchColumn: this.selectedSearchFields.keyName,
        searchValue: this.searchInputText,
      };
      console.log(params)
      this.UsermanagementService.onSearchUser(params).subscribe({
        next: (response) => {
          $('.spinner').hide();
          this.userTotalSearchRecords = response.totalCount;
          this.userTotalRecords = response.totalCount;
          if (response.data != null) {
            this.userDetailsColumnAlign(response);
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

  checkCcRemove($event) {
    console.log($event.value);
    this.ccMailMessage = '';
    if (this.ccMailLists.length > 0) {
      this.ccMailLists.splice(this.ccMailLists.indexOf($event.value), 1);
    }
    console.log(this.ccMailLists);
  }

  checkCcInput($event) {
    const regex = new RegExp('^(?![0-9])[a-zA-Z0-9._]+@[a-z]+[.]+[a-z]{2,4}$');
    if (regex.test($event.value)) {
      let emailSplit = $event.value.split('@');
      this.ccMailsSelected.push(emailSplit[0]);
      this.ccMailsSelected.splice(this.ccMailsSelected.indexOf($event.value), 1);
      this.ccMailLists.push($event.value);
    } else {
      this.ccMailMessage = 'Enter a valid data';
    }
  }

  checkBccInput($event) {
    const regex = new RegExp('^(?![0-9])[a-zA-Z0-9._]+@[a-z]+[.]+[a-z]{2,4}$');
    if (regex.test($event.value)) {
      let emailSplit = $event.value.split('@');
      this.bccMailsSelected.push(emailSplit[0]);
      this.bccMailsSelected.splice(this.bccMailsSelected.indexOf($event.value), 1);
      this.bccMailLists.push($event.value);
      console.log(this.bccMailLists);
    } else {
      this.bccMailMessage = 'Enter a valid data';
    }
  }

  onGeneralTermsUpload(updateTerm) {
    let form = updateTerm.form;
    if (form.valid && this.termMessage == '') {

      let files = this.termFileName == null || this.termFileName == undefined ? '' : this.termFileName;
      let params = {
        'inserted_By_Id': +JSON.parse(this.user).id,
        'version': form.value.version
      }

      $('.spinner').show();
      this.UsermanagementService.getGenTermsConditionsUpload(params, files).subscribe({
        next: (res) => {
          if (res.status.toLowerCase() == 'success') {
            this.genTermsAndConditionUrl();
            ($('#uploadtc') as any).modal('hide');
            this.termUploadFileInput.nativeElement.value = '';
            updateTerm.resetForm();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: res.message,
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


  genTermsAndConditionUrl() {
    $('.spinner').show();
    this._loginservice.getTermUrl().subscribe({
      next: (res) => {
        $('.spinner').hide();
        if (res.status.toLowerCase() == "success") {
          this.terms_and_conditions_url = res.data.url_path
          this.locStorageTermFileName = res.data.filename;
          this.locStorageTermFileVersion = res.data.version;
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



  getOrganizationList() {
    // $('.spinner').show();
    this.UsermanagementService.getOrganizationList().subscribe((response) => {
      // $('.spinner').hide();
      if (response.data != null) {
        const orgSorted = response.data.sort((a: any, b: any) =>
          a.placement_employer_name > b.placement_employer_name ? 1 : -1
        );
        this.organizationNameList = orgSorted;
      }
    });
  }


  onGeneralTermsUploadChange(event: any) {
    this.termDisable = false;
    const file = event.target.files[0];
    this.termFileName = file;
    var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
    let _validFileExtensions = ['pdf', 'PDF'];
    if (event.target.files.length > 0 && _validFileExtensions.includes(ext)) {
      this.termMessage = '';
      if (file.size > 2000000) {
        this.termMessage = 'File size less than 2MB';
        this.termDisable = true;
      } else {
        this.termMessage = '';
        this.termUploadFileName = file.name;
      }
    } else {
      this.termMessage = 'Invalid file format';
      this.termDisable = true;
    }
  }

  onFilter(event, dt) {
    console.log(event.filters);
    if (Object.keys(event.filters).length != 0) {
      console.log(event.filters.global.value.length);
      this.userTotalRecords = event.filteredValue.length;
    } else {
      this.userTotalRecords = this.userTotalSearchRecords;
    }
  }

  @Input() get selectedBulkUploadTemplateColumns(): any[] {
    return this._selectedUploadBulkTemplate;
  }

  editBulkUploadTemplate(rowData: any) {
    ($('#editbulktemplte') as any).modal('show');
    this.bulkUploadFileName = rowData.file_name;
  }

  onBulkUploadTemplateChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.bulkUploadTemplateFile = file;
      var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
      let _validFileExtensions = ['xlsx'];
      if (event.target.files.length > 0 && _validFileExtensions.includes(ext)) {
        if (file.size > 20000000) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'File size should be less than 20MB',
          });
          this.bulkTemplateFileError = false;
        } else {
          this.bulkTemplateFileError = true;
        }
        this.bulkTemplateFileError = true;
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Invalid file format',
        });
        this.bulkTemplateFileError = false;
        this.bulkUploadFileName = '';
      }
    }
  }

  bulkUploadTemplateSubmit() {
    this.commonservice
      .bulkTemplateFileUpload(this.bulkUploadTemplateFile)
      .subscribe({
        next: (response) => {
          $('.spinner').hide();
          alert('Success');
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

  UploadCerticate(value: any) {
    this.bulkUploadOption = value;
    this.bulkUploadFileName = '';
  }

  UploadTermCerticate(value: any) {
    this.bulkUploadTermOption = value;
    console.log(this.termFileName);
    console.log(value);
    console.log(this.locStorageTermFileName);
    if (value == true) {
      this.termUploadFileName = this.locStorageTermFileName;
      this.termMessage = '';
    } else {
      this.termUploadFileName = null;
    }
  }

  getStuProRoleIds() {
    let roleIds = [];
    this.roles.map(function (obj) {
      let roleName = obj.role_name
        .replace(/\w+/g, function (txt) {
          return txt.toUpperCase();
        })
        .replace(/\s/g, '_');
      if (['STUDENT', 'PROFESSIONAL'].includes(roleName)) {
        roleIds.push({
          role_id: obj.role_id,
        });
      }
    });

    let paramRoleIds = roleIds.map((x) => x.role_id).join(',');
    return paramRoleIds;
  }

  getCoordinatorRoleIds() {
    let roleIds = [];
    this.roles.map(function (obj) {
      let roleName = obj.role_name
        .replace(/\w+/g, function (txt) {
          return txt.toUpperCase();
        })
        .replace(/\s/g, '_');
      if (
        !['ROLE_ADMIN', 'STUDENT', 'PROFESSIONAL', 'GTT_ADMIN'].includes(
          roleName
        )
      ) {
        roleIds.push({
          role_id: obj.role_id,
        });
      }
    });

    let coParamRoleIds = roleIds.map((x) => x.role_id).join(',');
    return coParamRoleIds;
  }

  onProjectChange(project_id: any) {
    let projectFields =
      this.listOfAdditionalFields[this.currentAdditionFieldUserId][project_id];
    if (projectFields != null && projectFields != undefined) {
      this.additionalUserDetails = projectFields;
    }
  }

  migrateToSA() {

    if (this.selectedUserDetails.length > 0) {
      var designation: string;
      if (this.currentTab1 != '') {
        designation = 'learner';
      } else {
        designation = 'L&D Manager';
      }


      let params: any = [];
      this.selectedUserDetails.forEach((elm, inx) => {
        params.push({
          "employeeId": elm.id,
          "userName": elm.email,
          "firstName": elm.firstName,
          "lastName": elm.lastName,
          "mobile": elm.mobile,
          "altMobile": elm.mobile,
          "email": elm.email,
          "alternetEmail": elm.email,
          "designation": designation,
          'password': elm.password,
        })
      });

      $('.spinner').show();
      this.UsermanagementService.migrateToSA(params).subscribe({
        next: (response) => {
          $('.spinner').hide();
          if (response.status.toLowerCase() == 'success') {
            this.selectedUserDetails = [];
            let paramRoleIds = this.getStuProRoleIds();
            this.getUserManagementNewDetails(paramRoleIds, this.pageNumber, this.showCount);
            this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          }
        },
        error: (response) => {
          $('.spinner').hide();
          this.selectedUserDetails = [];
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


  userDetailsColumnAlign(response) {

    let headerName = '';
    this.listOfResponseProjects = [];
    this.userDetails = [];
    this.listOfAdditionalFields = [];
    let stuPrpAssignProjects = {};
    let assignProjects: any = [];
    this.columns = [];

    response.data.forEach((elem: any, index: any) => {

      let stuProjectss = [];
      if (elem.projectAddtionalFields.length > 0) {
        stuProjectss = Object.keys(elem.projectAddtionalFields).map(
          function (k) {
            return elem.projectAddtionalFields[k].projectname;
          }
        );
      }

      let stuProjects = [...new Set(stuProjectss)];

      if (
        elem.user.status == 'Active' &&
        this.loggedInRoleName != 'GTT_ADMIN'
      ) {
        this.userDetails.push({
          id: elem.user.id,
          firstName: elem.user.firstName,
          lastName: elem.user.lastName,
          insertedtime:
            elem.user.insertedtime != null &&
              elem.user.insertedtime != ''
              ? moment(elem.user.insertedtime).format('YYYY-MM-DD')
              : '',
          gender: elem.user.gender,
          dob:
            elem.user.dob != null && elem.user.dob != ''
              ? moment(elem.user.dob).format('YYYY-MM-DD')
              : '',
          maritalStatus: elem.user.maritalStatus,
          email: elem.user.email,
          mobile: elem.user.mobile,
          whatsappNumber: elem.user.whatsappNumber,
          password: elem.user.password,
          confirmPassword: elem.user.confirmPassword,
          isGraduated: elem.user.isGraduated,
          isMigratetoSA: elem.user.isMigratetoSA,
          address: elem.user.address,
          collegestate: elem.user.collegestate,
          collegeCity: elem.user.collegeCity,
          academiciInstitutionName: (elem.user.academiciInstitutionName != null) ? elem.user.academiciInstitutionName : '',
          academicInstitutionId: (elem.user.academicInstitution_id != null) ? elem.user.academicInstitution_id : '',
          academicInstitutionShortName: elem.user.academicInstitutionShortName,
          aadharNumber: elem.user.aadharNumber,
          tponame: elem.user.tponame,
          kamname: elem.user.kamname,
          educationalQualification: elem.user.educationalQualification,
          graduationPassingYear: elem.user.graduationPassingYear,
          subject: elem.user.subject,
          profession: elem.user.profession,
          currentLocation: elem.user.currentLocation,
          isPlaced: elem.user.isPlaced,
          gttId: elem.user.gttId,
          roleId: elem.user.roleId,
          roleName: elem.user.roleName,
          vaccinationStatus: elem.user.vaccinationStatus,
          pursuingPostGraduate: elem.user.pursuingPostGraduate,
          postGraduationQualification:
            elem.user.postGraduationQualification,
          postGraduationPassingYear:
            elem.user.postGraduationPassingYear,
          postGraduationInstitution:
            (elem.user.postGraduationInstitution != null) ? elem.user.postGraduationInstitution : '',
          alternateNumber: elem.user.alternateNumber,
          fatherName: elem.user.fatherName,
          motherName: elem.user.motherName,
          guardianName: elem.user.guardianName,
          pincode: elem.user.pincode,
          disabilityType: elem.user.disabilityType,
          percentageMarks: elem.user.percentageMarks,
          knownLanguage: elem.user.knownLanguage,
          languageIds: elem.user.languageKnown,
          isExperience: elem.user.isExperience,
          experienceYears: elem.user.experienceYears,
          employer1: elem.user.employer1,
          employer2: elem.user.employer2,
          caste: elem.user.caste,
          placedOrganizationId: elem.user.placedOrganizationId,
          placedOrganization: (elem.user.placedOrganization != null) ? elem.user.placedOrganization : '',
          sectorId: elem.user.sector,
          sectorName: elem.user.sectorName,
          designation: elem.user.designation,
          joiningMonth: elem.user.joiningMonth,
          uploadVaccinationCertificate:
            (elem.user.vaccinationStatus != 'No') ? elem.user.uploadVaccinationCertificate : '',
          status: elem.user.status,
          cityId: elem.user.cityId,
          stateId: elem.user.stateId,
          stateName: elem.user.stateName,
          vaccinationcertificatefilename: (elem.user.vaccinationStatus != 'No') ? elem.user.vaccinationcertificatefilename : '',
          additionalFields:
            elem.projectAddtionalFields.length > 0 ? true : false,
          stuProjects: stuProjects.toString(),
          insertedBy: elem.user.insertedby,
        });
      } else {
        this.userDetails.push({
          id: elem.user.id,
          firstName: elem.user.firstName,
          lastName: elem.user.lastName,
          insertedtime:
            elem.user.insertedtime != null &&
              elem.user.insertedtime != ''
              ? moment(elem.user.insertedtime).format('YYYY-MM-DD')
              : '',
          gender: elem.user.gender,
          dob:
            elem.user.dob != null && elem.user.dob != ''
              ? moment(elem.user.dob).format('YYYY-MM-DD')
              : '',
          maritalStatus: elem.user.maritalStatus,
          email: elem.user.email,
          mobile: elem.user.mobile,
          whatsappNumber: elem.user.whatsappNumber,
          password: elem.user.password,
          confirmPassword: elem.user.confirmPassword,
          isGraduated: elem.user.isGraduated,
          isMigratetoSA: elem.user.isMigratetoSA,
          address: elem.user.address,
          collegeCity: elem.user.collegeCity,
          collegestate: elem.user.collegestate,
          academicInstitutionId: (elem.user.academicInstitution_id != null) ? elem.user.academicInstitution_id : '',
          academiciInstitutionName: (elem.user.academiciInstitutionName != null) ? elem.user.academiciInstitutionName : '',
          academicInstitutionShortName: elem.user.academicInstitutionShortName,
          aadharNumber: elem.user.aadharNumber,
          tponame: elem.user.tponame,
          kamname: elem.user.kamname,
          educationalQualification: elem.user.educationalQualification,
          graduationPassingYear: elem.user.graduationPassingYear,
          subject: elem.user.subject,
          profession: elem.user.profession,
          currentLocation: elem.user.currentLocation,
          isPlaced: elem.user.isPlaced,
          gttId: elem.user.gttId,
          roleId: elem.user.roleId,
          roleName: elem.user.roleName,
          vaccinationStatus: elem.user.vaccinationStatus,
          pursuingPostGraduate: elem.user.pursuingPostGraduate,
          postGraduationQualification:
            elem.user.postGraduationQualification,
          postGraduationPassingYear:
            elem.user.postGraduationPassingYear,
          postGraduationInstitution:
            (elem.user.postGraduationInstitution != null) ? elem.user.postGraduationInstitution : '',
          alternateNumber: elem.user.alternateNumber,
          fatherName: elem.user.fatherName,
          motherName: elem.user.motherName,
          guardianName: elem.user.guardianName,
          pincode: elem.user.pincode,
          disabilityType: elem.user.disabilityType,
          percentageMarks: elem.user.percentageMarks,
          knownLanguage: elem.user.knownLanguage,
          languageIds: elem.user.languageKnown,
          isExperience: elem.user.isExperience,
          experienceYears: elem.user.experienceYears,
          employer1: elem.user.employer1,
          employer2: elem.user.employer2,
          caste: elem.user.caste,
          placedOrganizationId: elem.user.placedOrganizationId,
          placedOrganization: (elem.user.placedOrganization != null) ? elem.user.placedOrganization : '',
          sectorId: elem.user.sector,
          sectorName: elem.user.sectorName,
          designation: elem.user.designation,
          joiningMonth: elem.user.joiningMonth,
          uploadVaccinationCertificate:
            (elem.user.vaccinationStatus != 'No') ? elem.user.uploadVaccinationCertificate : '',
          status: elem.user.status,
          cityId: elem.user.cityId,
          stateId: elem.user.stateId,
          stateName: elem.user.stateName,
          vaccinationcertificatefilename:
            (elem.user.vaccinationStatus != 'No') ? elem.user.vaccinationcertificatefilename : '',
          additionalFields:
            elem.projectAddtionalFields.length > 0 ? true : false,
          projects: stuProjects.toString(),
          insertedBy: elem.user.insertedby,
        });
      }


      if (elem.projectAddtionalFields.length > 0) {
        elem.projectAddtionalFields.forEach((elm, inx) => {
          if (!assignProjects.includes(elm.projectId)) {
            let projectObject = this.projectddl.findIndex((x: any) => {
              return x.project_id == elm.projectId;
            });
            assignProjects.push(elm.projectId);
            this.listOfResponseProjects.push(
              this.projectddl[projectObject]
            );
          }

          if (!stuPrpAssignProjects.hasOwnProperty(elem.user.id)) {
            stuPrpAssignProjects[elem.user.id] = {};
          }

          if (
            !stuPrpAssignProjects[elem.user.id].hasOwnProperty(
              elm.projectId
            )
          ) {
            stuPrpAssignProjects[elem.user.id][elm.projectId] = {};
          }
        });
      }

    });


    if (this._searchedColumns.length > 0) {

      this.backUpUserFilterRecords = this.userDetails;
      let searchFilterDetails = this.userDetails;
      // this.userTotalRecords = this.userTotalRecords;
      this.backUpUserFilterRecords = searchFilterDetails;
      this.userDetails = this.backUpUserFilterRecords.slice(0, this.showCount);
      this.paginator.changePage(0);
      // if (this.pageNumber > 0) {
      //   let countStartRec = this.pageNumber * this.showCount;
      //   let countEndRec = this.showCount * (this.pageNumber + 1);
      //   this.userDetails = this.backUpUserFilterRecords.slice(countStartRec, countEndRec);
      // }
    }


    //  this.listOfAdditionalFields = stuPrpAssignProjects;
    console.log(this.userDetails);
    this.stuProfessionalRefersh = false;
    if(this.userDetails.length > 0){
      var result = Object.keys(this.userDetails[0]).map(function (
        key: string
      ) {
        return key;
      });

      result.forEach((elem: any, key: any) => {
        headerName = this.headerCaseString(elem);
        if (elem == 'disabilityPercent') {
          headerName = 'Disability %';
        } else if (elem == 'percentageMarks') {
          headerName = 'Score';
        } else if (elem == 'employer1') {
          headerName = 'Previous Employer 1';
        } else if (elem == 'employer2') {
          headerName = 'Previous Employer 2';
        } else if (elem == 'placedOrganization') {
          headerName = 'Placed Organization Name';
        } else if (elem == 'dob') {
          headerName = 'DOB';
        } else if (elem == 'isGraduated') {
          headerName = 'Graduated';
        } else if (elem == 'subject') {
          headerName = 'Subject/Stream';
        } else if (elem == 'isPlaced') {
          headerName = 'Are you placed in any organization?';
        } else if (elem == 'stateName') {
          headerName = 'State';
        } else if (elem == 'email') {
          headerName = 'Email Id';
        } else if (elem == 'mobile') {
          headerName = 'Mobile No';
        } else if (elem == 'whatsappNumber') {
          headerName = 'Whatsapp No';
        } else if (elem == 'mobile') {
          headerName = 'Mobile No';
        } else if (elem == 'aadharNumber') {
          headerName = 'Aadhar No';
        } else if (elem == 'educationalQualification') {
          headerName = 'UG Qualification';
        } else if (elem == 'graduationPassingYear') {
          headerName = 'UG Passing Year';
        } else if (elem == 'roleName') {
          headerName = 'Role';
        } else if (elem == 'pursuingPostGraduate') {
          headerName = 'Pursuing PG';
        } else if (elem == 'postGraduationQualification') {
          headerName = 'PG qualification';
        } else if (elem == 'postGraduationPassingYear') {
          headerName = 'PG Passing year';
        } else if (elem == 'postGraduationInstitution') {
          headerName = 'PG Instituion name';
        } else if (elem == 'alternateNumber') {
          headerName = 'Alternate No';
        } else if (elem == 'isExperience') {
          headerName = 'Experienced';
        } else if (elem == 'vaccinationcertificatefilename') {
          headerName = 'Vaccination Certificate';
        } else if (elem == 'academiciInstitutionName') {
          headerName = 'Academic Instituition Name';
        } else if (elem == 'signature') {
          headerName = 'Signature(Original)';
        }

        else if (elem == 'insertedtime') {
          headerName = 'Register Date';
        } else if (elem == 'address') {
          headerName = 'College Address';
        } else if (elem == 'collegestate') {
          headerName = 'College State';
        } else if (elem == 'tponame') {
          headerName = 'TPO Name';
        } else if (elem == 'kamname') {
          headerName = 'KAM Name';
        } else if (elem == 'knownLanguage') {
          headerName = 'Language Known';
        }


        if (
          elem != 'id' &&
          elem != 'gttId' &&
          elem != 'stateId' &&
          elem != 'cityId' &&
          elem != 'academicInstitution_id' &&
          elem != 'panNumber' &&
          elem != 'disabilityPercent' &&
          elem != 'candidateCategory' &&
          elem != 'placedStatus' &&
          elem != 'droppedStatus' &&
          elem != 'termsAndConditions' &&
          elem != 'placedOrganizationId' &&
          elem != 'sectorId' &&
          elem != 'roleId' &&
          elem != 'active' &&
          elem != 'projectId' &&
          elem != 'projectId' &&
          elem != 'additionalFields' &&
          elem != 'languageIds' &&
          elem != 'insertedBy' &&
          elem != 'uploadVaccinationCertificate' &&
          elem != 'PGQualification' &&
          elem != 'PgQualification' &&
          elem != 'pgQualification' &&
          // elem != 'postGraduationQualification' &&
          elem != 'AreyoupursuingPostGraduation' &&

          elem != 'ugPassingYear' &&
          elem != 'UGPassingYear' &&

          elem != 'tenthMarkSheet' &&
          elem != 'twelthMarkSheet' &&
          elem != 'knownGTT'
        ) {
          this.columns.push({
            field: elem,
            header: headerName,
          });
        }
      });
    }



    this.cols = this.columns;
    if (this._searchedColumns.length == 0) {
      this.searchCols = [...this.cols].map(item => ({ ...item }));
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

  onSearchFormReset(form) {
    form.resetForm();
    let paramRoleIds = this.getStuProRoleIds();
    this.getUserManagementNewDetails(paramRoleIds, 0, this.showCount);
  }

  /* Student and Professional */
  getUserManagementNewDetails(paramRoleIds, pageNumber, showCount) {

    $('.spinner').show();
    this.UsermanagementService.getUserNewDetails(
      paramRoleIds,
      this.currentLoginUserId,
      this.loggedInRoleId,
      pageNumber,
      showCount
    ).subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.status.toLowerCase() == 'success') {
          this.genTermsAndConditionUrl();
          this.userTotalSearchRecords = response.totalCount;
          this.userTotalRecords = response.totalCount;
          if (response.data != null) {
            this.userDetailsColumnAlign(response);
          }
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




  sendMailButton() {
    debugger
    this.mailUsers = [];
    this.selectedMailedUsers = [];

    if (this.currentTab1 == 'studentprofessional') {
      this.selectedUserDetails.forEach((elm, inx) => {
        this.mailUsers.push({
          'name': elm.firstName + ' ' + elm.lastName,
          'email': elm.email,
        });
        this.selectedMailedUsers.push({
          'name': elm.firstName + ' ' + elm.lastName,
          'email': elm.email,
        });
      });
    } else if (this.currentTab2 == 'coordinator') {
      this.selectedCoordinatorDetails.forEach((elm, inx) => {
        this.mailUsers.push({
          'name': elm.first_name + ' ' + elm.last_name,
          'email': elm.email,
        });
        this.selectedMailedUsers.push({
          'name': elm.first_name + ' ' + elm.last_name,
          'email': elm.email,
        });
      });
    } else {
      this.selectedUserAdminDetails.forEach((elm, inx) => {
        this.mailUsers.push({
          'name': elm.last_name + ' ' + elm.last_name,
          'email': elm.email,
        });
        this.selectedMailedUsers.push({
          'name': elm.last_name + ' ' + elm.last_name,
          'email': elm.email,
        });
      });
    }
  }

  mailFormReset(mail: NgForm) {
    mail.resetForm();
    this.mailMessage = '';
    this.mailFileInput.nativeElement.value = '';
  }


  GenResetForm(updateTerm: NgForm) {
    updateTerm.resetForm();
    this.termUploadFileInput.nativeElement.value = '';
  }


  sendBulkMail(mail: NgForm) {


    if (mail.form.valid && this.mailMessage == '' && this.ccMailMessage == '' && this.bccMailMessage == '') {
      let ccMailParams: any = [];
      let bccMailParams: any = [];
      if (this.ccMailLists.length > 0) {
        this.ccMailLists.forEach((elm, inx) => {
          let splitEmail = elm.split('@');
          ccMailParams.push({
            'name': splitEmail[0],
            'email': elm
          })
        });
      }

      if (this.bccMailLists.length > 0) {
        this.bccMailLists.forEach((elmBcc, inxBcc) => {
          let splitEmail = elmBcc.split('@');
          bccMailParams.push({
            'name': splitEmail[0],
            'email': elmBcc
          })
        });
      }


      let emailsPrams = {
        'recipient': {
          'to': mail.form.value.users,
          'cc': ccMailParams,
          'bcc': bccMailParams
        }
      }


      var str = mail.form.value.message;
      var sentences = str.split(/\r\n|\r|\n|[.|!|?]\s/gi);

      let html = "<html><body>";
      sentences.forEach((el, ix) => {
        html += '<span>' + el + '</span><br />';
      });
      html += '</body></html>';

      let params = {
        'recipient': emailsPrams,
        'subject': mail.form.value.subject,
        'body': html
      };

      let files = this.mailFiles == null || this.mailFiles == undefined ? '' : this.mailFiles;

      $('.spinner').show();
      this.UsermanagementService.sendBulkMail(params, files).subscribe({
        next: response => {
          if (response.status.toLowerCase() == "success") {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
            $('.spinner').hide();
            this.selectedMailedUsers = [];
            this.selectedUserDetails = [];
            this.selectedCoordinatorDetails = [];
            this.selectedUserAdminDetails = [];
            this.ccMailLists = [];
            this.bccMailLists = [];
            this.mailUsers = [];
            this.mailFiles = [];
            this.mailFileInput.nativeElement.value = '';
            mail.resetForm();
            this.ccInput = false;
            this.bccInput = false;
            ($('#sendmail') as any).modal('hide');
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





  /* Student and Professional */
  getUserManagementDetails(paramRoleIds) {

    $('.spinner').show();
    let headerName = '';
    this.listOfResponseProjects = [];
    this.UsermanagementService.getUserDetails(
      paramRoleIds,
      this.currentLoginUserId,
      this.loggedInRoleId
    ).subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.status == 'Success') {
          if (response.data != null) {
            this.userDetails = [];
            this.listOfAdditionalFields = [];
            let stuPrpAssignProjects = {};
            let assignProjects: any = [];

            response.data.forEach((elem: any, index: any) => {
              this.columns = [];
              let stuProjects = [];
              if (elem.projectAddtionalFields.length > 0) {
                stuProjects = Object.keys(elem.projectAddtionalFields).map(
                  function (k) {
                    return elem.projectAddtionalFields[k].projectname;
                  }
                );
              }
              if (
                elem.user.status == 'Active' &&
                this.loggedInRoleName != 'GTT_ADMIN'
              ) {
                this.userDetails.push({
                  id: elem.user.id,
                  firstName: elem.user.firstName,
                  lastName: elem.user.lastName,
                  insertedtime:
                    elem.user.insertedtime != null &&
                      elem.user.insertedtime != ''
                      ? moment(elem.user.insertedtime).format('YYYY-MM-DD')
                      : '',
                  gender: elem.user.gender,
                  dob:
                    elem.user.dob != null && elem.user.dob != ''
                      ? moment(elem.user.dob).format('YYYY-MM-DD')
                      : '',
                  maritalStatus: elem.user.maritalStatus,
                  email: elem.user.email,
                  mobile: elem.user.mobile,
                  whatsappNumber: elem.user.whatsappNumber,
                  password: elem.user.password,
                  confirmPassword: elem.user.confirmPassword,
                  isGraduated: elem.user.isGraduated,
                  isMigratetoSA: elem.user.isMigratetoSA,
                  address: elem.user.address,
                  collegestate: elem.user.collegestate,
                  collegeCity: elem.user.collegeCity,
                  academiciInstitutionName: elem.user.academiciInstitutionName,
                  academicInstitutionShortName: elem.user.academicInstitutionShortName,
                  aadharNumber: elem.user.aadharNumber,
                  tponame: elem.user.tponame,
                  kamname: elem.user.kamname,
                  educationalQualification: elem.user.educationalQualification,
                  graduationPassingYear: elem.user.graduationPassingYear,
                  subject: elem.user.subject,
                  profession: elem.user.profession,
                  currentLocation: elem.user.currentLocation,
                  isPlaced: elem.user.isPlaced,
                  gttId: elem.user.gttId,
                  roleId: elem.user.roleId,
                  roleName: elem.user.roleName,
                  vaccinationStatus: elem.user.vaccinationStatus,
                  pursuingPostGraduate: elem.user.pursuingPostGraduate,
                  postGraduationQualification:
                    elem.user.postGraduationQualification,
                  postGraduationPassingYear:
                    elem.user.postGraduationPassingYear,
                  postGraduationInstitution:
                    elem.user.postGraduationInstitution,
                  alternateNumber: elem.user.alternateNumber,
                  fatherName: elem.user.fatherName,
                  motherName: elem.user.motherName,
                  guardianName: elem.user.guardianName,
                  pincode: elem.user.pincode,
                  disabilityType: elem.user.disabilityType,
                  percentageMarks: elem.user.percentageMarks,
                  knownLanguage: elem.user.knownLanguage,
                  languageIds: elem.user.languageKnown,
                  isExperience: elem.user.isExperience,
                  experienceYears: elem.user.experienceYears,
                  employer1: elem.user.employer1,
                  employer2: elem.user.employer2,
                  caste: elem.user.caste,
                  placedOrganizationId: elem.user.placedOrganizationId,
                  placedOrganization: elem.user.placedOrganization,
                  sectorId: elem.user.sector,
                  sectorName: elem.user.sectorName,
                  designation: elem.user.designation,
                  joiningMonth: elem.user.joiningMonth,
                  uploadVaccinationCertificate:
                    elem.user.uploadVaccinationCertificate,
                  status: elem.user.status,
                  cityId: elem.user.cityId,
                  stateId: elem.user.stateId,
                  stateName: elem.user.stateName,
                  vaccinationcertificatefilename:
                    elem.user.vaccinationcertificatefilename,
                  additionalFields:
                    elem.projectAddtionalFields.length > 0 ? true : false,
                  stuProjects: stuProjects.toString(),
                  insertedBy: elem.user.insertedby,
                });
              } else {
                this.userDetails.push({
                  id: elem.user.id,
                  firstName: elem.user.firstName,
                  lastName: elem.user.lastName,
                  insertedtime:
                    elem.user.insertedtime != null &&
                      elem.user.insertedtime != ''
                      ? moment(elem.user.insertedtime).format('YYYY-MM-DD')
                      : '',
                  gender: elem.user.gender,
                  dob:
                    elem.user.dob != null && elem.user.dob != ''
                      ? moment(elem.user.dob).format('YYYY-MM-DD')
                      : '',
                  maritalStatus: elem.user.maritalStatus,
                  email: elem.user.email,
                  mobile: elem.user.mobile,
                  whatsappNumber: elem.user.whatsappNumber,
                  password: elem.user.password,
                  confirmPassword: elem.user.confirmPassword,
                  isGraduated: elem.user.isGraduated,
                  isMigratetoSA: elem.user.isMigratetoSA,
                  address: elem.user.address,
                  collegeCity: elem.user.collegeCity,
                  collegestate: elem.user.collegestate,
                  academiciInstitutionName: elem.user.academiciInstitutionName,
                  academicInstitutionShortName: elem.user.academicInstitutionShortName,
                  aadharNumber: elem.user.aadharNumber,
                  tponame: elem.user.tponame,
                  kamname: elem.user.kamname,
                  educationalQualification: elem.user.educationalQualification,
                  graduationPassingYear: elem.user.graduationPassingYear,
                  subject: elem.user.subject,
                  profession: elem.user.profession,
                  currentLocation: elem.user.currentLocation,
                  isPlaced: elem.user.isPlaced,
                  gttId: elem.user.gttId,
                  roleId: elem.user.roleId,
                  roleName: elem.user.roleName,
                  vaccinationStatus: elem.user.vaccinationStatus,
                  pursuingPostGraduate: elem.user.pursuingPostGraduate,
                  postGraduationQualification:
                    elem.user.postGraduationQualification,
                  postGraduationPassingYear:
                    elem.user.postGraduationPassingYear,
                  postGraduationInstitution:
                    elem.user.postGraduationInstitution,
                  alternateNumber: elem.user.alternateNumber,
                  fatherName: elem.user.fatherName,
                  motherName: elem.user.motherName,
                  guardianName: elem.user.guardianName,
                  pincode: elem.user.pincode,
                  disabilityType: elem.user.disabilityType,
                  percentageMarks: elem.user.percentageMarks,
                  knownLanguage: elem.user.knownLanguage,
                  languageIds: elem.user.languageKnown,
                  isExperience: elem.user.isExperience,
                  experienceYears: elem.user.experienceYears,
                  employer1: elem.user.employer1,
                  employer2: elem.user.employer2,
                  caste: elem.user.caste,
                  placedOrganizationId: elem.user.placedOrganizationId,
                  placedOrganization: elem.user.placedOrganization,
                  sectorId: elem.user.sector,
                  sectorName: elem.user.sectorName,
                  designation: elem.user.designation,
                  joiningMonth: elem.user.joiningMonth,
                  uploadVaccinationCertificate:
                    elem.user.uploadVaccinationCertificate,
                  status: elem.user.status,
                  cityId: elem.user.cityId,
                  stateId: elem.user.stateId,
                  stateName: elem.user.stateName,
                  vaccinationcertificatefilename:
                    elem.user.vaccinationcertificatefilename,
                  additionalFields:
                    elem.projectAddtionalFields.length > 0 ? true : false,
                  projects: stuProjects.toString(),
                  insertedBy: elem.user.insertedby,
                });
              }

              if (elem.projectAddtionalFields.length > 0) {
                elem.projectAddtionalFields.forEach((elm, inx) => {
                  if (!assignProjects.includes(elm.projectId)) {
                    let projectObject = this.projectddl.findIndex((x: any) => {
                      return x.project_id == elm.projectId;
                    });
                    assignProjects.push(elm.projectId);
                    this.listOfResponseProjects.push(
                      this.projectddl[projectObject]
                    );
                  }

                  if (!stuPrpAssignProjects.hasOwnProperty(elem.user.id)) {
                    stuPrpAssignProjects[elem.user.id] = {};
                  }

                  if (
                    !stuPrpAssignProjects[elem.user.id].hasOwnProperty(
                      elm.projectId
                    )
                  ) {
                    stuPrpAssignProjects[elem.user.id][elm.projectId] = {};
                  }

                  // elm.fields.forEach((elfields, fieInx) => {
                  //   if (elfields.documentFieldName != '') {
                  //     stuPrpAssignProjects[elem.user.id][elm.projectId][
                  //       elfields.documentFieldName
                  //     ] = elfields.documentValue;
                  //     stuPrpAssignProjects[elem.user.id][elm.projectId][
                  //       'Project Name'
                  //     ] = elfields.projectname;
                  //     stuPrpAssignProjects[elem.user.id][elm.projectId][
                  //       'Program Name'
                  //     ] = elfields.programname;
                  //     stuPrpAssignProjects[elem.user.id][elm.projectId][
                  //       'Course Name'
                  //     ] = elfields.coursename;
                  //     stuPrpAssignProjects[elem.user.id][elm.projectId][
                  //       'Batch Name'
                  //     ] = elfields.batchname;
                  //     stuPrpAssignProjects[elem.user.id][elm.projectId][
                  //       'Trainer Name'
                  //     ] = elfields.trainername;
                  //     stuPrpAssignProjects[elem.user.id][elm.projectId][
                  //       'Trainer Coordinator Name'
                  //     ] = elfields.trainercoordinatorname;
                  //     stuPrpAssignProjects[elem.user.id][elm.projectId][
                  //       'Project Manager Name'
                  //     ] = elfields.projectmanagername;
                  //   }
                  // });
                });
              }
            });

            //  this.listOfAdditionalFields = stuPrpAssignProjects;

            this.stuProfessionalRefersh = false;
            var result = Object.keys(this.userDetails[0]).map(function (
              key: string
            ) {
              return key;
            });

            result.forEach((elem: any, key: any) => {
              headerName = this.headerCaseString(elem);
              if (elem == 'disabilityPercent') {
                headerName = 'Disability %';
              } else if (elem == 'percentageMarks') {
                headerName = 'Score';
              } else if (elem == 'employer1') {
                headerName = 'Previous Employer 1';
              } else if (elem == 'employer2') {
                headerName = 'Previous Employer 2';
              } else if (elem == 'placedOrganization') {
                headerName = 'Placed Organization Name';
              } else if (elem == 'dob') {
                headerName = 'DOB';
              } else if (elem == 'isGraduated') {
                headerName = 'Graduated';
              } else if (elem == 'subject') {
                headerName = 'Subject/Stream';
              } else if (elem == 'isPlaced') {
                headerName = 'Are you placed in any organization?';
              } else if (elem == 'stateName') {
                headerName = 'State';
              } else if (elem == 'email') {
                headerName = 'Email Id';
              } else if (elem == 'mobile') {
                headerName = 'Mobile No';
              } else if (elem == 'whatsappNumber') {
                headerName = 'Whatsapp No';
              } else if (elem == 'mobile') {
                headerName = 'Mobile No';
              } else if (elem == 'aadharNumber') {
                headerName = 'Aadhar No';
              } else if (elem == 'educationalQualification') {
                headerName = 'UG Qualification';
              } else if (elem == 'graduationPassingYear') {
                headerName = 'UG passing year';
              } else if (elem == 'roleName') {
                headerName = 'Role';
              } else if (elem == 'pursuingPostGraduate') {
                headerName = 'Pursuing PG';
              } else if (elem == 'postGraduationQualification') {
                headerName = 'PG qualification';
              } else if (elem == 'postGraduationPassingYear') {
                headerName = 'PG Passing year';
              } else if (elem == 'postGraduationInstitution') {
                headerName = 'PG Instituion name';
              } else if (elem == 'alternateNumber') {
                headerName = 'Alternate No';
              } else if (elem == 'isExperience') {
                headerName = 'Experienced';
              } else if (elem == 'vaccinationcertificatefilename') {
                headerName = 'vaccination Certificate';
              } else if (elem == 'academiciInstitutionName') {
                headerName = 'Academic Instituition Name';
              } else if (elem == 'signature') {
                headerName = 'Signature(Original)';
              }

              else if (elem == 'insertedtime') {
                headerName = 'Register Date';
              } else if (elem == 'address') {
                headerName = 'College Address';
              } else if (elem == 'collegestate') {
                headerName = 'College State';
              } else if (elem == 'tponame') {
                headerName = 'TPO Name';
              } else if (elem == 'kamname') {
                headerName = 'KAM Name';
              } else if (elem == 'knownLanguage') {
                headerName = 'Language Known';
              }

              if (
                elem != 'id' &&
                elem != 'gttId' &&
                elem != 'stateId' &&
                elem != 'cityId' &&
                elem != 'panNumber' &&
                elem != 'disabilityPercent' &&
                elem != 'candidateCategory' &&
                elem != 'placedStatus' &&
                elem != 'droppedStatus' &&
                elem != 'termsAndConditions' &&
                elem != 'placedOrganizationId' &&
                elem != 'sectorId' &&
                elem != 'roleId' &&
                elem != 'active' &&
                elem != 'projectId' &&
                elem != 'projectId' &&
                elem != 'additionalFields' &&
                elem != 'languageIds' &&
                elem != 'insertedBy' &&
                elem != 'uploadVaccinationCertificate' &&
                elem != 'PGQualification' &&
                elem != 'PgQualification' &&
                elem != 'pgQualification' &&
                // elem != 'postGraduationQualification' &&
                elem != 'AreyoupursuingPostGraduation' &&
                elem != 'guardianName' &&
                elem != 'ugPassingYear' &&
                elem != 'UGPassingYear' &&
                elem != 'graduationPassingYear' &&
                elem != 'tenthMarkSheet' &&
                elem != 'twelthMarkSheet' &&
                elem != 'knownGTT'
              ) {
                this.columns.push({
                  field: elem,
                  header: headerName,
                });
              }
            });

            console.log(this.columns);

            this.cols = this.columns;
            if (this._searchedColumns.length == 0) {
              this.searchCols = [...this.cols].map(item => ({ ...item }));
            }
            this.exportColumns = this.cols.map((col) => ({
              title: col.header,
              dataKey: col.field,
            }));
            this.exportCols = this.cols.map((col) => ({ dataKey: col.field }));
          }

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

  //   getAdditionalFields(rowData: any) {
  //     this.additionalFieldLabel = Object.keys(
  //       this.listOfAdditionalFields[rowData.id][
  //         this.listOfResponseProjects[0].project_id
  //       ]
  //     );

  //     ($('#additionalfields') as any).modal('show');
  //     this.currentAdditionFieldUserId = rowData.id;
  //     $('#additional_map_projects').val(
  //       this.listOfResponseProjects[0].project_id
  //     );
  //     this.additionalUserDetails =
  //       this.listOfAdditionalFields[rowData.id][
  //         this.listOfResponseProjects[0].project_id
  //       ];
  //   }

  dropdownReset() {
    console.log(this.projectBasedRegistrationColumns);
    console.log(this._projectBasedDefaultColumnsCopy);
    this.projectBasedRegistrationColumns = this._projectBasedDefaultColumnsCopy;
  }

  getAdditionalFieldsGrid(rowData: any) {
    $('.spinner').show();

    let userId = rowData.id;
    this._projectBasedDefaultColumns = this._projectBasedDefaultColumnsCopy;
    this.UsermanagementService.getUser(userId).subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.status == 'Success') {
          ($('#additionalfields') as any).modal('show');
          let projectBasedReportArray = [];
          this.finalProjectBasedReports = [];

          let projectList: any;
          let projectAddtionalFields = response.data.projectAddtionalFields;

          if (projectAddtionalFields.length > 0) {
            for (let i = 0; i < projectAddtionalFields.length; i += 1) {
              projectList = projectAddtionalFields[i].fields;

              if (projectAddtionalFields[i].batch_based_details != null && projectAddtionalFields[i].batch_based_details.length > 0) {
                projectAddtionalFields[i].batch_based_details.forEach((elm, inx) => {

                  let projectManagerName = elm.project_managers_list.map((x: { project_manager_name: any }) => x.project_manager_name);
                  let trainerCoName = elm.training_coordinator_list.map((x: { trainer_name: any }) => x.trainer_name);

                  const data = {
                    user: response.data.user,
                    fields: projectList,
                    projectInfos: {
                      projectName: projectAddtionalFields[i].projectname,
                      projectManagerName: projectManagerName.toString(),
                      programName: elm.program_name,
                      batchName: elm.batch_name,
                      courseName: elm.course_name,
                      trainerName: elm.trainer_name,
                      trainerCoordinatorName: trainerCoName
                    }
                  };

                  projectBasedReportArray.push(data);

                });
              } else {

                const data = {
                  user: response.data.user,
                  fields: projectList,
                  projectInfos: {
                    projectName: projectAddtionalFields[i].projectname,
                    projectManagerName: projectAddtionalFields[i].projectmanagername,
                    programName: projectAddtionalFields[i].programname,
                    batchName: projectAddtionalFields[i].batchname,
                    courseName: projectAddtionalFields[i].coursename,
                    trainerName: projectAddtionalFields[i].trainername,
                    trainerCoordinatorName: projectAddtionalFields[i].trainercoordinatorname,
                  }

                };

                projectBasedReportArray.push(data);
              }

            }
          } else {
            const data = {
              user: response.data.user,
              fields: [],
              projectInfos: {
                projectName: null,
                projectManagerName: null,
                programName: null,
                batchName: null,
                courseName: null,
                trainerName: null,
                trainerCoordinatorName: null,
              }
            };
            projectBasedReportArray.push(data);
          }





          console.log(projectBasedReportArray);
          let projectBasedReports = [];

          projectBasedReportArray.forEach((elem: any, index: any) => {

            if (!projectBasedReports.hasOwnProperty(index)) {
              projectBasedReports[index] = {};
            }

            projectBasedReports[index]['userDetails'] = elem.user;
            projectBasedReports[index]['projectInfos'] = elem.projectInfos;
            this.listOfAllAdditionalFields.forEach((ele: any, ix: any) => {
              projectBasedReports[index][ele] = elem.fields.filter(function (el) {
                return el.documentFieldName == ele;
              });
            });

            // projectBasedReports.push({
            //   gttId: elem.user.gttId,
            //   firstName: elem.user.firstName,
            //   lastName: elem.user.lastName,
            //   gender: elem.user.gender,
            //   dob: elem.user.dob,
            //   email: elem.user.email,
            //   mobile: elem.user.mobile,
            //   postalAddress: elem.user.postalAddress,
            //   AreyoupursuingPostGraduation: elem.user.pursuingPostGraduate,
            //   PGQualification: elem.user.postGraduationQualification,
            //   PGPassingYear: elem.user.postGraduationPassingYear,
            //   guardianName: elem.user.guardianName,
            //   UGQualification: elem.user.educationalQualification,
            //   UGPassingYear: elem.user.graduationPassingYear,
            //   projectname: elem.projectName,
            //   projectmanagername: elem.projectManagerName,
            //   programname: elem.programName,
            //   batchname: elem.batchName,
            //   coursename: elem.courseName,
            //   trainername: elem.trainerName,
            //   trainercoordinatorname: elem.trainerCoordinatorName,
            //   pincode: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'Pincode';
            //   }),
            //   fatherName: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'Father Name';
            //   }),
            //   motherName: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'Mother Name';
            //   }),
            //   FamilyIncome: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'Family Income';
            //   }),
            //   signature: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'Signature(Original)';
            //   }),
            //   RationCardNo: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'Ration Card No';
            //   }),
            //   RationCardColor: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'Ration Card Color';
            //   }),
            //   IncomeMentionedinRationcard: elem.fields.filter(function (el) {
            //     return (
            //       el.documentFieldName == 'Income Mentioned in Ration card'
            //     );
            //   }),
            //   MainEarningMemberofFamily: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'Main Earning Member of Family';
            //   }),
            //   OccupationofthemainearningoftheFamily: elem.fields.filter(
            //     function (el) {
            //       return (
            //         el.documentFieldName ==
            //         'Occupation of the main earning of the Family'
            //       );
            //     }
            //   ),
            //   AnnualIncome: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'Annual Income';
            //   }),
            //   IncomeProofValidity: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'Income Proof Validity';
            //   }),
            //   Passport: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'Passport size photo(Original)';
            //   }),
            //   tenthMarkSheet: elem.fields.filter(function (el) {
            //     return el.documentFieldName == '10th marksheet(Original)';
            //   }),
            //   twelthMarkSheet: elem.fields.filter(function (el) {
            //     return el.documentFieldName == '12th marksheet(Original)';
            //   }),
            //   UGMarksheet: elem.fields.filter(function (el) {
            //     return (
            //       el.documentFieldName ==
            //       'UG Mark sheet (If pursuing then mark sheet of current semester)'
            //     );
            //   }),
            //   PGMarksheet: elem.fields.filter(function (el) {
            //     return (
            //       el.documentFieldName ==
            //       'PG (If pursuing then mark sheet of current semester)'
            //     );
            //   }),
            //   IDProof: elem.fields.filter(function (el) {
            //     return (
            //       el.documentFieldName ==
            //       'ID Proof (only Aadhar Card applicable both side scan)'
            //     );
            //   }),
            //   UpdatedResume: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'Updated Resume';
            //   }),
            //   LOI: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'LOI';
            //   }),
            //   IncomeProof: elem.fields.filter(function (el) {
            //     return (
            //       el.documentFieldName ==
            //       'Income Proof (Any one member in the family only salary slip, income certificate, form 16 applicable)'
            //     );
            //   }),
            //   Pan: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'Pan';
            //   }),
            //   RationCard: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'Ration Card';
            //   }),
            //   CasteCertificate: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'Caste Certificate';
            //   }),
            //   KnownaboutGTT: elem.fields.filter(function (el) {
            //     return (
            //       el.documentFieldName == 'How you come to know about GTT?'
            //     );
            //   }),
            //   totalMmembersInTheFamily: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'Total members in the family';
            //   }),
            //   Address: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'Address';
            //   }),

            //   PanNumber: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'Pan Number';
            //   }),
            //   Religion: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'Religion';
            //   }),
            //   aadharPan: elem.fields.filter(function (el) {
            //     if (el.documentFieldName == 'Aadhar/Pan Document') {
            //       return el.documentFieldName == 'Aadhar/Pan Document';
            //     } else if (el.documentFieldName == 'Aadhar/Pan Document(Original)') {
            //       return el.documentFieldName == 'Aadhar/Pan Document(Original)';
            //     }
            //   }),

            //   incomeProofs: elem.fields.filter(function (el) {
            //     return (
            //       el.documentFieldName ==
            //       'Income Proof(Ration Card/Income Certificate/Self Declaration)(Original)'
            //     );
            //   }),
            //   casteProofs: elem.fields.filter(function (el) {
            //     return (
            //       el.documentFieldName ==
            //       'Caste Proof(Leaving Certificate/Caste Certificate)(Original)'
            //     );
            //   }),
            //   CertificationDate: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'Certification Date';
            //   }),
            //   Testimonials: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'Testimonials';
            //   }),
            //   CasteCategory: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'Caste /Category';
            //   }),
            //   SpouseName: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'Spouse Name';
            //   }),
            //   WhatsappGroupName: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'Whatsapp Group Name';
            //   }),
            //   PGUniversityName: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'PG University Name(STU)';
            //   }),
            //   District: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'District';
            //   }),
            //   AadharLink: elem.fields.filter(function (el) {
            //     return (
            //       el.documentFieldName ==
            //       'Is Aadhar linked With your phone number?'
            //     );
            //   }),
            //   PANcards: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'Do you have PAN card?';
            //   }),
            //   allCertificate: elem.fields.filter(function (el) {
            //     return (
            //       el.documentFieldName ==
            //       'Do you have all original graduation mark sheets and certificate with you?'
            //     );
            //   }),
            //   documentHave: elem.fields.filter(function (el) {
            //     return (
            //       el.documentFieldName ==
            //       'Please specify, which document you do not have?'
            //     );
            //   }),
            //   UpdatedResumes: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'Updated Resume(Original)';
            //   }),
            //   tenthBoard: elem.fields.filter(function (el) {
            //     return (
            //       el.documentFieldName == '10th board certificate(Original)'
            //     );
            //   }),
            //   twelthBoard: elem.fields.filter(function (el) {
            //     return el.documentFieldName == '12th board certificate';
            //   }),
            //   PGconsolidated: elem.fields.filter(function (el) {
            //     return (
            //       el.documentFieldName == 'PG consolidated marksheet(Original)'
            //     );
            //   }),
            //   Graduationconsolidated: elem.fields.filter(function (el) {
            //     return (
            //       el.documentFieldName ==
            //       'Graduation consolidated marksheet(Original)'
            //     );
            //   }),
            //   GraduationProfessional: elem.fields.filter(function (el) {
            //     return (
            //       el.documentFieldName ==
            //       'Graduation professional degree certificate'
            //     );
            //   }),
            //   PGProvisional: elem.fields.filter(function (el) {
            //     return (
            //       el.documentFieldName ==
            //       'PG provisional degree certificate(Original)'
            //     );
            //   }),
            //   LOID: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'LOI Document(Original)';
            //   }),
            //   PGDegreeName: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'PG Degree Name';
            //   }),

            //   PGCollegeName: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'PG College Name';
            //   }),

            //   PGPassingYears: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'PG Passing Year(STU)';
            //   }),

            //   TotalWorkExperience: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'Total Work experience';
            //   }),

            //   CTCSalary: elem.fields.filter(function (el) {
            //     return el.documentFieldName == 'CTC/Salary';
            //   }),
            // });
          });

          console.log(projectBasedReports);

          projectBasedReports.forEach((elem: any, index: any) => {

            if (!this.finalProjectBasedReports.hasOwnProperty(index)) {
              this.finalProjectBasedReports[index] = {};
            }

            this.additionalFieldKeys = Object.keys(elem);

            this.finalProjectBasedReports[index]['gttId'] = elem.userDetails.gttId;
            this.finalProjectBasedReports[index]['firstName'] = elem.userDetails.firstName;
            this.finalProjectBasedReports[index]['lastName'] = elem.userDetails.lastName;
            this.finalProjectBasedReports[index]['gender'] = elem.userDetails.gender;
            this.finalProjectBasedReports[index]['DOB'] = elem.userDetails.dob;
            this.finalProjectBasedReports[index]['email'] = elem.userDetails.email;
            this.finalProjectBasedReports[index]['mobile'] = elem.userDetails.mobile;
            this.finalProjectBasedReports[index]['postalAddress'] = elem.userDetails.postalAddress;
            this.finalProjectBasedReports[index]['AreyoupursuingPostGraduation'] = elem.userDetails.pursuingPostGraduate;
            this.finalProjectBasedReports[index]['PGQualification'] = elem.userDetails.postGraduationQualification;
            this.finalProjectBasedReports[index]['PGPassingYear'] = elem.userDetails.postGraduationPassingYear;
            this.finalProjectBasedReports[index]['guardianName'] = elem.userDetails.guardianName;
            this.finalProjectBasedReports[index]['UGQualification'] = elem.userDetails.educationalQualification;
            this.finalProjectBasedReports[index]['UGPassingYear'] = elem.userDetails.graduationPassingYear;
            this.finalProjectBasedReports[index]['projectName'] = elem.projectInfos.projectName;
            this.finalProjectBasedReports[index]['projectManagerName'] = elem.projectInfos.projectManagerName;
            this.finalProjectBasedReports[index]['programName'] = elem.projectInfos.programName;
            this.finalProjectBasedReports[index]['batchName'] = elem.projectInfos.batchName;
            this.finalProjectBasedReports[index]['courseName'] = elem.projectInfos.courseName;
            this.finalProjectBasedReports[index]['trainerName'] = elem.projectInfos.trainerName;
            this.finalProjectBasedReports[index]['trainerCoordinatorName'] = elem.projectInfos.trainerCoordinatorName;

            this.additionalFieldKeys.forEach((ell, ix) => {
              if (ell != 'userDetails' && ell != 'projectInfos') {

                if (elem[ell].length > 0 && elem[ell][0]?.fieldType != undefined && (elem[ell][0]?.fieldType == 'File upload' || elem[ell][0]?.fieldType == 'Video') ) {
                  this.finalProjectBasedReports[index][ell] = !elem[ell]?.length
                    ? ''
                    :
                    (elem[ell][0]?.verificationStatus == 'Yet to verify'
                      ? 'Yet to verify'
                      : (elem[ell][0]?.verificationStatus == 'Yes')
                        ? 'Valid'
                        : (elem[ell][0]?.verificationStatus == 'No') ? 'Not Valid' : '') +
                    ' - ' +
                    (elem[ell][0]?.documentValue == null
                      ? ''
                      : elem[ell][0]?.documentValue);
                } else {
                  this.finalProjectBasedReports[index][ell] = !elem[ell]?.length
                    ? ''
                    : (elem[ell][0]?.documentValue == null
                      ? ''
                      : elem[ell][0]?.documentValue);
                }

              }
            });

          });

          console.log(this.finalProjectBasedReports);

          console.log(this.finalProjectBasedReports[0]);
          this._projectBasedReportColumns = [];
          var result = Object.keys(this.finalProjectBasedReports[0]).map(
            function (key: string) {
              return key;
            }
          );

          let headerName = '';
          result.forEach((elem: any, key: any) => {
            headerName = this.headerCaseString(elem);
            this._projectBasedReportColumns.push({
              field: elem,
              header: headerName,
            });
          });

          this._projectBasedReportColumnHeader = this._projectBasedReportColumns;
          this._projectBasedReportColumnTitle =
            this._projectBasedReportColumnHeader.map((col) => ({
              title: col.header,
              dataKey: col.field,
            }));

          this._projectBasedReportColumnDataKey =
            this._projectBasedReportColumnHeader.map((col) => ({
              dataKey: col.field,
            }));

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
  @Input() get projectBasedRegistrationColumns(): any[] {
    return this._projectBasedDefaultColumns;
  }

  set projectBasedRegistrationColumns(val: any[]) {
    this._projectBasedDefaultColumns =
      this._projectBasedReportColumnHeader.filter((col) => val.includes(col));
  }

  projectBasedFilter($event: any) {
    console.log($event);
    var result = $event.value.reduce((unique, o) => {
      if (
        !unique.some((obj) => obj.field === o.field && obj.header === o.header)
      ) {
        unique.push(o);
      }
      return unique;
    }, []);

    if ($event.value.length == 0) {
      this._projectBasedDefaultColumns = this._projectBasedDefaultColumnsCopy;
    } else {
      this._projectBasedDefaultColumns = result;
    }
  }
  /* ======================== Coordinator Functionality =============== */

  getCoordinatorLists(roleIds) {
    // $('.spinner').show();
    let headerName = '';
    this.UsermanagementService.getCoordinatorsLists(roleIds).subscribe({
      next: (response) => {
        // $('.spinner').hide();
        this.coordinatorDetails = [];
        if (response.status == 'Success') {
          if (response.data != null && response.data.length > 0) {
            this.coordinatorDetails = this.coordinatorColumnsAlign(
              response.data
            );
            var result = Object.keys(response.data[0]).map(function (
              key: string
            ) {
              return key;
            });

            result.forEach((elem: any, key: any) => {
              headerName = this.headerCaseString(elem);
              if (elem == 'email') {
                headerName = 'Email Id';
              } else if (elem == 'mobile') {
                headerName = 'Mobile No';
              } else if (elem == 'whatsapp_number') {
                headerName = 'Whatsapp Number';
              } else if (elem == 'role_name') {
                headerName = 'Role';
              } else if (elem == 'dob') {
                headerName = 'DOB';
              }

              if (
                elem != 'role_id' &&
                elem != 'user_id' &&
                elem != 'id' &&
                elem != 'gtt_id'
              ) {
                this.coordiantorscolumns.push({
                  field: elem,
                  header: headerName,
                  align: 'center',
                });
              }
            });

            this.coordinatorscols = this.coordiantorscolumns;
            this.coordinatorsExportColumns = this.coordinatorscols.map(
              (col) => ({ title: col.header, dataKey: col.field })
            );
            this.coordinatorsExportCols = this.coordinatorscols.map((col) => ({
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

  onStuProMultiSelect($event: any) {
    if ($event.value.length == 0) {
      this._selectedColumns = this._selectedColumnsDup;
    }
  }

  searchHolder(field) {
    switch (field) {
      case "insertedtime":
        return "Search ('yyyy-mm-dd')";
        break;
      case "gender":
        return "Search ('Male/Female')";
        break;
      case "dob":
        return "Search ('yyyy-mm-dd')";
        break;
      case "isGraduated":
        return "Search ('Yes/No')";
        break;
      case "graduationPassingYear":
        return "Search ('yyyy')";
        break;
      case "vaccinationStatus":
        return "Search ('Yes/No')";
        break;
      case "pursuingPostGraduate":
        return "Search ('Yes/No')";
        break;
      case "postGraduationPassingYear":
        return "Search ('yyyy')";
        break;
      case "isExperience":
        return "Search ('Yes/No')";
        break;
      case "isPlaced":
        return "Search ('Yes/No')";
        break;
      case "isMigratetoSA":
        return "Search ('Yes/No')";
        break;
      default:
        return "Search";
        break;
    }
  }

  clearSearch() {
    this._selectedSearchColumns = [];
    this.searchCols = [...this.cols].map(item => ({ ...item }));
    this.searchError = false;
    if (this._searchedColumns.length > 0) {
      let paramRoleIds = this.getStuProRoleIds();
      this.getUserManagementNewDetails(paramRoleIds, 0, this.showCount);
    }
    this._searchedColumns = [];
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
    debugger;
    console.log(this._selectedSearchColumns);

    if (!this.searchError) {
      console.log(searchJsonArray);
      let searchJson = {
        Input: searchJsonArray,
      }
      $('.spinner').show();

      this.UsermanagementService.multiSearchUser(searchJson, this.currentLoginUserId).subscribe({
        next: (response) => {
          $('.spinner').hide();
          if (response.status == 'Success') {
            // if (response.data != null && response.data.length > 0) {
            this._searchedColumns = this._selectedSearchColumns;
            // this._searchedColumns = [...this._selectedSearchColumns].map(item => ({ ...item }));
            ($('#studentsearch') as any).modal('hide');
            this.selectedUserDetails = [];
            this.userTotalSearchRecords = response.totalCount;
            this.userTotalRecords = response.totalCount;
            if (response.data != null) {
              this.userDetailsColumnAlign(response);
            }
            this.dt.reset();
            // }
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

  onCoordinatorMultiSelect($event: any) {
    if ($event.value.length == 0) {
      this._coordinatorsSelectedColumns = this._coordinatorsSelectedColumnsDup;
    }
  }

  onUserAdminMultiSelect($event: any) {
    if ($event.value.length == 0) {
      this._selectedUserAdminColumns = this._selectedUserAdminColumnsDup;
    }
  }



  onAddCoordinatorSubmit(formValue: any) {
    if (formValue.valid) {
      let params = {
        first_name: formValue.value.co_add_first_name,
        last_name: formValue.value.co_add_last_name,
        gender: formValue.value.co_add_gender,
        dob: moment(formValue.value.co_add_dob).format('YYYY-MM-DD'),
        marital_status: formValue.value.co_add_marital_status,
        email: formValue.value.co_add_email,
        mobile: formValue.value.co_add_mobile,
        whatsapp_number: formValue.value.co_add_whats_app,
        password: formValue.value.co_add_pswd,
        confirm_password: formValue.value.co_add_cpswd,
        gtt_id: '',
        role_id: formValue.value.co_add_role,
        status: formValue.value.co_add_status,
      };

      $('.spinner').show();
      this.UsermanagementService.addCoordinator(params).subscribe({
        next: (addResponse) => {
          if (addResponse.status == 'Success') {
            let coParamRoleIds = '';
            if (this.loggedInRoleName == 'GTT_ADMIN') {
              coParamRoleIds = this.getCoordinatorRoleIds();
            } else {
              let paramRoleIds = this.getStuProRoleIds();
              this.getUserManagementNewDetails(paramRoleIds, 0, this.showCount);
              if (this.loggedInRoleName == 'PROJECT_MANAGER') {
                coParamRoleIds = String(this.loggedInRoleId);
              }
            }

            this.UsermanagementService.getCoordinatorsLists(
              coParamRoleIds
            ).subscribe({
              next: (response) => {
                this.coordinatorDetails = [];
                if (response.status == 'Success') {
                  if (response.data != null) {
                    $('.spinner').hide();

                    this.coordinatorDetails = this.coordinatorColumnsAlign(
                      response.data
                    );
                    ($('#addcoordinator') as any).modal('hide');
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Success',
                      detail: addResponse.message,
                    });
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
        error: (addErrResponse) => {
          $('.spinner').hide();
          if (addErrResponse.error.status == 'Failed') {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: addErrResponse.error.data[0],
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                addErrResponse.error.message == null
                  ? addErrResponse.error.error
                  : addErrResponse.error.message,
            });
          }
        },
      });
    }
  }

  // Coordinators Change Status
  CoordinatorChangeStatus() {
    $('.spinner').show();
    let checkValue = $('input[name="coordinatorstatus"]:checked').val();
    let gttIds = this.selectedCoordinatorDetails.map(
      (x: { gtt_id: any }) => x.gtt_id
    );
    let params = {
      status: checkValue,
      coOrdinatorEnrolmentIds: gttIds,
    };

    this.UsermanagementService.coordinatorChangeStatus(params).subscribe({
      next: (changeStatusResponse) => {
        if (changeStatusResponse.status.toLowerCase() == 'success') {
          ($('#coordinatorchangestatus') as any).modal('hide');

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: changeStatusResponse.message,
          });

          let coParamRoleIds = '';
          if (this.loggedInRoleName == 'GTT_ADMIN') {
            coParamRoleIds = this.getCoordinatorRoleIds();
          } else {
            let paramRoleIds = this.getStuProRoleIds();
            this.getUserManagementNewDetails(paramRoleIds, 0, this.showCount);
            if (this.loggedInRoleName == 'PROJECT_MANAGER') {
              coParamRoleIds = String(this.loggedInRoleId);
            }
          }

          this.UsermanagementService.getCoordinatorsLists(
            coParamRoleIds
          ).subscribe({
            next: (response) => {
              this.coordinatorDetails = [];
              if (response.status == 'Success') {
                if (response.data != null) {
                  $('.spinner').hide();
                  response.data.forEach((elem: any, index: any) => {
                    this.coordinatorDetails.push(elem);
                  });

                  this.StatusModal();
                  this.selectedCoordinatorDetails = [];
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

  editCoordinateDetails(rowData: any) {
    let role = this.roles.findIndex((x: any) => {
      return x.role_id == rowData.role_id;
    });

    ($('#edit_coordinator_details') as any).modal('show');

    this.currentCoordinatorRowData.id = rowData.id;
    this.currentCoordinatorRowData.gtt_id = rowData.gtt_id;
    this.currentCoordinatorRowData.role_id = rowData.role_id;
    this.currentCoordinatorRowData.status = rowData.status;
    this.coordinator.firstName = rowData.first_name != null ? this.capitalizeFirstLetter(rowData.first_name) : '';
    this.coordinator.lastName = rowData.last_name != null ? this.capitalizeFirstLetter(rowData.last_name) : '';
    this.coordinator.gender =
      rowData.gender != null ? this.capitalizeFirstLetter(rowData.gender) : '';
    this.coordinator.email = rowData.email;
    this.coordinator.dob = moment(rowData.dob).format('YYYY-MM-DD');
    this.coordinator.maritalStatus =
      rowData.marital_status != null
        ? this.capitalizeFirstLetter(rowData.marital_status)
        : '';
    this.coordinator.mobile = rowData.mobile;
    this.coordinator.password = rowData.password;
    this.coordinator.confirmPassword = rowData.confirm_password;
    this.coordinator.whatsappNumber = rowData.whatsapp_number;
    this.coordinator.role = rowData.role_id + '_' + rowData.role_name;
    this.coordinator.status = rowData.status;
  }

  onSubmitUpdateCoordinator(formValue: any) {
    if (formValue.valid) {
      let roleValue = formValue.value.co_edit_role.split('_', 2);
      let params = {
        id: this.currentCoordinatorRowData.id,
        first_name: formValue.value.co_edit_first_name,
        last_name: formValue.value.co_edit_last_name,
        gender: formValue.value.co_edit_gender,
        dob: moment(formValue.value.co_edit_dob).format('YYYY-MM-DD'),
        marital_status: formValue.value.co_edit_marital_status,
        email: formValue.value.co_edit_email,
        mobile: formValue.value.co_edit_mobile,
        whatsapp_number: formValue.value.co_edit_whats_app,
        password: formValue.value.co_edit_pswd,
        confirm_password: formValue.value.co_edit_cpswd,
        gtt_id: this.currentCoordinatorRowData.gtt_id,
        role_id: roleValue[0],
        role_name: roleValue[1],
        status: formValue.value.co_edit_status,
      };

      $('.spinner').show();
      this.UsermanagementService.updateCoordinatorDetails(params).subscribe({
        next: (editresponse) => {
          if (editresponse.status == 'Success') {
            let coParamRoleIds = '';
            if (this.loggedInRoleName == 'GTT_ADMIN') {
              coParamRoleIds = this.getCoordinatorRoleIds();
            } else {
              let paramRoleIds = this.getStuProRoleIds();
              this.getUserManagementNewDetails(paramRoleIds, 0, this.showCount);
              if (this.loggedInRoleName == 'PROJECT_MANAGER') {
                coParamRoleIds = String(this.loggedInRoleId);
              }
            }
            this.UsermanagementService.getCoordinatorsLists(
              coParamRoleIds
            ).subscribe({
              next: (response) => {
                this.coordinatorDetails = [];
                if (response.status == 'Success') {
                  if (response.data != null) {
                    $('.spinner').hide();
                    this.coordinatorDetails = this.coordinatorColumnsAlign(
                      response.data
                    );
                    this.selectedCoordinatorDetails = [];
                    ($('#edit_coordinator_details') as any).modal('hide');
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Success',
                      detail: editresponse.message,
                    });
                  }
                }
              },
              error: (response) => {
                $('.spinner').hide();
                if (response.error.status == 'Failed') {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail:
                      response.error.data == null
                        ? response.error.message
                        : response.error.data[0].toString(),
                  });
                } else {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail:
                      response.error.message == null
                        ? response.error.error
                        : response.error.message,
                  });
                }
                // this.messageService.add({
                //   severity: 'error',
                //   summary: 'Error',
                //   detail:
                //     response.error.message == null
                //       ? response.error.error
                //       : response.error.message,
                // });
              },
            });
          } else {
            $('.spinner').hide();
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                editresponse.message == null
                  ? editresponse.data[0]
                  : editresponse.message,
            });
          }
        },
        error: (editErrResponse) => {
          $('.spinner').hide();
          if (editErrResponse.error.status == 'Failed') {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: editErrResponse.error.data[0],
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                editErrResponse.error.message == null
                  ? editErrResponse.error.error
                  : editErrResponse.error.message,
            });
          }
        },
      });
    }
  }

  coordinatorColumnsAlign(coordinatorDetails: any) {
    this.coordinatorDetails = [];
    coordinatorDetails.forEach((elm, inx) => {
      if (elm.status == 'Active' && this.loggedInRoleName != 'GTT_ADMIN') {
        this.coordinatorDetails.push({
          id: elm.id,
          first_name: elm.first_name,
          last_name: elm.last_name,
          gtt_id: elm.gtt_id,
          gender: elm.gender,
          marital_status: elm.marital_status,
          mobile: elm.mobile,
          password: elm.password,
          confirm_password: elm.confirm_password,
          dob: new Date(elm.dob),
          email: elm.email,
          whatsapp_number: elm.whatsapp_number,
          status: elm.status,
          role_name: elm.role_name,
          role_id: elm.role_id,
        });
      } else {
        this.coordinatorDetails.push({
          id: elm.id,
          first_name: elm.first_name,
          last_name: elm.last_name,
          gtt_id: elm.gtt_id,
          gender: elm.gender,
          marital_status: elm.marital_status,
          mobile: elm.mobile,
          password: elm.password,
          confirm_password: elm.confirm_password,
          dob: elm.dob,
          email: elm.email,
          whatsapp_number: elm.whatsapp_number,
          status: elm.status,
          role_name: elm.role_name,
          role_id: elm.role_id,
        });
      }
    });

    return this.coordinatorDetails;
  }

  //  Export Coordinator
  // =====================

  // Export Coordinator PDF
  exportCoordinatorPdf(dt: any) {
    var doc: any = new jsPDF.default('p', 'pt', 'a1', true);
    this.coordinatorsExportColumns = [];
    Object.keys(this._coordinatorsSelectedColumns).forEach((key) => {
      this.coordinatorsExportColumns.push({
        title: this._coordinatorsSelectedColumns[key].header,
        dataKey: this._coordinatorsSelectedColumns[key].field,
      });
    });
    doc.autoTable(
      this.coordinatorsExportColumns,
      this.selectedCoordinatorDetails,
      {
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
      }
    );
    doc.save('Coordinator-details.pdf');
  }

  exportCoordinatorCSV() {
    let coordinatorDetails: any = [];
    let columns: any = [];
    debugger
    this.selectedCoordinatorDetails.forEach((elem, inx) => {
      if (!coordinatorDetails.hasOwnProperty(inx)) {
        coordinatorDetails[inx] = {};
      }
      this._coordinatorsSelectedColumns.forEach((elm, indx) => {
        // let headerName = elm.header.replace(/\s/g, '');
        let headerName = elm.header;
        coordinatorDetails[inx][headerName] = elem[elm.field];
      });
    });

    if (this.selectedCoordinatorDetails.length == 0) {
      this._coordinatorsSelectedColumns.forEach((elm, indx) => {
        // let headerName = elm.header.replace(/\s/g, '');
        let headerName = elm.header;
        columns[headerName] = '';
      });
      coordinatorDetails.push(columns);
    }

    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      filename: 'Coordinator-Details',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(coordinatorDetails);
    this.selectedCoordinatorDetails = [];
  }

  exportCoordinatorExcel() {
    let coordinatorDetails: any = [];
    let columns: any = [];
    this.selectedCoordinatorDetails.forEach((elem, inx) => {
      if (!coordinatorDetails.hasOwnProperty(inx)) {
        coordinatorDetails[inx] = {};
      }
      this._coordinatorsSelectedColumns.forEach((elm, indx) => {
        // let headerName = elm.header.replace(/\s/g, '');
        let headerName = elm.header;
        coordinatorDetails[inx][headerName] = elem[elm.field];
      });
    });

    if (this.selectedCoordinatorDetails.length == 0) {
      this._coordinatorsSelectedColumns.forEach((elm, indx) => {
        // let headerName = elm.header.replace(/\s/g, '')
        let headerName = elm.header;
        columns[headerName] = '';
      });
      coordinatorDetails.push(columns);
    }

    // import("xlsx").then(xlsx => {
    const worksheet = xlsx.utils.json_to_sheet(coordinatorDetails);
    const workbook = {
      Sheets: { 'Coordinator-Details': worksheet },
      SheetNames: ['Coordinator-Details'],
    };
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'Coordinator-Details');
    // });
  }

  /* ======================== End Coordinator ====================== */

  userAdminColumnsAlign(userAdmins: any) {
    this.adminDetails = [];
    userAdmins.forEach((elm, inx) => {
      if (elm.status == 'Active' && this.loggedInRoleName != 'GTT_ADMIN') {
        this.adminDetails.push({
          id: elm.id,
          first_name: elm.first_name,
          last_name: elm.last_name,
          gtt_id: elm.gtt_id,
          marital_status: elm.marital_status,
          mobile: elm.mobile,
          gender: elm.gender,
          password: elm.password,
          confirm_password: elm.confirm_password,
          dob: elm.dob,
          email: elm.email,
          whatsapp_number: elm.whatsapp_number,
          status: elm.status,
          role_name: elm.role_name,
        });
      } else {
        this.adminDetails.push({
          id: elm.id,
          first_name: elm.first_name,
          last_name: elm.last_name,
          gtt_id: elm.gtt_id,
          marital_status: elm.marital_status,
          mobile: elm.mobile,
          gender: elm.gender,
          password: elm.password,
          confirm_password: elm.confirm_password,
          dob: elm.dob,
          email: elm.email,
          whatsapp_number: elm.whatsapp_number,
          status: elm.status,
          role_name: elm.role_name,
        });
      }
    });

    return this.adminDetails;
  }

  /* Get Admin List Details */
  getUserAdminDetails(roleId) {
    // $('.spinner').show();
    this.userAdminService.getUserAdminDetails(roleId).subscribe({
      next: (response) => {
        // $('.spinner').hide();
        if (response.status == 'Success') {
          this.adminDetails = this.userAdminColumnsAlign(response.data);
          var result = Object.keys(this.adminDetails[0]).map(function (
            key: string
          ) {
            return key;
          });

          result.forEach((elem: any, key: any) => {
            let headerName = this.humanize(elem);
            if (elem == 'email') {
              headerName = 'Email Id';
            } else if (elem == 'mobile') {
              headerName = 'Mobile No';
            } else if (elem == 'whatsapp_number') {
              headerName = 'Whatsapp No';
            } else if (elem == 'dob') {
              headerName = 'DOB';
            }
            if (
              elem != 'id' &&
              elem != 'role_id' &&
              elem != 'role_name' &&
              elem != 'gtt_id'
            ) {
              this.userAdminColumns.push({
                field: elem,
                header: headerName,
                align: 'center',
              });
            }
          });

          this.userAdminCols = this.userAdminColumns;
          this.userAdminExportColumns = this.userAdminCols.map((col) => ({
            title: col.header,
            dataKey: col.field,
          }));
          this.userAdminExportCols = this.userAdminCols.map((col) => ({
            dataKey: col.field,
          }));
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

  // Add User Admin List
  addUserAdminSubmit(formValue: any) {
    if (formValue.valid) {
      let params = {
        first_name: formValue.value.admin_add_first_name,
        last_name: formValue.value.admin_add_last_name,
        gender: formValue.value.admin_add_gender,
        dob: moment(formValue.value.admin_add_dob).format('YYYY-MM-DD'),
        marital_status: formValue.value.admin_add_marital_status,
        email: formValue.value.admin_add_email,
        mobile: formValue.value.admin_add_mobile,
        whatsapp_number: formValue.value.admin_add_whats_app,
        password: formValue.value.admin_add_pswd,
        confirm_password: formValue.value.admin_add_cpswd,
        gtt_id: '',
        role_id: String(this.loggedInRoleId),
        status: 'Active',
      };

      $('.spinner').show();
      this.userAdminService.addUserAdmin(params).subscribe({
        next: (addResponse) => {
          if (addResponse.status == 'Success') {
            this.userAdminService
              .getUserAdminDetails(this.loggedInRoleId)
              .subscribe({
                next: (response) => {
                  if (response.status == 'Success') {
                    if (response.data != null) {
                      $('.spinner').hide();
                      this.adminDetails = this.userAdminColumnsAlign(
                        response.data
                      );
                      ($('#addadmin') as any).modal('hide');
                      this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: addResponse.message,
                      });
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
        error: (addErrResponse) => {
          $('.spinner').hide();
          if (addErrResponse.error.status == 'Failed') {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: addErrResponse.error.data[0],
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                addErrResponse.error.message == null
                  ? addErrResponse.error.error
                  : addErrResponse.error.message,
            });
          }
        },
      });
    }
  }

  resetUserAdminForm(userAdminForm: NgForm) {
    userAdminForm.resetForm();
  }

  // Edit Admin
  editAdminDetails(rowData: any) {
    ($('#edit_admin_details') as any).modal('show');
    this.currentUserAdminRowData.id = rowData.id;
    this.currentUserAdminRowData.gtt_id = rowData.gtt_id;
    this.currentUserAdminRowData.role_id = rowData.role_id;
    this.currentUserAdminRowData.status = rowData.status;
    this.userAdmin.firstName = rowData.first_name != null ? this.capitalizeFirstLetter(rowData.first_name) : '';
    this.userAdmin.lastName = rowData.last_name != null ? this.capitalizeFirstLetter(rowData.last_name) : '';
    this.userAdmin.gender =
      rowData.gender != null ? this.capitalizeFirstLetter(rowData.gender) : '';
    this.userAdmin.email = rowData.email;
    this.userAdmin.dob = this.datepipe.transform(rowData.dob, 'yyyy-MM-dd');
    this.userAdmin.maritalStatus =
      rowData.marital_status != null
        ? this.capitalizeFirstLetter(rowData.marital_status)
        : '';
    this.userAdmin.mobile = rowData.mobile;
    this.userAdmin.password = rowData.password;
    this.userAdmin.confirmPassword = rowData.confirm_password;
    this.userAdmin.whatsappNumber = rowData.whatsapp_number;
  }

  //  Update Admin User Details
  onSubmitUpdateUserAdmin(formValue: any) {
    if (formValue.valid) {
      let params = {
        id: this.currentUserAdminRowData.id,
        first_name: formValue.value.admin_edit_first_name,
        last_name: formValue.value.admin_edit_last_name,
        gender: formValue.value.admin_edit_gender,
        dob: moment(formValue.value.admin_edit_dob).format('YYYY-MM-DD'),
        marital_status: formValue.value.admin_edit_marital_status,
        email: formValue.value.admin_edit_email,
        mobile: formValue.value.admin_edit_mobile,
        whatsapp_number: formValue.value.admin_edit_whats_app,
        password: formValue.value.admin_edit_pswd,
        confirm_password: formValue.value.admin_edit_cpswd,
        gtt_id: this.currentUserAdminRowData.gtt_id,
        role_id: JSON.parse(this.user).user_role.role_id,
        role_name: this.loggedInRoleName,
        status: this.currentUserAdminRowData.status,
      };

      $('.spinner').show();
      this.userAdminService
        .updateUserAdminDetails(this.currentUserAdminRowData.id, params)
        .subscribe({
          next: (editresponse) => {
            if (editresponse.status == 'Success') {
              this.userAdminService
                .getUserAdminDetails(this.loggedInRoleId)
                .subscribe({
                  next: (response) => {
                    if (response.status == 'Success') {
                      if (response.data != null) {
                        $('.spinner').hide();
                        this.adminDetails = this.userAdminColumnsAlign(
                          response.data
                        );
                        ($('#edit_admin_details') as any).modal('hide');
                        this.messageService.add({
                          severity: 'success',
                          summary: 'Success',
                          detail: editresponse.message,
                        });
                      }
                    } else {
                      $('.spinner').hide();
                      this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail:
                          editresponse.message == null
                            ? editresponse.data[0].toString()
                            : editresponse.message,
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
          error: (editErrResponse) => {
            $('.spinner').hide();
            if (editErrResponse.error.status == 'Failed') {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: editErrResponse.error.data[0],
              });
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail:
                  editErrResponse.error.message == null
                    ? editErrResponse.error.error
                    : editErrResponse.error.message,
              });
            }
          },
        });
    }
  }

  // Admin Change Status
  UserAdminChangeStatus() {
    let checkValue = $('input[name="useradminstatus"]:checked').val();
    $('.spinner').show();
    let gttIds = this.selectedUserAdminDetails.map(
      (x: { gtt_id: any }) => x.gtt_id
    );
    let params = {
      status: checkValue,
      adminEnrolmentIds: gttIds,
    };

    this.userAdminService.userAdminChangeStatus(params).subscribe({
      next: (changeStatusResponse) => {
        if (changeStatusResponse.status.toLowerCase() == 'success') {
          ($('#adminchangestatus') as any).modal('hide');

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: changeStatusResponse.message,
          });
          this.userAdminService
            .getUserAdminDetails(this.loggedInRoleId)
            .subscribe({
              next: (response) => {
                if (response.status == 'Success') {
                  $('.spinner').hide();
                  this.adminDetails = response.data;
                  this.StatusModal();
                  this.selectedUserAdminDetails = [];
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

  // ================ End User Admin Functionality =======================//

  @Input() get selectedUserAdminColumns(): any[] {
    return this._selectedUserAdminColumns;
  }

  set selectedUserAdminColumns(val: any[]) {
    this._selectedUserAdminColumns = this.userAdminCols.filter((col) =>
      val.includes(col)
    );
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

  private setting = {
    element: {
      dynamicDownload: null as unknown as HTMLElement,
    },
  };

  private dyanmicDownloadByHtmlTag(arg: { fileName: string; text: string }) {

    console.log(arg);
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    debugger
    const element = this.setting.element.dynamicDownload;
    const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute(
      'href',
      `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`
    );
    element.setAttribute('download', arg.fileName);
    var event = new MouseEvent('click');
    element.dispatchEvent(event);
    this.coorFileInput.nativeElement.value = '';
    this.adminFileInput.nativeElement.value = '';
  }


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

  getCoordinator($event: any) {
    if (!$event.index) {
      this.currentTab1 = 'studentprofessional';
      this.currentTab2 = '';
      this.currentTab3 = '';
      this.selectedCoordinatorDetails = [];
      this.selectedUserAdminDetails = [];
      $('#inlineRadio_student1').trigger('click');
    } else if ($event.index == 1) {
      this.currentTab2 = 'coordinator';
      this.currentTab1 = '';
      this.currentTab3 = '';
      this.selectedUserDetails = [];
      this.selectedUserAdminDetails = [];
      $('#inlineRadio_coor1').trigger('click');
    } else if ($event.index == 2) {
      this.currentTab3 = 'admin';
      this.currentTab1 = '';
      this.currentTab2 = '';
      this.selectedUserDetails = [];
      this.selectedCoordinatorDetails = [];
      $('#inlineRadio_admin1').trigger('click');
    }
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.substr(1);;
  }

  deleteCoordinator(deleteId: any) {
    $('.spinner').show();
    this.UsermanagementService.deleteCoordinator(deleteId).subscribe({
      next: (delresponse) => {
        if (delresponse.status == 'Success') {
          let roleIds = '4,5,6,7,8';
          this.UsermanagementService.getCoordinatorsLists(roleIds).subscribe({
            next: (response) => {
              $('.spinner').hide();
              this.coordinatorDetails = [];
              if (response.status == 'Success') {
                if (response.data != null) {
                  response.data.forEach((elem: any, index: any) => {
                    this.coordinatorDetails.push(elem);
                  });

                  ($('#deleteCoordinatorModal') as any).modal('hide');
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: delresponse.message,
                  });
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

  deleteCurrentCoId(rowData: any) {
    this.currentCoordinatorRowData.id = rowData.id;
  }

  deleteUserGtt(rowData: any) {
    this.currentGttId = rowData.gttId;
  }

  deleteUser(rowData: any) {
    let params = {
      status: 'Deactivated',
      studentEnrolmentIds: [this.currentGttId],
    };

    $('.spinner').show();
    this.UsermanagementService.deleteUser(params).subscribe({
      next: (delresponse) => {
        if (delresponse.status == 'Success') {
          $('.spinner').show();
          let headerName = '';
          let UserId = '3,14';
          this.UsermanagementService.getUserDetails(
            UserId,
            this.currentLoginUserId,
            this.loggedInRoleId
          ).subscribe({
            next: (response) => {
              $('.spinner').hide();
              if (response.status == 'Success') {
                if (response.data != null) {
                  response.data.forEach((elem: any, index: any) => {
                    this.userDetails.push(elem.user);
                  });

                  ($('#deleteUserModal') as any).modal('hide');
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: delresponse.message,
                  });
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

  onCoorBulkUpload() {
    let fi = this.coorFileInput.nativeElement;
    if (fi.files && fi.files[0] && this.CofileUploadError == true) {
      $('.spinner').show();

      this.UsermanagementService.onCoorBulkUpload(
        this.bulkCoorUploadFile
      ).subscribe({
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
            return false;
          }

          if (result.data != null && result.data.failureRecords > 0) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Upload Error Please check the downloaded file',
            });

            let coParamRoleIds = this.getCoordinatorRoleIds();
            this.getCoordinatorLists(coParamRoleIds);
            $('.spinner').hide();
            ($('#addcoordinator') as any).modal('hide');
            this.coorFileInput.nativeElement.value = '';
            if (result.data.validationResults) {
              result.data.validationResults.forEach(
                (val: any, index: any, arValue: any) => {
                  erFile += val.rowNumber + " - ";
                  val.messages.forEach((error: any) => {
                    erFile += error + "\r\n";
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
            let coParamRoleIds = this.getCoordinatorRoleIds();
            this.getCoordinatorLists(coParamRoleIds);
            $('.spinner').hide();
            ($('#addcoordinator') as any).modal('hide');
            this.stuProFileInput.nativeElement.value = '';
            this.coorFileInput.nativeElement.value = '';
            this.messageService.add({
              severity: 'success',
              summary: 'Sucess',
              detail: 'Successfully Uploaded',
            });
          }
        },
        error: (err) => {
          let coParamRoleIds = this.getCoordinatorRoleIds();
          this.getCoordinatorLists(coParamRoleIds);
          $('.spinner').hide();
          ($('#addcoordinator') as any).modal('hide');
          this.coorFileInput.nativeElement.value = '';
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
                  erFile += 'Row ' + val.rowNumber + ' - ' + error + ` \r\n  `;
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
      this.coordiantorBulkUploadMsg = true;
    }
  }

  onCoorBulkUploadChange(event: any) {
    this.coordiantorBulkUploadMsg = false;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.bulkCoorUploadFile = file;
      var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
      let _validFileExtensions = ['xlsx'];
      if (event.target.files.length > 0 && _validFileExtensions.includes(ext)) {
        if (this.bulkCoorUploadFile.size > 20000000) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'File size should be less than 20MB',
          });
          this.CofileUploadError = false;
        } else {
          this.CofileUploadError = true;
        }
        this.CofileUploadError = true;
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Invalid file format',
        });
        this.CofileUploadError = false;
      }
    }
  }

  onAdminBulkUpload() {
    let fi = this.adminFileInput.nativeElement;
    if (fi.files && fi.files[0] && this.adminfileUploadError == true) {
      $('.spinner').show();
      this.UsermanagementService.onAdminBulkUpload(
        this.bulkAdminUploadFile
      ).subscribe({
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
            return false;
          }

          if (result.data != null && result.data.failureRecords > 0) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Upload Error Please check the downloaded file',
            });
            this.getUserAdminDetails(this.loggedInRoleId);
            this.adminFileInput.nativeElement.value = '';
            ($('#addadmin') as any).modal('hide');
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
            this.getUserAdminDetails(this.loggedInRoleId);
            ($('#addadmin') as any).modal('hide');
            this.adminFileInput.nativeElement.value = '';
            this.messageService.add({
              severity: 'success',
              summary: 'Sucess',
              detail: 'Successfully Uploaded',
            });
          }
        },
        error: (err) => {
          $('.spinner').hide();
          this.getUserAdminDetails(this.loggedInRoleId);
          ($('#addadmin') as any).modal('hide');
          this.adminFileInput.nativeElement.value = '';
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
                  erFile += 'Row ' + val.rowNumber + ' - ' + error + ` \r\n  `;
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
      this.adminBulkUploadMsg = true;
    }
  }

  onAdminBulkUploadChange(event: any) {
    this.adminBulkUploadMsg = false;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.bulkAdminUploadFile = file;
      var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
      let _validFileExtensions = ['xlsx'];
      if (event.target.files.length > 0 && _validFileExtensions.includes(ext)) {
        if (this.bulkAdminUploadFile.size > 20000000) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'File size should be less than 20MB',
          });
          this.adminfileUploadError = false;
        } else {
          this.adminfileUploadError = true;
        }
        this.adminfileUploadError = true;
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Invalid file format',
        });
        this.adminfileUploadError = false;
      }
    }
  }

  onBulkUpload() {
    let fi = this.stuProFileInput.nativeElement;
    if (fi.files && fi.files[0] && this.stuProUploadError == true) {
      $('.spinner').show();

      this.UsermanagementService.onBulkUpload(
        this.bulkUploadFile,
        this.currentLoginUserId
      ).subscribe({
        next: (result) => {

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
                    erFile += 'Row ' + val.rowNumber + ' - ' + error + ` \r\n`;
                  });
                  if (arValue.length == index + 1) {
                    this.dyanmicDownloadByHtmlTags('Bulk upload error logs', erFile);
                  }
                }
              );
            }
          } else {
            let paramRoleIds = this.getStuProRoleIds();
            this.getUserManagementNewDetails(paramRoleIds, this.pageNumber, this.showCount);
            // $('.spinner').hide();
            this.stuProFileInput.nativeElement.value = '';
            ($('#addstudentprofessional') as any).modal('hide');
            this.messageService.add({
              severity: 'success',
              summary: 'Sucess',
              detail: 'Successfully Uploaded',
            });
          }
        },
        error: (err) => {
          $('.spinner').hide();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              err.error.message == null ? err.error.error : err.error.message,
          });
          this.stuProFileInput.nativeElement.value = '';
          var erFile: string = "";
          if (err.error.data.validationResults) {
            err.error.data.validationResults.forEach(
              (val: any, index: any, arValue: any) => {
                val.messages.forEach((error: any) => {
                  erFile += 'Row ' + val.rowNumber + ' - ' + error + ` \r\n  `;
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
        if (this.bulkUploadFile.size > 20000000) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'File size should be less than 20MB',
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

  onBulkUploadUpdateChange(event: any) {
    this.stuProBulkUploadUpdateMsg = false;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.bulkUploadUpdateFile = file;
      var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
      let _validFileExtensions = ['xlsx'];
      if (event.target.files.length > 0 && _validFileExtensions.includes(ext)) {
        if (this.bulkUploadUpdateFile.size > 20000000) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'File size should be less than 20MB',
          });
          this.stuProUploadUpdateError = false;
        } else {
          this.stuProUploadUpdateError = true;
        }
        this.stuProUploadUpdateError = true;
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Invalid file format',
        });
        this.stuProUploadUpdateError = false;
      }
    }
  }

  uploadCloseButton() {
    this.stuProFileInput.nativeElement.value = '';
    this.stuProFileUpdateInput.nativeElement.value = '';
  }


  onBulkUploadUpdate() {

    let fi = this.stuProFileUpdateInput.nativeElement;
    if (fi.files && fi.files[0] && this.stuProUploadError == true) {
      $('.spinner').show();
      this.UsermanagementService.onBulkUploadUpdate(
        this.bulkUploadUpdateFile,
        this.currentLoginUserId
      ).subscribe({
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
                    erFile += 'Row ' + val.rowNumber + ' - ' + error + ` \r\n`;
                  });
                  if (arValue.length == index + 1) {
                    this.dyanmicDownloadByHtmlTags('Bulk upload error logs', erFile);
                  }
                }
              );
            }
          } else {
            let paramRoleIds = this.getStuProRoleIds();
            this.getUserManagementNewDetails(paramRoleIds, this.pageNumber, this.showCount);
            // $('.spinner').hide();
            this.stuProFileUpdateInput.nativeElement.value = '';
            ($('#addstudentprofessional') as any).modal('hide');
            this.messageService.add({
              severity: 'success',
              summary: 'Sucess',
              detail: 'Successfully Uploaded',
            });
          }
        },
        error: (err) => {
          $('.spinner').hide();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              err.error.message == null ? err.error.error : err.error.message,
          });
          this.stuProFileUpdateInput.nativeElement.value = '';
          var erFile: string = "";
          if (err.error.data.validationResults) {
            err.error.data.validationResults.forEach(
              (val: any, index: any, arValue: any) => {
                val.messages.forEach((error: any) => {
                  erFile += 'Row ' + val.rowNumber + ' - ' + error + ` \r\n  `;
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
      this.stuProBulkUploadUpdateMsg = true;
    }
  }

  onSelectItem($event: any) {
    this.selectedLanguage.push($event);
  }

  myGroup = new FormGroup({
    file: new FormControl(),
  });

  mailGroup = new FormGroup({
    file: new FormControl(),
  });


  termGroup = new FormGroup({
    file: new FormControl(),
  });


  onMailFileChange(event: any) {
    debugger
    let files = event.target.files;
    this.mailFiles = [];
    this.mailMessage = '';
    for (var i = 0; i < files.length; i++) {
      const file = files[i];
      var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
      let _validFileExtensions = ['jpeg', 'xlsx', 'jpg', 'pdf', 'doc', 'png', 'xls', 'docx', 'PNG', 'JPEG', 'JPG', 'csv', 'CSV', 'PPT', 'ppt'];
      this.mailMessage = '';
      if (_validFileExtensions.includes(ext)) {
        if (file.size > 10000000) {
          this.mailMessage = 'File size less than 10MB';
        } else {
          this.mailMessage = '';
          this.sendMail.attachment = file.name;
          this.mailFiles.push(files[i])
        }
      } else {
        this.mailMessage = 'Invalid file format';
        this.sendMail.attachment = null;
        console.log(this.mailFiles);
        this.mailFiles = [];
      }
    }



    // const file = event.target.files[0];
    // var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
    // let _validFileExtensions = ['jpeg', 'xlsx', 'jpg', 'pdf', 'doc', 'png', 'xls', 'docx', 'PNG', 'JPEG', 'JPG'];
    // if (event.target.files.length > 0 && _validFileExtensions.includes(ext)) {
    //   this.mailMessage = '';
    //   if (this.mailFiles.size > 2000000) {
    //     this.mailMessage = 'File size less than 2MB';
    //   } else {
    //     this.mailMessage = '';
    //     this.sendMail.attachment = file.name;
    //   }
    // } else {
    //   this.mailMessage = 'Invalid file format';
    //   this.sendMail.attachment = null;
    // }
  }



  showPassword() {
    this.show_button = !this.show_button;
    this.show_eye = !this.show_eye;
  }

  confirmShowPassword() {
    this.confirm_show_button = !this.confirm_show_button;
    this.confirm_show_eye = !this.confirm_show_eye;
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.files_s = file;
    }
  }


  paginate(event) {
    this.userRowNum = event.rows;
    this.pageNumber = event.first / event.rows // Index of the new page if event.page not defined.
    let paramRoleIds = this.getStuProRoleIds();
    this.showCount = this.userRowNum;
    // this.selectedUserDetails = [];

    if (this._searchedColumns.length > 0) {
      let countStartRec = this.pageNumber * this.showCount;
      let countEndRec = this.showCount * (this.pageNumber + 1);
      this.userDetails = this.backUpUserFilterRecords.slice(countStartRec, countEndRec);
    } else {
      this.getUserManagementNewDetails(paramRoleIds, this.pageNumber, this.userRowNum);
    }

  }

  StatusModal() {
    $('.form-check-input').addClass('radio_css');
  }

  changeStatusCss() {
    $('.form-check-input').removeClass('radio_css');
  }

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

  editUserDetails(rowData: any) {
    $('.spinner').show();

    console.log('editUserDetails', rowData);

    let collegeCityIndex = this.cityDetails.findIndex((x: any) => {
      return x.cityname == rowData.collegeCity;
    });

    let currentLocRow: any;
    let cityIndex: any;
    if (rowData.currentLocation != null) {
      currentLocRow = this.humanize(rowData.currentLocation)
      cityIndex = this.cityDetails.findIndex((x: any) => {
        return x.cityname.toLowerCase() == currentLocRow.toLowerCase();
      });
    }


    console.log(rowData);
    debugger


    if (rowData.roleName.toLowerCase() == 'student') {


      this.editStuDetails.currentLocation = null;
      this.editStuDetails.stateId = null;

      this.currentUserId = rowData.id;
      this.currentRoleId = rowData.roleId;
      this.editStuDetails.firstName = rowData.firstName != null ? this.capitalizeFirstLetter(rowData.firstName) : '';
      this.editStuDetails.lastName = rowData.lastName != null ? this.capitalizeFirstLetter(rowData.lastName) : '';
      this.editStuDetails.gender = rowData.gender;
      this.editStuDetails.email = rowData.email;
      this.editStuDetails.mobile = rowData.mobile;
      this.editStuDetails.whatsappNumber = rowData.whatsappNumber;
      this.editStuDetails.password = rowData.password;
      this.editStuDetails.confirmPassword = rowData.confirmPassword;
      (this.editStuDetails.roleId = rowData.roleId),
        (this.editStuDetails.roleName = rowData.roleName),
        (this.editStuDetails.gttId = rowData.gttId),
        (this.editStuDetails.stateId =
          rowData.stateId != null
            ? rowData.stateId + '_' + rowData.stateName
            : '');
      this.editStuDetails.isGraduated = rowData.isGraduated;
      this.editStuDetails.collegeCity =
        collegeCityIndex != -1
          ? this.cityDetails[collegeCityIndex].cityid + '_' + rowData.collegeCity
          : '';
      this.editStuDetails.collegeName = {
        'academic_institution_id': rowData.academicInstitutionId,
        'academic_institution_name': rowData.academiciInstitutionName
      };
      this.editStuDetails.aadharNumber = rowData.aadharNumber;
      this.editStuDetails.educationalQualification =
        rowData.educationalQualification != null ? this.capitalizeFirstLetter(rowData.educationalQualification) : '';
      this.editStuDetails.graduationPassingYear = rowData.graduationPassingYear;
      this.editStuDetails.subject = rowData.subject != null ? this.capitalizeFirstLetter(rowData.subject) : '';
      this.editStuDetails.profession = rowData.profession != null ? this.capitalizeFirstLetter(rowData.profession) : '';

      this.editStuDetails.placedOrganization =
        rowData.placedOrganizationId + '_' + rowData.placedOrganization;
      this.editStuDetails.sector = rowData.sector;
      this.editStuDetails.isPlaced = rowData.isPlaced;
      this.editStuDetails.caste = rowData.caste != null ? this.capitalizeFirstLetter(rowData.caste) : '';
      this.editStuDetails.placedOrganization =
        rowData.placedOrganizationId + '_' + rowData.placedOrganization;
      this.editStuDetails.sector = rowData.sectorName;
      this.editStuDetails.designation = rowData.designation != null ? this.capitalizeFirstLetter(rowData.designation) : '';
      this.editStuDetails.joiningMonth = rowData.joiningMonth;
      this.editStuDetails.uploadVaccinationCertificate =
        (rowData.vaccinationStatus != 'No') ? rowData.vaccinationcertificatefilename : '';
      this.editStuDetails.dubUploadVaccinationCertificate = (rowData.vaccinationStatus != 'No') ? rowData.vaccinationcertificatefilename : '';
      this.editStuDetails.status = rowData.status;
      this.editStuDetails.vaccinationStatus = rowData.vaccinationStatus;

      if ((rowData.vaccinationStatus == 'Yes' && this.editStuDetails.uploadVaccinationCertificate == null) || (rowData.vaccinationStatus == 'Yes' && this.editStuDetails.uploadVaccinationCertificate == '')) {
        this.stuUploadOption = false;
      } else {
        this.stuUploadOption = true;
      }


      this.editStuDetails.dob = moment(rowData.dob).format('YYYY-MM-DD');
      this.editStuDetails.insertedBy = rowData.insertedBy;
      let cityFilter = [];
      this.cityDetails.forEach((el, ix) => {
        if (rowData.stateId == el.stateid) {
          cityFilter.push(el);
        }
      });

      const citySorted = cityFilter.sort((a: any, b: any) =>
        a.cityname > b.cityname ? 1 : -1
      );
      this.filterCityNameList = citySorted;

      let currentLoc = '';
      if (cityIndex != -1 && cityIndex != undefined) {
        currentLoc = this.humanize(this.cityDetails[cityIndex].cityname)
      }

      this.editStuDetails.currentLocation =
        (cityIndex != -1 && cityIndex != undefined)
          ? this.cityDetails[cityIndex].cityid + '_' + rowData.currentLocation.trim()
          : '';
      console.log(currentLoc)
      $('#currentloc_stu').val(this.editStuDetails.currentLocation);
      ($('#edit_user_stu_details') as any).modal('show');
      $('.spinner').hide();


      // this.collegeService.getFilterCity(rowData.stateId).subscribe({
      //   next: (response) => {
      //     $('.spinner').hide();
      //     if (response.data != null) {
      //       const citySorted = response.data.sort((a: any, b: any) =>
      //         a.cityname > b.cityname ? 1 : -1
      //       );

      //       this.filterCityNameList = citySorted;
      //       this.editStuDetails.currentLocation =
      //         cityIndex != -1
      //           ? this.cityDetails[cityIndex].cityid + '_' + this.cityDetails[cityIndex].cityname.trim()
      //           : '';
      //       $('#currentloc_stu').val(this.editStuDetails.currentLocation);
      //       ($('#edit_user_stu_details') as any).modal('show');
      //       console.log(this.editStuDetails.currentLocation);
      //     }
      //   },
      //   error: (response) => {
      //     $('.spinner').hide();
      //     this.messageService.add({
      //       severity: 'error',
      //       summary: 'Error',
      //       detail:
      //         response.error.message == null
      //           ? response.error.error
      //           : response.error.message,
      //     });
      //   },
      // });



    } else {
      let dropdownlist = [
        { item_id: 1, item_text: 'English' },
        { item_id: 2, item_text: 'Hindi' },
        { item_id: 3, item_text: 'Marathi' },
        { item_id: 4, item_text: 'Tamil' },
        { item_id: 5, item_text: 'Telugu' },
        { item_id: 6, item_text: 'Kannada' },
        { item_id: 7, item_text: 'Other' },
      ];


      this.dropdownSettings = {
        idField: 'item_id',
        textField: 'item_text',
      };

      let selectKeyLanguages = [];
      // let arr = rowData.languageKnown.split(",");

      if (rowData.languageIds != null) {
        const arr1 = rowData.languageIds
          .split(',')
          .map((element) => +element.trim());
        let arr = [...new Set(arr1)];

        dropdownlist.forEach((elm, inx) => {
          if (arr.includes(elm.item_id)) {
            selectKeyLanguages.push({
              item_id: elm.item_id,
              item_text: elm.item_text,
            });
            this.languageIds.push(elm.item_id);
          }
        });
      }


      let currentLocRow: any;
      let currentLocationIndex: any;

      if (rowData.currentLocation != null) {
        currentLocRow = this.humanize(rowData.currentLocation)
        currentLocationIndex = this.cityDetails.findIndex((x: any) => {
          return x.cityname.toLowerCase() == currentLocRow.toLowerCase();
        });
      }

      let postGraduationInstitutionId = '';
      if (rowData.pursuingPostGraduate == 'Yes') {
        postGraduationInstitutionId = this.collegeDetails.findIndex((x: any) => {
          return x.academic_institution_name == rowData.postGraduationInstitution
        });

      }



      let stateIndex = this.stateDetails.findIndex((x: any) => {
        return x.stateid == rowData.stateId;
      });

      this.currentUserId = rowData.id;
      this.currentRoleId = rowData.roleId;
      this.editProDetails.gttId = rowData.gttId;
      this.editProDetails.firstName = rowData.firstName != null ? this.capitalizeFirstLetter(rowData.firstName) : '';
      this.editProDetails.lastName = rowData.lastName != null ? this.capitalizeFirstLetter(rowData.lastName) : '';
      this.editProDetails.gender = rowData.gender;
      this.editProDetails.maritalStatus = rowData.maritalStatus;
      this.editProDetails.email = rowData.email;
      this.editProDetails.mobile = rowData.mobile;
      this.editProDetails.whatsappNumber = rowData.whatsappNumber;
      this.editProDetails.password = rowData.password;
      this.editProDetails.confirmPassword = rowData.confirmPassword;
      this.editProDetails.isGraduated = rowData.isGraduated;
      this.editProDetails.educationalQualification =
        rowData.educationalQualification != null ? this.capitalizeFirstLetter(rowData.educationalQualification) : '';
      this.editProDetails.graduationPassingYear = rowData.graduationPassingYear;
      this.editProDetails.academiciInstitutionName = {
        'academic_institution_id': rowData.academicInstitutionId,
        'academic_institution_name': rowData.academiciInstitutionName
      }
      // (rowData.academiciInstitutionName != null) ? rowData.academiciInstitutionName.toLowerCase() : '';
      this.editProDetails.academicInstitutionCity =
        collegeCityIndex != -1
          ? this.cityDetails[collegeCityIndex].cityid + '_' + rowData.collegeCity
          : '';
      this.editProDetails.isPlaced =
        rowData.isPlaced != null ? rowData.isPlaced : '';
      this.editProDetails.pursuingPostGraduate =
        rowData.pursuingPostGraduate != null
          ? rowData.pursuingPostGraduate
          : '';
      this.editProDetails.fatherName = rowData.fatherName != null ? this.capitalizeFirstLetter(rowData.fatherName) : '';
      this.editProDetails.aadharNumber = rowData.aadharNumber;
      this.editProDetails.motherName = rowData.motherName != null ? this.capitalizeFirstLetter(rowData.motherName) : '';
      this.editProDetails.guardianName = rowData.guardianName != null ? this.capitalizeFirstLetter(rowData.guardianName) : '';
      this.editProDetails.stateId = stateIndex != -1 ? this.stateDetails[stateIndex].stateid + '_' + this.stateDetails[stateIndex].state : '';
      // if (currentLocationIndex != -1) {
      //   this.FilterCity(
      //     this.stateDetails[stateIndex].stateid +
      //     '_' +
      //     this.stateDetails[stateIndex].state
      //   );
      // }


      this.editProDetails.pincode = rowData.pincode;
      this.editProDetails.subject = rowData.subject;
      this.editProDetails.percentageMarks = rowData.percentageMarks;
      this.editProDetails.disabilityType =
        rowData.disabilityType != null ? rowData.disabilityType : '';
      this.editProDetails.isExperience = rowData.isExperience;
      this.editProDetails.experienceYears = rowData.experienceYears;
      this.editProDetails.employer1 = rowData.employer1 != null ? this.capitalizeFirstLetter(rowData.employer1) : '';
      this.editProDetails.employer2 = rowData.employer2 != null ? this.capitalizeFirstLetter(rowData.employer2) : '';
      this.editProDetails.placedOrganization =
        rowData.placedOrganizationId + '_' + rowData.placedOrganization;
      this.editProDetails.sector = rowData.sectorName;
      this.editProDetails.designation = rowData.designation != null ? this.capitalizeFirstLetter(rowData.designation) : '';
      this.editProDetails.joiningMonth = rowData.joiningMonth;
      this.editProDetails.status = rowData.status;
      this.editProDetails.postGraduationQualification =
        rowData.postGraduationQualification;
      this.editProDetails.postGraduationInstitution = {
        'academic_institution_id': (postGraduationInstitutionId != '')? this.collegeDetails[postGraduationInstitutionId].academic_institution_id: '',
        'academic_institution_name': rowData.postGraduationInstitution
      };
      this.editProDetails.postGraduationPassingYear =
        rowData.postGraduationPassingYear;
      // this.editProDetails.languageKnown = JSON.stringify(selectKeyLanguages);
      this.editProDetails.caste = rowData.caste != null ? this.capitalizeFirstLetter(rowData.caste) : '';
      this.editProDetails.alternateNumber = rowData.alternateNumber;
      this.editProDetails.vaccinationStatus = rowData.vaccinationStatus
      if (rowData.vaccinationStatus == 'No') {
        this.editProDetails.uploadVaccinationCertificate = '';
        this.editProDetails.dubUploadVaccinationCertificate = '';
      } else {
        this.editProDetails.uploadVaccinationCertificate =
          rowData.vaccinationcertificatefilename;
        this.editProDetails.dubUploadVaccinationCertificate =
          rowData.vaccinationcertificatefilename;
      }
      if ((rowData.vaccinationStatus == 'Yes' && this.editProDetails.uploadVaccinationCertificate == null) || (rowData.vaccinationStatus == 'Yes' && this.editProDetails.uploadVaccinationCertificate == '')) {
        this.proUploadOption = false;
      } else {
        this.proUploadOption = true;
      }
      this.editProDetails.selectedKeyLanguages = selectKeyLanguages;

      this.editProDetails.dob = moment(rowData.dob).format('YYYY-MM-DD');
      this.editProDetails.insertedBy = rowData.insertedBy;

      console.log(this.cityDetails);
      let cityFilter = [];
      this.cityDetails.forEach((el, ix) => {
        if (rowData.stateId == el.stateid) {
          cityFilter.push(el);
        }
      });

      console.log(cityFilter);

      const citySorted = cityFilter.sort((a: any, b: any) =>
        a.cityname > b.cityname ? 1 : -1
      );
      this.filterCityNameList = citySorted;

      let currentLoc = '';
      if (cityIndex != -1 && cityIndex != undefined) {
        currentLoc = this.humanize(this.cityDetails[cityIndex].cityname);
      }

      this.editProDetails.currentLocation =
        (currentLocationIndex != -1 && currentLocationIndex != undefined)
          ? this.cityDetails[currentLocationIndex].cityid + '_' + rowData.currentLocation.trim()
          : '';
      ($('#edit_user_pro_details') as any).modal('show');
      console.log(this.editProDetails.currentLocation);
      $('#currentloc_pro').val(this.editProDetails.currentLocation);
      $('.spinner').hide();

      // this.collegeService.getFilterCity(rowData.stateId).subscribe({
      //   next: (response) => {
      //     $('.spinner').hide();
      //     debugger
      //     if (response.data != null) {
      //       const citySorted = response.data.sort((a: any, b: any) =>
      //         a.cityname > b.cityname ? 1 : -1
      //       );
      //       this.editProDetails.currentLocation = "";
      //       this.filterCityNameList = citySorted;
      // this.editProDetails.currentLocation =
      //   currentLocationIndex != -1
      //     ? this.cityDetails[currentLocationIndex].cityid + '_' + this.cityDetails[currentLocationIndex].cityname.trim()
      //     : '';
      // ($('#edit_user_pro_details') as any).modal('show');
      // console.log(this.editProDetails.currentLocation);
      // $('#currentloc_pro').val(this.editProDetails.currentLocation);


      //     }
      //   },
      //   error: (response) => {
      //     $('.spinner').hide();
      //     this.messageService.add({
      //       severity: 'error',
      //       summary: 'Error',
      //       detail:
      //         response.error.message == null
      //           ? response.error.error
      //           : response.error.message,
      //     });
      //   },
      // });
    }
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  @Input() get selectedCoordinatorColumns(): any[] {
    return this._coordinatorsSelectedColumns;
  }

  set selectedCoordinatorColumns(val: any[]) {
    this._coordinatorsSelectedColumns = this.coordinatorscols.filter((col) =>
      val.includes(col)
    );
  }

  /* Display state list*/
  listOfState() {
    this.collegeService.getState().subscribe((response: any) => {
      if (response.data != null) {
        const stateSorted = response.data.sort((a: any, b: any) =>
          a.state > b.state ? 1 : -1
        );
        this.stateDetails = stateSorted;
        this.listOfCity();
      }
    });
  }


  dotAfterCaptilize(input, id) {

    if (input && input.length >= 1) {
      var firstChar = input.charAt(0);
      var remainingStr = input.slice(1);
      input = firstChar.toUpperCase() + remainingStr;
    }

    var name = input;
    name = name.replace(/\b[a-z]/g, function (letter) {
      return letter.toUpperCase();
    });

    $('#' + id).val(name);
  }


  FilterCity(value: any) {
    let stateDetails = value.split('_', 2);
    $('.spinner').show();
    this.collegeService.getFilterCity(stateDetails[0]).subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.data != null) {
          const citySorted = response.data.sort((a: any, b: any) =>
            a.cityname > b.cityname ? 1 : -1
          );
          this.filterCityNameList = citySorted;
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

  /* list Of City */
  listOfCity() {
    this.collegeService.getCity().subscribe((response: any) => {
      if (response.data != null) {
        const citySorted = response.data.sort((a: any, b: any) =>
          a.cityname > b.cityname ? 1 : -1
        );
        this.cityDetails = citySorted;
      }
    });
  }

  /* Display college list*/
  listOfColleges() {
    this.commonservice.getCollege().subscribe((response) => {
      response.data.forEach((elem: any, index: any) => {
        // if (elem.status == 'Active') {
        this.collegeDetails.push({
          academic_institution_id: elem.academicInstitutionId,
          academic_institution_name: elem.academicInstitutionName,
        });
        // }

      });

      const academicSorted = this.collegeDetails.sort((a: any, b: any) =>
        a.academic_institution_name > b.academic_institution_name ? 1 : -1
      );
      this.collegeDetails = academicSorted;
      debugger
      this.listOfState();
    });
  }


  listOfInstantUrl() {

    this.projectService.getProjectMangaerList().subscribe((data) => {
      let instants: any = [];
      data.data.forEach((elm, inx) => {
        let lastname = (elm.lastname != null) ? elm.lastname : '';
        instants.push({
          item_id: elm.userid,
          item_text: elm.firstname + ' ' + lastname,
        });
      });
      this.listOfInstantUrls = instants;
    });
  }

  exportall(extType) {
    let userData;
    debugger
    if (this.selectedUserDetails.length > 0) {
      userData = this.selectedUserDetails;
    } else {
      if (this._searchedColumns.length > 0) {
        userData = this.backUpUserFilterRecords;
      } else {
        userData = [];
      }
    }
    var header = [];
    this._selectedColumns.forEach((ele, indx) => {
      header.push(ele.field);
    });
    if (userData.length > 0) {
      let additionalFieldvalues = [];
      userData.forEach((elem, indx) => {
        if (!additionalFieldvalues.hasOwnProperty(elem.id)) {
          additionalFieldvalues[elem.id] = {};
        }
        header.forEach((aelem, ainx) => {
          if (aelem.trim() == 'academicInstitutionName') {
            let aeelems = this.humanize(aelem);
            // let aeelems = aeelem.replace(/\s/g, '');
            additionalFieldvalues[elem.id][aeelems] = (elem['academiciInstitutionName'] != null) ? elem['academiciInstitutionName'] : "";
          } else if (aelem.trim() == 'markPercent') {
            let aeelems = this.humanize(aelem);
            // let aeelems = aeelem.replace(/\s/g, '');
            additionalFieldvalues[elem.id][aeelems] = (elem['percentageMarks'] != null) ? elem['percentageMarks'] : "";
          } else if (aelem.trim() == 'typeofDisability') {
            let aeelems = this.humanize(aelem);
            // let aeelems = aeelem.replace(/\s/g, '');
            additionalFieldvalues[elem.id][aeelems] = (elem['disabilityType'] != null) ? elem['disabilityType'] : "";
          } else if (aelem.trim() == 'insertedtime') {
            // let aeelem = this.humanize(aelem);
            additionalFieldvalues[elem.id]['Register Date'] = (elem['insertedtime'] != null) ? elem['insertedtime'] : "";
          } else if (aelem.trim() == 'address') {
            additionalFieldvalues[elem.id]['College Address'] = (elem['address'] != null) ? elem['address'] : "";
          } else if (aelem.trim() == 'dob') {
            additionalFieldvalues[elem.id]['DOB'] = (elem['dob'] != null) ? elem['dob'] : "";
          } else if (aelem.trim() == 'collegestate') {
            additionalFieldvalues[elem.id]['College State'] = (elem['collegestate'] != null) ? elem['collegestate'] : "";
          } else if (aelem.trim() == 'tponame') {
            additionalFieldvalues[elem.id]['TPO Name'] = (elem['tponame'] != null) ? elem['tponame'] : "";
          } else if (aelem.trim() == 'kamname') {
            additionalFieldvalues[elem.id]['KAM Name'] = (elem['kamname'] != null) ? elem['kamname'] : "";
          } else if (aelem.trim() == 'vaccinationcertificatefilename') {
            additionalFieldvalues[elem.id]['Vaccination Certificate Filename'] = (elem['vaccinationcertificatefilename'] != null) ? elem['vaccinationcertificatefilename'] : "";
          } else {
            let aeelems = this.humanize(aelem);
            // let aeelems = aeelem.replace(/\s/g, '');
            additionalFieldvalues[elem.id][aeelems] = (elem[aelem] == null) ? "" : elem[aelem];
          }
        });

      });

      let farray: any = [];
      additionalFieldvalues.forEach((elll, iii) => {
        farray.push(elll)
      });

      let wb = xlsx.utils.book_new();
      const ws = xlsx.utils.json_to_sheet(farray);
      var colNum = xlsx.utils.decode_col("P"); //decode_col converts Excel col name to an integer for col #
      var colDate = xlsx.utils.decode_col("BB");
      var fmt = 0; // or '"$"#,##0.00_);[Red]\\("$"#,##0.00\\)' or any Excel number format
      var datfmt = "dd/mm/yyyy;@";
      var range = xlsx.utils.decode_range(ws['!ref']);
      for (var i = range.s.r + 1; i <= range.e.r; ++i) {
        var ref = xlsx.utils.encode_cell({ r: i, c: colNum });
        var refDate = xlsx.utils.encode_cell({ r: i, c: colDate });
        if (!ws[ref]) continue;
        ws[ref].z = fmt;
        ws[ref].t = 'n';
        if (!ws[refDate]) continue;
        ws[refDate].t = 'n';
        ws[refDate].z = datfmt;
      }
      const workbook = {
        Sheets: { 'User-Management-Details': ws },
        SheetNames: ['User-Management-Details'],
      };

      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      if (extType != 'CSV') {
        this.saveAsExcelFile(excelBuffer, 'User-Management-Details');
      } else {
        let EXCEL_TYPE =
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.csv';
        const data: Blob = new Blob([excelBuffer], {
          type: EXCEL_TYPE,
        });

        FileSaver.saveAs(data, 'User-Management-Details' + EXCEL_EXTENSION);
        this.selectedUserDetails = [];
      }
    } else {
      let head = {
        "headers": header
      }
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'File getting ready in background.',
      });
      this.UsermanagementService.exportAllFile(this.currentLoginUserId, head, extType).subscribe({
        next: response => {
          if (response.status.toLowerCase() == "success") {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'From Notification you can download the file.',
            });
            this.UsermanagementService.mySubject.next('');
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


  // // Student And Professional Export
  exportallFields() {
    console.log("Selected Users ", this.selectedUserDetails)
    let userIds;
    if (this.selectedUserDetails.length > 0) {
      userIds = this.selectedUserDetails.map((x: { id: any }) => x.id);
    } else {
      if (this._searchedColumns.length > 0) {
        userIds = this.userDetails.map((x: { id: any }) => x.id);
      } else {
        userIds = [];
      }
    }
    if (userIds.length > 0) {
      $('.spinner').show();

  this.UsermanagementService.exportAllExcelFields(userIds, this.currentLoginUserId).subscribe({
    next: response => {
debugger
      if (response.status.toLowerCase() == "success") {
        $('.spinner').hide();
        let headercaps: any = [];
        let arruserdata: any = [];
        // let Arr: any = [];
        let additionalFieldvalues = [];
        console.log("Users Response ", response.data)

        var header = ['gttId', "firstName", "lastName", "gender", "dob", "maritalStatus", "email", "mobile", "whatsappNumber", "password", "confirmPassword", "roleName", "isGraduated", "collegeCity", "academicInstitutionName", "aadharNumber", "educationalQualification", "graduationPassingYear", "subject", "profession", "currentLocation", "isPlaced", "vaccinationStatus", "termsAndConditions", "caste", "placedOrganization", "designation", "joiningMonth", "pursuingPostGraduate", "postGraduationQualification", "postGraduationPassingYear", "postGraduationInstitution", "alternateNumber", "fatherName", "motherName", "guardianName", "pincode", "typeofDisability ", "markPercent", "languageKnown", "isExperience", "experienceYears", "employer1", "employer2", "status", "stateName", "projectName", "Father Name", "Mother Name", "Total members in the family", "Address", "Pan Number", "Religion", "Certification Date", "Testimonials", "Caste /Category", "Whatsapp Group Name", "Total Work experience", "Spouse Name", "Pincode", "PG Degree Name", "PG College Name", "Do you have PAN card?", "District", "Is Aadhar linked With your phone number?", "PG University Name(STU)", "PG Passing Year(STU)", "Do you have all original graduation mark sheets and certificate with you?", "Please specify, which document you do not have?"];
        response.data.forEach((elem, indx) => {
          // Arr = [];
          var userdata = response.data[indx].user
          arruserdata.push(userdata)
          // console.log(arruserdata)


          // var header = Object.keys(response.data[indx].user).map(function (
          //   key: string
          // ) {
          //   return key;
          // });

          // var fvalue = Object.values(response.data[indx].user)

          // header.forEach((elee: any, key: any) => {
          //   headercaps = this.humanize(elee);
          //   Arr.push(headercaps)
          // });

          if (!additionalFieldvalues.hasOwnProperty(elem.user.id)) {
            additionalFieldvalues[elem.user.id] = {};
          }

          if (elem.projectAddtionalFields.length > 0) {

            header.forEach((aelem, ainx) => {
              if (aelem.trim() == 'academicInstitutionName') {
                additionalFieldvalues[elem.user.id][aelem] = (elem.user['academiciInstitutionName'] != null) ? elem.user['academiciInstitutionName'] : "";
              } else if (aelem.trim() == 'markPercent') {
                additionalFieldvalues[elem.user.id][aelem] = (elem.user['percentageMarks'] != null) ? elem.user['percentageMarks'] : "";
              } else if (aelem.trim() == 'typeofDisability') {
                additionalFieldvalues[elem.user.id][aelem] = (elem.user['disabilityType'] != null) ? elem.user['disabilityType'] : "";
              } else {
                additionalFieldvalues[elem.user.id][aelem] = (elem.user[aelem] == null) ? "" : elem.user[aelem];
              }
            });


            // elem.projectAddtionalFields[0].forEach((addElm, addInx) => {
            //   let expotvalue = addElm.fields.map((x: { documentValue: any }) => x.documentValue);
            //   let expotheader = addElm.fields.map((x: { documentFieldName: any }) => x.documentFieldName);
            //   expotheader.forEach((heh, exin) => {
            //     let Projectsname = [];
            //     if (elem.projectAddtionalFields.length > 0) {
            //       Projectsname = Object.keys(elem.projectAddtionalFields).map(
            //         function (k) {
            //           return elem.projectAddtionalFields[k].projectname;
            //         }
            //       );
            //       additionalFieldvalues[elem.user.id]['projectName'] = Projectsname.toString()
            //     }
            //     additionalFieldvalues[elem.user.id][heh] = expotvalue[exin];
            //   });



            // });

            let expotvalue = elem.projectAddtionalFields[0].fields.map((x: { documentValue: any }) => x.documentValue);
            let expotheader = elem.projectAddtionalFields[0].fields.map((x: { documentFieldName: any }) => x.documentFieldName);
            expotheader.forEach((heh, exin) => {
              // let Projectsname = [];
              // if (elem.projectAddtionalFields.length > 0) {
              //   Projectsname = Object.keys(elem.projectAddtionalFields[0]).map(
              //     function (k) {
              //       return elem.projectAddtionalFields[k].projectname;
              //     }
              //   );

              // }

              additionalFieldvalues[elem.user.id][heh] = (expotvalue[exin] != null) ? expotvalue[exin] : "";
            });

            additionalFieldvalues[elem.user.id]['projectName'] = elem.projectAddtionalFields[0].projectname


            // });
          } else {

            header.forEach((aelem, ainx) => {
              if (aelem.trim() == 'academicInstitutionName') {
                additionalFieldvalues[elem.user.id][aelem] = (elem.user['academiciInstitutionName'] != null) ? elem.user['academiciInstitutionName'] : "";
              } else if (aelem.trim() == 'markPercent') {
                additionalFieldvalues[elem.user.id][aelem] = (elem.user['percentageMarks'] != null) ? elem.user['percentageMarks'] : "";
              } else if (aelem.trim() == 'typeofDisability') {
                additionalFieldvalues[elem.user.id][aelem] = (elem.user['disabilityType'] != null) ? elem.user['disabilityType'] : "";
              } else {
                additionalFieldvalues[elem.user.id][aelem] = (elem.user[aelem] == null) ? "" : elem.user[aelem];
              }
            });
          }
        });

        let farray: any = [];
        additionalFieldvalues.forEach((elll, iii) => {
          farray.push(elll)
        });


        let wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(farray);
        var colNum = xlsx.utils.decode_col("P"); //decode_col converts Excel col name to an integer for col #
        var colDate = xlsx.utils.decode_col("BB");
        var fmt = 0; // or '"$"#,##0.00_);[Red]\\("$"#,##0.00\\)' or any Excel number format
        var datfmt = "dd/mm/yyyy;@";
        /* get worksheet range */
        var range = xlsx.utils.decode_range(ws['!ref']);
        for (var i = range.s.r + 1; i <= range.e.r; ++i) {
          /* find the data cell (range.s.r + 1 skips the header row of the worksheet) */
          var ref = xlsx.utils.encode_cell({ r: i, c: colNum });
          var refDate = xlsx.utils.encode_cell({ r: i, c: colDate });
          /* if the particular row did not contain data for the column, the cell will not be generated */
          if (!ws[ref]) continue;
          // /* `.t == "n"` for number cells */
          // if (ws[ref].t != 'n') continue;
          /* assign the `.z` number format */
          ws[ref].z = fmt;
          ws[ref].t = 'n';
          // ws[refDate].z = datfmt;
          // ws[refDate].t = 'w';
          ws[refDate].t = 'n';
          ws[refDate].z = datfmt;
        }


        // farray.forEach((ele, indx) => {
        //   let rowNo = indx + 2;
        //   worksheet['N' + rowNo].z = 0;
        // });

        const workbook = {
          Sheets: { 'User-Management-Details': ws },
          SheetNames: ['User-Management-Details'],
        };

        const excelBuffer: any = xlsx.write(workbook, {
          bookType: 'xlsx',
          type: 'array',
        });
        this.saveAsExcelFile(excelBuffer, 'User-Management-Details');
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


  exportallFieldscsv() {
    let userIds;
    if (this.selectedUserDetails.length > 0) {
      userIds = this.selectedUserDetails.map((x: { id: any }) => x.id);
    } else {
      if (this._searchedColumns.length > 0) {
        userIds = this.userDetails.map((x: { id: any }) => x.id);
      } else {
        userIds = [];
      }
    }
    if (userIds.length > 0) {
      $('.spinner').show();
      this.UsermanagementService.exportAllExcelFields(userIds, this.currentLoginUserId).subscribe({
        next: response => {

          if (response.status.toLowerCase() == "success") {
            $('.spinner').hide();
            let headercaps: any = [];
            let arruserdata: any = [];
            // let Arr: any = [];
            let additionalFieldvalues = [];

            var header = ['gttId', "firstName", "lastName", "gender", "dob", "maritalStatus", "email", "mobile", "whatsappNumber", "password", "confirmPassword", "roleName", "isGraduated", "collegeCity", "academicInstitutionName", "aadharNumber", "educationalQualification", "graduationPassingYear", "subject", "profession", "currentLocation", "isPlaced", "vaccinationStatus", "termsAndConditions", "caste", "placedOrganization", "designation", "joiningMonth", "pursuingPostGraduate", "postGraduationQualification", "postGraduationPassingYear", "postGraduationInstitution", "alternateNumber", "fatherName", "motherName", "guardianName", "pincode", "typeofDisability ", "markPercent", "languageKnown", "isExperience", "experienceYears", "employer1", "employer2", "status", "stateName", "projectName", "Father Name", "Mother Name", "Total members in the family", "Address", "Pan Number", "Religion", "Certification Date", "Testimonials", "Caste /Category", "Whatsapp Group Name", "Total Work experience", "Spouse Name", "Pincode", "PG Degree Name", "PG College Name", "Do you have PAN card?", "District", "Is Aadhar linked With your phone number?", "PG University Name(STU)", "PG Passing Year(STU)", "Do you have all original graduation mark sheets and certificate with you?", "Please specify, which document you do not have?"];
            response.data.forEach((elem, indx) => {
              // Arr = [];
              var userdata = response.data[indx].user
              arruserdata.push(userdata)
              // console.log(arruserdata)


              // var header = Object.keys(response.data[indx].user).map(function (
              //   key: string
              // ) {
              //   return key;
              // });

              // var fvalue = Object.values(response.data[indx].user)

              // header.forEach((elee: any, key: any) => {
              //   headercaps = this.humanize(elee);
              //   Arr.push(headercaps)
              // });

              if (!additionalFieldvalues.hasOwnProperty(elem.user.id)) {
                additionalFieldvalues[elem.user.id] = {};
              }

              if (elem.projectAddtionalFields.length > 0) {

                header.forEach((aelem, ainx) => {
                  if (aelem.trim() == 'academicInstitutionName') {
                    additionalFieldvalues[elem.user.id][aelem] = (elem.user['academiciInstitutionName'] != null) ? elem.user['academiciInstitutionName'] : "";
                  } else if (aelem.trim() == 'markPercent') {
                    additionalFieldvalues[elem.user.id][aelem] = (elem.user['percentageMarks'] != null) ? elem.user['percentageMarks'] : "";
                  } else if (aelem.trim() == 'typeofDisability') {
                    additionalFieldvalues[elem.user.id][aelem] = (elem.user['disabilityType'] != null) ? elem.user['disabilityType'] : "";
                  } else {
                    additionalFieldvalues[elem.user.id][aelem] = (elem.user[aelem] == null) ? "" : elem.user[aelem];
                  }
                });

                elem.projectAddtionalFields.forEach((addElm, addInx) => {
                  let expotvalue = addElm.fields.map((x: { documentValue: any }) => x.documentValue);
                  let expotheader = addElm.fields.map((x: { documentFieldName: any }) => x.documentFieldName);
                  expotheader.forEach((heh, exin) => {
                    let Projectsname = [];
                    if (elem.projectAddtionalFields.length > 0) {
                      Projectsname = Object.keys(elem.projectAddtionalFields).map(
                        function (k) {
                          return elem.projectAddtionalFields[k].projectname;
                        }
                      );
                      let projectsNames = [...new Set(Projectsname)];
                      additionalFieldvalues[elem.user.id]['projectName'] = projectsNames.toString()
                    }
                    additionalFieldvalues[elem.user.id][heh] = (expotvalue[exin] != null) ? expotvalue[exin] : "";
                  });
                });

              } else {

                header.forEach((aelem, ainx) => {
                  if (aelem.trim() == 'academicInstitutionName') {
                    additionalFieldvalues[elem.user.id][aelem] = (elem.user['academiciInstitutionName'] != null) ? elem.user['academiciInstitutionName'] : "";
                  } else if (aelem.trim() == 'markPercent') {
                    additionalFieldvalues[elem.user.id][aelem] = (elem.user['percentageMarks'] != null) ? elem.user['percentageMarks'] : "";
                  } else if (aelem.trim() == 'typeofDisability') {
                    additionalFieldvalues[elem.user.id][aelem] = (elem.user['disabilityType'] != null) ? elem.user['disabilityType'] : "";
                  } else {
                    additionalFieldvalues[elem.user.id][aelem] = (elem.user[aelem] == null) ? "" : elem.user[aelem];
                  }
                });
              }
            });

            let farray: any = [];
            additionalFieldvalues.forEach((elll, iii) => {
              farray.push(elll)
            });


            let wb = xlsx.utils.book_new();
            const ws = xlsx.utils.json_to_sheet(farray);
            var colNum = xlsx.utils.decode_col("P"); //decode_col converts Excel col name to an integer for col #
            var colDate = xlsx.utils.decode_col("BB");
            var fmt = 0; // or '"$"#,##0.00_);[Red]\\("$"#,##0.00\\)' or any Excel number format
            var datfmt = "dd/mm/yyyy;@";
            /* get worksheet range */
            var range = xlsx.utils.decode_range(ws['!ref']);
            for (var i = range.s.r + 1; i <= range.e.r; ++i) {
              /* find the data cell (range.s.r + 1 skips the header row of the worksheet) */
              var ref = xlsx.utils.encode_cell({ r: i, c: colNum });
              var refDate = xlsx.utils.encode_cell({ r: i, c: colDate });
              /* if the particular row did not contain data for the column, the cell will not be generated */
              if (!ws[ref]) continue;
              // /* `.t == "n"` for number cells */
              // if (ws[ref].t != 'n') continue;
              /* assign the `.z` number format */
              ws[ref].z = fmt;
              ws[ref].t = 'n';
              // ws[refDate].z = datfmt;
              // ws[refDate].t = 'w';
              ws[refDate].t = 'n';
              ws[refDate].z = datfmt;
            }

            const workbook = {
              Sheets: { 'User-Management-Details': ws },
              SheetNames: ['User-Management-Details'],
            };

            const excelBuffer: any = xlsx.write(workbook, {
              bookType: 'csv',
              type: 'array',
            });

            let EXCEL_TYPE =
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            let EXCEL_EXTENSION = '.csv';
            const data: Blob = new Blob([excelBuffer], {
              type: EXCEL_TYPE,
            });

            FileSaver.saveAs(data, 'User-Management-Details' + EXCEL_EXTENSION);
            this.selectedUserDetails = [];

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


  // exportExcel() {
  //   debugger
  //   let stuProExcelDetails: any = [];
  //   let columns: any = [];

  //   this.selectedUserDetails.forEach((elem, inx) => {
  //     if (!stuProExcelDetails.hasOwnProperty(inx)) {
  //       stuProExcelDetails[inx] = {};
  //     }
  //     this._selectedColumns.forEach((elm, indx) => {
  //       stuProExcelDetails[inx][elm.header] = elem[elm.field];
  //     });
  //   });

  //   if (this.selectedUserDetails.length == 0) {
  //     this._selectedColumns.forEach((elm, indx) => {
  //       columns[elm.header] = '';
  //     });
  //     stuProExcelDetails.push(columns);
  //   }
  //   console.log(stuProExcelDetails)

  //   const worksheet = xlsx.utils.json_to_sheet(stuProExcelDetails);
  //   const workbook = {
  //     Sheets: { 'User-Management-Details': worksheet },
  //     SheetNames: ['User-Management-Details'],
  //   };
  //   const excelBuffer: any = xlsx.write(workbook, {
  //     bookType: 'xlsx',
  //     type: 'array',
  //   });
  //   this.saveAsExcelFile(excelBuffer, 'User-Management-Details');
  // }

  exportPdf(dt: any) {
    var doc: any = new jsPDF.default('p', 'pt', 'a1', true);
    this.exportColumns = [];
    Object.keys(this._selectedColumns).forEach((key) => {
      this.exportColumns.push({
        title: this._selectedColumns[key].header,
        dataKey: this._selectedColumns[key].field,
      });
    });
    doc.autoTable(this.exportColumns, this.selectedUserDetails, {
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
    doc.save('User-Management-Details.pdf');
  }


  downloadTemplate() {
    // import("xlsx").then(xlsx => {
    this.expotheader = this.cols.map((x: { header: any }) => x.header);

    const worksheet = xlsx.utils.json_to_sheet([this.expotheader], {
      skipHeader: true,
    });
    const workbook = {
      Sheets: { 'Bulk User': worksheet },
      SheetNames: ['Bulk User'],
    };
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    //this.saveAsExcelFile(excelBuffer, "User-Details");
    this.saveAsExcelFile(excelBuffer, 'BulkUserRegistrationTemplate');
    // });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    this.selectedCoordinatorDetails = [];
    this.selectedUserDetails = [];
    this.selectedUserAdminDetails = [];
  }

  showStatus() {
    this.showSta = true;
  }

  // Coordinators Change Status
  onUserChangeStatus() {
    debugger
    $('.spinner').show();
    console.log(this.selectedUserDetails);
    let gttIds = this.selectedUserDetails.map((x: { gttId: any }) => x.gttId);
    let params = {
      status: this.userModel.status,
      studentEnrolmentIds: gttIds,
    };

    this.UsermanagementService.userChangeStatus(params).subscribe({
      next: (changeStatusResponse) => {
        if (changeStatusResponse.status.toLowerCase() == 'success') {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: changeStatusResponse.message,
          });
          ($('#stuprochangestatus') as any).modal('hide');
          let paramRoleIds = '';
          if (this.loggedInRoleName == 'GTT_ADMIN') {
            paramRoleIds = this.getStuProRoleIds();
          } else {
            paramRoleIds = String(this.loggedInRoleId);
          }
          this.StatusModal();
          this.userDetails = [];
          this.selectedUserDetails = [];
          this.getUserManagementNewDetails(paramRoleIds, this.pageNumber, this.showCount);
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

  SendresetPassword() {
    $('.spinner').show();
    let emailId = this.selectedUserDetails.map((x: { email: any }) => x.email);
    this.passwordReset.emails = emailId;
    this._loginservice.forgetpassword(this.passwordReset.emails).subscribe({
      next: (data) => {
        $('.spinner').hide();
        if (data.status == 200) {
          this.selectedUserDetails = [];
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: data.message,
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

  /* Display Student list*/
  studentNameList() {
    this.UsermanagementService.getStudentList().subscribe((data) => {
      const student = data.data.sort((a: any, b: any) =>
        a.firstName > b.firstName ? 1 : -1
      );
      //this.cityddl.sort();
      this.studentddl = student;
    });
  }
  /* Display Project list*/
  projectNameList() {
    this.UsermanagementService.getProjectList().subscribe((data) => {

      let projects = [];
      data.data.forEach((elem: any, index: number) => {
        if (elem.project_name != null && elem.status == 'Active') {
          projects.push(elem);
        }
      });

      const project = projects.sort((a: any, b: any) =>
        a.project_name.toLowerCase() > b.project_name.toLowerCase() ? 1 : -1
      );

      this.projectddl = project;

    });
  }

  /* Display Program list*/
  programNameList() {
    this.UsermanagementService.getProgramList().subscribe((data) => {
      const program = data.data.sort((a: any, b: any) =>
        a.programname > b.programname ? 1 : -1
      );
      //this.cityddl.sort();
      this.programddl = program;
    });
  }
  /* Display Trainer list*/
  trainerNameList() {
    this.UsermanagementService.getTrainerList().subscribe((data) => {
      const trainer = data.data.sort((a: any, b: any) =>
        a.firstname > b.firstname ? 1 : -1
      );
      this.trainerddl = trainer;
      //this.cityddl.sort();
    });
  }
  /* Display Training Co-ordinator list*/
  trainingCoordinatorNameList() {
    this.UsermanagementService.getTrainingCoordinatorList().subscribe(
      (data) => {
        const trainingcor = data.data.sort((a: any, b: any) =>
          a.firstname > b.firstname ? 1 : -1
        );
        this.trainingcorddl = trainingcor;
        //this.cityddl.sort();
      }
    );
  }
  /* Display Batch list*/
  batchNameList() {
    this.UsermanagementService.getBatchList().subscribe((data) => {
      const batchsorted = data.data.sort((a: any, b: any) =>
        a.batch_code > b.batch_code ? 1 : -1
      );
      //this.cityddl.sort();
      batchsorted.forEach((elem: any, index: number) => {
        if (elem.batch_code != null) {
          this.batchddl.push(elem);
        }
      });
    });
  }
  /* Display projectmanager list*/
  projectmanagerNameList() {
    this.UsermanagementService.getProgramManagerList().subscribe((data) => {
      const projectmanager = data.data.sort((a: any, b: any) =>
        a.firstname > b.firstname ? 1 : -1
      );
      this.projectmanagerddl = projectmanager;
      //this.cityddl.sort();
    });
  }

  // projectmanagerNameList(value: any) {

  //   let projectddl = value.split("_", 2);
  //   this.UsermanagementService.getProgramManagerList(projectddl[0]).subscribe((response: any) => {
  //     if (response.data != null) {
  //       const projectmanager = response.data.sort((a: any, b: any) => a.firstname > b.firstname ? 1 : -1);
  //       this.projectmanagerddl = projectmanager
  //     }
  //   });
  // }

  /* Export User Admin Details */
  // ========================== //

  exportUserAdminPdf(at: any) {
    var doc: any = new jsPDF.default('p', 'pt', 'a1', true);
    this.userAdminExportColumns = [];
    Object.keys(this._selectedUserAdminColumns).forEach((key) => {
      this.userAdminExportColumns.push({
        title: this._selectedUserAdminColumns[key].header,
        dataKey: this._selectedUserAdminColumns[key].field,
      });
    });

    doc.autoTable(this.userAdminExportColumns, this.selectedUserAdminDetails, {
      bodyStyles: { valign: 'middle' },
      styles: { overflow: 'linebreak', columnWidth: '100' },
      columnStyles: {
        text: {
          cellWidth: 'wrap',
        },
        description: {
          cellWidth: '107',
        },
      },
    });
    doc.save('User-Admin-Details.pdf');
  }

  exportUserAdminExcel() {
    let userAdminExcelDetails: any = [];
    let columns: any = [];

    this.selectedUserAdminDetails.forEach((elem, inx) => {
      if (!userAdminExcelDetails.hasOwnProperty(inx)) {
        userAdminExcelDetails[inx] = {};
      }
      this._selectedUserAdminColumns.forEach((elm, indx) => {
        // let headerName = elm.header.replace(/\s/g, '');
        let headerName = elm.header;
        userAdminExcelDetails[inx][headerName] = elem[elm.field];
      });
    });

    if (this.selectedUserAdminDetails.length > 0) {
      userAdminExcelDetails = userAdminExcelDetails;
    } else {
      this._selectedUserAdminColumns.forEach((elm, indx) => {
        // let headerName = elm.header.replace(/\s/g, '');
        let headerName = elm.header;
        columns[headerName] = '';
      });
      userAdminExcelDetails.push(columns);
    }

    const worksheet = xlsx.utils.json_to_sheet(userAdminExcelDetails);
    const workbook = {
      Sheets: { 'User-Admin-Details': worksheet },
      SheetNames: ['User-Admin-Details'],
    };
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'User-Admin-Details');
  }

  exportUserAdminCSV() {
    let userAdminExcelDetails: any = [];
    let columns: any = [];

    this.selectedUserAdminDetails.forEach((elem, inx) => {
      if (!userAdminExcelDetails.hasOwnProperty(inx)) {
        userAdminExcelDetails[inx] = {};
      }
      this._selectedUserAdminColumns.forEach((elm, indx) => {
        // let headerName = elm.header.replace(/\s/g, '');
        let headerName = elm.header;
        userAdminExcelDetails[inx][headerName] = elem[elm.field];
      });
    });

    if (this.selectedUserAdminDetails.length > 0) {
      userAdminExcelDetails = userAdminExcelDetails;
    } else {
      this._selectedUserAdminColumns.forEach((elm, indx) => {
        // let headerName = elm.header.replace(/\s/g, '');
        let headerName = elm.header;
        columns[headerName] = '';
      });
      userAdminExcelDetails.push(columns);
    }

    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      filename: 'User-Admin-Details',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(userAdminExcelDetails);
    this.selectedUserAdminDetails = [];
  }

  // =========  End Export ========== //

  onAssignProject(formvalue: any, dt: any) {

    if (formvalue.valid) {
      let batch_program_id = this.projectAssign.batch_code.split('__');
      let student_ids = this.selectedUserDetails.map((x: { id: any }) => x.id);
      let params = {
        students: student_ids,
        project_id: +this.projectAssign.project_id,
        courses: this.listOfCourseIds,
        program_id: +batch_program_id[1],
        trainer_id: this.listOfTrainerIds,
        project_manager_id: +this.projectAssign.project_manager_id,
        training_coordinator_id: +this.projectAssign.training_coordinator_id,
        batch_id: this.listOfBatchCodes,
      };

      $('.spinner').show();
      this.UsermanagementService.addAssignProject(params).subscribe({
        next: (data) => {
          $('.spinner').hide();
          this.status = data.status;
          this.receivedmessage = data.message;
          if (this.status == 'Success') {
            this.successmsg = false;

            ($('#assignproject') as any).modal('hide');
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: data.message,
            });
            let paramRoleIds = this.getStuProRoleIds();
            this.getUserManagementNewDetails(paramRoleIds, this.pageNumber, this.showCount);
            this.selectedUserDetails = [];
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: data.message,
            });
          }
        },
        error: (data) => {
          //this.disable = false;
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

  getBatchProgramBasedOnProject(project: any) {
    let projectDetails = project.split('_', 2);
    $('.spinner').show();
    this.UsermanagementService.getBatchProgramBasedByProject(projectDetails[0]).subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.status == 'Success') {
          this.listOfBatches = [];
          this.listOfProjectManger = [];
          this.projectAssign.batch_code = '';
          this.projectAssign.project_manager_id = '';
          if (response.data.batch_names.length > 0) {
            response.data.batch_names.forEach((elem, indx) => {
              this.listOfBatches.push({
                batch_code: elem.batch_code,
                batch_name: elem.batch_name,
                program_id: elem.program_id
              });
            });
          }

          if (response.data.project_manager.length > 0) {
            response.data.project_manager.forEach((elem, indx) => {
              this.listOfProjectManger.push({
                project_manager_id: elem.project_manager_Id,
                project_manager_name: elem.project_Manager_name,
              });
            });
          }
        }
      },
      error: (ErrResponse) => {
        $('.spinner').hide();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: (ErrResponse.error.message == null) ? ErrResponse.statusText : ErrResponse.error.message,
        });
      },
    });

  }



  getCourseTrainerBasedOnBatch(bacthId: any) {
    let batch_program_id = bacthId.split('__');
    $('.spinner').show();
    this.getBatchResponse = {};
    this.UsermanagementService.getCourseTrainerBasedByBatch(batch_program_id[0], batch_program_id[1]).subscribe({
      next: (response) => {

        if (response.data != null && response.status == 'Success') {
          this.listOfBatchCodes = [];
          this.listOfCourseIds = [];
          this.listOfCourseNames = [];
          this.listOfTrainerIds = [];
          this.listOfTrainerNames = [];
          $('.spinner').hide();
          response.data.forEach((eleRes, eleIdx) => {
            this.listOfBatchCodes.push(eleRes.batch_id);
            eleRes.course_details.forEach((elem, inx) => {
              this.listOfCourseIds.push(elem.course_id);
              this.listOfCourseNames.push(elem.coure_name);
              elem.trainer_details.forEach((elm, ix) => {
                this.listOfTrainerIds.push(elm.trainer_id);
                this.listOfTrainerNames.push(elm.trainer_name);
              });
            });
          });

          this.listOfBatchCodes = [...new Set(this.listOfBatchCodes)];
          this.listOfCourseIds = [...new Set(this.listOfCourseIds)];
          this.listOfTrainerIds = [...new Set(this.listOfTrainerIds)];

          this.listOfCourseNames = [...new Set(this.listOfCourseNames)];
          this.listOfTrainerNames = [...new Set(this.listOfTrainerNames)];

          this.projectAssign.courses = this.listOfCourseNames.toString();
          this.projectAssign.trainer_id = this.listOfTrainerNames.toString();
        }
      },
      error: (data) => {
        $('.spinner').hide();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: data.error.message,
        });
      },
    });
  }


  /* Additional field view dowmload*/
  downloadadditionalfieldView() {
    const worksheet = xlsx.utils.json_to_sheet(this.finalProjectBasedReports);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'Additional Details');
  }
  attendanceNavigation() {
    this.router.navigate(['/attendance']);
  }
}
