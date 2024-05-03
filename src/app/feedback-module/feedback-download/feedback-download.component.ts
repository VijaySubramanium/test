import { Component, OnInit, Input, Output } from '@angular/core';
import { FeedbackService } from 'src/app/services/feedback.service';
import { MessageService } from 'primeng/api';
import * as FileSaver from 'file-saver';
import * as xlsx from 'xlsx';
import { FeedbackViewModel } from '../../view-models/feedbackview-model';

@Component({
  selector: 'app-feedback-download',
  templateUrl: './feedback-download.component.html',
  styleUrls: ['./feedback-download.component.css'],
})
export class FeedbackDownloadComponent implements OnInit {
  @Input() activeProjectList: any = [];
  _QuestionReportColumns: any = [];
  _ResponseReportColumns: any = [];
  addFields = new FeedbackViewModel();
  disable = false;
  programDetails: any;
  batchDetails: any;
  courseDetails: any;
  trainerDetails: any;
  formDetails: any;
  project_ids: any = [];
  program_ids: any = [];
  batch_ids: any = [];
  course_ids: any = [];
  trainer_ids: any = [];
  form_ids: any = [];
  id_ActiveForm: number;
  activeFormId: number;
  formResponseCount: number;
  responseFormList: any = [];
  questionsList: any = [];
  responseList: any = [];
  isProjectSelect: boolean = false;
  _selectedProjects: any[];
  isProgramSelect: boolean = false;
  _selectedPrograms: any[];
  isBatchSelect: boolean = false;
  _selectedBatches: any[];
  isCourseSelect: boolean = false;
  _selectedCourses: any[];
  isTrainerSelect: boolean = false;
  _selectedTrainer: any[];
  _selectedForms: any[];
  isFormSelect: boolean = false;


