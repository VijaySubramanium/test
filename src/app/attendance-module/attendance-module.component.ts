import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-attendance-module',
  templateUrl: './attendance-module.component.html',
  styleUrls: ['./attendance-module.component.css'],
  providers: [MessageService, DatePipe],
})
export class AttendanceModuleComponent implements OnInit {
  user: any = '';
  public loggedInRoleName: string;

  constructor(private titleService: Title) {
    this.user = localStorage.getItem('userId');
    let loggedInRoleName = JSON.parse(this.user).user_role.role;
    this.loggedInRoleName = loggedInRoleName
      .replace(/\w+/g, function (txt) {
        return txt.toUpperCase();
      })
      .replace(/\s/g, '_');
  }

  ngOnInit() {
    console.log('this.loggedInRoleName', this.loggedInRoleName);
    this.setTitle('TJM-Attendance');
  }
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}
