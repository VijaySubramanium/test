import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CourseService } from 'src/app/services/course.service';
import { Router } from '@angular/router';
import mockdatas from './online.json';
import { AnyForUntypedForms } from '@angular/forms';

@Component({
  selector: 'app-course-online',
  templateUrl: './course-online.component.html',
  styleUrls: ['./course-online.component.css'],
  providers: [MessageService],
})
export class CourseOnlineComponent implements OnInit {
  user: any;
  loggedUserId: any;
  responsiveOptions: any;
  online: any;
  inProgress: any;
  yetToStart: any;
  onHold: any;
  completed: any;

  constructor(
    private courseService: CourseService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.user = localStorage.getItem('userId');
    this.loggedUserId = JSON.parse(this.user).id;
  }

  ngOnInit(): void {
    //this.initialLoad();
    this.responseCourseCard();
    this.getClassRoomCourseList();
  }
  responseCourseCard() {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3,
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2,
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }
  initialLoad() {
    this.online = mockdatas;
    this.inProgress = mockdatas[0]?.coursedetails.online[0]?.inprogress;
    this.yetToStart = mockdatas[0]?.coursedetails.online[0]?.yettostart;
    this.onHold = mockdatas[0]?.coursedetails.online[0]?.onhold;
    this.completed = mockdatas[0]?.coursedetails.online[0]?.completed;
  }
  getClassRoomCourseList() {
    let user_id = this.loggedUserId;
    $('.spinner').show();
    this.courseService.getonlinecoursedetail(user_id).subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.status == 'Success') {
          this.inProgress =
            response.data[0]?.coursedetails.online[0]?.inprogress;
          this.yetToStart =
            response.data[0]?.coursedetails.online[0]?.yettostart;
          this.onHold = response.data[0]?.coursedetails.online[0]?.onHold;
          this.completed = response.data[0]?.coursedetails.online[0]?.completed;
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
  onSkillDevelopment(course: any) {
    localStorage.setItem('courseId', JSON.stringify(course));
    this.router.navigate(['/coursedetail']);
  }

  getFeedback(feedbackData: any) {
    localStorage.setItem(
      'feedback_batchid',
      JSON.stringify(feedbackData.batchid)
    );
    localStorage.setItem(
      'feedback_courseid',
      JSON.stringify(feedbackData.course_id)
    );
    this.router.navigate(['/studentfeedback']);
  }
}
