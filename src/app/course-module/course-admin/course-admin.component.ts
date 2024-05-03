import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CourseService } from 'src/app/services/course.service';
import { MessageService } from 'primeng/api';
import * as FileSaver from 'file-saver';
import * as xlsx from 'xlsx';;
import { ExportToCsv } from 'export-to-csv';
import * as moment from 'moment';

@Component({
  selector: 'app-course-admin',
  templateUrl: './course-admin.component.html',
  styleUrls: ['./course-admin.component.css'],
  providers: [MessageService],
})
export class CourseAdminComponent implements OnInit {
  names: any[];
  // -----------------
  public courseDetails: any = [];
  _courseDetailColumns: any = [];
  _courseDetailColumnHeader: any[];
  _courseDetailColumnDataKey: any[];
  _courseDetailColumnTitle: any[];
  _courseDetailDefaultColumns: any[];
  _courseDetailDefaultColumnsCopy: any[];
  _selectedViewColumns: any[];
  _selectedViewColumnsDup: any[];
  public _courseDetailFilter: any = [];
  selectedCourseDetails: any = [];
  viewCols: any[];
  _courseViewFilter: any = [];
  selectedViewCourseDetails: any = [];

  searchCols: any[];
  _selectedSearchColumns: any[];
  _searchedColumns: any[] = [];
  searchError: boolean = false;
  manualSearchCols: any = [];

  constructor(
    private courseService: CourseService,
    private messageService: MessageService
  ) {
    this._courseDetailDefaultColumns = [
      { field: 'courseName', header: 'Course Name' },
      { field: 'noOfStudents', header: 'No of Students' },
      { field: 'isActive', header: 'Status' },
    ];

    this._courseDetailDefaultColumnsCopy = this._courseDetailDefaultColumns;
    this._courseDetailFilter = ['courseName', 'noOfStudents', 'isActive'];

    this._selectedViewColumns = [
      { field: 'projectName', header: 'Project Name', align: 'center' },
      { field: 'programName', header: 'Program Name', align: 'center' },
      { field: 'courseName', header: 'Course Name', align: 'center' },
      { field: 'batchCode', header: 'Batch Code', align: 'center' },
      { field: 'projectManagerName', header: 'Project Manager Name', align: 'center' },
      { field: 'trainerName', header: 'Trainer Name', align: 'center' },
      { field: 'startDate', header: 'Start Date', align: 'center' },
      { field: 'endDate', header: 'End Date', align: 'center' },
      { field: 'noOfStudents', header: 'No of Student', align: 'center' },
      { field: 'programOutline', header: 'Program Outline', align: 'center' },
      { field: 'batchStatus', header: 'Batch Status', align: 'center' },
      { field: 'batchAvgScore', header: 'Batch Avg Score', align: 'center' },
      { field: 'batchDurationHour', header: 'Batch Duration Hour', align: 'center' },
      { field: 'batchDays', header: 'Batch Days', align: 'center' },
    ];

    this._selectedViewColumnsDup = this._selectedViewColumns;
    this._courseViewFilter = ['projectName', 'programName', 'courseName', 'projectManagerName', 'trainerName', 'startDate', 'endDate', 'noOfStudents', 'programOutline', 'durationBatchHours'];
  }

  ngOnInit(): void {
    this.getCourseDetailList();
  }

