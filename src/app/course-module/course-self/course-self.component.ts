import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CourseService } from 'src/app/services/course.service';
import mockdatas from './self.json';
import { Router } from '@angular/router';

@Component({
  selector: 'app-course-self',
  templateUrl: './course-self.component.html',
  styleUrls: ['./course-self.component.css'],
})
export class CourseSelfComponent implements OnInit {
  user: any;
  loggedUserId: any;
  responsiveOptions: any;
  self: any;
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
    this.self = mockdatas;
    this.inProgress = mockdatas[0]?.coursedetails.self[0]?.inprogress;
    this.yetToStart = mockdatas[0]?.coursedetails.self[0]?.yettostart;
    this.onHold = mockdatas[0]?.coursedetails.self[0]?.onhold;
    this.completed = mockdatas[0]?.coursedetails.self[0]?.completed;
  }
  getClassRoomCourseList() {
    let user_id = this.loggedUserId;
    $('.spinner').show();
    this.courseService.getselfcoursedetail(user_id).subscribe({
      next: (response) => {
        $('.spinner').hide();
        debugger
        if (response.status == 'Success') {
          this.inProgress =
            response.data[0]?.coursedetails.self_paced[0]?.inprogress;
          this.yetToStart =
            response.data[0]?.coursedetails.self_paced[0]?.yettostart;
          this.onHold = response.data[0]?.coursedetails.self_paced[0]?.onHold;
          this.completed =
            response.data[0]?.coursedetails.self_paced[0]?.completed;
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
    debugger
    console.log(course);
    localStorage.setItem(
      'Coursestatus',
      JSON.stringify(course.completionpercentage)
    );

    localStorage.setItem('courseId', JSON.stringify(course.course_id));
    localStorage.setItem('batchId', JSON.stringify(course.batchid));
    localStorage.setItem('feedback_batchid', JSON.stringify(course.batchid));
    this.router.navigate(['/coursedetail']);
  }

  getFeedback(feedbackData: any) {
    debugger
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
