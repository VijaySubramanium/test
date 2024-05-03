import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ProgramDetailsService } from 'src/app/services/program-details.service';
import { ProjectDetailsService } from '../services/project-details.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { MessageService } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import {
  addProgramDetails,
  editProgramDetails,
} from '../view-models/addprogram';
import * as FileSaver from 'file-saver';
import { ExportToCsv } from 'export-to-csv';
import * as jsPDF from 'jspdf';
import * as xlsx from 'xlsx';
import 'jspdf-autotable';
// import { NgForm } from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';
import { Validators, FormGroup, FormBuilder, FormArray, NgForm, FormControl } from '@angular/forms';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-program-management',
  templateUrl: './program-management.component.html',
  providers: [MessageService, DatePipe],
  styleUrls: ['./program-management.component.css'],
})
export class ProgramManagementComponent implements OnInit {
  addProgram = new addProgramDetails('', [], '', '', '', '', [], '', '');
  editProgram = new editProgramDetails('', '', '', [], '', '', '', '', [], '', '');
  @ViewChild(Table) dt: Table;
  @ViewChild('programFileInput') programFileInput;
  @ViewChild('programOutlineFile') programOutlineFile;
  programBulkUploadMsg: boolean = false;
  programfileUploadError: boolean = true;
  bulkProgramUploadFile: any;
  selectedProgram: any;
  selectedEditProgram: any;
  _selectedColumns: any[];
  _selectedColumnsDup: any[];
  programDetails: any;
  programDropDownDetails: any = [];
  columns: any[] = [];
  cols: any[];
  exportCols: any[];
  exportColumns: any = [];
  names: any[];
  exportProgramName = 'Program-Details';
  rightSideMenus: any = [];
  public programSearchFilter: any = [];
  selectedProgramDetails: any = [];
  dateTime = new Date();

  public loggedInRoleName: string;
  public loggedInRoleId: string;
  public accessRoleNames: any = [];
  public notAccessRoleNames: any = [];
  roles: any = [];
  user: any = '';
  currentProgramId: any;

  courseddl: any = [];
  projectddl: any;
  projectManagerLists: any = [];
  projectManagerIds: any = [];

  coursedropdownSettings: IDropdownSettings = {};
  coursedropdownList: { item_id: number; item_text: string }[];
  projectdropdownSettings: IDropdownSettings = {};
  projectdropdownList: { item_id: number; item_text: string }[];

  selectProjects: any = [];

  public uploadOption: boolean = true;
  message: string | undefined;
  editMessage: string | undefined;
  public files: any;
  public editFiles: any;
  public editExistsUploadFileName: any;


  searchCols: any[];
  _selectedSearchColumns: any[];
  _searchedColumns: any[] = [];
  searchError: boolean = false;
  manualSearchCols: any = [];


  constructor(
    public projectService: ProjectDetailsService,
    public programService: ProgramDetailsService,
    private titleService: Title,
    private messageService: MessageService,
    public datepipe: DatePipe
  ) {
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
    this.notAccessRoleNames = ['TRAINER', 'L&D'];

    this.projectNameList();
    this.courseList();

    this._selectedColumns = [
      { field: 'program_name', header: 'Program Name', align: 'center' },
      { field: 'course_name', header: 'Course Name', align: 'center' },
      {
        field: 'project_manager_name',
        header: 'Project Manager Name',
        align: 'center',
      },
      { field: 'project_name', header: 'Project Name', align: 'center' },
      { field: 'program_status', header: 'Status', align: 'center' },
    ];

    this._selectedColumnsDup = this._selectedColumns;
    this.coursedropdownList = [];
    this.projectdropdownList = [];

    this.coursedropdownSettings = {
      idField: 'course_id',
      textField: 'coursename',
    };

    this.projectdropdownSettings = {
      idField: 'project_id',
      textField: 'project_name',
    };

    this.programSearchFilter = [
      'program_name',
      'course_name',
      'program_status',
      'project_name',
      'project_manager_name',
    ];
  }

  ngOnInit(): void {
    this.getProgramList();
    this.setTitle('TJM-Program');
    this.programDropDownDetails.push({
      'program_id': 0,
      'program_name': 'Create a new program'
    })
  }
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  changeProgram($event, p) {

  }

  changeEditProgram($event, edit) {
    if ($event.value != null && $event.value.program_id == 0) {
      this.editProgram.programName = '';
      this.UploadCerticate(false);
    }
  }


