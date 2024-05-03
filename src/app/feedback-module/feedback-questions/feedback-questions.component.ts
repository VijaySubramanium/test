import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  FormArray,
  Validators,
} from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { FeedbackViewModel } from '../../view-models/feedbackview-model';
import { FeedbackService } from 'src/app/services/feedback.service';
import { NgForm } from '@angular/forms';
import { FeedbackMultiViewModel } from 'src/app/view-models/feedbackmultiview-models';

@Component({
  selector: 'app-feedback-questions',
  templateUrl: './feedback-questions.component.html',
  styleUrls: ['./feedback-questions.component.css'],
})
export class FeedbackQuestionsComponent implements OnInit {
  @Input() activeProjectList: any = [];
  addFields = new FeedbackMultiViewModel();
  disable = false;
  stackForm: FormGroup;
  /*
   Feedback Order New Code
  */
  quesTextStackForm: FormGroup;


  get work(): FormArray {
    return this.stackForm.get('work') as FormArray;
  }
  get textwork(): FormArray {
    return this.stackForm.get('textwork') as FormArray;
  }

  get quesTextArr(): FormArray {
    return this.quesTextStackForm.get('quesTextArr') as FormArray;
  }

  @ViewChild("addfield")
  yourForm: any;

  formname: any;
  formId: any;
  formType: any;

  QCount: any = 0;
  QCountArray: any = [];

  mappingDetails: any;
  projectDetails: any;
  programDetails: any;
  courseDetails: any;
  batchDetails: any;
  formDetails: any;

  projectsName: any;
  projectId: any;
  programsName: any;
  programId: any;
  coursesName: any;
  courseId: any;
  batchName: any;
  batchId: any;
  isAddForm: boolean = true;
  isDuplicate: boolean = false;
  formsubmitted: boolean = false;
  dynamicArray = [];
  emptyarray = [
    {
      optionname: null,
      optionorder: 0,
    },
  ];

  project_ids: any = [];
  program_ids: any = [];
  batch_ids: any = [];
  course_ids: any = [];
  form_ids: any = [];

  formDataList: any;
  displayFormName: any;
  // formActive: any;
  formViewStatus: any;

  isProjectSelect: boolean = false;
  _selectedProjects: any[];
  isProgramSelect: boolean = false;
  _selectedPrograms: any[];
  isBatchSelect: boolean = false;
  _selectedBatches: any[];
  isCourseSelect: boolean = false;
  _selectedCourses: any[];

