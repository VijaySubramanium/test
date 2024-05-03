import { Component, OnInit, Input, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { FeedbackService } from 'src/app/services/feedback.service';
import { FeedbackViewModel } from '../../view-models/feedbackview-model';
import mockdata from './viewform.json';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feedback-viewforms',
  templateUrl: './feedback-viewforms.component.html',
  styleUrls: ['./feedback-viewforms.component.css'],
})
export class FeedbackViewformsComponent implements OnInit {
  @Input() activeProjectList: any = [];
  disable = false;
  addFields = new FeedbackViewModel();
  projectDetails: any;
  programDetails: any;
  batchDetails: any;
  courseDetails: any;
  formDetails: any;
  projectsName: any;
  projectsId: any;
  programsName: any;
  programsId: any;
  courseName: any;
  courseId: any;
  batchName: any;
  batchId: any;
  batchInfo: any;
  formName: any;
  formId: any;
  formDataList: any;
  displayFormName: any;
  formActive: any;
  isActiveForm: any;
  formStatus: any;
  constructor(
    private feedbackService: FeedbackService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  /* Display Program List*/
  getProgramsByProjectId(project: any) {
    this.addFields.programName = "";
    this.programDetails = [];
    this.addFields.CourseName = "";
    this.courseDetails = [];
    this.addFields.BatchName = "";
    this.batchDetails = [];
    this.addFields.FormName = "";
    this.formDetails = [];
    let projectInfo = project.split('_', 2);
    this.projectsId = projectInfo[0];
    this.projectsName = projectInfo[1];
    $('.spinner').show();
    this.feedbackService
      .getFeedbackProgramsListByProjectId(this.projectsId)
      .subscribe((data) => {
        $('.spinner').hide();
        this.programDetails = data.data.sort((a: any, b: any) =>
          a.programname > b.programname ? 1 : -1
        );
      });
  }

  

  /* Display Course List*/
  getCourseByProjectIdProgramId(program: any) {
    this.addFields.CourseName = "";
    this.courseDetails = [];
    this.addFields.BatchName = "";
    this.batchDetails = [];
    this.addFields.FormName = "";
    this.formDetails = [];
    let programInfo = program.split('_', 2);
    this.programsId = programInfo[0];
    this.programsName = programInfo[1];
    let params = {
      project_id: this.projectsId,
      program_id: this.programsId,
    };
    $('.spinner').show();
    this.feedbackService
      .getFeedbackCourseListBySingle(params)
      .subscribe((data) => {
        $('.spinner').hide();
        this.courseDetails = data.data.sort((a: any, b: any) =>
          a.coursename > b.coursename ? 1 : -1
        );
      });
  }
  
  /* Display Batch List*/
  getBatchByProjectIdProgramId(course: any) {
    this.addFields.BatchName = "";
    this.batchDetails = [];
    this.addFields.FormName = "";
    this.formDetails = [];
    let courseInfo = course.split('_', 2);
    this.courseId = courseInfo[0];
    this.courseName = courseInfo[1];
    let params = {
      course_id:this.courseId,
      project_id: this.projectsId,
      program_id: this.programsId,
    };
    $('.spinner').show();
    this.feedbackService
      .getFeedbackBatchListByProjectIdAndProgramId(params)
      .subscribe((data) => {
        $('.spinner').hide();
        this.batchDetails = data.data.sort((a: any, b: any) =>
          a.batch_code > b.batch_code ? 1 : -1
        );
      });
  }

  /* Display Form List*/
  getFormsByBatchId(batch: any) {
    this.addFields.FormName = "";
    this.formDetails = [];
    this.batchInfo = batch.split('_', 2);
    let batches = this.batchInfo;
    this.batchId = batches[0];
    this.batchName = batches[1];
    let params = {
      batchId: Number(this.batchId),
      projectId: Number(this.projectsId),
      programId: Number(this.programsId)
    };
    $('.spinner').show();
    this.feedbackService
      .getMapFeedbackFormByBatchId(params)
      .subscribe((data) => {
        $('.spinner').hide();
        let forms = [];
        data.data.forEach(function (value) {
          if(!forms.some(el => el.formId === value.formId)){
            forms.push(value);
          }
        });
        this.formDetails = forms.sort((a: any, b: any) =>
          a.formName > b.formName ? 1 : -1
        );
      });
  }
  /* Display Selected Form Info*/
  getSelectedForm(course: any) {
    let formInfo = course.split('_', 2);
    this.formId = formInfo[0];
    this.formName = formInfo[1];
    console.log('this.formName', this.formName);
  }
  /* Display Form By Form Id*/

  getFormLists(formvalue: any) {
    if (formvalue.valid == true) {
      this.getFormList();
    }
  }
  getFormList() {
    let params = {
      formId: Number(this.formId),
      batchId: Number(this.batchId),
      projectId: Number(this.projectsId),
      programId: Number(this.programsId)
    };
    $('.spinner').show();
    this.feedbackService.getMapFormById(params).subscribe({
      next: (response) => {
        this.formStatus = response.status;
        $('.spinner').hide();
        if (response.status == 'Success') {
          this.displayFormName = response.data[0]?.formname;
          this.formActive =
            response.data[0]?.isactive == 1 ? 'Active' : 'Inactive';

          let questionsRecord = [];
          response.data.forEach((elem: any, index: any) => {
            let option = elem.questionoption?.replaceAll('"','');
            questionsRecord.push({
              questions: elem.questions.replaceAll('"', ''),
              questionoption:
              option == null
                  ? ''
                  : option.split(','),
              formname: elem.formname,
              actiontype:elem.actiontype,
              optionorder: elem.optionorder,
            });
          });
          console.log('questionsRecord', questionsRecord);
          this.formDataList = questionsRecord;
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

  changeStatus() {
    let params = {
      formId: Number(this.formId),
      batchId: Number(this.batchId),
      isactive: 1,
    };
    $('.spinner').show();
    this.feedbackService.formActiveStatusChange(params).subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.status == 'Success') {
          this.getFormList();

          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Status change is successful',
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
}
