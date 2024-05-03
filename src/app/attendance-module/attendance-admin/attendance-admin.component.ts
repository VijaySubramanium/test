import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Console } from 'console';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { AttendanceService } from 'src/app/services/attendance.service';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-attendance-admin',
  templateUrl: './attendance-admin.component.html',
  styleUrls: ['./attendance-admin.component.css']
})
export class AttendanceAdminComponent implements OnInit {
  user: any;
  id_User: any;
  roleId_User: any;
  id_Project: any;
  name_Project: any;
  id_Program: any;
  name_Program: any;
  id_Course: any;
  name_Course: any;
  id_Batch: any;
  name_Batch: any;

  projectDetails: any;
  programDetails: any;
  courseDetails: any;
  batchDetails: any;

  attendenceData: any;
  dateList: any[];
  viewdates: any[];
  index = 0;
  today: any;
  attendPopup: any;
  attendUser: any;
  form = new FormGroup({
    attend: new FormControl('', Validators.required),
  });
  multiSelectAttend: any;
  rangeDates: Date[];

  constructor(
    private attendanceService: AttendanceService,
    private messageService: MessageService
  ) {
    this.user = localStorage.getItem('userId');
    this.id_User = JSON.parse(this.user).id;
    this.roleId_User = JSON.parse(this.user).user_role.role_id;
  }

  ngOnInit(): void {
    this.getAdminProjectLists();
  }

  get f() {
    return this.form.controls;
  }

