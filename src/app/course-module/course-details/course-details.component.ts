import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CourseService } from 'src/app/services/course.service';
import { DomSanitizer } from '@angular/platform-browser';
import skilling from './skilling.json';
import { DocumentVerificationService } from '../../services/document-verification.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css'],
  providers: [MessageService],
})
export class CourseDetailsComponent implements OnInit {
  @ViewChild('fullScreen') divRef;
  courseId: any;
  batchId: any;
  courseName: any;
  courseDetailList: any;
  fileResponse: any;
  courseTimeSpentCount: number;
  courseCount: number;
  LrId: any;
  user: any;
  loggedUserId: any;
  Coursestatus: any;
  recordStatus: number;
  currentFileType: string
  courseDetails: any = [];
  items: MenuItem[];
  activeMenus: any = [];
  fileEvent: boolean = true;

  public fileName;
  private commonUrl: string = environment.BASE_API_URL;
  public elem;
  public config: any;
  constructor(

    @Inject(DOCUMENT) private document: any,
    public documentverificationService: DocumentVerificationService,
    private courseService: CourseService,
    private messageService: MessageService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private titleService: Title,
    private router: Router,

  ) {
    this.user = localStorage.getItem('userId');
    this.courseId = localStorage.getItem('courseId');
    this.batchId = localStorage.getItem('batchId');
    this.Coursestatus = localStorage.getItem('Coursestatus');
    this.loggedUserId = JSON.parse(this.user).id;

    this.config = {
      paddingAtStart: true,
      classname: 'my-custom-class',
      listBackgroundColor: 'rgb(208, 241, 239)',
      fontColor: 'rgb(8, 54, 71)',
      backgroundColor: 'rgb(208, 241, 239)',
      selectedListFontColor: 'red',
    };
  }

