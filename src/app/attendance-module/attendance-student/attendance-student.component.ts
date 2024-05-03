import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { Moment } from 'moment';
import { MessageService } from 'primeng/api';
import { AttendanceService } from 'src/app/services/attendance.service';
import mockdata from './mockdata.json';

@Component({
  selector: 'app-attendance-student',
  templateUrl: './attendance-student.component.html',
  styleUrls: ['./attendance-student.component.css'],
})
export class AttendanceStudentComponent implements OnInit {
  user: any;
  id_User: any;
  name_Program: any;
  getbatchId: any;
  getcourseId: any;

  attendenceData: any;
  dateList: any[];
  viewdates: any;
  index = 0;
  attendPopup: any;
  today: any;   //or end date
  form = new FormGroup({
    attend: new FormControl('', Validators.required),
  });

  constructor(
    private attendanceService: AttendanceService,
    private messageService: MessageService
  ) {
    this.user = localStorage.getItem('userId');
    this.getbatchId = localStorage.getItem('feedback_batchid');
    this.getcourseId = localStorage.getItem('courseId');
    this.id_User = JSON.parse(this.user).id;
  }

  ngOnInit(): void {
    this.getAttendanceList();
  }

  get f() {
    return this.form.controls;
  }

  /* Display Attendance List*/
  getAttendanceList() {
    let params = {
      batchid: this.getbatchId,
      userid: this.id_User,
    };

    $('.spinner').show();
    this.attendanceService.getStudentAttendanceList(params).subscribe({
      next: (response) => {
        if (response.status == 'success') {
          this.displayAttendance(response.data);
        }
        $('.spinner').hide();
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

  submitPopup() {
    if (this.form.value.attend.length != 0) {
      let params = {
        batch_id: this.getbatchId,
        user_id: this.id_User,
        course_id: this.getcourseId,
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
            let data = {
              attendance_date: this.getDateFormat(
                params.date_of_attendance,
                'DD/MMM/YYYY'
              ),
              attendance_value: params.attendance_value,
              course_id: params.course_id,
            };
            this.attendenceData.attendance_details.push(data);

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

  openPopup(date: any) {
    var now = moment();
    let index = this.attendenceData.attendance_details.findIndex(
      (x) => x.attendance_date === date
    );
    if (index < 0 && now.isSameOrAfter(date)) {
      this.attendPopup = this.getDateFormat(date, 'YYYY-MM-DD');
    }
  }

  closePopup() {
    this.attendPopup = undefined;
    this.form.reset();
  }

  displayAttendance(data: any) {
    this.attendenceData = data;
    this.attendenceData.batch_start_date = this.getDateFormat(
      this.attendenceData.batch_start_date,
      'DD MMM YYYY'
    );
    this.attendenceData.batch_end_date = this.getDateFormat(
      this.attendenceData.batch_end_date,
      'DD MMM YYYY'
    );

    for (let i = 0; i < this.attendenceData.attendance_details.length; i++) {
      this.attendenceData.attendance_details[i].attendance_date =
        this.getDateFormat(
          this.attendenceData.attendance_details[i].attendance_date,
          'DD/MMM/YYYY'
        );
    }

    this.dateList = this.getDaysBetweenDates(
      data.batch_start_date,
      data.batch_end_date
    );
    this.viewdates = this.dateList.slice(this.index, 7);
    this.todayPagenation();
  }

  getDaysBetweenDates(startDate, endDate) {
    var now = moment(startDate).clone(),
      dates = [];

    while (now.isSameOrBefore(endDate)) {
      dates.push(now.format('DD/MMM/YYYY'));
      now.add(1, 'days');
    }
    return dates;
  }

  getDateFormat(date: any, formatto: any) {
    var now = moment(date).clone();
    return now.format(formatto);
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
}
