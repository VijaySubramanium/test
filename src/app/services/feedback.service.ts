import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FeedbackService {
  constructor(private http: HttpClient) { }

  private commonUrl: string = environment.BASE_API_URL;

  /* Get FeedBack Project List*/
  getFeedbackProjectList() {
    return this.http.get<any>(this.commonUrl + 'get-all-project');
  }

  /* Get mapping data By Project Ids*/
  getMappingData(params: any) {
    return this.http.post<any>(
      this.commonUrl + 'feedback/get-project-program-batch-course-on-projectids',
      params
    );
  }

  /* Get FeedBack Program List By Project Id*/
  getFeedbackProgramsListByProjectId(project_id: any) {
    return this.http.get<any>(
      this.commonUrl + 'user-management/get-program-by-projectid/' + project_id
    );
  }

  /* Get FeedBack multiple Program List By Project Ids*/
  getFeedbackProgramsListByProjectIds(params: any) {
    return this.http.post<any>(
      this.commonUrl + 'user-management/v1/get-program-by-projectid',
      params
    );
  }

  /* Get FeedBack Course List By Program Id*/
  getFeedbackCourseList(programId: any) {
    return this.http.get<any>(
      this.commonUrl + 'admin-program-details/get-course-details/' + programId
    );
  }

  /* Get FeedBack Batch List*/
  getFeedbackBatchList(batchId: any) {
    return this.http.get<any>(
      this.commonUrl + 'batch/v1/getAllBatchs-response/' + batchId
    );
  }

  /* Get FeedBack Batch List By Project Id*/
  getFeedbackBatchListByProjectId(project_id: any) {
    return this.http.get<any>(
      this.commonUrl + 'user-management/get-batch-by-projectid/' + project_id
    );
  }

  /* Get FeedBack User List By Batch Id*/
  getFeedbackUserListByBatchId(batch_id: any) {
    return this.http.get<any>(
      this.commonUrl + 'user-management/get-user/' + batch_id
    );
  }

  /* Get FeedBack Batch List By Project Id And Program Id*/
  getFeedbackBatchListByProjectIdAndProgramId(params: any) {
    let headers = new HttpHeaders();
    let formData: FormData = new FormData();
    formData.append('projectId', params.project_id);
    formData.append('programId', params.program_id);
    formData.append('courseId', params.course_id);
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(
      this.commonUrl + 'batch/v3/getbatchs',
      formData,
      {
        headers: headers,
      }
    );
  }

  /* Get FeedBack Course List By Project Id And Program Id*/
  getFeedbackCourseListBySingle(params: any) {
    let headers = new HttpHeaders();
    let formData: FormData = new FormData();
    formData.append('projectId', params.project_id);
    formData.append('programId', params.program_id);
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(
      this.commonUrl + 'batch/v6/getcourse-response',
      formData,
      {
        headers: headers,
      }
    );
  }

  /* Get FeedBack Course List By Project Id And Program Id*/
  getFeedbackCourseListByProjectIdAndProgramId(params: any) {
    return this.http.post<any>(
      this.commonUrl + 'batch/v3/getCourse-response',
      params
    );
  }

  /* Get FeedBack Batch List By Multiple Course Ids And Program Ids*/
  getFeedbackBatchListByCourseIdsAndProgramIds(params: any) {
    return this.http.post<any>(
      this.commonUrl + 'batch/v4/getbatchdetails',
      params
    );
  }

  /* Get FeedBack Batch List By Multiple Course Ids, Trainer Ids And Program Ids*/
  getFeedbackBatchListByCourseIdsTrainerIdsAndProgramIds(params: any) {
    return this.http.post<any>(
      this.commonUrl + 'batch/v4/getBatchresponse',
      params
    );
  }

  /* Get FeedBack Course List By Multiple Program Ids*/
  getFeedbackCouseListByBatchIds(params: any) {
    return this.http.post<any>(
      this.commonUrl + 'batch/v3/getfeedbackcourse',
      params
    );
  }

  /* Get FeedBack Trainer List By Multiple Batch Ids*/
  getFeedbackTrainerListByBatchIds(params: any) {
    return this.http.post<any>(
      this.commonUrl + 'user-management/v1/get-trainer',
      params
    );
  }

  /* Get FeedBack Form List By Project Id And Program Id*/
  getFeedbackFormListByProjectIdAndProgramId(params: any) {
    return this.http.get<any>(
      this.commonUrl +
      'feedback-form/feedbackform-details?' +
      'projectId=' +
      params.project_id +
      '&programId=' +
      params.program_id
    );
  }
  /* Save FeedBack Question Form*/
  saveFeedBackQuestionForm(params: any) {
    return this.http.post<any>(
      this.commonUrl + 'feedback-form/save-feedback',
      params
    );
  }
  /* Save Multiple FeedBack Question Form*/
  savemultiplefeedbackdetails(params: any) {
    return this.http.post<any>(
      this.commonUrl + 'feedback-form/savemultiplefeedbackdetails',
      params
    );
  }
  /* Save FeedBack Question new Form*/
  addFeedBackQuestionForm(params: any) {
    return this.http.post<any>(
      this.commonUrl + 'feedback-form/add-feedback',
      params
    );
  }
  /* Duplicate FeedBack Question Form*/
  dubFeedBackQuestionForm(params: any) {
    return this.http.post<any>(
      this.commonUrl + 'feedback/dupform-data-mapping',
      params
    );
  }
  /* Form Active Status Change*/
  formActiveStatusChange(params: any) {
    return this.http.get<any>(
      this.commonUrl +
      'feedback-form/v1/save-feedbackform-details/' +
      params.formId +
      '/' +
      params.batchId +
      '/' +
      params.isactive
    );
  }
  /* Get FeedBack Form List By Batch Id*/
  getFeedbackFormListByBatchId(batch_id: any) {
    return this.http.get<any>(
      this.commonUrl + 'feedback-form/feedbackform-details?batchid=' + batch_id
    );
  }
  /* Get FeedBack Form By Batch Id*/
  getFeedbackFormByBatchId(batch_id: any) {
    return this.http.get<any>(
      this.commonUrl + 'feedback-form/v2/feedbackformbatch/' + batch_id
    );
  }

  /* Get FeedBack Form By Batch Id*/
  getMapFeedbackFormByBatchId(params: any) {
    return this.http.get<any>(
      this.commonUrl + 'feedback-form/v1/feedbackformbatch/' +
      params.projectId +
      '/' +
      params.programId +
      '/' +
      params.batchId
    );
  }

  /* Get FeedBack Form By Batch Ids*/
  getFeedbackFormByBatchIds(params: any) {
    return this.http.post<any>(
      this.commonUrl + 'feedback-form/v1/feedbackform-details-batch',
      params
    );
  }

  /* Get FeedBack Forms*/
  getFeedbackForms() {
    return this.http.get<any>(
      this.commonUrl + 'feedback-form/getfeedbackformdetails'
    );
  }

  /* Get FeedBack Form By Form Id*/
  getFormById(form_id: any) {
    return this.http.get<any>(
      this.commonUrl + 'feedback-form/feedbackform-details/' + form_id
    );
  }

  // /* Get FeedBack Form By Form Id*/
  // getFormByCBF(params: any) {
  //   return this.http.get<any>(
  //     this.commonUrl + 'feedback-form/v3/feedbackform-details/' + 
  //     params.courseId +
  //     '/' +
  //     params.batchId +
  //     '/' +
  //     params.formId
  //   );
  // }

  /* Get FeedBack Form By Map Id*/
  getMapFormById(params: any) {
    return this.http.get<any>(
      this.commonUrl + 'feedback-form/v1/feedbackform-details/' +
      params.projectId +
      '/' +
      params.programId +
      '/' +
      params.batchId +
      '/' +
      params.formId

    );
  }

  /* Get FeedBack Form ListBy Batch Id*/
  getFormListByBatchId(batch_id: any) {
    return this.http.get<any>(
      this.commonUrl + 'feedback/feedback-response/' + batch_id
    );
  }

  /* Save FeedBack User Form*/
  saveFeedBackUserForm(params: any) {
    return this.http.post<any>(
      this.commonUrl + 'feedback-form/v1/save-feedbackuser-details',
      params
    );
  }

  /* Get User Respond Form List */
  getUserRespondFormList(params: any) {
    return this.http.get<any>(
      this.commonUrl +
      'feedback/v3/feedback-user-response/' +
      params.courseid +
      '/' +
      params.batchid +
      '/' +
      params.userid
    );
  }

  /* Get FeedBack Question Form List By Project Id*/
  getQuestionFormListByProjectId(id_Project: any) {
    return this.http.get<any>(
      this.commonUrl + 'feedback-form/feedbackform-excel-details/' + id_Project
    );
  }

  /* Get FeedBack Question Form List By Multiple Project Ids*/
  getQuestionFormListByProjectIds(params: any) {
    return this.http.post<any>(
      this.commonUrl + 'feedback-form/v1/feedbackform-excel-details',
      params
    );
  }

  /* Get FeedBack Response Form List By Form Id*/
  getResponseFormListByFormId(id_Project: any) {
    return this.http.get<any>(
      this.commonUrl +
      'feedback-form/feedbackresponse-excel-details/' +
      id_Project
    );
  }

  /* Get FeedBack Response Form List By Projects, Programs, Batches, Courses, Trainer and Forms Ids, */
  getResponseFormListByIds(params: any) {
    return this.http.post<any>(
      this.commonUrl + 'feedback-form/v1/feedbackresponse-excel-details',
      params
    );
  }
}