  searchHolder(field) {
    switch (field) {
      case "end_date":
        return "Search ('yyyy-mm-dd')";
        break;
      case "start_date":
        return "Search ('yyyy-mm-dd')";
        break;
      case "program_status":
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
      this.getProgramList();
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
      this.programService.multiSearchUser(searchJson).subscribe({
        next: (response) => {
          $('.spinner').hide();
          if (response.status == 'Success') {
            this._searchedColumns = this._selectedSearchColumns;
            this.programColumnsAlign(response.data);
            ($('#programSearch') as any).modal('hide');
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


  clearEvent(programForm) {
    // programForm.resetForm();
    this.selectedProgram = null;
    this.selectedEditProgram = null;
  }

  resetProgram(p, edit) {
    p.resetForm();
    edit.resetForm();
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
    let _validFileExtensions = ['jpeg', 'xlsx', 'jpg', 'pdf', 'doc', 'png', 'xls', 'docx', 'PNG', 'JPEG', 'JPG', 'csv', 'CSV', 'PPT', 'ppt', 'PDF', 'PPTX', 'pptx'];
    if (event.target.files.length > 0 && _validFileExtensions.includes(ext)) {
      this.message = '';
      if (this.files.size > 2000000) {
        this.message = 'File size less than 2MB';
      } else {
        this.message = '';
        this.addProgram.programOutline = file.name;
      }
    } else {
      this.message = 'Invalid file format';
      this.addProgram.programOutline = null;
    }
  }

  /* Display Project list*/
  projectNameList() {
    this.programService.getProjectList().subscribe((data) => {
      let activeRecords: any = [];
      if (data.data.length > 0) {
        data.data.forEach((elm, inx) => {
          if (elm.status == 'Active') {
            activeRecords.push(elm);
          }
        });
      }

      this.projectddl = activeRecords.sort((a: any, b: any) =>
        a.project_name.toLowerCase() > b.project_name.toLowerCase() ? 1 : -1
      );
    });
  }

  courseList() {
    this.programService.getCourseList().subscribe((data) => {
      if (data.data.length > 0) {
        let coursesList = [];
        data.data.forEach((elem, indx) => {
          if (elem.coursename != null) {
            coursesList.push(elem);
          }
        });

        const courses = coursesList.sort((a: any, b: any) =>
          a.coursename.toLowerCase() > b.coursename.toLowerCase() ? 1 : -1
        );

        this.courseddl = courses;

        console.log(this.courseddl);
      }
    });
  }

  columnFilter($event: any) {
    if ($event.value.length == 0) {
      this._selectedColumns = this._selectedColumnsDup;
    }
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }

  onListOfRightMenus(eventData: string) {
    let arr = JSON.parse(eventData);
    Object.entries(arr).forEach(([key, value]) =>
      this.rightSideMenus.push(value)
    );
  }



  UploadCerticate(value) {
    this.uploadOption = value;
    if (value == true) {
      this.editProgram.programOutline = (this.editExistsUploadFileName != null && this.editExistsUploadFileName != undefined) ? this.editExistsUploadFileName : "";
      this.editMessage = '';
    }
  }

  onEditFileChange(event: any) {
    this.editMessage = null;
    const file = event.target.files[0];
    this.editFiles = file;
    var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
    let _validFileExtensions = ['jpeg', 'xlsx', 'jpg', 'pdf', 'doc', 'png', 'xls', 'docx', 'PNG', 'JPEG', 'JPG', 'csv', 'CSV', 'PPT', 'ppt', 'PDF', 'PPTX', 'pptx'];;
    if (event.target.files.length > 0 && _validFileExtensions.includes(ext)) {
      this.editMessage = '';
      if (this.editFiles.size > 2000000) {
        this.editMessage = 'File size less than 2MB';
      } else {
        this.editMessage = '';
        this.editProgram.programOutline = file.name;
        this.uploadOption = true;
      }
    } else {
      this.editMessage = 'Invalid file format';
      this.editProgram.programOutline = null;
    }
  }

  /*Add project*/
  onAddProgram(formvalue: any, p: NgForm) {

    if (formvalue.valid && this.message == '') {
      // let courses = formvalue.value.Course.map(
      //   (x: { coursename: any }) => x.coursename
      // );

      // let projectName = formvalue.value.projectname.map(
      //   (x: { project_name: any }) => x.project_name
      // );
      let projectName: any = [];
      let proName = formvalue.value.projectname.split('__', 2);

      let params = {
        programName: formvalue.value.programname.program_id != 0
          ? this.selectedProgram.program_name
          : this.addProgram.programName,
        courses: [this.addProgram.courses],
        programOutline: this.addProgram.programOutline,
        programStatus: this.addProgram.programStatus,
        startDate: moment(this.addProgram.startDate).format('YYYY-MM-DD'),
        endDate: moment(this.addProgram.endDate).format('YYYY-MM-DD'),
        insertedById: +JSON.parse(this.user).id,
        projectName: [proName[1]],
        projectManagerId: this.addProgram.projectManagerId,
        projectManagerName: this.addProgram.projectManagerName,
      };

      let files = this.files == null || this.files == undefined ? '' : this.files;

      $('.spinner').show();
      this.programService.addProgram(params, files).subscribe({
        next: (data) => {
          if (data.status == 'Success') {
            ($('#addprogram') as any).modal('hide');
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Program saved successfully',
            });
            this.resetProgramForm(p);
            this.selectedProgram = [];
            this.myGroup.reset();
            this.files = '';

            this.programService.getProgramDetails().subscribe({
              next: (response) => {
                if (response.status == 'Success') {
                  if (response.data != null) {
                    $('.spinner').hide();
                    this.programColumnsAlign(
                      response.data
                    );
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
          $('.spinner').hide();
          if (data.error.status == 'Failed') {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: data.error.data.toString(),
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: data.error.message,
            });
          }
        },
      });
    }
  }

  otherChange() {
    debugger
    if (this.selectedProgram.length > 0) {

    }
  }

  editProgramDetails(rowData: any) {

    this.UploadCerticate(true);
    this.getprojectBasedRecords(rowData.project_id + '__' + rowData.project_name, 'edit');

    let programInx = this.programDropDownDetails.findIndex((x: any) => {
      return x.program_id == rowData.program_id;
    });

    this.selectedEditProgram = this.programDropDownDetails[programInx];
    ($('#edit_user_details') as any).modal('show');
    this.currentProgramId = rowData.program_id;
    this.editProgram.programMapId = rowData.course_program_map_id;
    this.editProgram.programName = rowData.program_name;
    this.editProgram.projectName = rowData.project_id + '__' + rowData.project_name;
    this.editProgram.courseId = rowData.course_id;
    this.editProgram.courseName = rowData.course_id + '__' + rowData.course_name;
    this.editProgram.projectManagerId = rowData.project_manager_id;
    this.editProgram.projectManagerName = rowData.project_manager_name;
    this.editProgram.programOutline = rowData.file_name;
    this.editProgram.status = rowData.program_status;
    this.editProgram.startdate = new Date(moment(rowData.start_date).format('YYYY-MM-DD'));
    this.editProgram.enddate = new Date(moment(rowData.end_date).format('YYYY-MM-DD'));
    this.editExistsUploadFileName = rowData.program_outline;
  }

  onSubmitUpdateProgram(formValue: any, edit: NgForm) {

    if (formValue.valid && this.uploadOption == true) {
      let editProName = [];
      let proName = formValue.value.editprojectname.split('__', 2);
      let courses = formValue.value.editcourse.split('__', 2);
      let UpdateProjectManagerIds = [...new Set(this.projectManagerIds)];

      let params = {
        programId: String(this.currentProgramId),
        programName: formValue.value.editprogramname.program_id != 0
          ? this.selectedEditProgram.program_name
          : this.editProgram.programName,
        program_project_crs_map_id: this.editProgram.programMapId,
        courseId: courses[0],
        projectName: [proName[1]],
        programOutline: this.editProgram.programOutline,
        status: formValue.value.editstatus,
        startDate: moment(formValue.value.editstartdate).format('YYYY-MM-DD'),
        endDate: moment(formValue.value.editenddate).format('YYYY-MM-DD'),
        updatedbyid: +JSON.parse(this.user).id,
        projectManagerId: UpdateProjectManagerIds.toString(),
        file_name: this.editProgram.programOutline
      };

      let editFiles = this.editFiles == null || this.editFiles == undefined ? '' : this.editFiles;

      $('.spinner').show();
      this.programService.updateProgramDetails(params, editFiles).subscribe({
        next: (editresponse) => {
          if (editresponse.status == 'Success') {
            ($('#edit_user_details') as any).modal('hide');
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Program updated successfully',
            });
            this.programService.getProgramDetails().subscribe({
              next: (response) => {
                if (response.status == 'Success') {
                  if (response.data != null) {
                    $('.spinner').hide();
                    this.programColumnsAlign(response.data);
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
          $('.spinner').hide();
          if (data.error.status == 'Failed') {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                data.error.data != null
                  ? data.error.data.toString()
                  : data.error.message,
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: data.error.message,
            });
          }
        },
      });
    }


    //}
  }

  getprojectBasedRecords(value: any, type) {

    this.selectProjects = [];
    let projectIds = value.split('__', 2);
    if (type == 'add' || type == 'edit') {
      this.selectProjects.push(projectIds[0]);
    } else {
      var projectIndx = this.selectProjects.indexOf(projectIds[0]);
      this.selectProjects.splice(projectIndx, 1);
    }

    let params: any = {};
    params = {
      projectids: this.selectProjects,
    };

    this.addProgram.projectManagerName = '';
    this.addProgram.projectManagerId = '';
    this.editProgram.projectManagerName = '';
    this.editProgram.projectManagerId = '';

    if (this.selectProjects.length > 0) {
      $('.spinner').show();
      this.programService.getProjectBasedRecords(params).subscribe({
        next: (response) => {
          if (response.data != null) {
            $('.spinner').hide();
            this.projectManagerLists = [];
            this.projectManagerIds = [];
            if (response.status == 'Success') {
              response.data.forEach((elm, inx) => {
                let splitNames = elm.project_manager_name.split(',');
                let splitIds = elm.project_manager_id.split(',');

                splitNames.forEach((elm, inx) => {
                  // let nameInx = this.projectManagerLists.findIndex((x: any) => {
                  //   return x == elm.trim();
                  // });
                  // if (nameInx == -1) {
                  this.projectManagerLists.push(elm.trim());
                  // }
                });

                splitIds.forEach((elmId, inxId) => {
                  let IdInx = this.projectManagerIds.findIndex((x: any) => {
                    return x == elmId.trim();
                  });
                  if (IdInx == -1) {
                    this.projectManagerIds.push(elmId.trim());
                  }
                });
              });
            }

            // let projectmanager: any = [];
            this.addProgram.projectManagerName =
              this.projectManagerLists.toString();
            this.addProgram.projectManagerId =
              this.projectManagerIds.toString();
            this.editProgram.projectManagerName =
              this.projectManagerLists.toString();
            this.editProgram.projectManagerId =
              this.projectManagerIds.toString();
          }
        },
        error: (data) => {
          $('.spinner').hide();
          if (data.error.status == 'Failed') {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                data.error.data != null
                  ? data.error.data.toString()
                  : data.error.message,
            });
          }
        },
      });
    }
  }



  /*Change status project details*/
  onchangeStatus(dt: any) {

    let programIds = this.selectedProgramDetails.map(
      (x: { course_program_map_id: any }) => x.course_program_map_id
    );

    let checkValue = $('input[name="programstatus"]:checked').val();
    $('.spinner').show();
    let params = {
      status: checkValue,
      program_ids: programIds,
    };

    this.programService.changeStatus(params).subscribe({
      next: (changeresponse) => {
        if (changeresponse.status.toLowerCase() == 'success') {
          ($('#changestatus') as any).modal('hide');
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: changeresponse.message,
          });
          this.selectedProgramDetails = [];
          this.programService.getProgramDetails().subscribe({
            next: (response) => {
              if (response.status == 'Success') {
                if (response.data != null) {
                  $('.spinner').hide();
                  this.programColumnsAlign(response.data);
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

  programColumnsAlign(response) {
    this.programDetails = [];
    this.programDropDownDetails = [];
    let progemDrpDown = [];
    response.forEach((elm, inx) => {
      this.programDetails.push({
        course_program_map_id: elm.course_program_map_id,
        program_id: elm.program_id,
        program_name: elm.program_name,
        start_date: (elm.start_date != null) ? moment(elm.start_date).format('YYYY-MM-DD') : '',
        end_date: (elm.end_date != null) ? moment(elm.end_date).format('YYYY-MM-DD') : '',
        program_status: elm.program_status,
        file_name: elm.file_name,
        file_url: elm.url_path,
        project_id: elm.project_id,
        project_name: elm.project_name != null ? elm.project_name : '',
        course_id: elm.course_id != null ? elm.course_id : '',
        course_name: elm.course_name != null ? elm.course_name : '',
        project_manager_name: elm.project_manager_name != null ? elm.project_manager_name : '',
        project_manager_id: elm.project_manager_id != null ? elm.project_manager_id : '',
        number_of_student: elm.number_of_student,
      });

      let programInx = progemDrpDown.findIndex((x: any) => {
        return x.program_id == elm.program_id;
      });

      if (programInx == -1) {
        progemDrpDown.push({
          'program_id': elm.program_id,
          'program_name': elm.program_name
        });
      }
    });

    const programSorted = progemDrpDown.sort((a: any, b: any) =>
      a.program_name.toLowerCase() > b.program_name.toLowerCase() ? 1 : -1
    );

    let programInx = this.programDropDownDetails.findIndex((x: any) => {
      return x.program_id == 0;
    });


    if (programInx == -1 && progemDrpDown.length > 0) {

      let newObjArr = [{
        'program_id': 0,
        'program_name': 'Create a new program'
      }];

      this.programDropDownDetails = [...newObjArr, ...progemDrpDown];
    } else {
      this.programDropDownDetails = programSorted;
    }

    var result = Object.keys(response[0]).map(function (
      key: string
    ) {
      return key;
    });

    this.columns = [];
    result.forEach((elem: any, key: any) => {
      let headerName = this.humanize(elem);

      let newElm = '';
      if (elem == 'program_name') {
        newElm = 'programname';
      } else if (elem == 'program_status') {
        newElm = 'programstatus';
      } else if (elem == 'start_date') {
        newElm = 'startdate';
      } else if (elem == 'end_date') {
        newElm = 'enddate';
      } else if (elem == 'course_name') {
        newElm = 'coursename';
      } else if (elem == 'number_of_student') {
        newElm = 'noofstudents';
      } else if (elem == 'file_name') {
        newElm = 'program_outline';
      }

      if (
        elem != 'program_id' &&
        elem != 'course_id' &&
        elem != 'course_program_map_id' &&
        elem != 'url_path' &&
        elem != 'project_id' &&
        elem != 'project_manager_id'
      ) {
        if (elem == 'program_name') {
          headerName = 'Program Name';
        }
        if (elem == 'course_name') {
          headerName = 'Course Name';
        }
        if (elem == 'project_name') {
          headerName = 'Project Name';
        }
        if (elem == 'project_manager_name') {
          headerName = 'Project Manager Name';
        }
        if (elem == 'program_status') {
          headerName = 'Status';
        }
        if (elem == 'file_name') {
          headerName = 'Program Outline';
        }
        if (elem == 'number_of_student') {
          headerName = 'No of Student';
        }

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

  getProgramList() {
    $('.spinner').show();
    this.programService.getProgramDetails().subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.status == 'Success') {
          this.programDetails = [];
          this.columns = [];
          this.manualSearchCols = [];
          if (response.data.length > 0) {
            this.programColumnsAlign(response.data);
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

  viewProgram(rowData: any) {

    let params = {
      'project_id': +rowData.project_id,
      'program_id': +rowData.program_id,
      'course_id': +rowData.course_id
    }

    $('.spinner').show();
    ($('#view') as any).modal('hide');
    this.programService.viewProgramDetails(params).subscribe({
      next: (response) => {
        $('.spinner').hide();
        this.names = [];
        if (response.status == 'Success') {
          if (response.data.length > 0) {
            ($('#view') as any).modal('show');
            response.data.forEach((elem: any, index: any) => {
              let lastName = (elem.lastName != null) ? elem.lastName : '';
              this.names.push({
                firstName: elem.firstName + ' ' + lastName,
                email: elem.email,
                mobile: elem.mobile,
              });
            });
          } else {
            debugger
            ($('#view') as any).modal('hide');
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: "Student not mapped in " + rowData.program_name + ' program',
            });
          }
        } else {
          ($('#view') as any).modal('hide');
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: "Student not mapped in " + rowData.program_name + ' program',
          });
        }
      },
      error: (response) => {
        debugger
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

  resetProgramForm(p: NgForm) {
    p.resetForm();
    return true;
  }

  /*
  =========== Bulk Upload ===========
  */


  onProgramBulkUpload() {
    let fi = this.programFileInput.nativeElement;
    if (fi.files && fi.files[0] && this.programfileUploadError == true) {
      $('.spinner').show();
      let userId = +JSON.parse(this.user).id;
      this.programService.onBulkUpload(this.bulkProgramUploadFile, userId).subscribe({
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

            $('.spinner').hide();
            this.getProgramList();
            ($('#addprogram') as any).modal('hide');
            this.programFileInput.nativeElement.value = '';

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
            $('.spinner').hide();
            this.getProgramList();
            ($('#addprogram') as any).modal('hide');
            this.programFileInput.nativeElement.value = '';
            this.messageService.add({
              severity: 'success',
              summary: 'Sucess',
              detail: 'Successfully Uploaded',
            });
          }
        },
        error: (err) => {
          this.getProgramList();
          ($('#addprogram') as any).modal('hide');
          this.programFileInput.nativeElement.value = '';
          $('.spinner').hide();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              err.error.message == null ? err.error.error : err.error.message,
          });
        },
      });
    } else {
      this.programBulkUploadMsg = true;
    }
  }



  onProgramBulkUploadChange(event: any) {
    this.programBulkUploadMsg = false;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.bulkProgramUploadFile = file;
      var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
      let _validFileExtensions = ['xlsx'];
      if (event.target.files.length > 0 && _validFileExtensions.includes(ext)) {
        if (this.bulkProgramUploadFile.size > 20000000) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'File size should be less than 20MB',
          });
          this.programfileUploadError = false;
        } else {
          this.programfileUploadError = true;
        }
        this.programfileUploadError = true;
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Invalid file format',
        });
        this.programFileInput.nativeElement.value = '';
        this.programfileUploadError = false;
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

  /*
  =============== Export =================
  */

  exportPdf(dt: any) {
    var doc: any = new jsPDF.default('p', 'pt', 'a1', true);
    this.exportColumns = [];
    Object.keys(this._selectedColumns).forEach((key) => {
      this.exportColumns.push({
        title: this._selectedColumns[key].header,
        dataKey: this._selectedColumns[key].field,
      });
    });
    doc.autoTable(this.exportColumns, this.selectedProgramDetails, {
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
    doc.save('Program-Details.pdf');
  }

  exportToCsv() {
    let programDetailsExcelDetails: any = [];
    let column: any = [];
    let fieldName: string;
    this.selectedProgramDetails.forEach((elem, inx) => {
      if (!programDetailsExcelDetails.hasOwnProperty(inx)) {
        programDetailsExcelDetails[inx] = {};
      }
      this._selectedColumns.forEach((elm, indx) => {
        // let headerName = elm.header.replace(/\s/g, '');
        // headerName = this.humanize(headerName);
        let headerName = elm.header;
        programDetailsExcelDetails[inx][headerName] = (elem[elm.field] != null) ? elem[elm.field] : '';
      });
    });

    if (this.selectedProgramDetails.length == 0) {
      this._selectedColumns.forEach((elm, indx) => {
        // let headerName = elm.header.replace(/\s/g, '');
        // headerName = this.humanize(headerName);
        let headerName = elm.header;
        column[headerName] = '';
      });
      programDetailsExcelDetails.push(column);
    }

    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      filename: 'Program-Details',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(programDetailsExcelDetails);
    this.selectedProgramDetails = [];
  }

  /*Export Excel*/
  exportExcel() {
    let programDetailsExcelDetails: any = [];
    let column: any = [];
    let fieldName: string;
    this.selectedProgramDetails.forEach((elem, inx) => {
      if (!programDetailsExcelDetails.hasOwnProperty(inx)) {
        programDetailsExcelDetails[inx] = {};
      }
      this._selectedColumns.forEach((elm, indx) => {
        // let headerName = elm.header.replace(/\s/g, '');
        // headerName = this.humanize(headerName);
        let headerName = elm.header
        programDetailsExcelDetails[inx][headerName] = (elem[elm.field] != null) ? elem[elm.field] : '';
      });
    });

    if (this.selectedProgramDetails.length == 0) {
      this._selectedColumns.forEach((elm, indx) => {
        // let headerName = elm.header.replace(/\s/g, '');
        // headerName = this.humanize(headerName);
        let headerName = elm.header;
        column[headerName] = '';
      });
      programDetailsExcelDetails.push(column);
    }


    const worksheet = xlsx.utils.json_to_sheet(programDetailsExcelDetails);
    const workbook = { Sheets: { 'Program-Details': worksheet }, SheetNames: ['Program-Details'] };
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'Program-Details');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });

    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }

  downloadView() {


    let excelData = [];
    this.names.forEach((elm, inx) => {
      excelData.push({
        'Student Name': elm.firstName,
        'Email Id': elm.email,
        'Mobile Number': elm.mobile
      })
    })

    // import('xlsx').then((xlsx) => {
    const worksheet = xlsx.utils.json_to_sheet(excelData);
    const workbook = { Sheets: { 'Program-Details': worksheet }, SheetNames: ['Program-Details'] };
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'Program-Details');
    //this.saveAsExcelFile(excelBuffer, "BulkStudentRegistrationTemplate");
    // });
  }
}
