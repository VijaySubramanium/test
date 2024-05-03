import { Component, Input, OnInit, Inject, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import * as FileSaver from 'file-saver';
import { NgForm } from '@angular/forms';
import { UserAdminService } from 'src/app/services/user-admin.service';
import { BatchDetailsService } from 'src/app/services/batch-details.service';
import { UsermanagementService } from 'src/app/services/user-management.service';
import { CommonService } from '../common.service';
import { ExportToCsv } from 'export-to-csv';
// import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { UserAdmin } from 'src/app/view-models/useradmin';
import { DatePipe } from '@angular/common';
import { Batch } from 'src/app/view-models/batch';
import * as jsPDF from 'jspdf';
import * as xlsx from 'xlsx';
import 'jspdf-autotable';
import { StudentProfile } from '../view-models/student-profile';
import { CalendarModule } from 'primeng/calendar';
import { Title } from '@angular/platform-browser';
import { PaginatorModule } from 'primeng/paginator';
import * as moment from 'moment';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-batch-details',
  templateUrl: './batch-details.component.html',
  providers: [MessageService, DatePipe],
  styleUrls: ['./batch-details.component.css'],
})
export class BatchDetailsComponent implements OnInit {
  @ViewChild(Table) dt: Table;
  @ViewChild('customPaginator', { static: false }) paginator: PaginatorModule;
  userAdmin = new UserAdmin('', '', '', '', '', '', '', '', '', '', '');
  batch = new Batch('', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '');
  ProfileName = new StudentProfile();

  public loggedInRoleName: string;
  public accessRoleNames: any = [];
  public notAccessRoleNames: any = [];
  public addAdminUserScreen: any = [];
  public loggedInRoleId: number;
  public roleDetails: any = [];
  public roles: any = [];
  public batchStartDate: Date;
  public batchEndDate: Date;
  names: any[];
  showCount: any = 10;
  pageNumber: any = 0;
  batchRowNum: any = 10;
  batchTotalRecords: any = 0;
  batchTotalSearchRecords: any = 0;


  manualSearchCols: any[];
  searchCols: any[];
  _selectedSearchColumns: any[];
  _searchedColumns: any[] = [];
  searchError: boolean = false;

  constructor(
    public userAdminService: UserAdminService,
    private titleService: Title,
    private messageService: MessageService,
    public commonservice: CommonService,
    private bacthDetailsService: BatchDetailsService,
    public datepipe: DatePipe,
    public UsermanagementService: UsermanagementService
  ) {
    this.programNameList();
    this.trainerLists();
    this.courseTypes();

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
    this.notAccessRoleNames = ['TRAINER', 'L&D'];
    this.addAdminUserScreen = [
      'GTT_ADMIN',
      'TRAINER',
      'TRAINING_COORDINATOR',
      'PROGRAM_LEAD',
      'PROJECT_MANAGER',
      'MIS',
      'RECRUITER',
    ];
  }

  @ViewChild('at') at: any;
  @Input() adminDetails: any[];
  batchDetails: any[];

  /* Bulk Upload */
  public files: any;
  public bulkUploadFile: any;

  /* Programs */
  listOfProjects: any = [];
  listOfPrograms: any = [];
  listOfProjectManagers: any = [];
  listOfTrainers: any = [];
  listOfCourses: any = [];
  listOfCourseTypes: any = [];
  // dropdownSettings: IDropdownSettings;
  dropdownList: any = [];
  rightSideMenus: any = [];

  user: any = '';
  currentBatchRowData = {
    batch_id: '',
  };

  /* Batch Details */
  batchCols: any[];
  _selectedBatchColumns: any[];
  _selectedBatchColumnsDuplicate: any[];
  exportColumns: any[];
  batchColumns: any = [];
  batchExportColumns: any[];
  selectedBatchDetails: any = [];
  batchExportCols: any[];
  exportBatchName: string = 'Batch-Details';
  dateTime = new Date();
  editCurrentRowData: any;

  batchBulkUploadMsg: boolean = false;
  @ViewChild('batchFileInput') batchFileInput;
  batchUploadError: boolean = true;

