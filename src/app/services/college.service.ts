import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CollegeService {
  constructor(private http: HttpClient) { }

  private commonUrl: string = environment.BASE_API_URL;
  private saUrl: string = environment.BASE_SA_API_URL;

  /* College Details */
  getCollege() {
    return this.http.get<any>(this.commonUrl + 'api/admin-college-details');
  }

  /* De College Details */
  getDeRegisterCollege() {
    return this.http.get<any>(this.commonUrl + 'api/find-all-college-names');
  }

  /* City Details */
  getCity() {
    return this.http.get<any>(this.commonUrl + 'api/get-cities');
  }

  /* State Details */
  getState() {
    return this.http.get<any>(this.commonUrl + 'api/get-states');
  }

  /* Name Details*/
  getName() {
    return this.http.get<any>(this.commonUrl + 'api/admin-college-details');
  }

  /* KAM Name Details */
  getKamName() {
    return this.http.get<any>(this.commonUrl + 'api/get-kam-user-details');
  }

  onBulkUpload(file: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(
      this.commonUrl + 'api/upload-bulk-college-registration',
      formData,
      { headers: headers }
    );
  }

  multiSearchUser(params: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(
      this.commonUrl + 'api/searchCollege',
      params,
      { headers: headers }
    );
  }

  /* TPO Name Details */
  getTpoName() {
    return this.http.get<any>(this.commonUrl + 'api/get-tpo-user-details');
  }

  /* Insert College */
  insertCollegeDetails(response: any) {
    return this.http.post<any>(
      this.commonUrl + 'api/college-registration',
      response
    );
  }

  reDirectSkillsAlpha(params) {
    debugger
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(
      this.saUrl + 'api/userlogin/keycloaklogin',
      params,
      { headers: headers }
    );
  }


  getSkillAlphaUser(params, sessionId) {
    let headers = new HttpHeaders().set(
      "x-auth-token", sessionId
    );
    return this.http.post<any>(
      this.saUrl + 'api/user/getUser',
      params,
      { headers: headers }
    );
  }


  getCheckLatestScreenView(params, sessionId) {
    console.log('session ---------' + sessionId);
    // let headers = new HttpHeaders();
    let headers = new HttpHeaders().set(
      "x-auth-token", sessionId
    );
    // headers.append('Access-Control-Allow-Origin', '*');
    // headers.append('Content-Type', 'application/json');
    // headers.append('x-auth-token', sessionId);
    return this.http.post<any>(
      this.saUrl + 'api/usercontext/getusercontext',
      params,
      { headers: headers }
    );
  }


  getCreateUserContext(params, sessionId) {
    // let headers = new HttpHeaders();
    let headers = new HttpHeaders().set(
      "x-auth-token", sessionId
    );
    return this.http.post<any>(
      this.saUrl + 'api/usercontext/createusercontext',
      params,
      { headers: headers }
    );
  }

  /* Update College Details */
  // updateCollgeDetails(response: any) {
  //   let headers = new HttpHeaders();
  //   headers.append('Access-Control-Allow-Origin', '*');
  //   return this.http.put<any>(
  //     this.commonUrl + 'api/update-college-details',
  //     response,
  //     { headers: headers }
  //   );
  // }
  /* Update College Details */
  updateCollgeDetails(response: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.put<any>(
      this.commonUrl +
      'api/update-college-details-byname/' +
      response.academicInstitutionName,
      response,
      { headers: headers }
    );
  }
  /* Filter City */
  getFilterCity(stateId: any) {
    return this.http.get<any>(
      this.commonUrl + 'api/get-cities-based-on-state/' + stateId
    );
  }

  /* college Details */
  getCollegeDetails() {
    return this.http.get<any>(this.commonUrl + 'api/admin-college-details');
  }

  /* college Details */
  getEditCollegeDetails(collegeId: any) {
    return this.http.get<any>(this.commonUrl + 'api/find-college/' + collegeId);
  }

  /* Delete College */
  deleteCollege(collegeId: any) {
    return this.http.get<any>(
      this.commonUrl + 'api/delete-college/' + collegeId
    );
  }

  /* Change Status */
  changeStatus(params: any) {
    let headers = new HttpHeaders();
    return this.http.post<any>(
      this.commonUrl + 'api/change-college-status',
      params,
      { headers: headers }
    );
  }
  addAssignProject(response: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(
      this.commonUrl + 'api/assign-project',
      response,
      { headers: headers }
    );
  }
}