  ngOnInit(): void {
    this.getCourseDetailList();
    this.setTitle('TJM-Course Details');
  }
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }


  activeMenuss(event, segment: any, fileResponse: any) {
    this.fileEvent = false;
    this.getCourseURL(event, fileResponse);
  }


  activeMenu(event: any) {
    console.log(this.activeMenus)
    //console.log(event.target.classList);
    let node;
    if (event.target.classList.contains("p-submenu-header") == true) {
      node = "submenu";
    } else if (event.target.tagName === "SPAN") {
      node = event.target.parentNode.parentNode;
    } else {
      node = event.target.parentNode;
    }
    console.log(node);
    if (node != "submenu") {
      let menuitem = document.getElementsByClassName("p-menuitem");
      for (let i = 0; i < menuitem.length; i++) {
        menuitem[i].classList.remove("active");
      }
      node.classList.add("active");
    }
  }


  /* get learning course list */
  getCourseDetailList() {
    let params = {
      user_id: this.loggedUserId,
      course_id: this.courseId,
      batch_id: this.batchId
    };

    $('.spinner').show();
    this.courseService.getLearningResourcesByCourseId(params).subscribe({
      next: (response) => {
        $('.spinner').hide();

        // let response = {
        //   "code": 200,
        //   "data": {
        //     "courseid": 7110,
        //     "course_name": "1st",
        //     "child_nodes": [
        //       {
        //         "learner_resource_id": 3000,
        //         "learing_resource_name": "Coordinators Bulk Template (19)",
        //         "folder_path": "Parent/1",
        //         "parent_id": 3000,
        //         "file_type": "XLS",
        //         "learning_resource_path": "Tenant/169/LearningResource/57404/Coordinators Bulk Template (19).xlsx",
        //         "version": "V3",
        //         "count": 1,
        //         "record_status": 0
        //       },
        //       {
        //         "learner_resource_id": 3001,
        //         "learing_resource_name": "test",
        //         "folder_path": "Parent/1/1_1",
        //         "parent_id": 3000,
        //         "file_type": "DOC",
        //         "learning_resource_path": "Tenant/169/LearningResource/57406/test.docx",
        //         "version": "V3",
        //         "count": 2,
        //         "record_status": 0
        //       },
        //       {
        //         "learner_resource_id": 3002,
        //         "learing_resource_name": "DDL",
        //         "folder_path": "Parent/1/1_1",
        //         "parent_id": 3001,
        //         "file_type": "HTML",
        //         "learning_resource_path": "https://skillsalphatest.blob.core.windows.net/skills-alpha-test/Tenant/169/LearningResource/SCORM/1682949507799/index_lms.html?sig=y311IXwQIexvnTdd%2FNNhlluDBspO4lojIwWRMMOD3eY%3D&st=2023-05-01T00%3A01%3A01Z&se=2023-05-02T15%3A01%3A01Z&sv=2019-02-02&si=DownloadPolicy&sr=b",
        //         "version": "V3",
        //         "count": 3,
        //         "record_status": 0
        //       },
        //       {
        //         "learner_resource_id": 2998,
        //         "learing_resource_name": "sample-6s",
        //         "folder_path": "Parent/1/1_1/1_1_1",
        //         "parent_id": 2998,
        //         "file_type": "AUDIO",
        //         "learning_resource_path": "Tenant/169/LearningResource/57403/sample-6s.mp3",
        //         "version": "V3",
        //         "count": 4,
        //         "record_status": 0
        //       },
        //       {
        //         "learner_resource_id": 3004,
        //         "learing_resource_name": "Sample-MP4-Video-File-for-Testing",
        //         "parent_id": 3004,
        //         "folder_path": "New/2/2_1",
        //         "file_type": "VIDEO",
        //         "learning_resource_path": "Tenant/169/LearningResource/57409/Sample-MP4-Video-File-for-Testing.mp4",
        //         "version": "V3",
        //         "count": 5,
        //         "record_status": 0
        //       }
        //     ]
        //   },
        //   "status": "Success",
        //   "message": "Learning resourse list  retrieved succesfully "
        // };

        if (response.status == 'Success') {

          const defaultJson = {
            label: '/',
            items: []
          };

          let fileResult = response.data;
          response.data.child_nodes.forEach(path => {

            var resFileName = '';
            if (path.file_type != null) {
              if (path.file_type.toUpperCase() == 'HTML') {
                resFileName = path.learing_resource_name + '.' + path.file_type.toLowerCase();
              } else {
                resFileName = path.learning_resource_path.replace(/^.*[\\\/]/, '');
              }
            }


            let folderPathUrl = path.folder_path + '/' + resFileName;

            const directorySegments = folderPathUrl.split("/");
            let currentDirectory = defaultJson;
            directorySegments.forEach(segment => {
              const child = currentDirectory.items.find(path => path.label.toLowerCase() === segment.toLowerCase());

              if (child !== undefined) {
                currentDirectory = child;
              }
              else {
                let newDirectory: any
                var filename = folderPathUrl.replace(/^.*[\\\/]/, '');
                if (filename == segment) {
                  newDirectory = {
                    label: segment,
                    command: () => this.activeMenuss(path, segment, fileResult),
                  };
                } else {
                  newDirectory = {
                    label: segment,
                    items: [],
                  };
                }

                currentDirectory.items.push(newDirectory);
                currentDirectory = newDirectory;
              }

            });
          });

          this.items = defaultJson.items;



          this.courseDetailList = [];
          this.courseName = response.data.course_name;
          response.data.child_nodes.forEach((elem, indx) => {
            if (elem.learing_resource_name != null) {
              this.courseDetailList.push(elem);
            }
          });

          this.courseDetailList = response.data.child_nodes;
          this.fileResponse = response.data;
          this.courseCount = this.courseDetailList.length;
          this.getCourseURL(this.courseDetailList[0], this.fileResponse);
        } else {

          if (response.status == 'Failed' && response.message == 'courseid not found in the learning resourse mapping') {
            response.message = 'Learning resource not assigned to the course';
          }

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message
          });
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



  getCourseURL(course: any, fileResponse: any) {
debugger
    this.recordStatus = course.record_status;
    this.currentFileType = (course.file_type != null) ? course.file_type.toLowerCase() : null;
    this.LrId = course.learner_resource_id;
    this.courseTimeSpentCount = course.count;
    let params = {
      lr_id: course.learner_resource_id,
      course_id: this.courseId,
    };
    $('.spinner').show();
    this.courseService
      .getLearningResourcePathByCourseIdAndLrID(params)
      .subscribe({
        next: (response) => {
          $('.spinner').hide();
          if (response.status == 'Success') {
            console.log(response)
            let learningresourcepath = response.data[0]?.learningresourcepath;
            this.displayCourseContent(learningresourcepath, fileResponse, course.count);
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

  /* Display the Course Content*/
  displayCourseContent(coursePath: any, res: any, count: any) {

    res.child_nodes.forEach((el: any, ix) => {

      if(el.file_type != null){
        if (this.currentFileType != null && el.file_type.toLowerCase() == this.currentFileType && ix == (count - 1)) {
          this.courseDetails = el;
          return true;
        }
      }

    });


    let course = this.courseDetails;
    let fileType = this.currentFileType
    if (fileType != undefined && fileType != null) {
      if (fileType.toLowerCase() == 'html') {
        let coursePath = this.commonUrl + 'resources/saScormPlayer.html?lrId=' + course.learner_resource_id + '&deviceType=3&courseId=' + res.courseid + '&serverUrl=' + this.commonUrl;
        this.fileName = this.sanitizer.bypassSecurityTrustResourceUrl(coursePath);
      } else if (fileType.toLowerCase() == 'ppt' || fileType.toLowerCase() == 'docx' || fileType.toLowerCase() == 'doc' || fileType.toLowerCase() == 'xlsx' || fileType.toLowerCase() == 'xls') {
        this.fileName = this.sanitizer.bypassSecurityTrustResourceUrl(coursePath);
        window.open(coursePath, '_blank');
      } else if (fileType.toLowerCase() == 'pdf') {
             this.fileName = coursePath;
        // this.fileName = this.sanitizer.bypassSecurityTrustResourceUrl(coursePath);
      } else {
        this.fileName = this.sanitizer.bypassSecurityTrustResourceUrl(coursePath);
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'File type is null',
      });
    }

  }


  requestFullScreen() {
    this.elem = this.divRef.nativeElement;
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      this.elem.msRequestFullscreen();
    }
  }




  /* Download document*/
  downloadFile(url) {
    $('.spinner').show();
    this.documentverificationService.getFileDownload(url).subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.status == 'Success') {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: response.message,
          });
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



  /* get course spending hrs*/
  getCourseDuration() {
    let params = {
      lrid: this.LrId,
      courseid: Number(this.courseId),
      batchid: Number(this.batchId),
      status: 1,
      userid: this.loggedUserId,
      timespentcount: this.courseTimeSpentCount,
      totalcount: this.courseCount,
    };

    $('.spinner').show();
    this.courseService.getCourseDuration(params).subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.status == 'Success') {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Course completion duration updated successfully',
          });
          setTimeout(() => {
            this.router.navigate(['/coursemanagement']);
          }, 2000);
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
