import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { FeedbackService } from 'src/app/services/feedback.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-feedback-module',
  templateUrl: './feedback-module.component.html',
  styleUrls: ['./feedback-module.component.css'],
  providers: [MessageService, DatePipe],
})
export class FeedbackModuleComponent implements OnInit {
  currentTab1: string = 'RegistrationReport';
  currentTab2: string = '';
  currentTab3: string = '';
  activeProjectList: any;
  projectDetails: any;
  user: any = '';
  public loggedInRoleName: string;

  constructor(
    private titleService: Title,
    private feedbackService: FeedbackService
  ) {
    this.user = localStorage.getItem('userId');
    let loggedInRoleName = JSON.parse(this.user).user_role.role;
    this.loggedInRoleName = loggedInRoleName
      .replace(/\w+/g, function (txt) {
        return txt.toUpperCase();
      })
      .replace(/\s/g, '_');
  }

  ngOnInit() {
    this.setTitle('TJM-Feedback');
    this.projectNameList();
  }
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
  FeedBackGrid($event: any) {
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
  /* Display Project List*/
  projectNameList() {
    $('.spinner').show();
    this.feedbackService.getFeedbackProjectList().subscribe((data) => {
      $('.spinner').hide();
      this.projectDetails = data.data.sort((a: any, b: any) =>
        a.project_name > b.project_name ? 1 : -1
      );
      this.activeProjectList = this.projectDetails.filter(function (el) {
        return el.status == 'Active';
      });
    });
  }
}