  constructor(
    private feedbackService: FeedbackService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {

  }

  // @Input() get selectedProjects(): any[] {
  //   return this._selectedProjects;
  // }

  // set selectedProjects(val: any[]) {
  //   this._selectedProjects = this.activeProjectList.filter((col) => val.includes(col));
  // }

  // @Input() get selectedPrograms(): any[] {
  //   return this._selectedPrograms;
  // }

  // set selectedPrograms(val: any[]) {
  //   this._selectedPrograms = this.programDetails.filter((col) => val.includes(col));
  // }

  // @Input() get selectedBatches(): any[] {
  //   return this._selectedBatches;
  // }

  // set selectedBatches(val: any[]) {
  //   this._selectedBatches = this.batchDetails.filter((col) => val.includes(col));
  // }

  // @Input() get selectedCourses(): any[] {
  //   return this._selectedCourses;
  // }

  // set selectedCourses(val: any[]) {
  //   this._selectedCourses = this.activeProjectList.filter((col) => val.includes(col));
  // }

  // @Input() get selectedTrainer(): any[] {
  //   return this._selectedTrainer;
  // }

  // set selectedTrainer(val: any[]) {
  //   this._selectedTrainer = this.activeProjectList.filter((col) => val.includes(col));
  // }

  // @Input() get selectedForms(): any[] {
  //   return this._selectedForms;
  // }

  // set selectedForms(val: any[]) {
  //   this._selectedForms = this.formDetails.filter((col) => val.includes(col));
  // }

  columnFilter($event: any, type: String) {
    if (type == 'projects') {
      this._selectedProjects = undefined;
      this._selectedProjects = $event.value;
      if (this._selectedProjects.length > 0) {
        this.isProjectSelect = true;
      } else {
        this.isProjectSelect = false;
      }
    } else if (type == 'programs') {
      this._selectedPrograms = undefined;
      this._selectedPrograms = $event.value;
      if (this._selectedPrograms.length > 0 && this.isProjectSelect) {
        this.isProgramSelect = true;
      } else {
        this.isProgramSelect = false;
      }
    } else if (type == 'batches') {
      this._selectedBatches = undefined;
      this._selectedBatches = $event.value;
      if (this._selectedBatches.length > 0 && this.isProjectSelect && this.isProgramSelect && this.isCourseSelect && this.isTrainerSelect) {
        this.isBatchSelect = true;
      } else {
        this.isBatchSelect = false;
      }
    } else if (type == 'courses') {
      this._selectedCourses = undefined;
      this._selectedCourses = $event.value;
      if (this._selectedCourses.length > 0 && this.isProjectSelect && this.isProgramSelect ) {
        this.isCourseSelect = true;
      } else {
        this.isCourseSelect = false;
      }
    } else if (type == 'trainers') {
      this._selectedTrainer = undefined;
      this._selectedTrainer = $event.value;
      if (this._selectedTrainer.length > 0 && this.isProjectSelect && this.isProgramSelect && this.isCourseSelect) {
        this.isTrainerSelect = true;
      } else {
        this.isTrainerSelect = false;
      }
    } else if (type == 'forms') {
      this._selectedForms = undefined;
      this._selectedForms = $event.value;
      if (this._selectedForms.length > 0 && this.isProjectSelect && this.isProgramSelect && this.isBatchSelect && this.isCourseSelect && this.isTrainerSelect) {
        this.isFormSelect = true;
      } else {
        this.isFormSelect = false;
      }
    }
  }


  /* ====================== Question Form start============================== */
  exportQuestionForm() {
    this.project_ids = [];
    for (let i = 0; i < this._selectedProjects.length; i++) {
      this.project_ids.push(this._selectedProjects[i].project_id);
    }
    const params = {
      project_ids: this.project_ids
    }

    this.feedbackService
      .getQuestionFormListByProjectIds(params)
      .subscribe({
        next: (response) => {
          $('.spinner').hide();

          if (response.status == 'Success') {
            if (response.data != null) {
              this.questionsList = response.data;
            }
            this.downloadQuestions(this.questionsList);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No data available',
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

  downloadQuestions(questionData) {
    var result = Object.keys(questionData[0]).map(function (key: string) {
      return key;
    });

    let headerName = '';
    result.forEach((elem: any, key: any) => {
      headerName = this.headerCaseString(elem);
      if (elem == 'formname') {
        headerName = 'Form Name';
      } else if (elem == 'actiontype') {
        headerName = 'Action Type';
      } else if (elem == 'questions') {
        headerName = 'Questions';
      } else if (elem == 'formid') {
        headerName = 'Form Id';
      } else if (elem == 'questionoption') {
        headerName = 'Question Options';
      } else if (elem == 'optionscore') {
        headerName = 'Option Scores';
      } else if (elem == 'projectname') {
        headerName = 'Project Name';
      }
      if (elem != 'formid' && elem != 'projectname') {
        this._QuestionReportColumns.push({
          field: elem,
          header: headerName,
        });
      } else {
        if (elem == 'projectname') {
          this._QuestionReportColumns.unshift({
            field: elem,
            header: headerName,
          });
        }
      }
    });
    // ---------------------------------------------
    let stuProExcelDetails: any = [];
    let columnsdata: any = [];

    questionData.forEach((elem, inx) => {
      if (!stuProExcelDetails.hasOwnProperty(inx)) {
        stuProExcelDetails[inx] = {};
      }
      this._QuestionReportColumns.forEach((elm, indx) => {
        stuProExcelDetails[inx][elm.header] =
          elem[elm.field] != null || elem[elm.field] != undefined
            ? elem[elm.field].toString()
            : null;
      });
    });

    if (questionData.length == 0) {
      this._QuestionReportColumns.forEach((elm, indx) => {
        columnsdata[elm.header] = '';
      });
      stuProExcelDetails.push(columnsdata);
    }

    const worksheet = xlsx.utils.json_to_sheet(stuProExcelDetails);
    const range = xlsx.utils.decode_range(worksheet['!ref']);
    for (var C = range.s.c; C <= range.e.c; ++C) {
      var address = xlsx.utils.encode_col(C) + "1"; // <-- first row, column number C
      if (!worksheet[address]) continue;
      worksheet[address].v = worksheet[address].v.toUpperCase();
    }

    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Export Form');
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
      cellStyles: true
    });

    this.saveAsExcelFile(excelBuffer, 'Export Form');
  }
  /* ===================== Question Form End ================================= */
  /* ====================== Question Form start============================== */

  exportResponseForm() {
    this.project_ids = [];
    for (let i = 0; i < this._selectedProjects?.length; i++) {
      this.project_ids.push(this._selectedProjects[i].project_id);
    }
    this.program_ids = [];
    for (let i = 0; i < this._selectedPrograms?.length; i++) {
      this.program_ids.push(this._selectedPrograms[i].programid);
    }
    this.batch_ids = [];
    for (let i = 0; i < this._selectedBatches?.length; i++) {
      this.batch_ids.push(this._selectedBatches[i].batchid);
    }
    this.course_ids = [];
    for (let i = 0; i < this._selectedCourses?.length; i++) {
      this.course_ids.push(this._selectedCourses[i].courseid);
    }
    this.trainer_ids = [];
    for (let i = 0; i < this._selectedTrainer?.length; i++) {
      this.trainer_ids.push(this._selectedTrainer[i].userid);
    }
    this.form_ids = [];
    for (let i = 0; i < this._selectedForms?.length; i++) {
      this.form_ids.push(this._selectedForms[i]?.formId);
    }
    const params = {
      project_ids: this.project_ids,
      program_ids: this.program_ids,
      batch_ids: this.batch_ids,
      course_ids: this.course_ids,
      trainer_ids: this.trainer_ids,
      form_ids: this.form_ids
    }

    console.log("Params:---------   ", params)
    this.feedbackService
      .getResponseFormListByIds(params)
      .subscribe({
        next: (response) => {
          $('.spinner').hide();
          if (response.status == 'Success') {
            if (response.data != null) {
              this.responseList = response.data;
            }
            console.log('this.responseList', this.responseList);

            this.downloadResponse(this.responseList);
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No data available',
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

  downloadResponse(responseDatas) {
    // var responseData = responseDatas.filter(function (v) {
    //   return this[v.userid]
    //     ? !Object.assign(this[v.userid], v)
    //     : (this[v.userid] = v);
    // }, {});
    console.log('results', responseDatas);
    var responseData = [];
    // const count = {};
    // responseDatas.forEach(element => {
    //   let index = responseData.findIndex(x => x.username === element.username);
    //   if (index >= 0) {
    //     let score = responseData[index].optionscore + element.optionscore;;
    //     responseData[index] = { ...responseData[index], ...element };
    //     responseData[index].totalscore = score;
    //   } else {
    //     element.totalscore = element.optionscore;
    //     responseData.push(element);
    //   }
    //   count[element.username] = (count[element.username] || 0) + 1;
    // });
    responseData = responseDatas;
    console.log("Two", responseData);
    responseData.forEach(element => {
      // element.avgscore = (element.totalscore / count[element.username]);
      delete element.totalscore;
    });
    console.log("Three", responseData);
    // ------------------------------------------------------------
    // var result = Object.keys(responseData[0]).map(function (key: string) {
    //   return key;
    // });

    var result = ['project', 'program', 'batch', 'course', 'trainer', 'formname', 'username', 'question', 'answer', 'optionscore'];
    let headerName = '';
    result.forEach((elem: any, key: any) => {
      headerName = this.headerCaseString(elem);
      if (elem == 'formname') {
        headerName = 'Form Name';
      } else if (elem == 'username') {
        headerName = 'User Name';
      } else if (elem == 'optionscore') {
        headerName = 'Option Scores';
      }
      this._ResponseReportColumns.push({
        field: elem,
        header: headerName,
      });
    });
    // ---------------------------------------------
    let stuProExcelDetails: any = [];
    let columnsdata: any = [];
    responseData.forEach((elem, inx) => {
      if (!stuProExcelDetails.hasOwnProperty(inx)) {
        stuProExcelDetails[inx] = {};
      }
      this._ResponseReportColumns.forEach((elm, indx) => {
        stuProExcelDetails[inx][elm.header] =
          elem[elm.field] != null || elem[elm.field] != undefined
            ? elem[elm.field].toString()
            : null;
      });
    });

    if (responseData.length == 0) {
      this._ResponseReportColumns.forEach((elm, indx) => {
        columnsdata[elm.header] = '';
      });
      stuProExcelDetails.push(columnsdata);
    }

    const worksheet = xlsx.utils.json_to_sheet(stuProExcelDetails);
    const range = xlsx.utils.decode_range(worksheet['!ref']);
    for (var C = range.s.c; C <= range.e.c; ++C) {
      var address = xlsx.utils.encode_col(C) + "1"; // <-- first row, column number C
      if (!worksheet[address]) continue;
      worksheet[address].v = worksheet[address].v.toUpperCase();
    }
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Export Response');
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
      cellStyles: true
    });

    this.saveAsExcelFile(excelBuffer, 'Export Response');
  }
  /* ===================== Question Form End ================================= */
  /* ===================== Filters Functionality ============================== */

  /* Display Program List*/
  getProgramsByProjectId() {
    console.log("Ids:------  ", this._selectedProjects)
    this.project_ids = [];
    for (let i = 0; i < this._selectedProjects.length; i++) {
      this.project_ids.push(this._selectedProjects[i].project_id);
    }
    const params = {
      project_ids: this.project_ids
    }
    console.log("Multi Projects ids:---  ", params);

    $('.spinner').show();
    this.feedbackService
      .getFeedbackProgramsListByProjectIds(params)
      .subscribe((data) => {
        $('.spinner').hide();
        console.log("Ids:------  ", this._selectedProjects)
        this.programDetails = undefined;
        this.programDetails = data.data.sort((a: any, b: any) =>
          a.programname > b.programname ? 1 : -1
        );

        // var element = document.getElementsByTagName("p-multiSelect")[0];
        // var id = element.id;
        // var myElement = document.getElementById("multiProjects");
        // console.log("Id p-multi:---- ",element,"  ",id,"   ",myElement)
        this._selectedPrograms = undefined;
        this.isProgramSelect = false;

        this.batchDetails = undefined;
        this._selectedBatches = undefined;
        this.isBatchSelect = false;

        this.courseDetails = undefined;
        this._selectedCourses = undefined;
        this.isCourseSelect = false;

        this.trainerDetails = undefined;
        this._selectedTrainer = undefined;
        this.isTrainerSelect = false;

        this.formDetails = undefined;
        this._selectedForms = undefined;
        this.isFormSelect = false;
        console.log("Ids:------  ", this._selectedProjects)
      });
  }

  /* Display Batch List*/
  getBatchListByProjectIdAndProgramId() {
    this.trainer_ids = [];
    for (let i = 0; i < this._selectedTrainer.length; i++) {
      this.trainer_ids.push(this._selectedTrainer[i].userid);
    }
    let params = {
      course_ids: this.course_ids,
      program_ids: this.program_ids,
      trainer_ids: this.trainer_ids,
      project_ids: this.project_ids
    };
    $('.spinner').show();
    this.feedbackService
      .getFeedbackBatchListByCourseIdsTrainerIdsAndProgramIds(params)
      .subscribe((data) => {
        $('.spinner').hide();
        this.batchDetails = undefined;
        this.batchDetails = data.data.sort((a: any, b: any) =>
          a.batchcode > b.batchcode ? 1 : -1
        );
        this._selectedBatches = undefined;
        this.isBatchSelect = false;

        // this.courseDetails = undefined;
        // this._selectedCourses = undefined;
        // this.isCourseSelect = false;

        // this.trainerDetails = undefined;
        // this._selectedTrainer = undefined;
        // this.isTrainerSelect = false;

        this.formDetails = undefined;
        this._selectedForms = undefined;
        this.isFormSelect = false;
      });
  }

  /* Display Course List*/
  getCourseListByProjectIdAndProgramId() {
    this.program_ids = [];
    for (let i = 0; i < this._selectedPrograms.length; i++) {
      this.program_ids.push(this._selectedPrograms[i].programid);
    }
    let params = {
      project_ids: this.project_ids,
      program_ids: this.program_ids,
    };
    $('.spinner').show();
    this.feedbackService
      .getFeedbackCourseListByProjectIdAndProgramId(params)
      .subscribe((data) => {
        $('.spinner').hide();
        
        this.courseDetails = undefined;
        this.courseDetails = data.data.sort((a: any, b: any) =>
          a.courseid > b.courseid ? 1 : -1
        );
        this._selectedCourses = undefined;
        this.isCourseSelect = false;

        this.batchDetails = undefined;
        this._selectedBatches = undefined;
        this.isBatchSelect = false;

        this.trainerDetails = undefined;
        this._selectedTrainer = undefined;
        this.isTrainerSelect = false;

        this.formDetails = undefined;
        this._selectedForms = undefined;
        this.isFormSelect = false;
      });
  }

  /* Display Course List*/
  getCourseListByBatchId() {
    this.batch_ids = [];
    for (let i = 0; i < this._selectedBatches.length; i++) {
      this.batch_ids.push(this._selectedBatches[i].batchid);
    }
    let params = {
      batch_ids: this.batch_ids,
    };
    $('.spinner').show();
    this.feedbackService
      .getFeedbackCouseListByBatchIds(params)
      .subscribe((data) => {
        $('.spinner').hide();
        this.courseDetails = undefined;
        this.courseDetails = data.data.sort((a: any, b: any) =>
          a.coursename > b.coursename ? 1 : -1
        );
        this._selectedCourses = undefined;
        this.isCourseSelect = false;

        this.trainerDetails = undefined;
        this._selectedTrainer = undefined;
        this.isTrainerSelect = false;

        this.formDetails = undefined;
        this._selectedForms = undefined;
        this.isFormSelect = false;
      });
  }

  /* Display Trainer List*/
  getTrainerListByBatchId() {
    this.course_ids = [];
    for (let i = 0; i < this._selectedCourses.length; i++) {
      this.course_ids.push(this._selectedCourses[i].courseid);
    }
    let params = {
      course_ids: this.course_ids,
      program_ids: this.program_ids
    };
    $('.spinner').show();
    this.feedbackService
      .getFeedbackTrainerListByBatchIds(params)
      .subscribe((data) => {
        $('.spinner').hide();
        this.trainerDetails = undefined;
        let data_1= data.data.map((object,i) => {
          return {...object, fullName: data.data[i]["firstname"]+' '+data.data[i]["lastname"]} ;
        });
        
        this.trainerDetails = data_1.sort((a: any, b: any) =>
          a.fullName > b.fullName ? 1 : -1
        );
        this._selectedTrainer = undefined;
        this.isTrainerSelect = false;

        this.batchDetails = undefined;
        this._selectedBatches = undefined;
        this.isBatchSelect = false;

        this.formDetails = undefined;
        this._selectedForms = undefined;
        this.isFormSelect = false;
      });
  }

  /* Display Form List*/
  getFormListByBatchId() {
    this.batch_ids = [];
    for (let i = 0; i < this._selectedBatches.length; i++) {
      this.batch_ids.push(this._selectedBatches[i].batchid);
    }
    let params = {
      project_ids: this.project_ids,
      program_ids: this.program_ids,
      batch_ids: this.batch_ids,
    };
    $('.spinner').show();
    this.feedbackService
      .getFeedbackFormByBatchIds(params)
      .subscribe((data) => {
        $('.spinner').hide();
        this.formDetails = undefined;
        let forms = [];
        data.data.forEach(function (value) {
          if(!forms.some(el => el.formId === value.formId)){
            forms.push(value);
          }
        });
        this.formDetails = forms.sort((a: any, b: any) =>
          a.formName > b.formName ? 1 : -1
        );
        this._selectedForms = undefined;
        this.isFormSelect = false;
        // this.formDetails = formsList.filter(function (el) {
        //   return el.isActive == 1;
        // });
      });
  }
  /* Display Selected Form Info*/
  getSelectedForm(id_form: number) {
    this.id_ActiveForm = id_form;
  }

  headerCaseString(string: any) {
    let titleCaseString = string
      .replace(/(_|-)/g, ' ')
      .trim()
      .replace(/\w\S*/g, function (str: any) {
        return str.charAt(0).toUpperCase() + str.substr(1);
      })
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');

    return titleCaseString;
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    //fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    FileSaver.saveAs(
      data,
      fileName
    );
  }
}
