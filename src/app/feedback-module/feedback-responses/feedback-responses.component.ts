import { Component, OnInit, Input, Output } from '@angular/core';
import { FeedbackService } from 'src/app/services/feedback.service';
import { MessageService } from 'primeng/api';
import { FeedbackViewModel } from '../../view-models/feedbackview-model';
import { NgForm } from '@angular/forms';
import mockdata from './responseform.json';

@Component({
  selector: 'app-feedback-responses',
  templateUrl: './feedback-responses.component.html',
  styleUrls: ['./feedback-responses.component.css'],
  providers: [MessageService],
})
export class FeedbackResponsesComponent implements OnInit {
  @Input() activeProjectList: any = [];
  addFields = new FeedbackViewModel();

  programDetails: any = [];
  courseDetails: any = [];
  batchDetails: any = [];
  formDetails: any = [];
  id_Project: number;
  id_Program: number;
  id_Course : number;
  id_Batch: number;
  id_ActiveForm: number;
  activeFormId: number;
  formResponseCount: number;
  avgResponse: any;
  responseFormList: any = [];
  // ---------------------
  disable = false;

  constructor(
    private feedbackService: FeedbackService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {}

  /* Display User Form List By batch Id*/
  getUserResponse(formvalue: any, addfield: NgForm) {
    if (formvalue.valid == true) {
      $('.spinner').show();
      this.feedbackService.getFormListByBatchId(this.id_Batch).subscribe({
        next: (response) => {
          $('.spinner').hide();
          if (response.status == 'Success') {
            let validFormId = this.id_ActiveForm;
            var responseForm;
            if(validFormId){
              responseForm = response.data.filter(function (el) {
                return el.formid == validFormId;
              });
            }else{
              responseForm = response.data;
            }

            // this.responseFormList = responseForm;
            // this.formResponseCount = responseForm.length;

            var output = [];
            responseForm.forEach(function (item) {
              item.quetionsDetails.forEach(function (elem) {
                elem.answer = elem.answer.replaceAll('\"','');
                elem.questions = elem.questions.replaceAll('\"','');
                if(elem.options!=''){
                  elem.options.forEach(function (el,index) {
                    elem.options[index] = el.replaceAll('"','');
                  });
                }
              });

              debugger
              var existing = output.filter(function (v, i) {
                return v.userid == item.userid;
              });
              if (existing.length) {
                var existingIndex = output.indexOf(existing[0]);
                output[existingIndex].quetionsDetails = output[
                  existingIndex
                ].quetionsDetails.concat(item.quetionsDetails);
              } else {
                if (typeof item.quetionsDetails == 'string')
                  item.quetionsDetails = [item.quetionsDetails];
                output.push(item);
              }
            });
            this.scoresCalculation(output);
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

  /* Total and Average Calculations Project List*/
  scoresCalculation(form_Data) {
    let endResult = [];
    form_Data.forEach((elem: any, index: any) => {
      for (let i = 0; i < elem.quetionsDetails.length; i++) {
        endResult.push({
          userid: elem.userid,
          username: elem.username,
          quetionsDetails: elem.quetionsDetails[i],
          total:
            elem.quetionsDetails[i].optionscore == undefined
              ? []
              : elem.quetionsDetails[i].optionscore,
        });
      }
    });


    debugger

    var output = [];
    endResult.forEach(function (item) {
      var existing = output.filter(function (v, i) {
        return v.userid == item.userid;
      });
      if (existing.length) {
        var existingIndex = output.indexOf(existing[0]);

        output[existingIndex].quetionsDetails = output[
          existingIndex
        ].quetionsDetails.concat(item.quetionsDetails);

        output[existingIndex].total = output[existingIndex].total.concat(
          item.total
        );
      } else {
        if (typeof item.quetionsDetails != 'string')
          item.quetionsDetails = [item.quetionsDetails];
        item.total = [item.total];
        output.push(item);
      }
    });

    debugger
    let finaldatas = [];
    let avg = 0;
    output.forEach((element) => {
      console.log('element.total', element.total);
      let avgScore = element.total.reduce((partialSum, a) => partialSum + a, 0) /
      element.total.length;
      let totalScore = element.total.reduce((partialSum, a) => partialSum + a, 0);
      finaldatas.push({
        userid: element.userid,
        username: element.username,
        quetionsDetails: element.quetionsDetails,
        totalscore: totalScore,
        averagescore:avgScore
      });
      avg = avg + avgScore;
    });
    this.avgResponse = (avg / finaldatas.length).toFixed(1);
    this.responseFormList = finaldatas;
    this.formResponseCount = finaldatas.length;
  }
  /* ================================================ Filters Functionality ================================================ */

  /* Display Program List*/
  getProgramsByProjectId(id_project: number) {
    this.addFields.programName = "";
    this.programDetails = [];
    this.addFields.CourseName = "";
    this.courseDetails = [];
    this.addFields.BatchName = "";
    this.batchDetails = [];
    this.addFields.FormName = "";
    this.formDetails = [];
    this.id_Project = id_project;
    this.id_ActiveForm = undefined;
    this.id_Program = undefined;
    $('.spinner').show();
    this.feedbackService
      .getFeedbackProgramsListByProjectId(id_project)
      .subscribe((data) => {
        $('.spinner').hide();
        this.programDetails = data.data.sort((a: any, b: any) =>
          a.programname > b.programname ? 1 : -1
        );
      });
  }

  /* Display Course List*/
  getCourseByProjectIdProgramId(id_program: number) {
    this.addFields.CourseName = "";
    this.courseDetails = [];
    this.addFields.BatchName = "";
    this.batchDetails = [];
    this.addFields.FormName = "";
    this.formDetails = [];
    this.id_ActiveForm = undefined;
    this.id_Program = id_program;
    let params = {
      project_id: this.id_Project,
      program_id: this.id_Program,
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
  getBatchListByProjectIdAndProgramId(id_course: number) {
    this.addFields.BatchName = "";
    this.batchDetails = [];
    this.addFields.FormName = "";
    this.formDetails = [];
    this.id_ActiveForm = undefined;
    this.id_Course = id_course;
    let params = {
      project_id: this.id_Project,
      program_id: this.id_Program,
      course_id:this.id_Course
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
  getFormListByBatchId(id_batch: number) {
    this.addFields.FormName = "";
    this.formDetails = [];
    this.id_ActiveForm = undefined;
    this.id_Batch = id_batch;
    let params = {
      batchId: Number(this.id_Batch),
      projectId: Number(this.id_Project),
      programId: Number(this.id_Program)
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

        // this.formDetails = formsList.filter(function (el) {
        //   return el.isActive == 1;
        // });
      });
  }
  /* Display Selected Form Info*/
  getSelectedForm(id_form: number) {
    this.id_ActiveForm = id_form;
  }
}