  getStudentList() {
    let params = {
      projectid: this.id_Project,
      programid: this.id_Program,
      courseid: this.id_Course,
      batchid: this.id_Batch,
    };
    $('.spinner').show();

    this.attendanceService.getStudentListByBatch(params).subscribe({
      next: (response) => {
        console.log('getStudentList', response.data);
        if (response.status != 'Failed' && response.data.length > 0) {
          this.displayAttendance(response.data);
        } else {
          this.attendenceData = null;
          $('.spinner').hide();
          if (response.data.length == 0) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: "Student not mapped in this batch code"

            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                response.message == null
                  ? response.error
                  : response.message,
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

  todayPagenation() {
    if (this.viewdates.length > 0) {
      var now = moment();
      this.today = now.format('DD/MMM/YYYY');
      if (!this.dateList.includes(this.today)) {
        this.today = this.dateList[this.dateList.length - 1];
      }

      while (!this.viewdates.includes(this.today)) {
        if (now.isAfter(this.viewdates[this.viewdates.length - 1])) {
          this.pagenation(1);
        } else if (now.isBefore(this.viewdates[0])) {
          this.pagenation(0);
        }
      }
    }

  }

  displayAttendance(data: any) {
    this.attendenceData = null;
    if (data && data.length > 0) {
      this.attendenceData = data;
      this.attendenceData[0].batchStartDate = this.getDateFormat(
        this.attendenceData[0].batchStartDate,
        'DD MMM YYYY'
      );
      this.attendenceData[0].batchEndDate = this.getDateFormat(
        this.attendenceData[0].batchEndDate,
        'DD MMM YYYY'
      );
      for (let x = 0; x < this.attendenceData.length; x++) {
        for (let i = 0; i < this.attendenceData[x].attendance.length; i++) {
          this.attendenceData[x].attendance[i].attendanceDate =
            this.getDateFormat(
              this.attendenceData[x].attendance[i].attendanceDate,
              'DD/MMM/YYYY'
            );
        }
      }
      this.dateList = undefined;
      this.viewdates = undefined;
      this.index = 0;

      this.dateList = this.getDaysBetweenDates(
        data[0].batchStartDate,
        data[0].batchEndDate,
        'DD/MMM/YYYY'
      );
      this.viewdates = this.dateList.slice(this.index, 7);
      this.todayPagenation();
    }

    $('.spinner').hide();

  }

  getDateFormat(date: any, formatto: any) {
    var now = moment(date).clone();
    return now.format(formatto);
  }

  checkAll(ev) {
    this.multiSelectAttend.studentLists.forEach(x => x.state = ev.target.checked)
  }
  uncheckAll() {
    this.multiSelectAttend.studentLists.forEach(x => x.state = false)
  }
  isAllChecked() {
    return this.multiSelectAttend?.studentLists.every(_ => _.state);
  }

  isMultiChecked() {
    if (this.multiSelectAttend?.studentLists.some((item) => item.state === true)) {
      return true;
    }
    return false;
  }

  onSelect() {
    this.multiSelectAttend.endDay = undefined;
  }

  getStudentsBulkAttendence() {
    let userids = [];
    this.multiSelectAttend?.studentLists.forEach((item) => {
      if (item.state === true) {
        userids.push(item.studentId);
      }
    });
    return userids;
  }

  multiSelectPopup() {
    this.multiSelectAttend = undefined;
    this.multiSelectAttend = new MultiselectAttend();
    this.multiSelectAttend.studentLists = this.attendenceData;
    this.multiSelectAttend.enableToDate = new Date(this.today);
    this.multiSelectAttend.enableFromDate = new Date(this.dateList[0]);
  }
  openPopup(date: any, userId: any) {
    var now = moment();
    if (now.isSameOrAfter(date)) {
      this.attendPopup = this.getDateFormat(date, 'YYYY-MM-DD');
      this.attendUser = userId;
    }
  }

  closePopup() {
    this.attendPopup = undefined;
    this.uncheckAll();
    this.multiSelectAttend = undefined;
    this.attendUser = undefined;
    this.form.reset();
    this.rangeDates = null;
  }
  submitPopup() {
    if (this.form.value.attend.length != 0) {
      let params = {
        user_id: this.attendUser,
        batch_id: this.id_Batch,
        course_id: this.id_Course,
        date_of_attendance: this.attendPopup,
        attendance_value: this.form.value.attend,
      };

      this.form.reset();

      $('.spinner').show();
      this.attendanceService.saveAdminAttendance(params).subscribe({
        next: (response) => {
          $('.spinner').hide();
          if (response.status == 'success') {
            let date = this.getDateFormat(this.attendPopup, 'DD/MMM/YYYY');
            this.attendPopup = undefined;

            let pos = this.attendenceData.findIndex((y) => y.studentId === this.attendUser);
            if (pos >= 0) {
              let index = this.attendenceData[pos].attendance.findIndex(
                (x) => x.attendanceDate === date
              );

              if (index >= 0) {
                this.attendenceData[pos].attendance[index].attendanceValue =
                  params.attendance_value;
              } else {
                let data = {
                  attendanceDate: this.getDateFormat(
                    params.date_of_attendance,
                    'DD/MMM/YYYY'
                  ),
                  attendanceValue: params.attendance_value,
                  // course_id: params.course_id,
                };
                this.attendenceData[pos].attendance.push(data);
              }
            }
            this.attendUser = undefined;
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

  isMultiFormValid() {
    if (this.isMultiChecked() && this.form.valid && this.multiSelectAttend.startDay && this.multiSelectAttend.startDay != "Invalid date"
      && this.multiSelectAttend.endDay && this.multiSelectAttend.endDay != "Invalid date") {
      return true;
    } else {
      return false;
    }
  }
  submitMultiPopup() {
    if (this.isMultiFormValid()) {
      let params = {
        user_ids: this.getStudentsBulkAttendence(),
        batch_id: this.id_Batch,
        course_id: this.id_Course,
        dates: this.getDaysBetweenDates(this.multiSelectAttend.startDay, this.multiSelectAttend.endDay, 'YYYY-MM-DD'),
        attendance_value: this.form.value.attend,
      };
      console.log("Data drive", params)
      $('.spinner').show();
      this.attendanceService.saveStudentsAttendance(params).subscribe({
        next: (response) => {
          $('.spinner').hide();
          this.form.reset();
          this.uncheckAll();
          this.multiSelectAttend = undefined;
          this.rangeDates = null;
          if (response.status == 'success') {
            setTimeout(() => {
              this.getStudentList();
            }, 500);
          }
        },
        error: (response) => {
          $('.spinner').hide();
          this.form.reset();
          this.uncheckAll();
          this.multiSelectAttend = undefined;
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

  getDaysBetweenDates(startDate, endDate, format) {
    var now = moment(startDate).clone(),
      dates = [];
    while (now.isSameOrBefore(endDate)) {
      dates.push(now.format(format));
      now.add(1, 'days');
    }
    return dates;
  }

  pagenation(index: number) {
    if (index == 0) {
      if (this.index != 0) {
        this.index -= 7;
        this.viewdates = this.dateList.slice(this.index, this.index + 7);
      }
    } else {
      if (this.index < this.dateList.length - 7) {
        this.index += 7;
        this.viewdates = this.dateList.slice(this.index, this.index + 7);
      }
    }
  }

  getDataWithDate(date: string, attendance: any) {
    for (let i = 0; i < attendance.length; i++) {
      if (attendance[i].attendanceDate === date) {
        return attendance[i].attendanceValue;
      }
    }
    return null;
  }

  exportRegistrationExcel() {
    console.log("Excel Sheet", this.dateList, this.attendenceData);
    let attendExcelDetails: any = [];
    var now = moment();

    this.attendenceData.forEach((elem, inx) => {
      let sesCount = 0;
      let preCount = 0;
      let absCount = 0;
      if (!attendExcelDetails.hasOwnProperty(inx + 3)) {
        attendExcelDetails[inx] = {};
      }
      attendExcelDetails[inx]['Student Name'] = elem.studentName;
      this.dateList.forEach((elm, indx) => {
        if (now.isSameOrAfter(elm)) {
          sesCount++;
          if (elem.attendance[indx]?.attendanceValue == "Present") {
            preCount++;
          } else if (elem.attendance[indx]?.attendanceValue == "Absent") {
            absCount++;
          }
        }
        attendExcelDetails[inx]['Total Present'] = preCount;
        attendExcelDetails[inx]['Total Absent'] = absCount;
        attendExcelDetails[inx]['Total Sessions'] = sesCount;
        attendExcelDetails[inx]['Avg Prcentage'] = ((preCount / sesCount) * 100).toFixed(2) + "%";
        attendExcelDetails[inx][elm] = this.getDataWithDate(elm, elem.attendance);
      });

    });

    let attendMaindata: any = [{
      Project: this.name_Project,
      Program: this.name_Program,
      Course: this.name_Course,
      Batch: this.name_Batch,
      StartDate: this.attendenceData[0].batchStartDate,
      EndDate: this.attendenceData[0].batchEndDate
    }]
    this.exportAsExcelFile(attendMaindata, attendExcelDetails, 'Attendance_Data');
  }

  public exportAsExcelFile(mainjson: any[], attendjson: any[], excelFileName: string): void {
    const myworkbook: XLSX.WorkBook = XLSX.utils.book_new();
    const myprojsheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(mainjson);
    // XLSX.utils.sheet_add_json(myprojsheet, studentAttend, {skipHeader: true, origin: { r: 4, c: 0 }});
    XLSX.utils.book_append_sheet(myworkbook, myprojsheet, 'Course Details');

    const myattensheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(attendjson);
    XLSX.utils.book_append_sheet(myworkbook, myattensheet, 'Attendance');
    const excelBuffer: any = XLSX.write(myworkbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_Export' + EXCEL_EXTENSION);
  }
  /* ================================================ Filters Functionality ================================================ */
  /* Display Project List*/
  getAdminProjectLists() {
    let params = {

    };
    $('.spinner').show();
    this.attendanceService.getAdminProjectList(params).subscribe((response) => {
      $('.spinner').hide();
      this.projectDetails = response.data.sort((a: any, b: any) =>
        a.projectname > b.projectname ? 1 : -1
      );
    });
  }

  /* Display Program List*/
  getAdminProgramLists(project: any) {
    $('#programList').val('');
    this.programDetails = null;
    $('#courseList').val('');
    this.courseDetails = null;
    $('#batchList').val('');
    this.batchDetails = null;
    let projectDetails = project.split('_', 2);
    this.id_Project = projectDetails[0];
    this.name_Project = projectDetails[1];
    let params = {
      projectid: projectDetails[0],
    };
    $('.spinner').show();
    this.attendanceService.getAdminProgramList(params).subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.status == 'Success' && response.data.length > 0) {
          this.programDetails = response.data.sort((a: any, b: any) =>
            a.programname > b.programname ? 1 : -1
          );
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No programs mapped for selected project',
          });
        }
        this.attendenceData = null;
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

  /* Display Course List*/
  getAdminCourseLists(program: any) {
    $('#courseList').val('');
    this.courseDetails = null;
    $('#batchList').val('');
    this.batchDetails = null;
    let programDetails = program.split('_', 2);
    this.id_Program = programDetails[0];
    this.name_Program = programDetails[1];
    let params = {
      programid: programDetails[0],
      projectid: this.id_Project
    };
    $('.spinner').show();
    this.attendanceService.getAdminCourseList(params).subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.status == 'Success' && response.data.length > 0) {
          this.courseDetails = response.data.sort((a: any, b: any) =>
            a.coursename > b.coursename ? 1 : -1
          );
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No course mapped for selected program',
          });
        }
        this.attendenceData = null;
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

  /* Display Batch List*/
  getAdminBatchLists(course: any) {
    $('#batchList').val('');
    this.batchDetails = null;
    let courseDetails = course.split('__', 2);
    this.id_Course = courseDetails[0];
    this.name_Course = courseDetails[1];
    let params = {
      projectid: this.id_Project,
      programid: this.id_Program,
      courseid: courseDetails[0],
    };
    $('.spinner').show();
    this.attendanceService.getAdminBatchList(params).subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.status == 'Success' && response.data.length > 0) {
          this.batchDetails = response.data.sort((a: any, b: any) =>
            a.batchcode > b.batchcode ? 1 : -1
          );
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No batch mapped for selected course',
          });
        }
        this.attendenceData = null;
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
  /* Display user Batch List*/
  getUserBatch(batch: any) {
    let batchDetails = batch.split('_', 2);
    this.id_Batch = batchDetails[0];
    this.name_Batch = batchDetails[1];
    this.getStudentList();
  }
}

class MultiselectAttend {
  startDay: any;
  endDay: any;
  enableFromDate: Date;
  enableToDate: Date;
  studentLists: string[] = [];
}