  ngOnInit(): void {
    this.setTitle('TJM-Batch');
    this._selectedBatchColumns = [
      //{ field: 'batch_id', header: 'Id', align: 'center' },
      { field: 'program_name', header: 'Program Name', align: 'center' },
      { field: 'courses', header: 'Course Name', align: 'center' },
      { field: 'batch_code', header: 'Batch Code', align: 'center' },
      { field: 'project_names', header: 'Project Names', align: 'center' },
      { field: 'start_date', header: 'Start Date', align: 'center' },
      { field: 'end_date', header: 'End Date', align: 'center' },
    ];
    this._selectedBatchColumnsDuplicate = this._selectedBatchColumns;
    //this.getBatchDetails();
    this.getBatchDetails()
    // this.dropdownSettings = {
    //   singleSelection: false,
    //   idField: 'id',
    //   textField: 'firstName',
    //   itemsShowLimit: 3,
    // };
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  // Get Program Name List
  programNameList() {
    this.UsermanagementService.getProgramList().subscribe((data) => {
      let programArray = [];
      data.data.forEach((elem: any, index: number) => {
        this.batch.programName = '';
        if (elem.programname != null) {

          if (elem.programstatus == 'Active') {
            programArray.push({
              program_id: elem.programid,
              program_name: elem.programname,
            });
          }
        }
      });

      const programs = programArray.sort((a: any, b: any) =>
        a.program_name.toLowerCase() > b.program_name.toLowerCase() ? 1 : -1
      );

      this.listOfPrograms = programs;
    });
  }

  batchColumnsAlign(response: any) {
    let batchDetails: any = [];
    this.batchColumns = [];
    this.manualSearchCols = [];
    response.forEach((elm, inx) => {
      batchDetails.push({
        course_batch_map_id: elm.course_batch_map_id,
        batch_id: elm.batch_id,
        program_id: elm.program_id,
        program_name: elm.program_name,
        courses: elm.courses,
        courses_details: elm.courses_details,
        batch_code: elm.batch_code,
        project_names: elm.project_names,
        project_id: elm.project_id,
        start_date: (elm.start_date != null) ? moment(elm.start_date).format('YYYY-MM-DD') : '',
        end_date: (elm.end_date != null) ? moment(elm.end_date).format('YYYY-MM-DD') : '',
        no_of_students: (elm.no_of_students > 0) ? elm.no_of_students : '0',
        batch_status: elm.batch_status,
        days: elm.days,
        hours: elm.hours,
        course_type_id: elm.course_type_id,
        course_type_name: elm.course_type_name,
        project_manager_name: elm.project_Manager_name,
        project_managers_details: elm.project_managers_details,
        trainers: elm.trainers,
        trainers_details: elm.trainers_details,
        program_outline: elm.file_name,
        program_outline_url: elm.azure_url_path,
      });
    });

    this.batchDetails = batchDetails;

    console.log(this.batchDetails);
    var result = Object.keys(this.batchDetails[0]).map(function (
      key: string
    ) {
      return key;
    });

    debugger

    result.forEach((elem: any, key: any) => {
      let headerName = this.humanize(elem);


      let newElm = '';
      if (elem == 'batch_code') {
        newElm = 'batchcode';
      } else if (elem == 'batch_status') {
        newElm = 'batchstatus';
      } else if (elem == 'start_date') {
        newElm = 'startdate';
      } else if (elem == 'end_date') {
        newElm = 'enddate';
      } else if (elem == 'project_names') {
        newElm = 'projectname';
      } else if (elem == 'program_name') {
        newElm = 'programname';
      } else if (elem == 'courses') {
        newElm = 'coursename';
      } else if (elem == 'course_type_name') {
        newElm = 'coursetype';
      } else if (elem == 'no_of_students') {
        newElm = 'noofstudents';
      }


      if (elem == 'courses') {
        headerName = 'Course Name';
      } else if (elem == 'project_names') {
        headerName = 'Project Name';
      } else if (elem == 'batch_status') {
        headerName = 'Status';
      } else if (elem == 'project_manager_name') {
        headerName = 'Project Manager Name';
      } else if (elem == 'trainers') {
        headerName = 'Trainer Name';
      } else if (elem == 'file_name') {
        headerName = 'Program Outline'
      } else if (elem == 'no_of_students') {
        headerName = 'No of Students';
      }

      if (
        elem != 'program_id' &&
        elem != 'course_batch_map_id' &&
        elem != 'courses_details' &&
        elem != 'project_id' &&
        elem != 'projects' &&
        elem != 'project_managers_details' &&
        elem != 'courses_details' &&
        elem != 'students' &&
        elem != 'trainers_details' &&
        elem != 'batch_id' &&
        elem != 'azure_url_path' &&
        elem != 'course_type_id' &&
        elem != 'trainerid' &&
        elem != 'program_outline_url' &&
        elem != 'feedback_score'
      ) {
        this.batchColumns.push({
          field: elem,
          header: headerName == 'Batch Id' ? 'Id' : headerName,
          align: 'center',
        });

        this.manualSearchCols.push({
          field: (newElm == '') ? elem : newElm,
          header: headerName,
        });
      }
    });

    this.batchCols = this.batchColumns;
    if (this._searchedColumns.length == 0) {
      this.searchCols = [...this.manualSearchCols].map(item => ({ ...item }));
    }

    this.searchCols = this.searchCols.sort((a: any, b: any) =>
      a.header > b.header ? 1 : -1
    );

    this.batchExportColumns = this.batchCols.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
    this.batchExportCols = this.batchCols.map((col) => ({
      dataKey: col.field,
    }));

  }

  /* Get Admin List Details */
  getBatchDetails() {
    $('.spinner').show();
    this.bacthDetailsService.getBatchDetails().subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.status == 'Success') {
          this.batchColumns = [];
          this.batchTotalRecords = response.totalCount;
          this.batchTotalSearchRecords = response.totalCount;
          this.batchColumnsAlign(response.data);

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

  searchHolder(field) {
    switch (field) {
      case "start_date":
        return "Search ('yyyy-mm-dd')";
        break;

      case "end_date":
        return "Search ('yyyy-mm-dd')";
        break;
      case "batch_status":
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
      this.getBatchDetails();
    }
    this._searchedColumns = [];
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

    console.log(this._selectedSearchColumns);

    if (!this.searchError) {
      console.log(searchJsonArray);
      let searchJson = {
        Input: searchJsonArray
      }

      $('.spinner').show();

      this.bacthDetailsService.multiSearchUser(searchJson).subscribe({
        next: (response) => {
          $('.spinner').hide();
          if (response.status == 'Success') {
            this._searchedColumns = this._selectedSearchColumns;
            this.batchColumnsAlign(
              response.data
            );
            ($('#batchSearch') as any).modal('hide');
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

  addBatchSubmit(formValue: any, batchForm: NgForm) {

    if (formValue.valid) {
      // let projectManager: any = [];
      // let courseNames = formValue.value.batch_add_course_name.split(',');
      // let projectManagers = formValue.value.batch_add_trainer_name.split(',');
      // projects.push(projectNames[1]);

      let trainers: any = [];
      let projects: any = [];
      let programDetails = formValue.value.batch_add_program_name.split('__', 2);
      let courseDetails = formValue.value.batch_add_course_name.split('__', 2);
      let projectNames = formValue.value.batch_add_project_name.split('__', 2);
      let trainerNames = formValue.value.batch_add_trainer_name.split('__', 2);
      // trainers.push(formValue.value.batch_add_trainer_name);

      let params = {
        program_id: programDetails[0],
        // course_names: courseNames,
        //  project_managers: projectManagers,
        // no_of_students: formValue.value.batch_add_no_of_students,
        // program_outline: formValue.value.batch_add_program_outline,
        // over_all_status: formValue.value.batch_add_over_all_status,

        program_name: programDetails[1],
        courses: [{
          'course_id': +courseDetails[0],
          'course_name': courseDetails[1]
        }],
        project_id: +projectNames[0],
        project_names: projectNames[1],
        start_date: this.datepipe.transform(
          formValue.value.batch_add_start_date,
          'yyyy-MM-dd'
        ),
        end_date: this.datepipe.transform(
          formValue.value.batch_add_end_date,
          'yyyy-MM-dd'
        ),
        no_of_students: 0,
        days: formValue.value.batch_add_days,
        hours: formValue.value.batch_add_hours,
        course_type: +formValue.value.batch_add_course_type,
        trainer_id: +trainerNames[0],
        trainers: formValue.value.batch_add_trainer_name,
        program_outline: formValue.value.batch_add_program_outline,
        project_managers_details: this.listOfProjectManagers,
        batch_status: formValue.value.batch_add_status,

      };


      $('.spinner').show();
      this.bacthDetailsService.addBatch(params).subscribe({
        next: (addResponse) => {
          if (addResponse.status == 'Success') {
            this.bacthDetailsService.getBatchDetails().subscribe({
              next: (response) => {
                if (response.status == 'Success') {
                  if (response.data != null) {
                    $('.spinner').hide();
                    this.batchColumnsAlign(response.data);
                    ($('#addbatch') as any).modal('hide');
                    this.resetBatchForm(batchForm);
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Success',
                      detail: 'Batch added successfully',
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
              detail: addErrResponse.error.data.toString(),
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

  /* edit Batch */
  editBatchDetails(rowData: any) {
    debugger
    this.editCurrentRowData = rowData;
    ($('#edit_batch_details') as any).modal('show');
    this.currentBatchRowData.batch_id = rowData.batch_id;
    let programName =
      rowData.program_id != null
        ? rowData.program_id + '__' + rowData.program_name
        : '';
    if (programName != null) {
      let programDetails = programName.split('_', 2);
      this.batch.programName = programName;
      $('.spinner').show();
      this.bacthDetailsService
        .getProjectBasedByProgram(programDetails[0])
        .subscribe({
          next: (response) => {
            console.log('getProjectsBasedOnProgram', response.data);
            $('.spinner').hide();
            if (response.status == 'Success') {
              this.listOfCourses = [];
              this.getProjectsBasedOnCourse(rowData.courses_details[0].course_id + '__' + rowData.courses_details[0].course_name, 'edit');
              response.data.forEach((elem, indx) => {
                this.listOfCourses.push({
                  'course_id': elem.courseid,
                  'course_name': elem.coursename
                });
              });

              this.batch.courseName = rowData.courses_details[0].course_id + '__' + rowData.courses_details[0].course_name;

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


    this.batch.startDate = new Date(rowData.start_date);
    this.batch.endDate = new Date(rowData.end_date);
    this.batch.days = rowData.days;
    this.batch.hours = rowData.hours;
    this.batch.courseType = rowData.course_type_id;
    this.batch.noOfStudents = rowData.no_of_students;
    this.batch.projectManagerName =
      rowData.project_managers != null && rowData.project_managers.length > 0
        ? rowData.project_managers
        : '';
    this.batch.trainerName =
      rowData.trainers != null && rowData.trainers != undefined
        ? rowData.trainers_details[0].trainer_id + '__' + rowData.trainers_details[0].trainer_name
        : '';
    this.batch.programOutline = rowData.program_outline;
    this.batch.programOutlineUrl = rowData.program_outline_url;
    this.batch.status =
      rowData.batch_status == 'Deactivated' ||
        rowData.batch_status == 'Inactive'
        ? 'Inactive'
        : 'Active';
  }

  /* Display Project list*/
  projectNameList() {
    this.UsermanagementService.getProjectList().subscribe((data) => {
      const project = data.data.sort((a: any, b: any) =>
        a.project_name > b.project_name ? 1 : -1
      );
      project.forEach((elem: any, index: number) => {
        this.batch.projectName = '';
        if (elem.project_name != null) {
          this.listOfProjects.push(elem);
        }
      });
    });
  }


  /* Display Trainer list*/
  courseTypes() {
    this.bacthDetailsService.getCourseTypes().subscribe({
      next: (response) => {
        response.data.forEach((elem, indx) => {
          this.listOfCourseTypes.push({
            course_type_id: elem.coursetypeid,
            course_type_name: elem.coursetype,
          });
        });
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

  /* Display Trainer list*/
  trainerLists() {
    let role_id = 7;
    this.bacthDetailsService.getTrainerLists(role_id).subscribe({
      next: (response) => {
        this.batch.trainerName = '';
        response.data.forEach((elem, indx) => {
          this.listOfTrainers.push({
            trainer_id: elem.userid,
            trainer_name: elem.firstname + ' ' + elem.lastname,
          });
        });
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

  /* Display getProjectsBasedOnProgram list*/
  getProjectsBasedOnProgram(program: any) {
    let programDetails = program.split('_', 2);
    $('.spinner').show();
    this.bacthDetailsService
      .getProjectBasedByProgram(programDetails[0])
      .subscribe({
        next: (response) => {
          console.log('getProjectsBasedOnProgram', response.data);
          $('.spinner').hide();
          if (response.status == 'Success') {
            this.listOfCourses = [];
            this.listOfProjects = [];
            this.batch.courseName = '';
            this.batch.projectName = '';
            this.batch.noOfStudents = "0";
            response.data.forEach((elem, indx) => {
              this.listOfCourses.push({
                'course_id': elem.courseid,
                'course_name': elem.coursename
              });
            });
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


  /* Display getProjectsBasedOnProgram list*/
  getProjectsBasedOnCourse(course: any, action) {
    debugger
    let courseDetails = course.split('__', 2);
    let programDetails = this.batch.programName.split('_', 2);
    $('.spinner').show();
    this.bacthDetailsService
      .getProjectBasedByCourse(programDetails[0], courseDetails[0])
      .subscribe({
        next: (response) => {
          console.log('getProjectsBasedOnProgram', response.data);
          $('.spinner').hide();
          if (response.status == 'Success') {
            this.listOfProjects = [];
            this.batch.projectName = '';
            response.data.forEach((elem, indx) => {
              this.listOfProjects.push({
                project_id: elem.project_id,
                project_name: elem.project_name,
              });
            });

            if (action == 'edit') {
              this.batch.projectName = this.editCurrentRowData.project_id + '__' + this.editCurrentRowData.project_names;
              this.getProjectManagersBasedOnProject(this.batch.projectName);
            }
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.message,
            });
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

  /* Display getProjectManagersBasedOnProject list*/
  getProjectManagersBasedOnProject(project: any) {
    if (this.batch.courseName != '') {
      let programDetails = this.batch.programName.split('__', 2);
      let courseDetails = this.batch.courseName.split('__', 2);
      let projectDetails = project.split('__', 2);
      $('.spinner').show();
      let params: any = {};
      params = {
        program_id: programDetails[0],
        project_id: projectDetails[0],
        course_id: courseDetails[0]
      };

      this.batch.projectManagerName = '';
      this.batch.programOutline = '';
      this.bacthDetailsService
        .getAPIProjectManagerListBasedProject(params)
        .subscribe({
          next: (response) => {
            console.log('getProjectManagersBasedOnProject', response.data);
            $('.spinner').hide();
            if (response.status == 'Success') {
              if (response.data.projectm_manager_list.length > 0) {
                this.listOfProjectManagers = [...new Set(response.data.projectm_manager_list)];
                let project_manager_names = this.listOfProjectManagers.map(
                  (x: { project_manager_name: any }) => x.project_manager_name
                );

                this.batch.projectManagerName = project_manager_names.toString();

                this.batch.programOutline = response.data.file_name;
                this.batch.programOutlineUrl = response.data.url;
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
    } else {
      $('#batch_add_project_name').val('');
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select a course',
      });

    }
  }

  onListOfRightMenus(eventData: string) {
    let arr = JSON.parse(eventData);
    Object.entries(arr).forEach(([key, value]) =>
      this.rightSideMenus.push(value)
    );
  }

  @Input() get selectedBatchColumns(): any[] {
    return this._selectedBatchColumns;
  }

  set selectedBatchColumns(val: any[]) {
    this._selectedBatchColumns = this.batchCols.filter((col) =>
      val.includes(col)
    );
  }

  columnFilter($event: any) {
    if ($event.value.length == 0) {
      this._selectedBatchColumns = this._selectedBatchColumnsDuplicate;
    } else {
      this._selectedBatchColumns = $event.value;
    }
  }

  onSelectItem($event: any) {
    this.batch.projectManagerName.forEach((element: any, indx: any) => { });
  }

  /* date validation */
  getStartDateValidation(startvalue: any, endvalue: any) {
    if (startvalue < endvalue) {
      this.batch.startDate = startvalue;
      this.batch.endDate = endvalue;
    } else {
      this.batch.startDate = startvalue;
      this.batch.endDate = startvalue;
    }
  }

  /* Update Batch */
  onSubmitUpdateBatch(formValue: any, editBatchForm: NgForm) {

    debugger
    if (formValue.valid) {
      let projects: any = [];
      let trainers = formValue.value.batch_edit_trainer_name.split('__');
      let programDetails = formValue.value.batch_edit_program_name.split('__', 2);
      let courseDetails = formValue.value.batch_edit_course_name.split('__', 2);
      let projectNames = formValue.value.batch_edit_project_name.split('__', 2);

      let params = {
        course_batch_map_id: this.editCurrentRowData.course_batch_map_id,
        program_id: programDetails[0],
        program_name: programDetails[1],
        courses: [{
          'course_id': +courseDetails[0],
          'course_name': courseDetails[1]
        }],
        start_date: this.datepipe.transform(
          formValue.value.batch_edit_start_date,
          'yyyy-MM-dd'
        ),
        end_date: this.datepipe.transform(
          formValue.value.batch_edit_end_date,
          'yyyy-MM-dd'
        ),
        days: formValue.value.batch_edit_days,
        hours: formValue.value.batch_edit_hours,
        course_type: +formValue.value.batch_edit_course_type,
        no_of_students: +formValue.value.batch_edit_no_of_students,
        trainer_id: +trainers[0],
        trainers: trainers[1],
        batch_status: formValue.value.batch_edit_status,
        project_id: projectNames[0],
        project_names: projectNames[1],
        program_outline: formValue.value.batch_edit_program_outline,
      };


      $('.spinner').show();
      this.bacthDetailsService
        .updateBatchDetails(this.currentBatchRowData.batch_id, params)
        .subscribe({
          next: (editresponse) => {
            if (editresponse.status == 'Success') {
              ($('#edit_batch_details') as any).modal('hide');
              this.resetBatchForm(editBatchForm);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Batch update successfully',
              });
              this.bacthDetailsService.getBatchDetails().subscribe({
                next: (batchResponse) => {
                  if (batchResponse.status == 'Success') {
                    if (batchResponse.data != null) {
                      $('.spinner').hide();
                      this.batchColumnsAlign(
                        batchResponse.data
                      );
                    }
                  }
                },
                error: (batchErrResponse) => {
                  $('.spinner').hide();
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail:
                      batchErrResponse.error.message == null
                        ? batchErrResponse.error.error
                        : batchErrResponse.error.message,
                  });
                },
              });
            }
          },
          error: (editErrResponse) => {
            $('.spinner').hide();
            if (
              editErrResponse.error != null &&
              editErrResponse.error.status == 'Failed'
            ) {
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
                  editErrResponse.error != null
                    ? editErrResponse.error.message
                    : editErrResponse.message,
              });
            }
          },
        });
    }
  }

  /* view Batch */
  viewBatchDetails(rowData: any) {
    $('.spinner').show();
    debugger;
    ($('#view_batch_details') as any).modal('hide');
    this.bacthDetailsService.getViewBatchList(rowData.batch_id).subscribe({
      next: (response) => {
        $('.spinner').hide();
        debugger;
        if (
          response.status == 'Success' &&
          response.data.user_details.length > 0
        ) {
          ($('#view_batch_details') as any).modal('show');
          this.names = [];
          response.data.user_details.forEach((elem: any, index: any) => {
            this.names.push({
              studentName: elem.user_name,
              email: elem.email,
              mobile: elem.mobile,
            });
            console.log(this.names);
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Student not mapped in batch details',
          });
        }
      },
    });
  }

  /*downloadView batch details*/
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
    const workbook = { Sheets: { 'Batch-Details': worksheet }, SheetNames: ['Batch-Details'] };
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'Batch-Details');
    //this.saveAsExcelFile(excelBuffer, "BulkStudentRegistrationTemplate");
    // });
  }


  onBulkUplaod() {
    let fi = this.batchFileInput.nativeElement;
    if (fi.files && fi.files[0] && this.batchUploadError == true) {
      $('.spinner').show();

      this.bacthDetailsService.onBulkUpload(this.bulkUploadFile).subscribe({
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
            this.getBatchDetails();
            ($('#addbatch') as any).modal('hide');
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
            this.getBatchDetails();
            ($('#addbatch') as any).modal('hide');
            this.messageService.add({
              severity: 'success',
              summary: 'Sucess',
              detail: 'Successfully Uploaded',
            });
            this.batchFileInput.nativeElement.value = '';

          }
        },
        error: (err) => {
          this.getBatchDetails();
          ($('#addbatch') as any).modal('hide');
          $('.spinner').hide();
          this.batchFileInput.nativeElement.value = '';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              err.error.message == null ? err.error.error : err.error.message,
          });
        },
      });
    } else {
      this.batchBulkUploadMsg = true;
    }
  }


  onBulkUploadChange(event: any) {
    this.batchBulkUploadMsg = false;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.bulkUploadFile = file;
      var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
      let _validFileExtensions = ['csv', 'xlsx'];
      if (event.target.files.length > 0 && _validFileExtensions.includes(ext)) {
        if (this.bulkUploadFile.size > 20000000) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'File size should be less than 20MB',
          });
          this.batchUploadError = false;
        } else {
          this.batchUploadError = true;
        }
        this.batchUploadError = true;
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Invalid file format',
        });
        this.batchUploadError = false;
      }
    }
  }

  private setting = {
    element: {
      dynamicDownload: null as unknown as HTMLElement,
    },
  };

  private dyanmicDownloadByHtmlTag(arg: { fileName: string; text: string }) {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    debugger;
    const fileType =
      arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute(
      'href',
      `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`
    );
    element.setAttribute('download', arg.fileName);

    var event = new MouseEvent('click');
    element.dispatchEvent(event);
    this.batchFileInput.nativeElement.value = '';
  }

  capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  //  Export Batch Details
  //===========================

  exportExcel() {
    const worksheet = xlsx.utils.json_to_sheet(this.batchDetails);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'Batch-Details');
  }

  exportBatchDetailPdf(dt: any) {
    var doc: any = new jsPDF.default('p', 'pt', 'a1', true);
    this.batchExportColumns = [];
    Object.keys(this._selectedBatchColumns).forEach((key) => {
      this.batchExportColumns.push({
        title: this._selectedBatchColumns[key].header,
        dataKey: this._selectedBatchColumns[key].field,
      });
    });

    doc.autoTable(this.batchExportColumns, this.selectedBatchDetails, {
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
    });
    doc.save('Batch-Details.pdf');
  }

  exportBatchCSV(){
    let batcDetailsExcelDetails: any = [];
    let columns: any = [];

    this.selectedBatchDetails.forEach((elem, inx) => {
      if (!batcDetailsExcelDetails.hasOwnProperty(inx)) {
        batcDetailsExcelDetails[inx] = {};
      }
      this._selectedBatchColumns.forEach((elm, indx) => {
        // let headerName = elm.header.replace(/\s/g, '');
        let headerName = elm.header;
        if (elm.field == 'no_of_students') {
          batcDetailsExcelDetails[inx][headerName] =
            elem[elm.field] != '' && elem[elm.field] != null
              ? elem[elm.field].toString()
              : 0;
        } else {
          batcDetailsExcelDetails[inx][headerName] =
            elem[elm.field] != '' && elem[elm.field] != null
              ? elem[elm.field].toString()
              : '';
        }


      });
    });

    if (this.selectedBatchDetails.length == 0) {
      this._selectedBatchColumns.forEach((elm, indx) => {
        // let headerName = elm.header.replace(/\s/g, '');
        let headerName = elm.header;
        columns[headerName] = '';
      });
      batcDetailsExcelDetails.push(columns);
    }

    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      filename: 'Batch-Details',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(batcDetailsExcelDetails);
    this.selectedBatchDetails = [];
  }



  exportBatchDetailExcel() {
    let batcDetailsExcelDetails: any = [];
    let columns: any = [];

    this.selectedBatchDetails.forEach((elem, inx) => {
      if (!batcDetailsExcelDetails.hasOwnProperty(inx)) {
        batcDetailsExcelDetails[inx] = {};
      }
      this._selectedBatchColumns.forEach((elm, indx) => {
        // let headerName = elm.header.replace(/\s/g, '');
        let headerName = elm.header;
        if (elm.field == 'no_of_students') {
          batcDetailsExcelDetails[inx][headerName] =
            elem[elm.field] != '' && elem[elm.field] != null
              ? elem[elm.field].toString()
              : 0;
        } else {
          batcDetailsExcelDetails[inx][headerName] =
            elem[elm.field] != '' && elem[elm.field] != null
              ? elem[elm.field].toString()
              : '';
        }


      });
    });

    if (this.selectedBatchDetails.length == 0) {
      this._selectedBatchColumns.forEach((elm, indx) => {
        // let headerName = elm.header.replace(/\s/g, '');
        let headerName = elm.header;
        columns[headerName] = '';
      });
      batcDetailsExcelDetails.push(columns);
    }

    const worksheet = xlsx.utils.json_to_sheet(batcDetailsExcelDetails);
    const workbook = { Sheets: { 'Batch-Details': worksheet }, SheetNames: ['Batch-Details'] };
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'Batch-Details');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    this.selectedBatchDetails = [];
  }

  // ======================= End Export Details ======================

  StatusModal() {
    $('.form-check-input').addClass('radio_css');
  }

  changeStatusCss() {
    $('.form-check-input').removeClass('radio_css');
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

  resetBatchForm(batchForm: NgForm) {
    batchForm.resetForm();
  }

  BatchChangeStatus(bt: any) {
    $('.spinner').show();
    let batch_idss = this.selectedBatchDetails.map(
      (x: { batch_id: any }) => x.batch_id
    );
    let batch_ids = [...new Set(batch_idss)];
    let params = {
      batchStatus: this.batch.status,
      batchIds: batch_ids,
    };

    this.bacthDetailsService.batchChangeStatus(params).subscribe({
      next: (changeStatusResponse) => {
        if (changeStatusResponse.status.toLowerCase() == 'success') {
          ($('#batchchangestatus') as any).modal('hide');
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: changeStatusResponse.message,
          });

          this.bacthDetailsService.getBatchDetails().subscribe({
            next: (response) => {
              if (response.status == 'Success') {
                if (response.data != null) {
                  $('.spinner').hide();
                  this.batchColumnsAlign(response.data);
                  this.selectedBatchDetails = [];
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

  onFilter(event, at) {
    console.log(event.filters);
    if (Object.keys(event.filters).length != 0) {
      console.log(event.filters.global.value.length);
      this.batchTotalRecords = event.filteredValue.length;
    } else {
      this.batchTotalRecords = this.batchTotalSearchRecords;
    }
  }

  paginate(event) {
    this.batchRowNum = event.rows;
    this.pageNumber = event.first / event.rows // Index of the new page if event.page not defined.
    this.showCount = this.batchRowNum;
    this.getBatchDetails();
  }
}