  /* Get courseDetails*/
  getCourseDetailList() {
    $('.spinner').show();
    this.courseService.getcoursedetail().subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.status == 'Success') {
          if (response.data != null) {
            this.courseColumnAlign(response);
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

  courseColumnAlign(response) {
    this.courseDetails = [];
    this.manualSearchCols = [];
    response.data.forEach((elem: any, index: any) => {
      this.courseDetails.push({
        courseName: elem.coursename,
        noOfStudents: elem.noofstudents,
        isActive: elem.isactive == 1 ? 'Active' : 'Inactive',
      });
    });

    var result = Object.keys(this.courseDetails[0]).map(function (
      key: string
    ) {
      return key;
    });

    let headerName = '';
    this._courseDetailColumns = [];
    result.forEach((elem: any, key: any) => {
      headerName = this.headerCaseString(elem);

      let newElm = '';
      if (elem == 'courseName') {
        newElm = 'coursename';
      } else if (elem == 'noOfStudents') {
        newElm = 'noofstudents';
      } else if (elem == 'isActive') {
        newElm = 'isactive';
      }


      if (elem == 'courseName') {
        headerName = 'Course Name';
      } else if (elem == 'noOfStudents') {
        headerName = 'No of Students';
      } else if (elem == 'isActive') {
        headerName = 'Status';
      }

      if (elem != 'id' && elem != 'courseMappingDetails') {
        this._courseDetailColumns.push({
          field: elem,
          header: headerName,
        });

        this.manualSearchCols.push({
          field: (newElm == '') ? elem : newElm,
          header: headerName,
        });
      }
    });

    this._courseDetailColumnHeader = this._courseDetailColumns;
    if (this._searchedColumns.length == 0) {
      this.searchCols = [...this.manualSearchCols].map(item => ({ ...item }));
    }

    this.searchCols = this.searchCols.sort((a: any, b: any) =>
      a.header > b.header ? 1 : -1
    );

    this._courseDetailColumnTitle = this._courseDetailColumnHeader.map(
      (col) => ({
        title: col.header,
        dataKey: col.field,
      })
    );

    this._courseDetailColumnDataKey =
      this._courseDetailColumnHeader.map((col) => ({
        dataKey: col.field,
      }));
  }

  @Input() get registrationReportColumns(): any[] {
    return this._courseDetailDefaultColumns;
  }

  set registrationReportColumns(val: any[]) {
    this._courseDetailDefaultColumns = this._courseDetailColumnHeader.filter(
      (col) => val.includes(col)
    );
  }

  @Input() get courseViewColumns(): any[] {
    return this._selectedViewColumns;
  }

  set courseViewColumns(val: any[]) {
    this._selectedViewColumns = this.viewCols.filter((col) => val.includes(col));
  }


  searchHolder(field) {
    switch (field) {
      case "isActive":
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
      this.getCourseDetailList();
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

  onChangeSearchKey($event){
    if(this._selectedSearchColumns.length == 1){
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
          var obj: any;
          if (column.field == 'isactive') {
            obj = {
              Operation: index == 0 ? "" : column.condition,
              fieldName: column.field,
              value: (column.search.trim().toLowerCase() == 'active') ? "1" : "0"
            }
          } else {
            obj = {
              Operation: index == 0 ? "" : column.condition,
              fieldName: column.field,
              value: column.search.trim()
            }
          }
          searchJsonArray.push(obj);
        } else {
          this.searchError = true;
          return;
        }
      } else {
        if (column.search) {
          var obj: any;
          if (column.field == 'isactive') {
            obj = {
              Operation: index == 0 ? "" : column.condition,
              fieldName: column.field,
              value: (column.search.trim().toLowerCase() == 'active') ? "1" : "0"
            }
          } else {
            obj = {
              Operation: index == 0 ? "" : column.condition,
              fieldName: column.field,
              value: column.search.trim()
            }
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

      $('.spinner').show();
      this.courseService.multiSearchUser(searchJson).subscribe({
        next: (response) => {
          $('.spinner').hide();
          if (response.status == 'Success') {

            this._searchedColumns = this._selectedSearchColumns;
            this.courseColumnAlign(response);
            ($('#courseSearch') as any).modal('hide');

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


  registrationFilter($event: any) {
    if ($event.value.length == 0) {
      this._courseDetailDefaultColumns = this._courseDetailDefaultColumnsCopy;
    } else {
      this._courseDetailDefaultColumns = $event.value;
    }
  }


  viewCourseInfo(rowData: any) {
    console.log(rowData);
    $('.spinner').show();
    ($('#view-course') as any).modal('hide');
    this.courseService.viewCourseDetails(rowData.courseName).subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.status == 'Success') {
          if (response.data.length > 0) {
            ($('#view-course') as any).modal('show');
            this.names = [];
            response.data.forEach((elem, inx) => {
              elem.courseMappingDetails.forEach((elm, inx) => {
                this.names.push({
                  projectName: (elm.projectname != null) ? elm.projectname : "",
                  programName: (elm.programname != null) ? elm.programname : "",
                  batchCode: (elm.batchcode != null) ? elm.batchcode : "",
                  courseName: elem.coursename,
                  trainerName: (elm.trainername != null) ? elm.trainername : "",
                  projectManagerName: (elm.projectmanagername != null) ? elm.projectmanagername : "",
                  programOutline: (elm.programoutline != null) ? elm.programoutline : "",
                  startDate: (elm.batchstartdate != null) ? elm.batchstartdate : "",
                  endDate: (elm.batchenddate != null) ? elm.batchenddate : "",
                  batchStatus: (elm.batchstatus != null) ? elm.batchstatus : "",
                  batchAvgScore: (elm.batchavgscore != null) ? elm.batchavgscore : 0,
                  batchDurationHour: (elm.durationhours != null) ? elm.durationhours : 0,
                  noOfStudents: (elm.noofstudents != null) ? elm.noofstudents : 0,
                  batchDays: (elm.batch_days != null) ? elm.batch_days : 0,
                });
              });
            });

          } else {
            ($('#view-course') as any).modal('hide');
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: "Course not mapped in " + rowData.courseName,
            });
          }
        }
      },
    });
  }

  exportViewCSV(){
    let stuProExcelDetails: any = [];
    let columns: any = [];

    this.selectedViewCourseDetails.forEach((elem, inx) => {
      if (!stuProExcelDetails.hasOwnProperty(inx)) {
        stuProExcelDetails[inx] = {};
      }
      this._selectedViewColumns.forEach((elm, indx) => {
        let headerName = elm.header.replace(/\s/g, '');
        stuProExcelDetails[inx][headerName] = elem[elm.field];
      });
    });

    if (this.selectedViewCourseDetails.length == 0) {
      this._selectedViewColumns.forEach((elm, indx) => {
        let headerName = elm.header.replace(/\s/g, '');
        columns[headerName] = '';
      });
      stuProExcelDetails.push(columns);
    }

    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      filename: 'Course-View-Details',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(stuProExcelDetails);
    this.selectedViewCourseDetails = [];

  }

  exportViewExcel() {
    let stuProExcelDetails: any = [];
    let columns: any = [];

    this.selectedViewCourseDetails.forEach((elem, inx) => {
      if (!stuProExcelDetails.hasOwnProperty(inx)) {
        stuProExcelDetails[inx] = {};
      }
      this._selectedViewColumns.forEach((elm, indx) => {
        let headerName = elm.header.replace(/\s/g, '');
        stuProExcelDetails[inx][headerName] = elem[elm.field];
      });
    });

    if (this.selectedViewCourseDetails.length == 0) {
      this._selectedViewColumns.forEach((elm, indx) => {
        let headerName = elm.header.replace(/\s/g, '');
        columns[headerName] = '';
      });
      stuProExcelDetails.push(columns);
    }

    const worksheet = xlsx.utils.json_to_sheet(stuProExcelDetails);
    const workbook = {
      Sheets: { 'Course-View-Details': worksheet },
      SheetNames: ['Course-View-Details'],
    };
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'Course-View-Details');
  }


  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    this.selectedViewCourseDetails = [];
    this.selectedCourseDetails = [];
  }

  exportCSV(){
    let stuProExcelDetails: any = [];
    let columns: any = [];

    this.selectedCourseDetails.forEach((elem, inx) => {
      if (!stuProExcelDetails.hasOwnProperty(inx)) {
        stuProExcelDetails[inx] = {};
      }
      this.registrationReportColumns.forEach((elm, indx) => {
        let headerName = elm.header.replace(/\s/g, '');
        stuProExcelDetails[inx][headerName] = elem[elm.field];
      });
    });

    if (this.selectedCourseDetails.length == 0) {
      this.registrationReportColumns.forEach((elm, indx) => {
        let headerName = elm.header.replace(/\s/g, '');
        columns[headerName] = '';
      });
      stuProExcelDetails.push(columns);
    }

    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      filename: 'Course-Details',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(stuProExcelDetails);
    this.selectedCourseDetails = [];
  }


  exportExcel() {
    let stuProExcelDetails: any = [];
    let columns: any = [];

    this.selectedCourseDetails.forEach((elem, inx) => {
      if (!stuProExcelDetails.hasOwnProperty(inx)) {
        stuProExcelDetails[inx] = {};
      }
      this.registrationReportColumns.forEach((elm, indx) => {
        let headerName = elm.header.replace(/\s/g, '');
        stuProExcelDetails[inx][headerName] = elem[elm.field];
      });
    });

    if (this.selectedCourseDetails.length == 0) {
      this.registrationReportColumns.forEach((elm, indx) => {
        let headerName = elm.header.replace(/\s/g, '');
        columns[headerName] = '';
      });
      stuProExcelDetails.push(columns);
    }

    const worksheet = xlsx.utils.json_to_sheet(stuProExcelDetails);
    const workbook = {
      Sheets: { 'Course-Details': worksheet },
      SheetNames: ['Course-Details'],
    };
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'Course-Details');
  }


  /* View userDetails*/
  viewUserInfo(courseDetail: any) {
    this.names = [];

    // let courseProgramDetails: any = [];
    // let dupNames: any = [];
    // let columns: any = [];
    // courseDetail.courseMappingDetails.forEach((elem, inx) => {
    //   if (!courseProgramDetails.hasOwnProperty(elem.programname)) {
    //     courseProgramDetails[elem.programname] = {};
    //   }

    //   if (!dupNames.hasOwnProperty(elem.programname)) {
    //     dupNames[elem.programname] = {};
    //   }

    //   if (!dupNames[elem.programname].hasOwnProperty('projectManagerNames')) {
    //     dupNames[elem.programname]['projectManagerNames'] = [];
    //   }

    //   if (elem.projectmanagername != null) {
    //     dupNames[elem.programname]['projectManagerNames'].push(elem.projectmanagername);
    //   }

    //   let projectManagers = [...new Set(dupNames[elem.programname]['projectManagerNames'])];

    //   if (!dupNames[elem.programname].hasOwnProperty('trainerNames')) {
    //     dupNames[elem.programname]['trainerNames'] = [];
    //   }

    //   if (elem.projectmanagername != null) {
    //     dupNames[elem.programname]['trainerNames'].push(elem.trainername);
    //   }

    //   let trainers = [...new Set(dupNames[elem.programname]['trainerNames'])];

    //   courseProgramDetails[elem.programname]['projectName'] = elem.projectname;
    //   courseProgramDetails[elem.programname]['programName'] = elem.programname;
    //   courseProgramDetails[elem.programname]['courseName'] = courseDetail.courseName;
    //   courseProgramDetails[elem.programname]['projectManagerName'] = projectManagers.toString();
    //   courseProgramDetails[elem.programname]['trainerName'] = trainers.toString();
    //   courseProgramDetails[elem.programname]['startDate'] = elem.startdate;
    //   courseProgramDetails[elem.programname]['endDate'] = elem.enddate;
    //   courseProgramDetails[elem.programname]['noOfStudents'] = courseDetail.noOfStudents;
    //   courseProgramDetails[elem.programname]['programOutline'] = elem.programoutline;

    // });


    // console.log(courseProgramDetails);

    courseDetail.courseMappingDetails.forEach((elm, inx) => {
      this.names.push({
        projectName: elm.projectname,
        programName: elm.programname,
        courseName: courseDetail.courseName,
        trainerName: elm.trainername,
        projectManagerName: elm.projectmanagername,
        programOutline: elm.programoutline,
        startDate: elm.batchstartdate,
        endDate: elm.batchenddate,
        batchStatus: elm.batchstatus,
        batchAvgScore: elm.batchavgscore,
        batchDurationHour: elm.durationhours,
        noOfStudents: courseDetail.noOfStudents
      });
    });


    console.log(this.names)

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
}
