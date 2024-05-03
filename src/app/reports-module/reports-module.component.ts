import { Component, Input, OnInit, ViewChild } from '@angular/core';
import * as FileSaver from 'file-saver';
import { MessageService } from 'primeng/api';
import { UsermanagementService } from 'src/app/services/user-management.service';
import * as jsPDF from 'jspdf';
import * as xlsx from 'xlsx';
import 'jspdf-autotable';
import { CommonService } from '../common.service';
import { CollegeService } from 'src/app/services/college.service';
import { Table } from 'primeng/table';
import { ExportToCsv } from 'export-to-csv';
import { DatePipe } from '@angular/common';
import mockdata from './mockdata.json';
import { ProgramDetailsService } from 'src/app/services/program-details.service';
import { Title } from '@angular/platform-browser';
import * as moment from 'moment';
import { event } from 'jquery';
import { PaginatorModule } from 'primeng/paginator';
import { DocumentVerificationService } from '../services/document-verification.service';
import { ProjectDetailsService } from 'src/app/services/project-details.service';

@Component({
  selector: 'app-reports-module',
  templateUrl: './reports-module.component.html',
  styleUrls: ['./reports-module.component.css'],
  providers: [MessageService, DatePipe],
})
export class ReportsModuleComponent implements OnInit {
  reportsList: any[];
  rangeDates: Date[];
  startDay: any;
  endDay: any;


  userRowNum: any = 10;
  showCount: any = 10;
  pageNumber: any = 0;
  dupPageNumber: any = 0;
  userTotalRecords: any = 0;
  paginationTotalRecords: any = 0;
  userTotalSearchRecords: any = 0;
  backUpDateFilterRecords: any = [];

  /* Project Summery Report */
  _projectBasedDefaultColumns: any[];
  _projectBasedDefaultColumnsCopy: any[];
  _projectBasedReportColumnHeader: any[];
  _projectBasedReportColumnDataKey: any[];
  _projectBasedReportColumnTitle: any[];
  selectedProjectBasedDetail: any = [];
  public finalProjectBasedReports: any = [];
  _projectBasedReportColumns: any = [];
  public _projectBasedFilter: any = [];
  exportProjectBased: string = 'Project-Based-Report';
  _projectBasedManagerList: any[];
  public projectBasedmanager: any = [];
  public dubFindReportDetails: any = [];
  public dateFilterSearch: boolean = false;
  public currentLoginUserId: number;

  public inValidRange: boolean;
  public listOfProjects: any = [];
  public selectedProjects: any = [];
  public listOfAllAdditionalFields: any = [];

  public additionalFields: any = [];
  public _selectedSearchAdditionalFields: any = [];

  public isSelectedProject: boolean = false;

  public mainFieldsCount: any = 0;
  public projectAdditionalFieldsCount: any = 0;
  public mainFieldsLimit: any = 0;
  public projectAdditionalFieldsLimit: any = 0;
  public totalFieldsCount: any = 0;
  public countDecrease: boolean = false;
  public activeProjects: any = [];
  public additionalFieldKeys: any = [];


  /* ----------------------------- */
  @ViewChild(Table) dt: Table;
  @ViewChild(Table) ct: Table;
  @ViewChild(Table) at: Table;
  @ViewChild('customPaginator', { static: false }) paginator: PaginatorModule;
  // columns: any = [];
  currentTab1: string = 'RegistrationReport';
  currentTab2: string = '';
  currentTab3: string = '';

  rightSideMenus: any = [];

  user: any = '';
  roleDetails: any = [];
  loggedInRoleId: number;
  roles: any = [];
  managerName: any = 'ALL';
  preSelectManager: any;
  preSelectOption: any;
  preSelectPagination: any;
  first = 0;
  public loggedInRoleName: string;
  public accessRoleNames: any = [];

  searchCols: any[];
  _selectedSearchColumns: any = [];
  _searchedColumns: any[] = [];
  searchError: boolean = false;
  manualSearchCols: any = [];

  constructor(
    public commonservice: CommonService,
    private titleService: Title,
    public programService: ProgramDetailsService,
    private UsermanagementService: UsermanagementService,
    private messageService: MessageService,
    public collegeService: CollegeService,
    public documentverificationService: DocumentVerificationService,
    public projectService: ProjectDetailsService,
  ) {
    this._projectBasedDefaultColumns = [
      { field: 'gttId', header: 'Gtt Id' },
      // { field: 'name', header: 'Name' },
      { field: 'firstName', header: 'First Name' },
      { field: 'lastName', header: 'Last Name' },
      { field: 'email', header: 'Email' },
      { field: 'mobile', header: 'Mobile' },
      { field: 'projectName', header: 'Project Name' },
      { field: 'projectManagerName', header: 'Project Manager Name' },
      { field: 'programName', header: 'Program Name' },
      { field: 'courseName', header: 'Course Name' },
      { field: 'batchName', header: 'Batch Name' },
      { field: 'registerDate', header: 'Register Date' },
    ];
    this._projectBasedDefaultColumnsCopy = this._projectBasedDefaultColumns;
    this._projectBasedFilter = [
      'gttId',
      'name',
      'mobile',
      'firstName',
      'lastName',
      'gender',
      'email',
      'dob',
      'projectName',
      'projectManagerName',
      'programName',
      'courseName',
      'batchName',
      'registerDate'
    ];

    /*Profile Name */
    this.user = localStorage.getItem('userId');
    this.currentLoginUserId = JSON.parse(this.user).id;
    this.roles = JSON.parse(localStorage.getItem('roles'));
    this.roleDetails = [];
    this.roles.forEach((elem, indx) => {
      let roleName = elem.role_name
        .replace(/\w+/g, function (txt) {
          return txt.toUpperCase();
        })
        .replace(/\s/g, '_');
      if (
        !['ROLE_ADMIN', 'STUDENT', 'PROFESSIONAL'].includes(roleName.trim())
      ) {
        this.roleDetails.push(elem);
      }
    });

    this.loggedInRoleId = JSON.parse(this.user).user_role.role_id;
    let loggedInRoleName = JSON.parse(this.user).user_role.role;
    this.loggedInRoleName = loggedInRoleName
      .replace(/\w+/g, function (txt) {
        return txt.toUpperCase();
      })
      .replace(/\s/g, '_');

    this.accessRoleNames = ['GTT_ADMIN', 'PROJECT_MANAGER'];
  }

  ngOnInit(): void {
    this.listOfPro();

    // this.getProjectSummeryReport('ALL');
    this.setTitle('TJM-Reports');
    this.projectNameList();
  }

