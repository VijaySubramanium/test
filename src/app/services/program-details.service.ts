import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProgramDetailsService {
  constructor(private http: HttpClient) { }
  private commonUrl: string = environment.BASE_API_URL;

  /* Get Courses List*/
  getCourseList() {
    return this.http.get<any>(this.commonUrl + 'get-all-Course');
  }

  /* Get Project List*/
  getProjectList() {
    return this.http.get<any>(this.commonUrl + 'project-details/get-projects');
  }
  /* Get Form List*/
  getFormList(form_id: any) {
    return this.http.get<any>(
      this.commonUrl + 'feedback-form/feedbackform-details/' + form_id
    );
  }
  /* Get Program List*/
  getProgramList() {
    return this.http.get<any>(this.commonUrl + 'get-all-programList');
  }

  /* Get Program Details */
  getProgramDetails() {
    return this.http.get<any>(
      this.commonUrl + 'admin-program-details/get-show-details-info'
    );
  }

  /* Add Program */
  addProgram(addprogramDetails: any, files: any) {
    let headers = new HttpHeaders();
    let formData: FormData = new FormData();
    formData.append('programrequest', JSON.stringify(addprogramDetails));
    formData.append('programoutline', files);
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(formData);
    return this.http.post<any>(
      this.commonUrl + 'program/add-program',
      formData,
      { headers: headers }
    );
  }

  /* View Program Details */
  viewProgramDetails(params: any) {
    return this.http.get<any>(
      this.commonUrl +
      'admin-program-details/v1/get-view-details-info?programid=' + params.program_id + '&courseid=' + params.course_id + '&projectid=' + params.project_id
    );
  }
  /* Delete Program */
  deleteProgram(program_id: any) {
    return this.http.get<any>(
      this.commonUrl + 'admin-program-details/delete-program/' + program_id
    );
  }

  /* Change Program Status */
  changeStatus(params: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(
      this.commonUrl + 'program/changeStatus',
      params,
      { headers: headers }
    );
  }

  /* Change Program Status */
  // changeStatus(changeprogramStatus: any) {
  //   let headers = new HttpHeaders();
  //   console.log(changeprogramStatus);
  //   let formData: FormData = new FormData();
  //   formData.append("statusRequest", JSON.stringify(changeprogramStatus));
  //formData.append('vaccinationCertificate', files);
  // formData.append('firstName',fname);
  //   headers.append('Access-Control-Allow-Origin', '*');
  //   console.log(formData)
  //   return this.http.post<any>(this.commonUrl + 'program/changeStatus', changeprogramStatus, { headers: headers })
  // }
  /* Update Program Details */
  updateProgramDetails(params: any, editFiles: any) {
    let headers = new HttpHeaders();
    let formData: FormData = new FormData();
    formData.append('programrequest', JSON.stringify(params));
    formData.append('programoutline', editFiles);
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(formData);
    return this.http.put<any>(
      this.commonUrl + 'program/v1/updateProgramCourse',
      formData,
      { headers: headers }
    );
  }

  onBulkUpload(file: any, userId: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const formData = new FormData();
    formData.append('file', file);
    formData.append('insertedByid', userId);
    return this.http.post<any>(
      this.commonUrl + 'admin-program-details/upload-bulk-programs',
      formData,
      { headers: headers }
    );
  }
  /*Ptoject based list*/
  getProjectBasedRecords(params: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const formData = new FormData();
    formData.append('projectids', JSON.stringify(params));
    return this.http.post<any>(
      this.commonUrl + 'project-details/find-project-details-by-projectids',
      formData,
      { headers: headers }
    );
  }

  multiSearchUser(params: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(
      this.commonUrl + 'program/searchProgram',
      params,
      { headers: headers }
    );
  }
}
