import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-course-module',
  templateUrl: './course-module.component.html',
  styleUrls: ['./course-module.component.css'],
  providers: [MessageService, DatePipe],
})
export class CourseModuleComponent implements OnInit {
  currentTab1: string = 'RegistrationReport';
  currentTab2: string = '';
  currentTab3: string = '';
  courseViewModulesAccess: any = [];
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
    this.setTitle('TJM-Course');
    this.courseViewModulesAccess = ['GTT_ADMIN', 'L&D']
  }
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
  CourseGrid($event: any) {
    if (!$event.index) {
      this.currentTab1 = 'Online training';
      this.currentTab2 = '';
      this.currentTab3 = '';
      $('#inlineRadio_student1').trigger('click');
    } else if ($event.index == 1) {
      this.currentTab2 = 'Self learning';
      this.currentTab1 = '';
      this.currentTab3 = '';
      $('#inlineRadio_coor1').trigger('click');
    } else if ($event.index == 2) {
      this.currentTab3 = 'Classroom training';
      this.currentTab1 = '';
      this.currentTab2 = '';
      $('#inlineRadio_admin1').trigger('click');
    }
  }
}