  listOfPro() {
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
                        // this.listOfAllAdditionalFields.push(additionalFields);
                      }
                    }

                  });

                  let uNames = new Map(this.listOfAllAdditionalFields.map(s => [s.toLowerCase(), s]));
                  this.listOfAllAdditionalFields = [...uNames.values()];
                  this.getUserProjectBasedDetailReport('ALL', this.pageNumber, this.showCount);

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


  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  selectedProjectDetails($event: any) {
    this.rangeDates = [];
    this.startDay = null;
    this.endDay = null;
    this.preSelectPagination = this.pageNumber;
    this.preSelectManager = true;
    if (this.startDay != undefined && this.endDay != undefined) {
      this.getDateFilter($event);
    } else {

      if ($event == 'ALL') {
        this.preSelectOption = false;
        this.pageNumber = 0;
        this.preSelectPagination = 0;
      } else {
        this.preSelectOption = true;
      }

      this.getUserProjectBasedDetailReport($event, this.preSelectPagination, this.showCount);
    }
  }


  paginate(event) {

    this.userRowNum = event.rows;

    if (this.preSelectOption != true) {
      this.pageNumber = event.first / event.rows // Index of the new page if event.page not defined.
    }

    this.dupPageNumber = event.first / event.rows
    this.showCount = this.userRowNum;

    // this.selectedProjectBasedDetail = [];
    if (this.startDay != null || this.endDay != null) {
      this.getDateFilter(this.managerName);
      // if(this.pageNumber > 0){
      //   let countStartRec = this.pageNumber * this.showCount;
      //   let countEndRec = this.showCount * (this.pageNumber + 1);
      //   this.finalProjectBasedReports = this.backUpDateFilterRecords.slice(countStartRec, countEndRec);
      // }else{
      //   this.getDateFilter(this.managerName);
      // }
    } else if (this.managerName != null && this.managerName != 'ALL') {
      if (this.dupPageNumber > 0 && this.preSelectOption == true) {
        let countStartRec = this.dupPageNumber * this.showCount;
        let countEndRec = this.showCount * (this.dupPageNumber + 1);
        this.finalProjectBasedReports = this.backUpDateFilterRecords.slice(countStartRec, countEndRec);
      } else {
        this.pageNumber = 0;
        this.getUserProjectBasedDetailReport(this.managerName, this.preSelectPagination, this.showCount);
      }

    } else if (this._selectedSearchColumns.length > 0) {
      let countStartRec = this.pageNumber * this.showCount;
      let countEndRec = this.showCount * (this.pageNumber + 1);
      this.finalProjectBasedReports = this.backUpDateFilterRecords.slice(countStartRec, countEndRec);
    } else {
      this.getUserProjectBasedDetailReport('ALL', this.pageNumber, this.showCount);
    }
  }


  onFilter(event, dt) {
    console.log(event.filters);
    if (Object.keys(event.filters).length != 0) {
      console.log(event.filters.global.value.length);
      this.userTotalRecords = event.filteredValue.length;
      this.paginationTotalRecords = event.filteredValue.length;
    } else {
      this.userTotalRecords = this.userTotalSearchRecords;
      this.paginationTotalRecords = this.userTotalSearchRecords;
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
      case "startdate":
        return "Search ('YYYY-MM-DD')";
        break;
      case "enddate":
        return "Search ('YYYY-MM-DD')";
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
      this.getUserProjectBasedDetailReport('ALL', this.pageNumber, this.showCount);
    }
    this._searchedColumns = [];
    this._selectedSearchAdditionalFields = [];
    this.selectedProjects = [];
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

  onChangeSearchKey($event) {

    this.mainFieldsCount = this._selectedSearchColumns.length;
    this.totalFieldsCount = this.mainFieldsCount + this.projectAdditionalFieldsCount;
    console.log(this.totalFieldsCount);
    if (this.totalFieldsCount == 5) {
      this.mainFieldsLimit = this.mainFieldsCount;
      this.projectAdditionalFieldsLimit = this.projectAdditionalFieldsCount;
      this.countDecrease = true;
    } else {
      if (this.countDecrease == true) {
        this.mainFieldsLimit = this.mainFieldsCount + 10;
        this.projectAdditionalFieldsLimit = this.projectAdditionalFieldsCount + 10;
      }

    }


    let isProjectSelected = this._selectedSearchColumns.filter(function (el) {
      return el.field == 'projectName';
    });

    if (isProjectSelected.length == 0) {
      this.isSelectedProject = false;
      this._selectedSearchAdditionalFields = [];
      this.selectedProjects = [];
    }

    if (this._selectedSearchColumns.length == 1) {
      this.searchError = false;
    }
  }

  onChangeAdditionalSearchKey($event) {
    this.projectAdditionalFieldsCount = this._selectedSearchAdditionalFields.length;
    this.totalFieldsCount = this.mainFieldsCount + this.projectAdditionalFieldsCount;
    console.log(this.totalFieldsCount);
    if (this.totalFieldsCount == 5) {
      this.mainFieldsLimit = this.mainFieldsCount;
      this.projectAdditionalFieldsLimit = this.projectAdditionalFieldsCount;
      this.countDecrease = true;
    } else {
      if (this.countDecrease == true) {
        this.mainFieldsLimit = this.mainFieldsCount + 10;
        this.projectAdditionalFieldsLimit = this.projectAdditionalFieldsCount + 10;
      }
    }
  }

  changeProjects(searchCoulumns, projectValue) {
    let projectName = projectValue.value.split('___');
    searchCoulumns.search = projectName[1];
    this.isSelectedProject = false;
    this._selectedSearchAdditionalFields = [];
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

    var searchAdditionalCoulumns = [];
    this._selectedSearchAdditionalFields.forEach((column, index) => {
      searchAdditionalCoulumns.push(column);
    });

    var searchJsonArray = [];
    searchCoulumns.forEach((column, index) => {
      if (this._selectedSearchColumns.length != 1) {
        if (column.search && column.condition) {
          var obj = {
            Operation: index == 0 ? "" : column.condition,
            fieldName: column.field,
            value: column.search.trim(),
            flag: 0
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
            fieldName: (column.field == "batchName") ? 'batchcode' : column.field,
            value: column.search.trim(),
            flag: 0
          }
          searchJsonArray.push(obj);
        } else {
          this.searchError = true;
          return;
        }
      }
    });

    var searchAdditionalJsonArray = [];
    searchAdditionalCoulumns.forEach((column, index) => {
      if (this._selectedSearchAdditionalFields.length != 1) {
        if (column.search && column.condition) {
          var obj = {
            Operation: column.condition,
            fieldName: column.documentFieldName,
            value: column.search.trim(),
            flag: 1
          }
          searchAdditionalJsonArray.push(obj);
        } else {
          this.searchError = true;
          return;
        }
      } else {
        if (column.search) {
          var obj = {
            Operation: column.condition,
            fieldName: column.documentFieldName,
            value: column.search.trim(),
            flag: 1
          }
          searchAdditionalJsonArray.push(obj);
        } else {
          this.searchError = true;
          return;
        }
      }
    });

    let mergeSearchArray = [...searchJsonArray, ...searchAdditionalJsonArray];
    if (!this.searchError) {
      console.log(searchJsonArray);
      let searchJson = {
        Input: mergeSearchArray
      }

      $('.spinner').show();
      this.UsermanagementService.multiReportSearchUser(searchJson).subscribe({
        next: (response) => {
          $('.spinner').hide();

          if (response.status == 'Success') {
            this._searchedColumns = this._selectedSearchColumns;
            ($('#reportSearch') as any).modal('hide');

            let reportsData = [];
            response.data.forEach((el, ix) => {
              if (el.projectinfos == null) {
                reportsData.push({
                  'user': el.user,
                  'projectinfos': {
                    'projectId': null,
                    'projectname': null,
                    'programname': null,
                    'coursename': null,
                    'batchname': null,
                    'trainername': null,
                    'trainercoordinatorname': null,
                    'batch_based_details': null,
                    'fields': [],
                    'terms_url': null,
                    'terms_url_status': null,
                    'projectmanagername': null,
                  },
                  'fields': (el.fields == null) ? [] : el.fields
                })
              } else {
                reportsData.push({
                  'user': el.user,
                  'projectinfos': {
                    'projectId': el.projectinfos.projectId,
                    'projectname': el.projectinfos.projectname,
                    'programname': el.projectinfos.programname,
                    'coursename': el.projectinfos.coursename,
                    'batchname': el.projectinfos.batchname,
                    'trainername': el.projectinfos.trainername,
                    'trainercoordinatorname': el.projectinfos.trainercoordinatorname,
                    'batch_based_details': el.projectinfos.batch_based_details,
                    'fields': (el.fields == null) ? [] : el.fields,
                    'terms_url': el.projectinfos.terms_url,
                    'terms_url_status': el.projectinfos.terms_url_status,
                    'projectmanagername': el.projectinfos.projectmanagername,
                  },
                  'fields': (el.fields == null) ? [] : el.fields
                });
              }
            });


            this.reportsList = reportsData;
            debugger
            this.getProjectSummeryReport('ALL');
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


  getAdditionalFields() {

    this.isSelectedProject = true;

    // let response = {
    //   "code": 200,
    //   "data": [
    //     {
    //       "documentDetailId": 237,
    //       "documentFieldName": "Whatsapp Group Name",
    //       "projectId": 125,
    //       "isMandatory": 1,
    //       "isActive": 1,
    //       "recordStatus": 2,
    //       "insertedBy": 1
    //     },
    //     {
    //       "documentDetailId": 241,
    //       "documentFieldName": "PG Degree Name",
    //       "projectId": 125,
    //       "isMandatory": 1,
    //       "isActive": 1,
    //       "recordStatus": 2,
    //       "insertedBy": 1
    //     },
    //     {
    //       "documentDetailId": 242,
    //       "documentFieldName": "PG College Name",
    //       "projectId": 125,
    //       "isMandatory": 1,
    //       "isActive": 1,
    //       "recordStatus": 2,
    //       "insertedBy": 1
    //     },
    //     {
    //       "documentDetailId": 243,
    //       "documentFieldName": "PG University Name(STU)",
    //       "projectId": 125,
    //       "isMandatory": 1,
    //       "isActive": 1,
    //       "recordStatus": 2,
    //       "insertedBy": 1
    //     },
    //     {
    //       "documentDetailId": 244,
    //       "documentFieldName": "PG Passing Year(STU)",
    //       "projectId": 125,
    //       "isMandatory": 1,
    //       "isActive": 1,
    //       "recordStatus": 2,
    //       "insertedBy": 1
    //     },
    //     {
    //       "documentDetailId": 245,
    //       "documentFieldName": "Total Work experience",
    //       "projectId": 125,
    //       "isMandatory": 1,
    //       "isActive": 1,
    //       "recordStatus": 2,
    //       "insertedBy": 1
    //     }
    //   ],
    //   "status": "Success",
    //   "message": "Additional Fields retrieved successfully."
    // };

    // this.additionalFields = response.data;
    $('.spinner').show();
    let project_id = this.selectedProjects.split('___');
    this.UsermanagementService.getProjectAdditionalFields(project_id[0]).subscribe({
      next: (response) => {
        $('.spinner').hide();
        this.additionalFields = [];
        this._selectedSearchAdditionalFields = [];
        if (response.status == 'Success') {
          this.additionalFields = response.data;
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

  /* ========Initial Load=========== */
  getUserProjectBasedDetailReport($event, pageNumber, showCount) {
    $('.spinner').show();
    this.pageNumber = pageNumber;
    let studpro = [3, 14];
    this.UsermanagementService.getUserProjectBasedDetailReports(studpro, pageNumber, showCount).subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.status == 'Success') {
          if (response.data != null) {
            this.userTotalSearchRecords = response.userCount;
            this.userTotalRecords = response.totalCount;
            this.paginationTotalRecords = response.userCount;
            this.reportsList = response.data;
            // this.reportsList = mockdata.data;
            this.getProjectSummeryReport($event);
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
  /* ================================================ Project Summery Reports Start ================================================ */
  getProjectSummeryReport(manager_name) {
    var managername = manager_name;
    this.managerName = managername;
    // this.reportsList = mockdata.data;

    if (this.reportsList != null) {
      let reports = this.reportsList;
      if (reports != null) {
        let projectBasedReportArray = [];
        if ((reports != null && this._selectedSearchColumns.length == 0) && (reports != null && this._selectedSearchAdditionalFields.length == 0)) {
          reports.map((x) => {
            let projectList = '';
            let projectAddtionalFields = x.projectAddtionalFields;

            if (
              projectAddtionalFields != null &&
              projectAddtionalFields?.length != 0
            ) {
              for (let i = 0; i < projectAddtionalFields?.length; i += 1) {
                projectList = projectAddtionalFields[i].fields;
                const data = {
                  user: x.user,
                  projectinfos: projectAddtionalFields[i],
                  fields: projectList,
                };
                projectBasedReportArray.push(data);
              }
            } else {
              const data = {
                user: x.user,
                projectinfos: x.projectAddtionalFields,
                fields: [],
              };
              projectBasedReportArray.push(data);
            }
          });
        } else {
          projectBasedReportArray = this.reportsList;
        }

        console.log(projectBasedReportArray);

        console.log('additionalfiels', projectBasedReportArray);

        let projectBasedReports = [];
        projectBasedReportArray.forEach((elem: any, index: any) => {

          if (!projectBasedReports.hasOwnProperty(index)) {
            projectBasedReports[index] = {};
          }

          projectBasedReports[index]['userDetails'] = elem.user;
          projectBasedReports[index]['userProjects'] = elem.projectinfos;
          this.listOfAllAdditionalFields.forEach((ele: any, ix: any) => {
            projectBasedReports[index][ele] = elem.fields.filter(function (el) {
              return el.documentFieldName == ele;
            });
          });

        });


        this.finalProjectBasedReports = [];
        this.additionalFieldKeys = [];
        console.log(projectBasedReports);
        projectBasedReports.forEach((elem: any, index: any) => {
          if (elem.userDetails != null) {
            let registerDate = '';


            let firstNamee = (elem.userDetails.firstName != null) ? elem.userDetails.firstName : '';
            let lastNamee = (elem.userDetails.lastName != null) ? elem.userDetails.lastName : '';


            this.additionalFieldKeys = Object.keys(elem);

            if (!this.finalProjectBasedReports.hasOwnProperty(index)) {
              this.finalProjectBasedReports[index] = {};
            }

            if ((reports != null && this._selectedSearchColumns.length == 0) && (reports != null && this._selectedSearchAdditionalFields.length == 0)) {
              registerDate = elem.userDetails.insertedtime != null &&
                elem.userDetails.insertedtime != ''
                ? moment(elem.userDetails.insertedtime).format('YYYY-MM-DD')
                : '';
            } else {
              registerDate = elem.userDetails.registrationDate != null &&
                elem.userDetails.registrationDate != ''
                ? moment(elem.userDetails.registrationDate).format('YYYY-MM-DD')
                : '';
            }

            // keyNames.forEach((ell, ixx) => {
            // if (ell != 'id' && ell != 'cityId' && ell != 'stateId' && ell != 'roleId' && ell != 'projectId' && ell != 'academicInstitution_id' && ell != 'projectids' && ell != 'isdb' && ell != 'placedOrganizationId') {
            this.finalProjectBasedReports[index]['gttId'] = elem.userDetails.gttId != null && elem.userDetails.gttId != '' ? elem.userDetails.gttId : '';
            this.finalProjectBasedReports[index]['registerDate'] = registerDate;
            this.finalProjectBasedReports[index]['name'] = firstNamee + ' ' + lastNamee;
            this.finalProjectBasedReports[index]['firstName'] = elem.userDetails.firstName;
            this.finalProjectBasedReports[index]['lastName'] = (elem.userDetails.lastName != null) ? elem.userDetails.lastName : "";
            this.finalProjectBasedReports[index]['gender'] = (elem.userDetails.gender != null) ? elem.userDetails.gender : "";
            this.finalProjectBasedReports[index]['DOB'] = (elem.userDetails.dob != null) ? elem.userDetails.dob : "";
            this.finalProjectBasedReports[index]['maritalStatus'] = (elem.userDetails.maritalStatus != null) ? elem.userDetails.maritalStatus : "";
            this.finalProjectBasedReports[index]['email'] = (elem.userDetails.email != null) ? elem.userDetails.email : "";
            this.finalProjectBasedReports[index]['password'] = (elem.userDetails.password != null) ? elem.userDetails.password : "";
            this.finalProjectBasedReports[index]['confirmPassword'] = (elem.userDetails.confirmPassword != null) ? elem.userDetails.confirmPassword : "";
            this.finalProjectBasedReports[index]['mobile'] = (elem.userDetails.mobile != null) ? elem.userDetails.mobile : "";
            this.finalProjectBasedReports[index]['whatsappNumber'] = (elem.userDetails.whatsappNumber != null) ? elem.userDetails.whatsappNumber : "";
            this.finalProjectBasedReports[index]['alternateNumber'] = (elem.userDetails.alternateNumber != null) ? elem.userDetails.alternateNumber : "";
            this.finalProjectBasedReports[index]['aadharNo'] = (elem.userDetails.aadharNumber != null) ? elem.userDetails.aadharNumber : "";
            this.finalProjectBasedReports[index]['role'] = (elem.userDetails.roleName != null) ? elem.userDetails.roleName : "";
            this.finalProjectBasedReports[index]['guardianName'] = (elem.userDetails.guardianName != null) ? elem.userDetails.guardianName : "";
            this.finalProjectBasedReports[index]['currentState'] = (elem.userDetails.stateName != null) ? elem.userDetails.stateName : "";
            this.finalProjectBasedReports[index]['currentLocation'] = (elem.userDetails.currentLocation != null) ? elem.userDetails.currentLocation : "";
            this.finalProjectBasedReports[index]['disabilityType'] = (elem.userDetails.disabilityType != null) ? elem.userDetails.disabilityType : "";
            this.finalProjectBasedReports[index]['languageKnown'] = (elem.userDetails.languageKnown != null) ? elem.userDetails.languageKnown : "";
            this.finalProjectBasedReports[index]['isGraduated'] = (elem.userDetails.isGraduated != null) ? elem.userDetails.isGraduated : "";
            this.finalProjectBasedReports[index]['academicInstitution'] = (elem.userDetails.academiciInstitutionName != null) ? elem.userDetails.academiciInstitutionName : "";
            this.finalProjectBasedReports[index]['academicInstitutionShortName'] = (elem.userDetails.academicInstitutionShortName != null) ? elem.userDetails.academicInstitutionShortName : "";
            this.finalProjectBasedReports[index]['collegeAddress'] = (elem.userDetails.address != null) ? elem.userDetails.address : "";
            this.finalProjectBasedReports[index]['collegeState'] = (elem.userDetails.collegestate != null) ? elem.userDetails.collegestate : "";
            this.finalProjectBasedReports[index]['collegeCity'] = (elem.userDetails.collegeCity != null) ? elem.userDetails.collegeCity : "";
            this.finalProjectBasedReports[index]['currentEducationalQualification'] = (elem.userDetails.educationalQualification != null) ? elem.userDetails.educationalQualification : "";
            this.finalProjectBasedReports[index]['graduationPassingYear'] = (elem.userDetails.graduationPassingYear != null) ? elem.userDetails.graduationPassingYear : "";
            this.finalProjectBasedReports[index]['graduationSubjectStream'] = (elem.userDetails.subject != null) ? elem.userDetails.subject : "";
            this.finalProjectBasedReports[index]['TPOName'] = (elem.userDetails.tponame != null) ? elem.userDetails.tponame : "";
            this.finalProjectBasedReports[index]['kAMName'] = (elem.userDetails.kamname != null) ? elem.userDetails.kamname : "";
            this.finalProjectBasedReports[index]['areYouPursingPostGraduation'] = (elem.userDetails.pursuingPostGraduate != null) ? elem.userDetails.pursuingPostGraduate : "";
            this.finalProjectBasedReports[index]['PGAcademicInstitutionName'] = (elem.userDetails.postGraduationInstitution != null) ? elem.userDetails.postGraduationInstitution : "";
            this.finalProjectBasedReports[index]['PGQualification'] = (elem.userDetails.postGraduationQualification != null) ? elem.userDetails.postGraduationQualification : "";
            this.finalProjectBasedReports[index]['PGPassingYear'] = (elem.userDetails.postGraduationPassingYear != null) ? elem.userDetails.postGraduationPassingYear : "";
            this.finalProjectBasedReports[index]['score'] = (elem.userDetails.percentageMarks != null) ? elem.userDetails.percentageMarks : "";
            this.finalProjectBasedReports[index]['isPlaced'] = (elem.userDetails.isPlaced != null) ? elem.userDetails.isPlaced : "";
            this.finalProjectBasedReports[index]['currentOrganizationPlacedWith'] = (elem.userDetails.educationalQualification != null) ? elem.userDetails.educationalQualification : "";
            this.finalProjectBasedReports[index]['SectorOfOrganization'] = (elem.userDetails.sectorName != null) ? elem.userDetails.sectorName : "";
            this.finalProjectBasedReports[index]['designation'] = (elem.userDetails.designation != null) ? elem.userDetails.designation : "";
            this.finalProjectBasedReports[index]['monthOfJoiningTheOrganization'] = (elem.userDetails.joiningMonth != null) ? elem.userDetails.joiningMonth : "";
            this.finalProjectBasedReports[index]['employer1'] = (elem.userDetails.employer1 != null) ? elem.userDetails.employer1 : "";
            this.finalProjectBasedReports[index]['employer2'] = (elem.userDetails.employer2 != null) ? elem.userDetails.employer2 : "";
            this.finalProjectBasedReports[index]['areYouExperienced'] = (elem.userDetails.isExperience != null) ? elem.userDetails.isExperience : "";
            this.finalProjectBasedReports[index]['yearsOfExperience'] = (elem.userDetails.experienceYears != null) ? elem.userDetails.experienceYears : "";
            this.finalProjectBasedReports[index]['caste'] = (elem.userDetails.caste != null) ? elem.userDetails.caste : "";
            this.finalProjectBasedReports[index]['profession'] = (elem.userDetails.profession != null) ? elem.userDetails.profession : "";
            this.finalProjectBasedReports[index]['vaccinationStatus'] = (elem.userDetails.vaccinationStatus != null) ? elem.userDetails.vaccinationStatus : "";
            this.finalProjectBasedReports[index]['vaccinationCertificateName'] = (elem.userDetails.vaccinationcertificatefilename != null) ? elem.userDetails.vaccinationcertificatefilename : "";
            this.finalProjectBasedReports[index]['status'] = (elem.userDetails.status != null) ? elem.userDetails.status : "";
            this.finalProjectBasedReports[index]['projectName'] = (elem.userProjects.projectname != null) ? elem.userProjects.projectname : "";
            this.finalProjectBasedReports[index]['projectManagerName'] = (elem.userProjects.projectmanagername != null) ? elem.userProjects.projectmanagername : "";
            this.finalProjectBasedReports[index]['programName'] = (elem.userProjects.programname != null) ? elem.userProjects.programname : "";
            this.finalProjectBasedReports[index]['courseName'] = (elem.userProjects.coursename != null) ? elem.userProjects.coursename : "";
            this.finalProjectBasedReports[index]['batchName'] = (elem.userProjects.batchname != null) ? elem.userProjects.batchname : "";
            this.finalProjectBasedReports[index]['trainerName'] = (elem.userProjects.trainername != null) ? elem.userProjects.trainername : "";
            this.finalProjectBasedReports[index]['trainingCoordinatorName'] = (elem.userProjects.trainercoordinatorname != null) ? elem.userProjects.trainercoordinatorname : "";

            this.additionalFieldKeys.forEach((ell, ix) => {
              if (ell != 'userDetails' && ell != 'userProjects') {

                if (elem[ell].length > 0 && elem[ell][0]?.fieldType != undefined && (elem[ell][0]?.fieldType == 'File upload' || elem[ell][0]?.fieldType == 'Video')) {
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


          }
        });


        console.log(this.finalProjectBasedReports);



        var projectManager = this.finalProjectBasedReports.map((data) => {
          if (
            data.projectManagerName != 0 ||
            data.projectManagerName != null ||
            data.projectManagerName != undefined
          ) {
            return data.projectManagerName;
          }
        });

        var managerdata = projectManager.filter(function (element) {
          return element !== undefined && element !== null && element != '';
        });


        let managerArray = managerdata.flat();

        let projectManagerList = [...new Set(managerArray)];

        let projectarrays = [];
        if (managername == 'ALL') {
          this.finalProjectBasedReports;
        } else {
          this.finalProjectBasedReports.map((project) => {
            let data = project.projectManagerName?.includes(managername);
            if (data == true) {
              return projectarrays.push(project);
            }
          });

          this.finalProjectBasedReports = projectarrays;
          this.dubFindReportDetails = projectarrays;
          this.userTotalRecords = this.finalProjectBasedReports.length;
          this.paginationTotalRecords = this.finalProjectBasedReports.length;
          this.userRowNum = this.showCount;
        }

        if (this.managerName != 'ALL') {
          let finalProjectBasedRecords = this.finalProjectBasedReports;
          this.userTotalRecords = this.userTotalRecords;

          this.backUpDateFilterRecords = finalProjectBasedRecords;
          this.finalProjectBasedReports = this.backUpDateFilterRecords.slice(0, this.showCount);
          if (this.pageNumber > 0 && this.preSelectManager == false) {
            let countStartRec = this.pageNumber * this.showCount;
            let countEndRec = this.showCount * (this.pageNumber + 1);
            this.finalProjectBasedReports = this.backUpDateFilterRecords.slice(countStartRec, countEndRec);
          }
        }

        if (this.startDay != null && this.endDay != null) {
          // let finalProjectBasedRecords =  this.finalProjectBasedReports;
          // this.userTotalRecords = this.userTotalRecords;
          // this.backUpDateFilterRecords = finalProjectBasedRecords;
          // this.finalProjectBasedReports = this.backUpDateFilterRecords.slice(0, this.showCount);

          // if(this.pageNumber > 0){
          //   let countStartRec = this.pageNumber * this.showCount;
          //   let countEndRec = this.showCount * (this.pageNumber + 1);
          //   this.finalProjectBasedReports = this.backUpDateFilterRecords.slice(countStartRec, countEndRec);
          // }

          this.finalProjectBasedReports = this.finalProjectBasedReports;
        }

        if (this._selectedSearchColumns != undefined && this._selectedSearchColumns.length > 0) {

          let finalProjectBasedRecords = this.finalProjectBasedReports;
          this.userTotalSearchRecords = finalProjectBasedRecords.length;
          this.userTotalRecords = finalProjectBasedRecords.length;
          this.paginationTotalRecords = finalProjectBasedRecords.length;
          this.backUpDateFilterRecords = finalProjectBasedRecords;
          this.finalProjectBasedReports = this.backUpDateFilterRecords.slice(0, this.showCount);

          // if(this.pageNumber > 0){
          //   let countStartRec = this.pageNumber * this.showCount;
          //   let countEndRec = this.showCount * (this.pageNumber + 1);
          //   this.finalProjectBasedReports = this.backUpDateFilterRecords.slice(countStartRec, countEndRec);
          // }

          this.finalProjectBasedReports = this.finalProjectBasedReports;
        }




        this._projectBasedReportColumns = [];
        this.manualSearchCols = [];
        var result = Object.keys(this.finalProjectBasedReports[0])?.map(
          function (key: string) {
            return key;
          }
        );

        this.preSelectManager = false;
        let headerName = '';
        result.forEach((elem: any, key: any) => {
          headerName = this.headerCaseString(elem);

          let newElm = '';
          if (elem == 'DOB') {
            newElm = 'dob';
          } else if (elem == 'whatsappNumber') {
            newElm = 'whatsappnumber';
          } else if (elem == 'aadharNo') {
            newElm = 'aadharnumber';
          } else if (elem == 'guardianName') {
            newElm = 'guardiansName';
          } else if (elem == 'pincode') {
            newElm = 'pinCode';
          } else if (elem == 'academicInstitution') {
            newElm = 'institutionname';
          } else if (elem == 'currentEducationalQualification') {
            newElm = 'educationalqualification';
          } else if (elem == 'graduationSubjectStream') {
            newElm = 'subject_stream';
          } else if (elem == 'areYouPursingPostGraduation') {
            newElm = 'pursuing_postgraduate';
          } else if (elem == 'PGAcademicInstitutionName') {
            newElm = 'postgraduation_institution';
          } else if (elem == 'PGQualification') {
            newElm = 'postqraduation_qualification';
          } else if (elem == 'PGPassingYear') {
            newElm = 'postgraduationpassingyear';
          } else if (elem == 'currentOrganizationPlacedWith') {
            newElm = 'placed_organization';
          } else if (elem == 'SectorOfOrganization') {
            newElm = 'sector';
          } else if (elem == 'monthOfJoiningTheOrganization') {
            newElm = 'joining_month';
          } else if (elem == 'areYouExperienced') {
            newElm = 'isexperience';
          } else if (elem == 'yearsOfExperience') {
            newElm = 'experience_years';
          } else if (elem == 'vaccinationStatus') {
            newElm = 'vaccination_status';
          } else if (elem == 'stateName') {
            newElm = 'state';
          } else if (elem == 'projectName') {
            newElm = 'projectname';
          } else if (elem == 'city_name') {
            newElm = 'cityname';
          } else if (elem == 'roleName') {
            newElm = 'role';
          } else if (elem == 'batchName') {
            newElm = 'batchcode';
          } else if (elem == 'projectManagerName') {
            newElm = 'projectmanagername';
          } else if (elem == 'trainerName') {
            newElm = 'trainername';
          } else if (elem == 'trainingCoordinatorName') {
            newElm = 'trainingcoordinatorname';
          } else if (elem == 'courseName') {
            newElm = 'coursename';
          } else if (elem == 'programName') {
            newElm = 'programname';
          }

          // ---------------------------------------------------------
          // if (
          //   elem != 'postalAddress' &&
          //   elem != 'uploadVaccinationCertificate' &&
          //   elem != 'droppedStatus' &&
          //   elem != 'placedStatus' &&
          //   elem != 'droppedStatus' &&
          //   elem != 'ugQualification' &&
          //   elem != 'ugMarkSheet' &&
          //   elem != 'ugPassingYear' &&
          //   elem != 'pursuingPG' &&
          //   elem != 'pgMarkSheet' &&
          //   elem != 'pgPassingYear' &&
          //   elem != 'mainEarningMember' &&
          //   elem != 'occupationMainEarningMember' &&
          //   elem != 'familyIncome' &&
          //   elem != 'annualIncome' &&
          //   elem != 'incomeProof' &&
          //   elem != 'incomeProofValidity' &&
          //   elem != 'panCard' &&
          //   elem != 'CasteCertificate' &&
          //   elem != 'aadharIdProof' &&
          //   elem != 'rationCard' &&
          //   elem != 'rationCardNumber' &&
          //   elem != 'rationCardColor' &&
          //   elem != 'incomeMentionedInRationCard' &&
          //   // elem != 'photo' &&
          //   elem != 'updatedResume' &&
          //   elem != 'LOI' &&
          //   // elem != 'tenthMarkSheet' &&
          //   // elem != 'twelthMarkSheet' &&
          //   elem != 'knownGTT' &&
          //   elem != 'comments'
          // ) {
          this._projectBasedReportColumns.push({
            field: elem,
            header: headerName,
          });



          if (!this.additionalFieldKeys.includes(elem)) {
            if (elem != 'name' &&
              elem != 'password' &&
              elem != 'confirmPassword' &&
              elem != 'currentState' &&
              elem != 'academicInstitutionShortName' &&
              elem != 'collegeAddress' &&
              elem != 'score' &&
              elem != 'vaccinationCertificateName' &&
              elem != 'status') {
              console.log(newElm + '--------' + elem);
              this.manualSearchCols.push({
                field: (newElm == '') ? elem : newElm,
                header: headerName,
              });
            }
          }

          // }
        });

        console.log(this.manualSearchCols);

        this.first = 0;

        this.manualSearchCols.push({
          field: 'cityname',
          header: 'City Name',
        });

        this.manualSearchCols.push({
          field: 'startdate',
          header: 'Start Date',
        });

        this.manualSearchCols.push({
          field: 'enddate',
          header: 'End Date',
        });


        this.projectBasedmanager = projectManagerList;
        if (this._searchedColumns.length == 0) {
          this.searchCols = [...this.manualSearchCols].map(item => ({ ...item }));
        }

        this.searchCols = this.searchCols.sort((a: any, b: any) =>
          a.header > b.header ? 1 : -1
        );

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
    }
  }


  @Input() get projectBasedRegistrationColumns(): any[] {
    return this._projectBasedDefaultColumns;
  }

  set projectBasedRegistrationColumns(val: any[]) {
    this._projectBasedDefaultColumns =
      this._projectBasedReportColumnHeader.filter((col) => val.includes(col));
  }

  @Input() get projectBasedProjectManager(): any[] {
    return this._projectBasedDefaultColumns;
  }

  set projectBasedProjectManager(val: any[]) {
    this._projectBasedDefaultColumns = this._projectBasedManagerList.filter(
      (col) => val.includes(col)
    );
  }

  projectBasedFilter($event: any) {
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

  exportProjectBasedCSV() {
    let projectBasedExcelDetails: any = [];
    let projectColumnsData: any = [];

    this.selectedProjectBasedDetail.forEach((elem, inx) => {
      if (!projectBasedExcelDetails.hasOwnProperty(inx)) {
        projectBasedExcelDetails[inx] = {};
      }

      this._projectBasedDefaultColumns.forEach((elm, indx) => {
        let headerName = elm.header;
        if (elm.header == 'Gtt Id') {
          headerName = 'GTT ID';
        } else {
          headerName = elm.header;
        }
        projectBasedExcelDetails[inx][headerName] =
          elem[elm.field] != null || elem[elm.field] != undefined
            ? elem[elm.field].toString()
            : null;
      });
    });

    if (this.selectedProjectBasedDetail.length == 0) {
      this._projectBasedDefaultColumns.forEach((elm, indx) => {
        let headerName = elm.header;
        if (elm.header == 'Gtt Id') {
          headerName = 'GTT ID';
        } else {
          headerName = elm.header;
        }
        projectColumnsData[headerName] = '';
      });
      projectBasedExcelDetails.push(projectColumnsData);
    }

    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      filename: 'Project-Based-Report',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(projectBasedExcelDetails);
    this.selectedProjectBasedDetail = [];
  }

  exportProjectBasedExcel() {
    let projectBasedExcelDetails: any = [];
    let projectColumnsData: any = [];

    this.selectedProjectBasedDetail.forEach((elem, inx) => {
      if (!projectBasedExcelDetails.hasOwnProperty(inx)) {
        projectBasedExcelDetails[inx] = {};
      }
      this._projectBasedDefaultColumns.forEach((elm, indx) => {
        let headerName = elm.header;
        if (elm.header == 'Gtt Id') {
          headerName = 'GTT ID';
        } else {
          headerName = elm.header;
        }
        projectBasedExcelDetails[inx][headerName] =
          elem[elm.field] != null || elem[elm.field] != undefined
            ? elem[elm.field].toString()
            : null;
      });
    });

    if (this.selectedProjectBasedDetail.length == 0) {
      this._projectBasedDefaultColumns.forEach((elm, indx) => {
        let headerName = elm.header;
        if (elm.header == 'Gtt Id') {
          headerName = 'GTT ID';
        } else {
          headerName = elm.header;
        }
        projectColumnsData[headerName] = '';
      });
      projectBasedExcelDetails.push(projectColumnsData);
    }

    console.log(projectBasedExcelDetails);

    const worksheet = xlsx.utils.json_to_sheet(projectBasedExcelDetails);
    const workbook = {
      Sheets: { 'Project-Based-Report': worksheet },
      SheetNames: ['Project-Based-Report'],
    };
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'Project-Based-Report');
  }

  exportProjectBasedPDF(dt: any) {
    var doc: any = new jsPDF.default('p', 'pt', 'a0', true);

    this._projectBasedReportColumnTitle = [];

    Object.keys(this._projectBasedDefaultColumns).forEach((key) => {
      this._projectBasedReportColumnTitle.push({
        title: this._projectBasedDefaultColumns[key].header,
        dataKey: this._projectBasedDefaultColumns[key].field,
      });
    });

    doc.autoTable(
      this._projectBasedReportColumnTitle,
      this.selectedProjectBasedDetail,
      {
        bodyStyles: { valign: 'middle' },
        styles: { overflow: 'linebreak', columnWidth: '1000' },
        columnStyles: {
          text: {
            cellWidth: 'wrap',
          },
          description: {
            cellWidth: '107',
          },
        },
      }
    );
    doc.save('ProjectSummery-Report.pdf');
  }
  /* ================================================ Project Summery Reports End ================================================ */
  /* ================================================ Project Date range Filter Start================================================ */
  onSelect(event: any) {

    console.log(event);

    // this.dateRange = this.value;
    this.inValidRange = false;

    // console.log("here ", this.dateRange);

    if (this.rangeDates.length < 2) {
      this.inValidRange = true;
    }

    const fromDate = moment(this.rangeDates[0], 'YYYY-MM-DD', true)
    const toDate = moment(this.rangeDates[1], 'YYYY-MM-DD', true);

    this.startDay = moment(this.rangeDates[0]).format('YYYY-MM-DD');
    this.endDay = moment(this.rangeDates[1]).format('YYYY-MM-DD');
    var managername = this.managerName;

    if (managername != null && managername != 'ALL') {
      let projectarrays = [];
      if (!fromDate.isValid() || !toDate.isValid()) {
        this.inValidRange = true;
        var arr = [];
        arr.push(this.startDay);
        this.dubFindReportDetails.forEach((elm, ix) => {
          if (arr.includes(elm.registerDate)) {
            projectarrays.push(elm);
          }
        });

        this.finalProjectBasedReports = projectarrays;
        this.userTotalRecords = this.finalProjectBasedReports.length;
        this.userRowNum = this.showCount;
      } else {
        this.inValidRange = false;
        for (var arr = [], dt = new Date(this.startDay); dt <= new Date(this.endDay); dt.setDate(dt.getDate() + 1)) {
          arr.push(moment(new Date(dt)).format('YYYY-MM-DD'));
        }

        this.dubFindReportDetails.forEach((elm, ix) => {
          if (arr.includes(elm.registerDate)) {
            projectarrays.push(elm);
          }
        });

        this.finalProjectBasedReports = projectarrays;
        this.userTotalRecords = this.finalProjectBasedReports.length;
        this.userRowNum = this.showCount;
      }

    } else {
      this.getDateFilter(managername);
    }
  }


  getDateFilter(managername) {

    if (this.startDay != null && this.endDay != null) {
      if (this.dateFilterSearch) {
        this.pageNumber = this.pageNumber;
      } else {
        this.pageNumber = 0;
      }
    } else {
      this.pageNumber = this.pageNumber
    }

    let params = {
      roles: [3, 14],
      startdate: this.startDay,
      enddate: this.endDay,
      showCount: this.showCount,
      pageNumber: this.pageNumber
    };

    if (this.startDay != 'Invalid date' && this.endDay != 'Invalid date') {
      $('.spinner').show();
      this.UsermanagementService.getUserByDateFilter(params).subscribe({
        next: (response) => {
          $('.spinner').hide();
          if (response.status == 'Success') {

            if (this.startDay != null && this.endDay != null) {
              this.dateFilterSearch = true;
            } else {
              this.dateFilterSearch = false;
            }
            // var managername = $event;
            this.reportsList = response.data;
            this.userTotalSearchRecords = response.totalCount;
            this.userTotalRecords = response.totalCount;
            this.getProjectSummeryReport(managername);
            // if (reports != null) {
            //   let projectBasedReportArray = [];
            //   reports.map((x) => {
            //     let projectList = '';
            //     let projectAddtionalFields = x.projectAddtionalFields;

            //     if (projectAddtionalFields != 0) {
            //       for (let i = 0; i < projectAddtionalFields.length; i += 1) {
            //         projectList = projectAddtionalFields[i].fields;
            //         const data = {
            //           user: x.user,
            //           projectinfos: projectAddtionalFields[i],
            //           fields: projectList,
            //         };
            //         projectBasedReportArray.push(data);
            //       }
            //     } else {
            //       const data = {
            //         user: x.user,
            //         projectinfos: x.projectAddtionalFields,
            //         fields: [],
            //       };
            //       projectBasedReportArray.push(data);
            //     }
            //   });
            //   let projectBasedReports = [];
            //   projectBasedReportArray.forEach((elem: any, index: any) => {
            //     projectBasedReports.push({
            //       userDetails: elem.user,
            //       userProjects: elem.projectinfos,
            //       PGQualification: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'PG Qualification';
            //       }),
            //       OrgSignature: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'Signature(Original)';
            //       }),
            //       fatherName: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'Father Name';
            //       }),
            //       StuMotherName: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'Mother Name';
            //       }),
            //       PGPassingYear: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'Passing Year';
            //       }),
            //       FamilyIncome: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'Family Income';
            //       }),
            //       RationCardNo: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'Ration Card No';
            //       }),
            //       RationCardColor: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'Ration Card Color';
            //       }),
            //       IncomeMentionedinRationcard: elem.fields.filter(function (
            //         el
            //       ) {
            //         return (
            //           el.documentFieldName == 'Income Mentioned in Ration card'
            //         );
            //       }),
            //       MainEarningMemberofFamily: elem.fields.filter(function (el) {
            //         return (
            //           el.documentFieldName == 'Main Earning Member of Family'
            //         );
            //       }),
            //       OccupationofthemainearningoftheFamily: elem.fields.filter(
            //         function (el) {
            //           return (
            //             el.documentFieldName ==
            //             'Occupation of the main earning of the Family'
            //           );
            //         }
            //       ),
            //       AnnualIncome: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'Annual Income';
            //       }),
            //       IncomeProofValidity: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'Income Proof Validity';
            //       }),
            //       Passport: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'Passport size photo(original)';
            //       }),
            //       TenthMarksheet: elem.fields.filter(function (el) {
            //         return el.documentFieldName == '10th marksheet(Original)';
            //       }),
            //       TwelthMarksheet: elem.fields.filter(function (el) {
            //         return el.documentFieldName == '12th marksheet(Original)';
            //       }),
            //       UGMarksheet: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'UG Marksheet';
            //       }),
            //       PGMarksheet: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'PG Marksheet';
            //       }),
            //       IDProof: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'Id Proof(Aadhar)';
            //       }),
            //       UpdatedResume: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'Updated Resume';
            //       }),

            //       IncomeProof: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'Income Proof';
            //       }),
            //       Pan: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'Pan';
            //       }),
            //       RationCard: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'Ration Card';
            //       }),
            //       CasteCertificate: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'Caste Certificate';
            //       }),
            //       comments: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'Comments';
            //       }),
            //       KnownaboutGTT: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'Know about GTT';
            //       }),
            //       totalMmembersInTheFamily: elem.fields.filter(function (el) {
            //         return (
            //           el.documentFieldName == 'Total members in the family'
            //         );
            //       }),
            //       Address: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'Address';
            //       }),
            //       PanNumber: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'Pan Number';
            //       }),
            //       Religion: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'Religion';
            //       }),
            //       aadharPan: elem.fields.filter(function (el) {
            //         if(el.documentFieldName=='Aadhar/Pan Document'){
            //           return el.documentFieldName == 'Aadhar/Pan Document';
            //         }else if(el.documentFieldName == 'Aadhar/Pan Document(Original)'){
            //           return el.documentFieldName == 'Aadhar/Pan Document(Original)';
            //         }
            //       }),
            //       incomeProofs: elem.fields.filter(function (el) {
            //         return (
            //           el.documentFieldName ==
            //           'Income Proof(Ration Card/Income Certificate/Self Declaration)(Original)'
            //         );
            //       }),
            //       casteProofs: elem.fields.filter(function (el) {
            //         return (
            //           el.documentFieldName ==
            //           'Caste Proof(Leaving Certificate/Caste Certificate)(Original)'
            //         );
            //       }),
            //       CertificationDate: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'Certification Date';
            //       }),
            //       Testimonials: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'Testimonials';
            //       }),
            //       CasteCategory: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'Caste /Category';
            //       }),
            //       SpouseName: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'Spouse Name';
            //       }),
            //       WhatsappGroupName: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'Whatsapp Group Name';
            //       }),
            //       PGUniversityName: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'PG University Name(STU)';
            //       }),
            //       District: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'District';
            //       }),
            //       AadharLink: elem.fields.filter(function (el) {
            //         return (
            //           el.documentFieldName ==
            //           'Is Aadhar linked With your phone number?'
            //         );
            //       }),
            //       PANcards: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'Do you have PAN card?';
            //       }),
            //       allCertificate: elem.fields.filter(function (el) {
            //         return (
            //           el.documentFieldName ==
            //           'Do you have all original graduation mark sheets and certificate with you?'
            //         );
            //       }),
            //       documentHave: elem.fields.filter(function (el) {
            //         return (
            //           el.documentFieldName ==
            //           'Please specify, which document you do not have?'
            //         );
            //       }),
            //       UpdatedResumes: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'Updated Resume(Original)';
            //       }),
            //       tenthBoard: elem.fields.filter(function (el) {
            //         return (
            //           el.documentFieldName == '10th board certificate(Original)'
            //         );
            //       }),
            //       twelthBoard: elem.fields.filter(function (el) {
            //         return el.documentFieldName == '12th board certificate';
            //       }),
            //       PGconsolidated: elem.fields.filter(function (el) {
            //         return (
            //           el.documentFieldName ==
            //           'PG consolidated marksheet(Original)'
            //         );
            //       }),
            //       Graduationconsolidated: elem.fields.filter(function (el) {
            //         return (
            //           el.documentFieldName ==
            //           'Graduation consolidated marksheet(Original)'
            //         );
            //       }),
            //       GraduationProfessional: elem.fields.filter(function (el) {
            //         return (
            //           el.documentFieldName ==
            //           'Graduation professional degree certificate'
            //         );
            //       }),
            //       PGProvisional: elem.fields.filter(function (el) {
            //         return (
            //           el.documentFieldName ==
            //           'PG provisional degree certificate(Original)'
            //         );
            //       }),
            //       LOI: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'LOI';
            //       }),
            //       LOID: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'LOI Document(Original)';
            //       }),
            //       PGDegreeName: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'PG Degree Name';
            //       }),
            //       PGCollegeName: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'PG College Name';
            //       }),
            //       PGPassingYears: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'PG Passing Year(STU)';
            //       }),
            //       TotalWorkExperience: elem.fields.filter(function (el) {
            //         return el.documentFieldName == 'Total Work experience';
            //       }),
            //     });
            //   });

            //   this.finalProjectBasedReports = [];

            //   projectBasedReports.forEach((elem: any, index: any) => {
            //     this.finalProjectBasedReports.push({
            //       gttId: elem.userDetails.gttId,
            //       registerDate:
            //         elem.userDetails.insertedtime != null &&
            //         elem.userDetails.insertedtime != ''
            //           ? moment(elem.userDetails.insertedtime).format(
            //               'YYYY-MM-DD'
            //             )
            //           : '',
            //       name:
            //         elem.userDetails.firstName != null
            //           ? elem.userDetails.firstName +
            //             ' ' +
            //             elem.userDetails.lastName
            //           : '',
            //       firstName: elem.userDetails.firstName,
            //       lastName: elem.userDetails.lastName,
            //       gender: elem.userDetails.gender,
            //       dob: elem.userDetails.dob,
            //       maritalStatus: elem.userDetails.maritalStatus,
            //       email: elem.userDetails.email,
            //       password: elem.userDetails.password,
            //       confirmPassword: elem.userDetails.confirmPassword,
            //       mobile: elem.userDetails.mobile,
            //       whatsapp: elem.userDetails.whatsappNumber,
            //       alternateNumber: elem.userDetails.alternateNumber,
            //       aadhar: elem.userDetails.aadharNumber,
            //       role: elem.userDetails.roleName,
            //       // fatherName: elem.userDetails.fatherName,
            //       // motherName: elem.userDetails.motherName,
            //       guardianName: elem.userDetails.guardianName,
            //       currentState: elem.userDetails.stateName,
            //       currentLocation: elem.userDetails.currentLocation,
            //       pinCode: !elem.pinCode?.length
            //       ? ''
            //       : (elem.pinCode[0]?.verificationStatus == 'Yet to verify'
            //           ? 'Yet to verify'
            //           : elem.pinCode[0]?.verificationStatus == 'Yes'
            //           ? 'Valid'
            //           : 'Not Valid') +
            //         '-' +
            //         (elem.pinCode[0]?.documentValue == null
            //           ? ''
            //           : elem.pinCode[0]?.documentValue),
            //       disabilityType: elem.userDetails.disabilityType,
            //       languageKnown: elem.userDetails.languageKnown,
            //       isGraduated: elem.userDetails.isGraduated,
            //       academicInstitution:
            //         elem.userDetails.academiciInstitutionName,
            //       academicInstitutionShortName:
            //         elem.userDetails.academicInstitutionShortName,
            //       collegeAddress: elem.userDetails.address,
            //       collegeCity: elem.userDetails.collegeCity,
            //       collegeState: elem.userDetails.collegestate,
            //       currentEducationalQualification:
            //         elem.userDetails.educationalQualification,
            //       graduationPassingYear: elem.userDetails.graduationPassingYear,
            //       graduationSubjectStream: elem.userDetails.subject,
            //       tpoName: elem.userDetails.tponame,
            //       kamName: elem.userDetails.kamname,
            //       areYouPursingPostGraduation:
            //         elem.userDetails.pursuingPostGraduate,
            //       pgAcademicInstitutionName:
            //         elem.userDetails.postGraduationInstitution,
            //       pgQualification: elem.userDetails.postGraduationQualification,
            //       pgPassingyear: elem.userDetails.postGraduationPassingYear,
            //       score: elem.userDetails.percentageMarks,
            //       isPlaced: elem.userDetails.isPlaced,
            //       currentOrganizationPlacedWith:
            //         elem.userDetails.placedOrganization,
            //       SectorOfOrganization: elem.userDetails.sectorName,
            //       designation: elem.userDetails.designation,
            //       monthOfJoiningTheOrganization: elem.userDetails.joiningMonth,
            //       previousEmployer1: elem.userDetails.employer1,
            //       previousEmployer2: elem.userDetails.employer2,
            //       areYouExperienced: elem.userDetails.isExperience,
            //       yearsOfExperience: elem.userDetails.experienceYears,
            //       caste: elem.userDetails.caste,
            //       profession: elem.userDetails.profession,
            //       vaccinationStatus: elem.userDetails.vaccinationStatus,
            //       vaccinationcertificatename:
            //         elem.userDetails.vaccinationcertificatefilename,
            //       userStatus: elem.userDetails.status,
            //       projectName: elem.userProjects.projectname,
            //       projectManagerName: elem.userProjects.projectmanagername,
            //       programName: elem.userProjects.programname,
            //       courseName: elem.userProjects.coursename,
            //       batchName: elem.userProjects.batchname,
            //       trainerName: elem.userProjects.trainername,
            //       trainingCoordinatorName:
            //         elem.userProjects.trainercoordinatorname,

            //         OrgSignature: !elem.OrgSignature?.length
            //         ? ''
            //         : (elem.OrgSignature[0]?.verificationStatus == 'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.OrgSignature[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.OrgSignature[0]?.documentValue == null
            //             ? ''
            //             : elem.OrgSignature[0]?.documentValue),

            //             fatherName: !elem.fatherName?.length
            //         ? ''
            //         : (elem.fatherName[0]?.verificationStatus == 'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.fatherName[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.fatherName[0]?.documentValue == null
            //             ? ''
            //             : elem.fatherName[0]?.documentValue),

            //             motherName: !elem.motherName?.length
            //         ? ''
            //         : (elem.motherName[0]?.verificationStatus == 'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.motherName[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.motherName[0]?.documentValue == null
            //             ? ''
            //             : elem.motherName[0]?.documentValue),

            //       tenthMarkSheet: !elem.TenthMarksheet?.length
            //         ? ''
            //         : (elem.TenthMarksheet[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.TenthMarksheet[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.TenthMarksheet[0]?.documentValue == null
            //             ? ''
            //             : elem.TenthMarksheet[0]?.documentValue),
            //       twelthMarkSheet: !elem.TwelthMarksheet?.length
            //         ? ''
            //         : (elem.TwelthMarksheet[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.TwelthMarksheet[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.TwelthMarksheet[0]?.documentValue == null
            //             ? ''
            //             : elem.TwelthMarksheet[0]?.documentValue),
            //       knownGTT: !elem.KnownaboutGTT?.length
            //         ? ''
            //         : (elem.KnownaboutGTT[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.KnownaboutGTT[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.KnownaboutGTT[0]?.documentValue == null
            //             ? ''
            //             : elem.KnownaboutGTT[0]?.documentValue),
            //       comments: !elem.comments?.length
            //         ? ''
            //         : (elem.comments[0]?.verificationStatus == 'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.comments[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.comments[0]?.documentValue == null
            //             ? ''
            //             : elem.comments[0]?.documentValue),
            //       totalMmembersInTheFamily: !elem.totalMmembersInTheFamily?.length
            //         ? ''
            //         : (elem.totalMmembersInTheFamily[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.totalMmembersInTheFamily[0]
            //                 ?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.totalMmembersInTheFamily[0]?.documentValue == null
            //             ? ''
            //             : elem.totalMmembersInTheFamily[0]?.documentValue),

            //       Address: !elem.Address?.length
            //         ? ''
            //         : (elem.Address[0]?.verificationStatus == 'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.Address[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.Address[0]?.documentValue == null
            //             ? ''
            //             : elem.Address[0]?.documentValue),

            //       PanNumber: !elem.PanNumber?.length
            //         ? ''
            //         : (elem.PanNumber[0]?.verificationStatus == 'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.PanNumber[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.PanNumber[0]?.documentValue == null
            //             ? ''
            //             : elem.PanNumber[0]?.documentValue),

            //       Religion: !elem.Religion?.length
            //         ? ''
            //         : (elem.Religion[0]?.verificationStatus == 'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.Religion[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.Religion[0]?.documentValue == null
            //             ? ''
            //             : elem.Religion[0]?.documentValue),

            //       aadharPan: !elem.aadharPan?.length
            //         ? ''
            //         : (elem.aadharPan[0]?.verificationStatus == 'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.aadharPan[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.aadharPan[0]?.documentValue == null
            //             ? ''
            //             : elem.aadharPan[0]?.documentValue),

            //       incomeProofs: !elem.incomeProofs?.length
            //         ? ''
            //         : (elem.incomeProofs[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.incomeProofs[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.incomeProofs[0]?.documentValue == null
            //             ? ''
            //             : elem.incomeProofs[0]?.documentValue),

            //       casteProofs: !elem.casteProofs?.length
            //         ? ''
            //         : (elem.casteProofs[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.casteProofs[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.casteProofs[0]?.documentValue == null
            //             ? ''
            //             : elem.casteProofs[0]?.documentValue),

            //       CertificationDate: !elem.CertificationDate?.length
            //         ? ''
            //         : (elem.CertificationDate[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.CertificationDate[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.CertificationDate[0]?.documentValue == null
            //             ? ''
            //             : elem.CertificationDate[0]?.documentValue),

            //       Testimonials: !elem.Testimonials?.length
            //         ? ''
            //         : (elem.Testimonials[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.Testimonials[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.Testimonials[0]?.documentValue == null
            //             ? ''
            //             : elem.Testimonials[0]?.documentValue),

            //       CasteCategory: !elem.CasteCategory?.length
            //         ? ''
            //         : (elem.CasteCategory[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.CasteCategory[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.CasteCategory[0]?.documentValue == null
            //             ? ''
            //             : elem.CasteCategory[0]?.documentValue),

            //       SpouseName: !elem.SpouseName?.length
            //         ? ''
            //         : (elem.SpouseName[0]?.verificationStatus == 'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.SpouseName[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.SpouseName[0]?.documentValue == null
            //             ? ''
            //             : elem.SpouseName[0]?.documentValue),

            //       WhatsappGroupName: !elem.WhatsappGroupName?.length
            //         ? ''
            //         : (elem.WhatsappGroupName[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.WhatsappGroupName[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.WhatsappGroupName[0]?.documentValue == null
            //             ? ''
            //             : elem.WhatsappGroupName[0]?.documentValue),

            //       PGUniversityName: !elem.PGUniversityName?.length
            //         ? ''
            //         : (elem.PGUniversityName[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.PGUniversityName[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.PGUniversityName[0]?.documentValue == null
            //             ? ''
            //             : elem.PGUniversityName[0]?.documentValue),

            //       District: !elem.District?.length
            //         ? ''
            //         : (elem.District[0]?.verificationStatus == 'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.District[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.District[0]?.documentValue == null
            //             ? ''
            //             : elem.District[0]?.documentValue),

            //       AadharLink: !elem.AadharLink?.length
            //         ? ''
            //         : (elem.AadharLink[0]?.verificationStatus == 'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.AadharLink[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.AadharLink[0]?.documentValue == null
            //             ? ''
            //             : elem.AadharLink[0]?.documentValue),

            //       PANcards: !elem.PANcards?.length
            //         ? ''
            //         : (elem.PANcards[0]?.verificationStatus == 'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.PANcards[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.PANcards[0]?.documentValue == null
            //             ? ''
            //             : elem.PANcards[0]?.documentValue),

            //       allCertificate: !elem.allCertificate?.length
            //         ? ''
            //         : (elem.allCertificate[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.allCertificate[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.allCertificate[0]?.documentValue == null
            //             ? ''
            //             : elem.allCertificate[0]?.documentValue),

            //       documentHave: !elem.documentHave?.length
            //         ? ''
            //         : (elem.documentHave[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.documentHave[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.documentHave[0]?.documentValue == null
            //             ? ''
            //             : elem.documentHave[0]?.documentValue),

            //       UpdatedResumes: !elem.UpdatedResumes?.length
            //         ? ''
            //         : (elem.UpdatedResumes[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.UpdatedResumes[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.UpdatedResumes[0]?.documentValue == null
            //             ? ''
            //             : elem.UpdatedResumes[0]?.documentValue),

            //       tenthBoard: !elem.tenthBoard?.length
            //         ? ''
            //         : (elem.tenthBoard[0]?.verificationStatus == 'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.tenthBoard[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.tenthBoard[0]?.documentValue == null
            //             ? ''
            //             : elem.tenthBoard[0]?.documentValue),

            //       twelthBoard: !elem.twelthBoard?.length
            //         ? ''
            //         : (elem.twelthBoard[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.twelthBoard[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.twelthBoard[0]?.documentValue == null
            //             ? ''
            //             : elem.twelthBoard[0]?.documentValue),

            //       PGconsolidated: !elem.PGconsolidated?.length
            //         ? ''
            //         : (elem.PGconsolidated[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.PGconsolidated[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.PGconsolidated[0]?.documentValue == null
            //             ? ''
            //             : elem.PGconsolidated[0]?.documentValue),

            //       Graduationconsolidated: !elem.Graduationconsolidated?.length
            //         ? ''
            //         : (elem.Graduationconsolidated[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.Graduationconsolidated[0]?.verificationStatus ==
            //               'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.Graduationconsolidated[0]?.documentValue == null
            //             ? ''
            //             : elem.Graduationconsolidated[0]?.documentValue),

            //       GraduationProfessional: !elem.GraduationProfessional?.length
            //         ? ''
            //         : (elem.GraduationProfessional[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.GraduationProfessional[0]?.verificationStatus ==
            //               'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.GraduationProfessional[0]?.documentValue == null
            //             ? ''
            //             : elem.GraduationProfessional[0]?.documentValue),

            //       PGProvisional: !elem.PGProvisional?.length
            //         ? ''
            //         : (elem.PGProvisional[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.PGProvisional[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.PGProvisional[0]?.documentValue == null
            //             ? ''
            //             : elem.PGProvisional[0]?.documentValue),

            //       LOI: !elem.LOI?.length
            //         ? ''
            //         : (elem.LOI[0]?.verificationStatus == 'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.LOI[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.LOI[0]?.documentValue == null
            //             ? ''
            //             : elem.LOI[0]?.documentValue),
            //       LOID: !elem.LOID?.length
            //         ? ''
            //         : (elem.LOID[0]?.verificationStatus == 'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.LOID[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.LOID[0]?.documentValue == null
            //             ? ''
            //             : elem.LOID[0]?.documentValue),

            //       PGDegreeName: !elem.PGDegreeName?.length
            //         ? ''
            //         : (elem.PGDegreeName[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.PGDegreeName[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.PGDegreeName[0]?.documentValue == null
            //             ? ''
            //             : elem.PGDegreeName[0]?.documentValue),

            //       PGCollegeName: !elem.PGCollegeName?.length
            //         ? ''
            //         : (elem.PGCollegeName[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.PGCollegeName[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.PGCollegeName[0]?.documentValue == null
            //             ? ''
            //             : elem.PGCollegeName[0]?.documentValue),

            //       PGPassingYears: !elem.PGPassingYears?.length
            //         ? ''
            //         : (elem.PGPassingYears[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.PGPassingYears[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.PGPassingYears[0]?.documentValue == null
            //             ? ''
            //             : elem.PGPassingYears[0]?.documentValue),

            //       TotalWorkExperience: !elem.TotalWorkExperience?.length
            //         ? ''
            //         : (elem.TotalWorkExperience[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.TotalWorkExperience[0]?.verificationStatus ==
            //               'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.TotalWorkExperience[0]?.documentValue == null
            //             ? ''
            //             : elem.TotalWorkExperience[0]?.documentValue),
            //       // --------------------------------------------------------------------------------------------------------------------
            //       postalAddress: elem.userDetails.postalAddress,
            //       uploadVaccinationCertificate:
            //         elem.userDetails.uploadVaccinationCertificate,
            //       droppedStatus: elem.userDetails.droppedStatus,
            //       placedStatus: elem.userDetails.placedStatus,
            //       ugQualification: elem.UGQualification,
            //       ugMarkSheet: !elem.UGMarksheet?.length
            //         ? ''
            //         : (elem.UGMarksheet[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.UGMarksheet[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.UGMarksheet[0]?.documentValue == null
            //             ? ''
            //             : elem.UGMarksheet[0]?.documentValue),
            //       ugPassingYear: elem.UGPassingYear,
            //       pursuingPG: elem.AreyoupursuingPostGraduation,
            //       // pgQualification: elem.PGQualification,

            //       // pgQualification: elem.PGQualification[0]?.documentValue,
            //       pgMarkSheet: !elem.PGMarksheet?.length
            //         ? ''
            //         : (elem.PGMarksheet[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.PGMarksheet[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.PGMarksheet[0]?.documentValue == null
            //             ? ''
            //             : elem.PGMarksheet[0]?.documentValue),
            //       pgPassingYear: elem.PGPassingYear[0]?.documentValue,

            //       mainEarningMember: !elem.MainEarningMemberofFamily?.length
            //         ? ''
            //         : (elem.MainEarningMemberofFamily[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.MainEarningMemberofFamily[0]
            //                 ?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.MainEarningMemberofFamily[0]?.documentValue == null
            //             ? ''
            //             : elem.MainEarningMemberofFamily[0]?.documentValue),

            //       occupationMainEarningMember: !elem
            //         .OccupationofthemainearningoftheFamily?.length
            //         ? ''
            //         : (elem.OccupationofthemainearningoftheFamily[0]
            //             ?.verificationStatus == 'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.OccupationofthemainearningoftheFamily[0]
            //                 ?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.OccupationofthemainearningoftheFamily[0]
            //             ?.documentValue == null
            //             ? ''
            //             : elem.OccupationofthemainearningoftheFamily[0]
            //                 ?.documentValue),

            //       familyIncome: elem.FamilyIncome[0]?.documentValue,
            //       annualIncome: elem.AnnualIncome[0]?.documentValue,
            //       incomeProof: !elem.IncomeProof?.length
            //         ? ''
            //         : (elem.IncomeProof[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.IncomeProof[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.IncomeProof[0]?.documentValue == null
            //             ? ''
            //             : elem.IncomeProof[0]?.documentValue),

            //       incomeProofValidity: !elem.IncomeProofValidity?.length
            //         ? ''
            //         : (elem.IncomeProofValidity[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.IncomeProofValidity[0]?.verificationStatus ==
            //               'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.IncomeProofValidity[0]?.documentValue == null
            //             ? ''
            //             : elem.IncomeProofValidity[0]?.documentValue),

            //       panCard: !elem.Pan?.length
            //         ? ''
            //         : (elem.Pan[0]?.verificationStatus == 'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.Pan[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.Pan[0]?.documentValue == null
            //             ? ''
            //             : elem.Pan[0]?.documentValue),

            //       CasteCertificate: !elem.CasteCertificate?.length
            //         ? ''
            //         : (elem.CasteCertificate[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.CasteCertificate[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.CasteCertificate[0]?.documentValue == null
            //             ? ''
            //             : elem.CasteCertificate[0]?.documentValue),

            //       aadharIdProof: !elem.IDProof?.length
            //         ? ''
            //         : (elem.IDProof[0]?.verificationStatus == 'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.IDProof[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.IDProof[0]?.documentValue == null
            //             ? ''
            //             : elem.IDProof[0]?.documentValue),

            //       rationCard: !elem.RationCard?.length
            //         ? ''
            //         : (elem.RationCard[0]?.verificationStatus == 'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.RationCard[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.RationCard[0]?.documentValue == null
            //             ? ''
            //             : elem.RationCard[0]?.documentValue),

            //       rationCardNumber: !elem.RationCardNo?.length
            //         ? ''
            //         : (elem.RationCardNo[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.RationCardNo[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.RationCardNo[0]?.documentValue == null
            //             ? ''
            //             : elem.RationCardNo[0]?.documentValue),

            //       rationCardColor: !elem.RationCardColor?.length
            //         ? ''
            //         : (elem.RationCardColor[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.RationCardColor[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.RationCardColor[0]?.documentValue == null
            //             ? ''
            //             : elem.RationCardColor[0]?.documentValue),

            //       incomeMentionedInRationCard: !elem.IncomeMentionedinRationcard?.length
            //         ? ''
            //         : (elem.IncomeMentionedinRationcard[0]
            //             ?.verificationStatus == 'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.IncomeMentionedinRationcard[0]
            //                 ?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.IncomeMentionedinRationcard[0]?.documentValue ==
            //           null
            //             ? ''
            //             : elem.IncomeMentionedinRationcard[0]?.documentValue),

            //       photo: !elem.Passport?.length
            //         ? ''
            //         : (elem.Passport[0]?.verificationStatus == 'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.Passport[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.Passport[0]?.documentValue == null
            //             ? ''
            //             : elem.Passport[0]?.documentValue),

            //       updatedResume: !elem.UpdatedResume?.length
            //         ? ''
            //         : (elem.UpdatedResume[0]?.verificationStatus ==
            //           'Yet to verify'
            //             ? 'Yet to verify'
            //             : elem.UpdatedResume[0]?.verificationStatus == 'Yes'
            //             ? 'Valid'
            //             : 'Not Valid') +
            //           '-' +
            //           (elem.UpdatedResume[0]?.documentValue == null
            //             ? ''
            //             : elem.UpdatedResume[0]?.documentValue),
            //     });
            //   });

            //   var projectManager = this.finalProjectBasedReports.map((data) => {
            //     if (data.projectManagerName != 0) {
            //       return data.projectManagerName;
            //     }
            //   });
            //   var managerdata = projectManager.filter(function (element) {
            //     return element !== undefined;
            //   });
            //   let managerArray = managerdata.flat();

            //   let projectManagerList = [...new Set(managerArray)];

            //   let projectarrays = [];
            //   if (managername == 'ALL') {
            //     this.finalProjectBasedReports;
            //   } else {
            //     this.finalProjectBasedReports.map((project) => {
            //       let data = project.projectManagerName?.includes(managername);
            //       if (data == true) {
            //         return projectarrays.push(project);
            //       }
            //     });
            //     this.finalProjectBasedReports = projectarrays;
            //   }

            //   var result = Object.keys(this.finalProjectBasedReports[0]).map(
            //     function (key: string) {
            //       return key;
            //     }
            //   );

            //   let headerName = '';
            //   result.forEach((elem: any, key: any) => {
            //     headerName = this.headerCaseString(elem);
            //     if (elem == 'dob') {
            //       headerName = 'DOB';
            //     } else if (elem == 'tenthMarkSheet') {
            //       headerName = '10th MarkSheet';
            //     } else if (elem == 'twelthMarkSheet') {
            //       headerName = '12th MarkSheet';
            //     } else if (elem == 'knownGTT') {
            //       headerName = 'Known about GTT';
            //     } else if (elem == 'totalMmembersInTheFamily') {
            //       headerName = 'Total members in the family';
            //     } else if (elem == 'userStatus') {
            //       headerName = 'Status';
            //     } else if (elem == 'aadharPan') {
            //       headerName = 'Aadhar/Pan Document(Original)';
            //     } else if (elem == 'incomeProofs') {
            //       headerName =
            //         'Income Proof(Ration Card/Income Certificate/Self Declaration)(Original)';
            //     } else if (elem == 'casteProofs') {
            //       headerName =
            //         'Caste Proof(Leaving Certificate/Caste Certificate)(Original)';
            //     } else if (elem == 'CertificationDate') {
            //       headerName = 'Certification Date';
            //     } else if (elem == 'CasteCategory') {
            //       headerName = 'Caste /Category';
            //     } else if (elem == 'AadharLink') {
            //       headerName = 'Is Aadhar linked With your phone number?';
            //     } else if (elem == 'PANcards') {
            //       headerName = 'Do you have PAN card?';
            //     } else if (elem == 'allCertificate') {
            //       headerName =
            //         'Do you have all original graduation mark sheets and certificate with you?';
            //     } else if (elem == 'documentHave') {
            //       headerName =
            //         'Please specify, which document you do not have?';
            //     } else if (elem == 'UpdatedResumes') {
            //       headerName = 'Updated Resume(Original)';
            //     } else if (elem == 'tenthBoard') {
            //       headerName = '10th board certificate(Original)';
            //     } else if (elem == 'twelthBoard') {
            //       headerName = '12th board certificate';
            //     } else if (elem == 'PGconsolidated') {
            //       headerName = 'PG consolidated marksheet(Original)';
            //     } else if (elem == 'Graduationconsolidated') {
            //       headerName = 'Graduation consolidated marksheet(Original)';
            //     } else if (elem == 'GraduationProfessional') {
            //       headerName = 'Graduation professional degree certificate';
            //     } else if (elem == 'PGProvisional') {
            //       headerName = 'PG provisional degree certificate(Original)';
            //     } else if (elem == 'LOID') {
            //       headerName = 'LOI Document(Original)';
            //     } else if (elem == 'OrgSignature') {
            //       headerName = 'Signature(Original)';
            //     } else if (elem == 'fatherName') {
            //       headerName = 'Father Name(Stu)';
            //     } else if (elem == 'motherName') {
            //       headerName = 'Mother Name(Stu)';
            //     }

            //     if (
            //       elem != 'postalAddress' &&
            //       elem != 'uploadVaccinationCertificate' &&
            //       elem != 'droppedStatus' &&
            //       elem != 'placedStatus' &&
            //       elem != 'droppedStatus' &&
            //       elem != 'ugQualification' &&
            //       elem != 'ugMarkSheet' &&
            //       elem != 'ugPassingYear' &&
            //       elem != 'pursuingPG' &&
            //       elem != 'pgMarkSheet' &&
            //       elem != 'pgPassingYear' &&
            //       elem != 'mainEarningMember' &&
            //       elem != 'occupationMainEarningMember' &&
            //       elem != 'familyIncome' &&
            //       elem != 'annualIncome' &&
            //       elem != 'incomeProof' &&
            //       elem != 'incomeProofValidity' &&
            //       elem != 'panCard' &&
            //       elem != 'CasteCertificate' &&
            //       elem != 'aadharIdProof' &&
            //       elem != 'rationCard' &&
            //       elem != 'rationCardNumber' &&
            //       elem != 'rationCardColor' &&
            //       elem != 'incomeMentionedInRationCard' &&
            //       elem != 'photo' &&
            //       elem != 'updatedResume' &&
            //       elem != 'LOI'  &&
            //       elem != 'tenthMarkSheet' &&
            //       elem != 'twelthMarkSheet' &&
            //       elem != 'knownGTT' &&
            //       elem != 'comments'
            //     ) {
            //       this._projectBasedReportColumns.push({
            //         field: elem,
            //         header: headerName,
            //       });
            //     }
            //   });

            //   this.projectBasedmanager = projectManagerList;

            //   this._projectBasedReportColumnHeader =
            //     this._projectBasedReportColumns;
            //   this._projectBasedReportColumnTitle =
            //     this._projectBasedReportColumnHeader.map((col) => ({
            //       title: col.header,
            //       dataKey: col.field,
            //     }));

            //   this._projectBasedReportColumnDataKey =
            //     this._projectBasedReportColumnHeader.map((col) => ({
            //       dataKey: col.field,
            //     }));
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
  cleardate() {
    window.location.reload();
  }

  /* ================================================ Project Date range Filter End================================================ */
  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs( //+ '_export_' + new Date().getTime()
      data,
      fileName + EXCEL_EXTENSION
    );
    this.selectedProjectBasedDetail = [];
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

  /* Display Project list*/
  projectNameList() {
    this.listOfProjects = [];
    this.programService.getProjectList().subscribe((data) => {
      let activeRecords: any = [];
      if (data.data.length > 0) {
        data.data.forEach((elm, inx) => {
          if (elm.status == 'Active') {
            activeRecords.push(elm);
          }
        });
      }

      this.listOfProjects = activeRecords.sort((a: any, b: any) =>
        a.project_name.toLowerCase() > b.project_name.toLowerCase() ? 1 : -1
      );
    });
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
  analyticalReports($event: any) {
    if (!$event.index) {
      this.currentTab1 = 'RegistrationReport';
      this.currentTab2 = '';
      this.currentTab3 = '';
      $('#inlineRadio_student1').trigger('click');
    } else if ($event.index == 1) {
      this.currentTab2 = 'ProjectBasedRegistrationReports';
      this.currentTab1 = '';
      this.currentTab3 = '';
      $('#inlineRadio_coor1').trigger('click');
    } else if ($event.index == 2) {
      this.currentTab3 = 'ProjectAssignedReports';
      this.currentTab1 = '';
      this.currentTab2 = '';
      $('#inlineRadio_admin1').trigger('click');
    }
  }

  exportReport(extType) {

    let userData;
    if (this.selectedProjectBasedDetail.length > 0) {
      userData = this.selectedProjectBasedDetail;
    } else {
      if (this._searchedColumns.length > 0) {
        userData = this.backUpDateFilterRecords;
      } else {
        userData = [];
      }
    }
    var header = [];
    this.projectBasedRegistrationColumns.forEach((ele, indx) => {
      if (ele.field != 'name') {
        header.push(ele.field);
      }
    });
    if (userData.length > 0) {
      let additionalFieldvalues = [];
      userData.forEach((elem, indx) => {
        if (!additionalFieldvalues.hasOwnProperty(indx)) {
          additionalFieldvalues[indx] = {};
        }
        header.forEach((aelem, ainx) => {
          let aeelems = this.humanize(aelem);
          additionalFieldvalues[indx][aeelems] = (elem[aelem] == null) ? "" : elem[aelem].toString();
        });

      });

      let farray: any = [];
      additionalFieldvalues.forEach((elll, iii) => {
        farray.push(elll)
      });

      let wb = xlsx.utils.book_new();
      const ws = xlsx.utils.json_to_sheet(farray);

      const workbook = {
        Sheets: { 'Project-Based-Report': ws },
        SheetNames: ['Project-Based-Report'],
      };

      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      if (extType != 'CSV') {
        this.saveAsExcelFile(excelBuffer, 'Project-Based-Report');
      } else {
        let EXCEL_TYPE =
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
        let EXCEL_EXTENSION = '.csv';
        const data: Blob = new Blob([excelBuffer], {
          type: EXCEL_TYPE,
        });

        FileSaver.saveAs(data, 'Project-Based-Report' + EXCEL_EXTENSION);
        this.selectedProjectBasedDetail = [];
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
      this.UsermanagementService.exportAllReportFile(this.currentLoginUserId, head, extType).subscribe({
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
}
