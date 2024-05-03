import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { EMPTY, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsermanagementService {
  constructor(private http: HttpClient) { }
  private commonUrl: string = environment.BASE_API_URL;

  public notifications:any;
  public mySubject = new Subject<any>();


  getUserList(route: any) {
    return this.http.get<any>(route).pipe(map((res) => res));
  }

  onBulkUpload(file: any, loggedUserId) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const formData = new FormData();
    formData.append('bulkUsersFile', file);
    formData.append('insertedUserid', loggedUserId);
    return this.http.post<any>(
      this.commonUrl + 'user-management/uploadBulkUsers',
      formData,
      { headers: headers }
    );
  }


  migrateToSA(params: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(
      this.commonUrl + 'user-management/userMigrationTjmtoSa',
      params,
      { headers: headers }
    );
  }


  getProjectAdditionalFields(project_id: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(
      this.commonUrl + 'user-management/getadditionalfield/' + project_id,
      { headers: headers }
    );
  }


  onBulkUploadUpdate(file: any, loggedUserId) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const formData = new FormData();
    formData.append('bulkUsersFile', file);
    formData.append('insertedUserid', loggedUserId);
    return this.http.post<any>(
      this.commonUrl + 'user-management/update-uploadBulkUsers',
      formData,
      { headers: headers }
    );
  }


  onSearchUser(params) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const formData = new FormData();
    formData.append('searchColumn', params.searchColumn);
    formData.append('searchValue', params.searchValue);
    return this.http.post<any>(
      this.commonUrl + 'user-management/searchUsers',
      formData,
      { headers: headers }
    );
  }

  multiSearchUser(params: any, loginUserId: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(
      this.commonUrl + 'user-management/searchUsers?created_by=' +
      loginUserId,
      params,
      { headers: headers }
    );
  }


  // multiReportSearchUser(params: any) {
  //   let headers = new HttpHeaders();
  //   headers.append('Access-Control-Allow-Origin', '*');
  //   return this.http.post<any>(
  //     this.commonUrl + 'reports/searchreport',
  //     params,
  //     { headers: headers }
  //   );
  // }


  multiReportSearchUser(params: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(
      this.commonUrl + 'reports/v2/searchreport',
      params,
      { headers: headers }
    );
  }

  exportAllExcelFields(userIds: any, currentUserId: any) {
    let params = {
      'userids': userIds,
      'userid': currentUserId
    };

    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(
      this.commonUrl + 'user-management/users/v1',
      params,
      { headers: headers }
    );
  }

  exportAllFile(currentUserId:any,header: any, exportType: any) {
    let params = {
      'header': header,
      'exportType': exportType,
      'loggedInUserid':currentUserId
    };

    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(
      this.commonUrl + 'user-management/exportUser',
      params,
      { headers: headers }
    );
  }


  exportAllReportFile(currentUserId:any,header: any, exportType: any) {
    let params = {
      'header': header,
      'exportType': exportType,
      'loggedInUserid':currentUserId
    };

    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(
      this.commonUrl + 'user-management/report/exportUser',
      params,
      { headers: headers }
    );
  }

  getGenTermsConditionsUpload(params, file) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const formData = new FormData();
    formData.append('termsRequest', JSON.stringify(params));
    formData.append('termsandcondition', file);
    return this.http.post<any>(
      this.commonUrl + 'terms-conditions/save-general-terms-file',
      formData,
      { headers: headers }
    );
  }

  onCoorBulkUpload(file: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const formData = new FormData();
    formData.append('bulkUserCoordinatorFile', file);
    return this.http.post<any>(
      this.commonUrl + 'user-management/uploadBulkUser-co-ordinators',
      formData,
      { headers: headers }
    );
  }


  // Bulk Mail
  sendBulkMail(params, uploadFiles: any) {
    debugger
    let headers = new HttpHeaders();
    let formData: FormData = new FormData();
    formData.append('recipient', JSON.stringify(params.recipient));
    formData.append('subject', params.subject);
    formData.append('body', params.body);
    if (uploadFiles.length > 0) {
      for (var i = 0; i < uploadFiles.length; i++) {
        formData.append("attachments", uploadFiles[i]);
      }
    } else {
      formData.append("attachments", null);
    }


    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(formData);
    return this.http.post<any>(
      this.commonUrl + 'user-management/bulk-user-email',
      formData,
      { headers: headers }
    );
  }

  onAdminBulkUpload(file: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const formData = new FormData();
    formData.append('bulkUserAdminFile', file);
    return this.http.post<any>(
      this.commonUrl + 'user-management/uploadBulkUser-admin',
      formData,
      { headers: headers }
    );
  }

  /* User Details */
  getUserDetails(roleIds: any, currentUserId: any, loggedInRoleId: any) {
    return this.http.get<any>(
      this.commonUrl +
      'user-management/v2/users?roles=' +
      roleIds +
      '&userid=' +
      currentUserId +
      '&loginrole=' +
      loggedInRoleId
    );
  }

  /* Notification Details */
  getNotificationDetails() {
    return this.http.get<any>(
      this.commonUrl +
      'user-management/getNotificationDetails'
    );
  }

  getNotificationData(){
    return this.notifications;
  }

  /* User Details */
  getUserNewDetails(roleIds: any, currentUserId: any, loggedInRoleId: any, pageNumber: any, showCount: any) {
    return this.http.get<any>(
      this.commonUrl +
      'user-management/v9/users?roles=' +
      roleIds +
      '&userid=' +
      currentUserId +
      '&loginrole=' +
      loggedInRoleId +
      '&offset=' +
      pageNumber +
      '&pageSize=' +
      showCount
    );
  }

  /* User Date Filter */
  getUserByDateFilterOld(params: any) {
    return this.http.get<any>(
      this.commonUrl +
      'user-management/v3/users-registration?startdate=' +
      params.startDate +
      '&enddate=' +
      params.endDate
    );
  }
  getUserByDateFilter(params: any) {
    return this.http.get<any>(
      this.commonUrl +
      'user-management/v4/users?roles=' +
      params.roles +
      '&startdate=' +
      params.startdate +
      '&enddate=' +
      params.enddate +
      '&offset=' +
      params.pageNumber +
      '&pageSize=' +
      params.showCount
    );
  }

  getUserDetailReports(roleIds: any) {
    return this.http.get<any>(
      this.commonUrl + 'user-management/v2/users-registration?roles=' + roleIds
    );
  }

  getUserProjectAnalyticsBasedDetailReports(roleIds: any) {
    return this.http.get<any>(
      this.commonUrl + 'user-management/v1/users?roles=' + roleIds
    );
  }


  getUserProjectBasedDetailReports(roleIds: any, pageNumber, showCount) {
    return this.http.get<any>(
      this.commonUrl + 'user-management/v1/users?roles=' + roleIds + '&offset=' + pageNumber + '&pageSize=' + showCount
    );
  }

  /* Get All Organization */
  getOrganizationList() {
    return this.http.get<any>(
      this.commonUrl + 'student/placed-organization-list'
    );
  }

  /* Coordinator Details */
  getCoordinatorsLists(roleIds: any) {
    return this.http.get<any>(
      this.commonUrl + 'user-management/user-coordinators?roles=' + roleIds
    );
  }

  /* Add Coordinator Details */
  addCoordinator(params: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(
      this.commonUrl + 'user-management/addcoordinator/',
      params,
      { headers: headers }
    );
  }

  coordinatorChangeStatus(params: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(
      this.commonUrl + 'user-management/change-coordinator-status',
      params,
      { headers: headers }
    );
  }

  userChangeStatus(params: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(
      this.commonUrl + 'user-management/changeStatus',
      params,
      { headers: headers }
    );
  }

  /* Get User By Id */
  getUser(userId: any) {
    return this.http.get<any>(
      this.commonUrl + 'user-management/getUser?userId=' + userId
    );
  }

  /* Delete Coordinator */
  deleteCoordinator(deleteUserId: any) {
    return this.http.get<any>(
      this.commonUrl + 'user-management/delete-coordinator/' + deleteUserId
    );
  }

  /* Delete User */
  deleteUser(params: any) {
    return this.http.post<any>(
      this.commonUrl + 'user-management/changeStatus/',
      params
    );
  }

  /* Update User Details */
  // updateUserDetails(params: any) {
  //   let headers = new HttpHeaders();
  //   headers.append('Access-Control-Allow-Origin', '*');
  //   return this.http.post<any>(this.commonUrl + 'student/update/', params, {
  //     headers: headers,
  //   });
  // }

  updateUserDetails(params, files) {
    let headers = new HttpHeaders();
    let formData: FormData = new FormData();
    formData.append('studentRequest', JSON.stringify(params));
    formData.append('vaccinationCertificate', files);
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(formData);
    return this.http.post<any>(this.commonUrl + 'student/update/', formData, {
      headers: headers,
    });
  }

  /* Update User Details */
  // updateProfessionDetails(params: any, files: any) {
  //   let headers = new HttpHeaders();
  //   headers.append('Access-Control-Allow-Origin', '*');
  //   return this.http.post<any>(this.commonUrl + 'professional/update/', params, {
  //     headers: headers,
  //   });
  // }

  updateProfessionDetails(params: any, files: any) {
    let headers = new HttpHeaders();
    let formData: FormData = new FormData();
    formData.append('professionalRequest', JSON.stringify(params));
    formData.append('vaccinationCertificate', files);
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(formData);
    return this.http.post<any>(
      this.commonUrl + 'professional/update/',
      formData,
      { headers: headers }
    );
  }

  /* Update User Details */
  updateCoordinatorDetails(response: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.put<any>(
      this.commonUrl + 'user-management/update/co-ordinator/' + response.id,
      response,
      { headers: headers }
    );
  }

  /* ## Assign Project ## */
  /* Get student List*/
  getStudentList() {
    return this.http.get<any>(this.commonUrl + 'student/list?userRole=1');
  }

  /* Get Project List*/
  getCourseList() {
    return this.http.get<any>(this.commonUrl + 'get-all-project');
  }

  /* Get Project List*/
  getProjectList() {
    return this.http.get<any>(this.commonUrl + 'get-all-project');
  }
  /* Get Program List*/
  getProgramList() {
    return this.http.get<any>(this.commonUrl + 'get-all-programList');
  }

  /* Get Project manager List*/
  getProgramManagerList() {
    return this.http.get<any>(this.commonUrl + 'get-all-projectManagerList');
  }

  /* Get Batch List*/
  getBatchList() {
    return this.http.get<any>(this.commonUrl + 'batch/getAllBatchs');
  }

  /* Get Batch List*/
  getProjectBasedBatchList(projectId) {
    let headers = new HttpHeaders();
    let formData: FormData = new FormData();
    formData.append('projectId', projectId);
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(
      this.commonUrl + 'batch/v5/getBatch-response',
      formData,
      { headers: headers }
    );
  }


  /* Get Batch List*/
  getBatchBasedUserList(batchId: any) {
    return this.http.get<any>(
      this.commonUrl + 'batch/v2/getBatch?batchId='+ batchId
    );
  }


  /* Get Batch List*/
  getTrainerList() {
    return this.http.get<any>(
      this.commonUrl + 'user-management/get-trainer-or-training-coordinator/7'
    );
  }

  /* Get Trainer List*/
  getTrainingCoordinatorList() {
    return this.http.get<any>(
      this.commonUrl + 'user-management/get-trainer-or-training-coordinator/6'
    );
  }
  /*Get Training Coordinator List*/
  addAssignProject(response: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(
      this.commonUrl + 'user-management/assign-project',
      response,
      { headers: headers }
    );
  }
  /*Get program List based on projectid */
  getProgramsList(project_id: any) {
    return this.http.get<any>(
      this.commonUrl + 'user-management/get-program-by-projectid/' + project_id
    );
  }

   /*Get program List based on projectid */
   getBatchProgramBasedByProject(project_id: any) {
    return this.http.get<any>(
      this.commonUrl + 'batch/batches/projectid?projectid=' + project_id
    );
  }

  /*Get program List based on projectid */
  getTrainersBasedByCourse(course_id: any) {
    return this.http.get<any>(
      this.commonUrl + 'batch/trainers/courseid?courseid=' + course_id
    );
  }


  getBatchProManTrainerNames(params: any) {
    let headers = new HttpHeaders();
    let formData: FormData = new FormData();
    formData.append('projectId', params.project_id);
    formData.append('programId', params.program_id);
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(formData);
    return this.http.post<any>(this.commonUrl + 'batch/v2/getBatch', formData, {
      headers: headers,
    });
  }
  //FilterForms
  getFormListByProjectProgramIds(params: any) {
    let headers = new HttpHeaders();
    let formData: FormData = new FormData();
    formData.append('projectId', params.project_id);
    formData.append('programId', params.program_id);
    headers.append('Access-Control-Allow-Origin', '*');

    return this.http.get<any>(
      this.commonUrl +
      'feedback-form/feedbackform-details?' +
      'projectId=' +
      params.project_id +
      '&programId=' +
      params.program_id
    );
  }

  getCourseBasedPrograms(program_id: any) {
    return this.http.get<any>(
      this.commonUrl +
      'admin-program-details/get-program-by-programid/' +
      program_id
    );
  }

  getProjectBasedRecords(project_id: any) {
    return this.http.get<any>(
      this.commonUrl +
      'project-details/find-project-details-by-projectid?projectids=' +
      project_id
    );
  }

  getCourseTrainerBasedByBatch(batch_code: any, program_id: any){
    return this.http.get<any>(
      this.commonUrl +
      'batch/courses/trainers/batchcode?batchcode=' + batch_code + '&programid=' + program_id
    );
  }

  getBatchBasedRecords(batch_id: any) {
    return this.http.get<any>(
      this.commonUrl + 'batch/getBatch?batchId=' + batch_id
    );
  }
  /* ## Assign Project ## */
}
