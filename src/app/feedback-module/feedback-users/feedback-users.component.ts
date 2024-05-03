import { Component, OnInit } from '@angular/core';
import mockdata from './userform.json';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FeedbackService } from 'src/app/services/feedback.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-feedback-users',
  templateUrl: './feedback-users.component.html',
  styleUrls: ['./feedback-users.component.css'],
})
export class FeedbackUsersComponent implements OnInit {
  id_ActiveForm: number;
  list_ActiveForm: any = [];
  avg_score: number;
  profileName: string;
  lastName: string;
  options: any = [];
  option: any = [];
  formId: any;
  user: any = '';
  loggedUserId: any;
  userFormDataList: any;
  formText: any;
  formStatus: any;
  batchId: any;
  courseId: any;
  feedbackFormList: any;
  feedbackInfo: any;
  formDetails: any;
  mandatoryFieldsList: any;
  avgRating: number;
  constructor(
    private toastr: ToastrService,
    private feedbackService: FeedbackService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.user = localStorage.getItem('userId');
    this.batchId = localStorage.getItem('feedback_batchid');
    this.courseId = localStorage.getItem('feedback_courseid');
    this.loggedUserId = JSON.parse(this.user).id;
    this.profileName = JSON.parse(this.user).first_name;
    this.lastName = JSON.parse(this.user).last_name;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.getActiveFormId();
    }, 2000);
  }

  // / Get Active Form Id /
  getActiveFormId() {
    let batchId = this.batchId;

    $('.spinner').show();
    this.feedbackService.getFeedbackFormByBatchId(batchId).subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.status == 'Success') {
          let FormDetails = response.data;
          this.feedbackFormList = FormDetails.filter(function (el) {
            return el.isactive == 1;
          });
          this.id_ActiveForm = this.feedbackFormList[0]?.formId;
          // this.id_ActiveForm = 34;

          if(this.id_ActiveForm != undefined){    
            this.checkUserResponded(this.id_ActiveForm);
          }else{
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Feedback form not created',
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

  checkUserResponded(id_activeForm: number) {
    let activeFormId = id_activeForm;
    let params = {
      courseid: this.courseId,
      batchid: this.batchId,
      userid: this.loggedUserId,
    };
    $('.spinner').show();
    this.feedbackService.getUserRespondFormList(params).subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.status == 'Success') {
          if (response.data != null) {
            this.list_ActiveForm = response.data;
            var output = [];

            this.list_ActiveForm.forEach(function (item) {
              var existing = output.filter(function (v, i) {
                return v.username == item.username;
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
          // this.list_ActiveForm = response.data.filter(function (el) {
          //   return el.formid == activeFormId;
          // });

          this.getUserForm(this.id_ActiveForm);
        }
      },
    });
  }
  /* Total and Average Calculations Project List*/
  scoresCalculation(form_Data) {
    let endResult = [];
    form_Data.forEach((elem: any, index: any) => {
      for (let i = 0; i < elem.quetionsDetails.length; i++) {
        endResult.push({
          username: elem.username,
          quetionsDetails: elem.quetionsDetails[i],
          total:
            elem.quetionsDetails[i].optionscore == undefined
              ? []
              : elem.quetionsDetails[i].optionscore,
        });
      }
    });

    var output = [];
    endResult.forEach(function (item) {
      var existing = output.filter(function (v, i) {
        return v.username == item.username;
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

    let finaldatas = [];

    output.forEach((element) => {
      finaldatas.push({
        username: element.username,
        quetionsDetails: element.quetionsDetails,
        totalscore: element.total.reduce((partialSum, a) => partialSum + a, 0),
        averagescore:
          element.total.reduce((partialSum, a) => partialSum + a, 0) /
          element.total.length,
      });
    });
    this.avgRating = finaldatas[0]?.averagescore;
  }
  // / getUserForm /
  getUserForm(formId) {
    if (formId != undefined) {
      $('.spinner').show();
      this.feedbackService.getFormById(formId).subscribe({
        next: (response) => {
          $('.spinner').hide();
          if (response.status == 'Success') {
            this.formId = response.data[0]?.formid;
            let questionsRecord = [];
            let formresult = response.data;
            // let formresult = mockdata.data;
            formresult.forEach((elem: any, index: any) => {
              if(elem.options!=''){
                elem.options.forEach((ele: any, index: any) => {
                  ele.optionName =  ele.optionName.replaceAll('/"','')
                });
              }
             
              questionsRecord.push({
                questions: elem.questions.replaceAll('"', ''),
                actiontype: elem.actiontype,
                // questionoption:
                //   elem.questionoption == null
                //     ? ''
                //     : elem.questionoption.split(','),
                formname: elem.formname,
                optionorder: elem.optionorder,
                isrequired: elem.isrequired,
                questionId: elem.feedbackQuestionId,
                questionoptionid: elem.questionoptionid,
                options: elem.options,
              });
            });

            this.userFormDataList = questionsRecord;

            this.mandatoryFieldsList = this.userFormDataList.filter(function (
              el
            ) {
              return el.isrequired != 0;
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
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Feedback form not created',
      });
    }
  }
  getDifference(array1, array2) {
    return array1.filter((object1) => {
      return !array2.some((object2) => {
        return object1.questionId === object2.questionId;
      });
    });
  }
  showError() {
    this.toastr.error('Mandatory is required !', 'Error!');
  }
  userFormSubmit() {
    let selectedResult = this.options;
    let questionsRecord = [];
    console.log('selectedResult', selectedResult);
    selectedResult.forEach((elem: any, index: any) => {
      questionsRecord.push({
        questionId: selectedResult.indexOf(elem),
        questionOptionId:
          elem.split('_')[1] == undefined
            ? selectedResult.indexOf(elem)
            : Number(elem.split('_')[1]),
        answers: [elem.split('_')[0]],
      });
    });

    let mandatory = this.mandatoryFieldsList;
    let result = this.getDifference(mandatory, questionsRecord);
    if (result.length != 0) {
      this.showError();
    } else {
      const finalResult = {
        userId: this.loggedUserId,
        formId: this.id_ActiveForm,
        batchId: this.batchId,
        courseId: this.courseId,
        questionDetails: questionsRecord,
      };
      console.log('finalResult', finalResult);

      $('.spinner').show();
      this.feedbackService.saveFeedBackUserForm(finalResult).subscribe({
        next: (response) => {
          $('.spinner').hide();
          if (response.status == 'Success') {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: response.message,
            });
          }
          setTimeout(() => {
            this.router.navigate(['/coursemanagement']);
          }, 2000);
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
}