  constructor(
    private fb: FormBuilder,
    private feedbackService: FeedbackService,
    private messageService: MessageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.coursesName;
    this.stackForm = new FormGroup({
      work: this.fb.array([]),
      textwork: this.fb.array([]),
    });

    /* Feedback order new code */
    this.quesTextStackForm = new FormGroup({
      quesTextArr: this.fb.array([]),
    });


  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }

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
      if (this._selectedBatches.length > 0 && this.isProjectSelect && this.isProgramSelect && this.isCourseSelect) {
        this.isBatchSelect = true;
      } else {
        this.isBatchSelect = false;
      }
    } else if (type == 'courses') {
      this._selectedCourses = undefined;
      this._selectedCourses = $event.value;
      if (this._selectedCourses.length > 0 && this.isProjectSelect && this.isProgramSelect) {
        this.isCourseSelect = true;
      } else {
        this.isCourseSelect = false;
      }
    }
    //  else if (type == 'forms') {
    //   this._selectedForms = undefined;
    //   this._selectedForms = $event.value;
    //   if (this._selectedForms.length > 0 && this.isProjectSelect && this.isProgramSelect && this.isBatchSelect && this.isCourseSelect) {
    //     this.isFormSelect = true;
    //   } else {
    //     this.isFormSelect = false;
    //   }
    // }
  }

  /* Display Project List*/
  // projectNameList() {
  //   $('.spinner').show();
  //   this.feedbackService.getFeedbackProjectList().subscribe((data) => {
  //     $('.spinner').hide();
  //     this.projectDetails = data.data.sort((a: any, b: any) =>
  //       a.project_name > b.project_name ? 1 : -1
  //     );
  //     this.activeProjectList = this.projectDetails.filter(function (el) {
  //       return el.status == 'Active';
  //     });
  //   });
  // }

  getMappingData(projects: any) {
    const params = {
      projectids: projects
    }
    this.feedbackService
      .getMappingData(params)
      .subscribe((data) => {
        $('.spinner').hide();
        this.mappingDetails = undefined;
        this.mappingDetails = data.data;
      });
  }

  checkMapping() {
    let project_ids = this._selectedProjects.map((project) => project.project_id);
    let program_ids = this._selectedPrograms.map((program) => program.programid);
    let course_ids = this._selectedCourses.map((course) => course.courseid);
    let batch_ids = this._selectedBatches.map((batch) => batch.batch_id);


    console.log('Project ids:-----------  ', project_ids);
    console.log('Program ids:-----------  ', program_ids);
    console.log('Course ids:-----------  ', course_ids);
    console.log('Batch ids:-----------  ', batch_ids);


    var items = [];
    for (let i = 0; i < this.mappingDetails?.length; i++) {
      var obj = this.mappingDetails[i];
      if (
        project_ids.some((x) => x === obj?.projectid) &&
        program_ids.some((x) => x === obj?.programid) &&
        course_ids.some((x) => x === obj?.courseid) &&
        batch_ids.some((x) => x === obj?.batchid)
      ) {
        items.push(obj);
      }
    }
    console.log('Mapped data:-------------   ', items);
    return items;
  }

  /* Display Program List*/
  getProgramsByProjectId() {   //project: any
    console.log("Ids:------  ", this._selectedProjects)
    this.project_ids = [];
    for (let i = 0; i < this._selectedProjects.length; i++) {
      this.project_ids.push(this._selectedProjects[i].project_id);
    }
    const params = {
      project_ids: this.project_ids
    }
    console.log("Multi Projects ids:---  ", params);
    this.getMappingData(this.project_ids);
    $('.spinner').show();
    // this.addFields.programName = "";
    // this.programDetails = undefined;
    // this.addFields.BatchName = "";
    // this.batchDetails = [];
    // this.addFields.CourseName = "";
    // this.courseDetails = [];
    // let projectInfo = project.split('_', 2);
    // this.projectId = projectInfo[0];
    // this.projectsName = projectInfo[1];

    // this.feedbackService
    //   .getFeedbackProgramsListByProjectId(this.projectId)
    //   .subscribe((data) => {
    //     $('.spinner').hide();
    //     this.programDetails = data.data.sort((a: any, b: any) =>
    //       a.programname > b.programname ? 1 : -1
    //     );
    //   });


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
        this.isDuplicate = false;
        this.formViewStatus = undefined;
        this.stackForm = new FormGroup({
          work: this.fb.array([]),
          textwork: this.fb.array([]),
        });
        this.formDetails = undefined;
        this.formname = undefined;
        this.formId = undefined;
        console.log("programDetails:------  ", this.programDetails)
        console.log("activeProjectList:--------------", this.activeProjectList)
      });
  }

  /* Display Batch List*/
  getCourseByProjectIdProgramId() {  //program: any
    this.program_ids = [];
    for (let i = 0; i < this._selectedPrograms.length; i++) {
      this.program_ids.push(this._selectedPrograms[i].programid);
    }
    let params = {
      project_ids: this.project_ids,
      program_ids: this.program_ids,
    };
    $('.spinner').show();
    // this.addFields.BatchName = "";
    // this.batchDetails = [];
    // this.addFields.CourseName = "";
    // this.courseDetails = [];
    // let programInfo = program.split('_', 2);
    // this.programId = programInfo[0];
    // this.programsName = programInfo[1];
    // let params = {
    //   project_id: this.projectId,
    //   program_id: this.programId,
    // };

    // this.feedbackService
    //   .getFeedbackBatchListByProjectIdAndProgramId(params)
    //   .subscribe((data) => {
    //     $('.spinner').hide();

    //     data.data.forEach((elm, inx) => {
    //       if (elm.batch_code != null) {
    //         this.batchDetails.push(elm);
    //       }
    //     });

    //     this.batchDetails = this.batchDetails.sort((a: any, b: any) =>
    //       a.batch_code > b.batch_code ? 1 : -1
    //     );
    //   });
    this.feedbackService
      .getFeedbackCourseListByProjectIdAndProgramId(params)
      .subscribe((data) => {
        $('.spinner').hide();
        this.courseDetails = undefined;
        this.courseDetails = data.data.sort((a: any, b: any) =>
          a.coursename > b.coursename ? 1 : -1
        );
        this._selectedCourses = undefined;
        this.isCourseSelect = false;

        this.batchDetails = undefined;
        this._selectedBatches = undefined;
        this.isBatchSelect = false;
        this.isDuplicate = false;
        this.formViewStatus = undefined;
        this.stackForm = new FormGroup({
          work: this.fb.array([]),
          textwork: this.fb.array([]),
        });
        this.formDetails = undefined;
        this.formname = undefined;
        this.formId = undefined;
      });
  }

  /* Display course List*/
  getBatchByCourseId() {  //batch: any
    // this.addFields.CourseName = "";
    // this.courseDetails = [];
    // let batchInfo = batch.split('_', 2);
    // this.batchId = batchInfo[0];
    // this.batchName = batchInfo[1];
    // let id = batchInfo[0];
    this.course_ids = [];
    for (let i = 0; i < this._selectedCourses.length; i++) {
      this.course_ids.push(this._selectedCourses[i].courseid);
    }
    let params = {
      course_ids: this.course_ids,
      program_ids: this.program_ids,
      project_ids: this.project_ids
    };
    $('.spinner').show();
    // this.feedbackService.getFeedbackBatchList(this.batchId).subscribe({
    //   next: (response) => {
    //     $('.spinner').hide();
    //     if (response.status == 'Success') {
    //       response.data.forEach((elm, indx) => {
    //         this.courseDetails.push(elm);
    //       });
    //     }
    //   },
    //   error: (response) => {
    //     $('.spinner').hide();
    //     this.messageService.add({
    //       severity: 'error',
    //       summary: 'Error',
    //       detail:
    //         response.error.message == null
    //           ? response.error.error
    //           : response.error.message,
    //     });
    //   },
    // });
    this.feedbackService
      .getFeedbackBatchListByCourseIdsAndProgramIds(params)
      .subscribe((data) => {
        $('.spinner').hide();
        this.batchDetails = undefined;
        this.batchDetails = data.data.sort((a: any, b: any) =>
          a.batch_code > b.batch_code ? 1 : -1
        );
        this._selectedBatches = undefined;
        this.isBatchSelect = false;
        this.isDuplicate = false;
        this.formViewStatus = undefined;
        this.stackForm = new FormGroup({
          work: this.fb.array([]),
          textwork: this.fb.array([]),
        });
        this.formDetails = undefined;
        this.formname = undefined;
        this.formId = undefined;
      });
  }

  getFeedbackForms() {
    $('.spinner').show();
    this.feedbackService.getFeedbackForms().subscribe({
      next: (data) => {
        $('.spinner').hide();
        this.formDetails = undefined;
        this.formDetails = data.data.sort((a: any, b: any) =>
          a.form_name > b.form_name ? 1 : -1
        );
        this.formname = undefined;
        this.formId = undefined;
        this.isDuplicate = false;
        this.formViewStatus = undefined;
        this.stackForm = new FormGroup({
          work: this.fb.array([]),
          textwork: this.fb.array([]),
        });

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

  /* Display Form List*/
  getFormListByBatchId() {
    // this.course_ids = [];
    // for (let i = 0; i < this._selectedCourses.length; i++) {
    //   this.course_ids.push(this._selectedCourses[i].courseid);
    // }
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
        this.formDetails = data.data.sort((a: any, b: any) =>
          a.formName > b.formName ? 1 : -1
        );
        this.formname = undefined;
        this.formId = undefined;
        // this.formDetails = formsList.filter(function (el) {
        //   return el.isActive == 1;
        // });
      });
  }

  /* Display Selected Course Info*/
  getSelectedCourse(course: any) {
    let courseInfo = course.split('_', 2);
    this.courseId = courseInfo[0];
    this.coursesName = courseInfo[1];
  }

  /* Display Selected Form Info*/
  getSelectedForm(form: any) {
    let formInfo = form.split('_', 2);
    this.formId = formInfo[0];
    this.formname = formInfo[1];
    this.isDuplicate = false;
    this.formViewStatus = undefined;
    // this.stackForm = new FormGroup({
    //   work: this.fb.array([]),
    //   textwork: this.fb.array([]),
    // });

    /*
     Feedback new order
    */
    this.quesTextStackForm = new FormGroup({
      quesTextArr: this.fb.array([]),
    });

    let form_data = this.getFormList();
    console.log("Form data:--------   ", form_data)
    let map_data = this.checkMapping();
    console.log(map_data);
  }

  getFormList() {
    // let params = {
    //   formId: Number(this.formId),
    //   batchId: Number(this.batchId),
    //   projectId: Number(this.projectId),
    //   programId: Number(this.programId)
    // };
    $('.spinner').show();
    this.feedbackService.getFormById(this.formId).subscribe({
      next: (response) => {
        this.formViewStatus = response.status;
        $('.spinner').hide();
        if (response.status == 'Success') {
          this.displayFormName = response.data[0]?.formname;
          // this.formActive =
          // response.data[0]?.isactive == 1 ? 'Active' : 'Inactive';
          debugger
          let questionsRecord = [];
          response.data.forEach((elem: any, index: any) => {
            if (elem.options != '') {
              elem.options.forEach((ele: any, index: any) => {
                ele.optionName = ele.optionName.replaceAll('/"', '')
              });
            }
            let option = elem.questionoption?.replaceAll('"', '');

            questionsRecord.push({
              questions: elem.questions.replaceAll('"', ''),
              questionoption:
                option == null
                  ? ''
                  : option.split(','),
              formname: elem.formname,
              optionorder: elem.optionorder,
              isrequired: elem.isrequired,
              options: elem.options,
              actiontype: elem.actiontype,
              count: index + 1
            });
          });
          this.formDataList = questionsRecord;

          console.log('questionsRecord', questionsRecord);
          return questionsRecord;
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
  /* Display Selected Batch Info*/
  getBatchDetails(batch: any) {
    let batchInfo = batch.split('_', 2);
    this.batchId = batchInfo[0];
    this.batchName = batchInfo[1];
  }

  getFormType(formType: any) {
    this.formType = formType;
  }

  onTabSelection(selectType: String) {
    console.log(this.formname);
    this.yourForm.submitted = false;
    this.formname = undefined;
    this.formId = undefined;
    this.formViewStatus = undefined;
    this.isDuplicate = false;
    // this.stackForm = new FormGroup({
    //   work: this.fb.array([]),
    //   textwork: this.fb.array([]),
    // });

    /*
     Feedback new order
    */
    this.quesTextStackForm = new FormGroup({
      quesTextArr: this.fb.array([]),
    });



    if (selectType == 'AF') {
      this.isAddForm = true;
    } else {
      this.isAddForm = false;
    }
  }

  duplicateStatus(status: boolean) {
    this.isDuplicate = !status;
    this.stackForm = new FormGroup({
      work: this.fb.array([]),
      textwork: this.fb.array([]),
    });

    /*
    Feedback new order
   */
    this.quesTextStackForm = new FormGroup({
      quesTextArr: this.fb.array([]),
    });

    this.addFields.NewFormName = '';
    if (this.isDuplicate) {
      this.createFormRecords();
    }
  }

  createFormRecords() {
    debugger
    for (let i = 0; i < this.formDataList.length; i++) {
      // if (this.formDataList[i].actiontype == 'Text') {
      //   this.textwork.push(this.testbuildCustomWork(this.formDataList[i]));
      // } else {
      //   this.work.push(this.buildCustomWork(this.formDataList[i]));
      // }

      if (this.formDataList[i].actiontype == 'Text') {
        this.quesTextArr.push(this.testbuildCustomWork(this.formDataList[i]));
      } else {
        this.quesTextArr.push(this.buildCustomWork(this.formDataList[i]));
      }
    }
  }
  // -------------------------------------Question Functionality--------------------------------------------------------
  buildWork(): FormGroup {
    return this.fb.group({
      questions: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      isrequired: false,
      activate_flag: false,
      action_type: new FormControl('', [Validators.required]),
      options: this.fb.array([this.buildHighlights()], [Validators.required]),
      count: this.QCount
    });
  }

  buildCustomWork(question: any): FormGroup {
    let required;
    if (question.isrequired == 0) {
      required = false;
    } else {
      required = true;
    }
    let options = [];
    for (let i = 0; i < question.options.length; i++) {
      options.push(this.buildCustomHighlights(question.options[i]));
    }
    return this.fb.group({
      questions: new FormControl(question.questions, [Validators.required, this.noWhitespaceValidator]),
      isrequired: required,
      activate_flag: false,
      action_type: new FormControl(question.actiontype, [Validators.required]),
      options: this.fb.array(options, [Validators.required]),
      count: question.count,
    });
  }
  // buildHighlights(): FormControl {
  //   return new FormControl();
  // }

  buildHighlights(): FormGroup {
    return this.fb.group({
      optionname: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      optionorder: '',
      optionscore: new FormControl('', [
        Validators.required,
        Validators.min(0),
        Validators.max(10),
      ]),
    });
  }

  buildCustomHighlights(option: any): FormGroup {
    return this.fb.group({
      optionname: new FormControl(option.optionName, [Validators.required, this.noWhitespaceValidator]),
      optionorder: option.optionOrder,
      optionscore: new FormControl(option.optionScore, [
        Validators.required,
        Validators.min(0),
        Validators.max(10),
      ]),
    });
  }

  addQuestion(): void {
    this.QCount = this.QCount += 1;
    this.work.push(this.buildWork());
  }

  /* Feedback order new code */
  addFormQuestion(type: any) {
    if (type == 'select') {
      this.QCount = this.QCount += 1;
      this.quesTextArr.push(this.buildWork());
    } else {
      this.QCount = this.QCount += 1;
      this.quesTextArr.push(this.testbuildWork());
    }
  }

  deleteQuestion(index: any) {
    this.quesTextArr.removeAt(index);
  }

  // deleteQuestion(index) {
  //   this.work.removeAt(index);
  // }



  options(groupName: string, i: number) {
    return this.highLightFormArray(groupName, i).controls;
  }
  // highLightFormArray(groupName: string, i: number) {
  //   return (this.stackForm.get(groupName) as FormArray).controls[i].get(
  //     'options'
  //   ) as FormArray;
  // }

  /* Feedback order new code */
  highLightFormArray(groupName: string, i: number) {
    return (this.quesTextStackForm.get(groupName) as FormArray).controls[i].get(
      'options'
    ) as FormArray;
  }


  addHighlights(groupName: string, i = 0): void {
    this.highLightFormArray(groupName, i).push(this.buildHighlights());
  }

  deleteOptions(groupName: string, i, j) {
    this.highLightFormArray(groupName, i).removeAt(j);
  }

  // -------------------------------------Text Functionality--------------------------------------------------------

  testbuildWork(): FormGroup {
    return this.fb.group({
      questions: new FormControl('', [Validators.required, this.noWhitespaceValidator]),
      isrequired: false,
      activate_flag: false,
      action_type: 'Text',
      options: '',
      count: this.QCount,
    });
  }

  testbuildCustomWork(question: any): FormGroup {
    let required;
    if (question.isrequired == 0) {
      required = false;
    } else {
      required = true;
    }
    return this.fb.group({
      questions: new FormControl(question.questions, [Validators.required, this.noWhitespaceValidator]),
      isrequired: required,
      activate_flag: false,
      action_type: 'Text',
      options: '',
      count: question.count,
    });
  }

  addText(): void {
    this.QCount = this.QCount += 1;
    this.textwork.push(this.testbuildWork());
  }

  // deleteText(index) {
  //   this.textwork.removeAt(index);
  // }

  /* Feedback order new code */
  deleteText(index: any) {
    this.quesTextArr.removeAt(index);
  }

  /* FeedBack Form Submit*/
  onQuestionSubmit(formvalue: any, type: String) {
    // this.stackForm.value.work.forEach((opt: any, index: any) => {
    //   for (let i = 0; i < opt.options.length; i++) {
    //     opt.options[i].optionorder = i;
    //     opt.options[i].optionname = opt.options[i].optionname.replace(/\s+/g, ' ').trim();
    //   }
    // });

    this.quesTextArr.value.forEach((opt: any, index: any) => {
      if (opt.options != "") {
        for (let i = 0; i < opt.options.length; i++) {
          opt.options[i].optionorder = i;
          opt.options[i].optionname = opt.options[i].optionname.replace(/\s+/g, ' ').trim();
        }
      }
    });

    if (formvalue.valid == true && this.quesTextStackForm.valid == true) {
      //   let newQuestionList = [
      //     ...this.stackForm.value.work,
      //     ...this.stackForm.value.textwork,
      //   ];

      //   newQuestionList.sort((a, b) => a.count - b.count);

      /* Feedback order new code */
      let newQuestionList = this.quesTextArr.value;
      newQuestionList.sort((a, b) => a.count - b.count);

      let questionsRecord = [];
      newQuestionList.forEach((elem: any, index: any) => {
        questionsRecord.push({
          questions: elem.questions.replace(/\s+/g, ' ').trim(),
          isrequired: elem.isrequired == true ? 'True' : 'False',
          activate_flag: 'True',
          action_type: elem.action_type,
          options: elem.options == '' ? this.emptyarray : elem.options,
        });
      });

      if (!questionsRecord.length && type != 'assignForm') {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Question is required',
        });
      } else {
        if (type == 'newForm') {
          const finalResult = {
            form_name: formvalue.value.CreateFormName.replace(/\s+/g, ' ').trim(),
            quetionsDetails: questionsRecord,
          };

          console.log(finalResult);
          $('.spinner').show();
          this.feedbackService.addFeedBackQuestionForm(finalResult).subscribe({
            next: (response) => {
              $('.spinner').hide();
              if (response.status == 'Success') {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: response.message,
                });
                setTimeout(() => {
                  window.location.reload();
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
                    : response.error.data,
              });
            },
          });
        } else if (type == 'saveForm') {
          const finalResult = {
            form_name: formvalue.value.NewFormName.replace(/\s+/g, ' ').trim(),
            mapping: this.checkMapping(),
            quetionsDetails: questionsRecord,
          };

          if (finalResult.mapping.length > 0) {
            console.log(finalResult);
            if (finalResult.form_name != "") {
              $('.spinner').show();
              this.feedbackService.dubFeedBackQuestionForm(finalResult).subscribe({
                next: (response) => {
                  $('.spinner').hide();
                  if (response.status == 'Success') {
                    this.messageService.add({
                      severity: 'success',
                      summary: 'Success',
                      detail: response.message,
                    });
                    setTimeout(() => {
                      window.location.reload();
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
                        : response.error.data,
                  });
                },
              });
            }
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Project based mapping not found'
            });
          }

        } else {
          const finalResult = {
            formid: this.formId,
            mapping: this.checkMapping()
          };

          console.log("Assign data:------------  ", finalResult)
          if (finalResult.mapping.length > 0) {

            $('.spinner').show();
            this.feedbackService.savemultiplefeedbackdetails(finalResult).subscribe({
              next: (response) => {
                $('.spinner').hide();
                if (response.status == 'Success') {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: response.message,
                  });
                  setTimeout(() => {
                    window.location.reload();
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
                      : response.error.data,
                });
              },
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Project based mapping not found'
            });
          }
        }

      }
    }
  }
}
