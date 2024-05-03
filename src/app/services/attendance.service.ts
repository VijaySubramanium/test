import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  constructor(private http: HttpClient) {}

  private commonUrl: string = environment.BASE_API_URL;

  /* Get Attendance Project List*/
  getAttendanceProjectList() {
    return this.http.get<any>(this.commonUrl + 'get-all-project');
  }

  /* Get Attendance Program List*/
  getAttendanceProgramsList(project_id: any) {
    return this.http.get<any>(
      this.commonUrl + 'user-management/get-program-by-projectid/' + project_id
    );
  }

  /* Get Attendance Course List*/
  getAttendanceCourseList(programId: any) {
    return this.http.get<any>(
      this.commonUrl + 'admin-program-details/get-course-details/' + programId
    );
  }

  /* Get Attendance Batch List*/
  getAttendanceBatchList(project_id: any) {
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

  /* Get Attendance Batch List By Project Id And Program Id*/
  getFeedbackBatchListByProjectIdAndProgramId(params: any) {
    let headers = new HttpHeaders();
    let formData: FormData = new FormData();
    formData.append('projectId', params.project_id);
    formData.append('programId', params.program_id);
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(this.commonUrl + 'batch/v2/getBatch', formData, {
      headers: headers,
    });
  }

  /* Get Attendance Form List By Project Id And Program Id*/
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

  /* Get Attendance Form By Form Id*/
  getFormById(form_id: any) {
    return this.http.get<any>(
      this.commonUrl + 'feedback-form/feedbackform-details/' + form_id
    );
  }

  /* Get Attendance Form ListBy Batch Id*/
  getFormListByBatchId(batch_id: any) {
    return this.http.get<any>(
      this.commonUrl + 'feedback/feedback-response/' + batch_id
    );
  }

  /* Save Attendance Question Form*/
  saveFeedBackQuestionForm(params: any) {
    return this.http.post<any>(
      this.commonUrl + 'feedback-form/save-feedback',
      params
    );
  }

  /* Save FeedBack User Form*/
  saveFeedBackUserForm(params: any) {
    return this.http.post<any>(
      this.commonUrl + 'feedback-form/save-feedbackuser-details',
      params
    );
  }

  /* Get Student Attendance List*/
  getStudentAttendanceList(params: any) {
    return this.http.get<any>(
      this.commonUrl +
        'admin-attendance/attendance/' +
        params.batchid +
        '/' +
        params.userid
    );
  }

  /* Save Admin Attendance*/
  saveAdminAttendance(params: any) {
    return this.http.post<any>(
      this.commonUrl + 'admin-attendance/save-admin-attendance',
      params
    );
  }

  /* Save Admin Bulk Attendance*/
  saveStudentsAttendance(params: any) {
    return this.http.post<any>(
      this.commonUrl + 'admin-attendance/save-students-attendance',
      params
    );
  }

  /* Get Role Based Project List*/
  getUserProjectList(params: any) {
    return this.http.get<any>(
      this.commonUrl +
        'admin-attendance/get-user-project-details?userid=' +
        params.userid +
        '&roleid=' +
        params.roleid
    );
  }
   /* Get Admin Based Project List*/
   getAdminProjectList(params: any) {
    return this.http.get<any>(
      this.commonUrl +
        'admin-attendance/get-projects-admin'
    );
  }
  /* Get Role Based Program List*/
  getUserProgramList(params: any) {
    return this.http.get<any>(
      this.commonUrl +
        'admin-attendance/get-programs-basedon-project?userid=' +
        params.userid +
        '&projectid=' +
        params.projectid
    );
  }
   /* Get Admin Based Program List*/
   getAdminProgramList(params: any) {
    return this.http.get<any>(
      this.commonUrl +
        'admin-attendance/get-programs-basedon-project-admin?projectid=' +
        params.projectid
    );
  }
  /* Get Role Based Course List*/
  getUserCourseList(params: any) {
    return this.http.get<any>(
      this.commonUrl +
        'admin-attendance/get-courses-basedon-program?userid=' +
        params.userid +
        '&programid=' +
        params.programid
    );
  }
  /* Get Admin Based Course List */
  getAdminCourseList(params: any) {
    return this.http.get<any>(
      this.commonUrl +
        'batch/getCourse?projectid='+
         params.projectid +
         '&programid='+
         params.programid
    );
  }
  /* Get Role Based Batch List*/
  getUserBatchList(params: any) {
    return this.http.get<any>(
      this.commonUrl +
        'admin-attendance/get-batches-basedon-course?userid=' +
        params.userid +
        '&courseid=' +
        params.courseid +
        '&programid=' +
        params.programid
    );
  }
   /* Get Admin Based Batch List*/
   getAdminBatchList(params: any) {
    return this.http.get<any>(
      this.commonUrl +
        'admin-attendance/get-batches-per-course-admin?'+
        'projectid=' +
        params.projectid +
        '&programid=' +
        params.programid +
        '&courseid=' +
        params.courseid
    );
  }
  /* Get Role Based Batch List*/
  getStudentListByBatch(params: any) {
    return this.http.get<any>(
      this.commonUrl +
        'admin-attendance/get-student-per-batch?projectid=' +
        params.projectid +
        '&programid=' +
        params.programid +
        '&courseid=' +
        params.courseid +
        '&batchid=' +
        params.batchid
    );
  }
}
