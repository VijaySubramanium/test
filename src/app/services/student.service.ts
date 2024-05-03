import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  constructor(private http: HttpClient) { }
  private commonUrl: string = environment.BASE_API_URL;

  /* Get All College */
  getCollege() {
    return this.http.get<any>(this.commonUrl + 'api/find-all-college-names');
  }

  /* Get All College */
  getVoneCollege() {
    return this.http.get<any>(this.commonUrl + 'api/v1/find-all-college-names');
  }

  /* Get All City */
  getCity() {
    return this.http.get<any>(this.commonUrl + 'api/get-cities');
  }

  /* Get All City */
  getVoneCity() {
    return this.http.get<any>(this.commonUrl + 'api/v1/get-cities');
  }

  /* Get Filter City */
  getFilterCity(stateId: any) {
    return this.http.get<any>(
      this.commonUrl + 'api/get-cities-based-on-state/' + stateId
    );
  }


  getVoneFilterCity(stateId: any) {
    return this.http.get<any>(
      this.commonUrl + 'api/v1/get-cities-based-on-state/' + stateId
    );
  }


  /* Get All state */
  getState() {
    return this.http.get<any>(this.commonUrl + 'api/get-states');
  }


  /* Get All state */
  getVoneState() {
    return this.http.get<any>(this.commonUrl + 'api/v1/get-states');
  }

  /* Add Student */
  addStudent(params, files: any) {
    let headers = new HttpHeaders();
    let formData: FormData = new FormData();
    formData.append('studentRequest', JSON.stringify(params));
    formData.append('vaccinationCertificate', files);
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(formData);
    return this.http.post<any>(
      this.commonUrl + 'student/registration',
      formData,
      { headers: headers }
    );
  }

  addVoneStudent(params, files: any) {
    let headers = new HttpHeaders();
    let formData: FormData = new FormData();
    formData.append('studentRequest', JSON.stringify(params));
    formData.append('vaccinationCertificate', files);
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(formData);
    return this.http.post<any>(
      this.commonUrl + 'student/v1/registration',
      formData,
      { headers: headers }
    );
  }

  /* Add ProjectUser */
  addProjectUsers(ProjectUser: any) {
    return this.http.post<any>(
      this.commonUrl + 'projectUserDetails/addProjectUsers',
      ProjectUser
    );
  }

  /* Add additionalFields */
  additionalFields(userId: any): Observable<any> {
    let headers = new HttpHeaders();
    let params = new HttpParams();
    params = params.append('userId', userId);
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(
      this.commonUrl + 'studentProfile/addtionalDetails',
      { params: params }
    );
  }

  /* Get All Organization */
  getOrganizationList() {
    return this.http.get<any>(
      this.commonUrl + 'student/placed-organization-list'
    );
  }

  getVoneOrganizationList() {
    return this.http.get<any>(
      this.commonUrl + 'student/v1/placed-organization-list'
    );
  }

  /* Get All Industry */
  getIndustryList() {
    return this.http.get<any>(this.commonUrl + 'student/industry-list');
  }

  /* Get Sector name */
  getSectorName(org_id) {
    return this.http.get<any>(
      this.commonUrl + 'student/industry-sector?placementemployerid=' + org_id
    );
  }

  getVoneSectorName(org_id) {
    return this.http.get<any>(
      this.commonUrl + 'student/v1/industry-sector?placementemployerid=' + org_id
    );
  }

  /*Get Projectid for generate link */
  genLink() {
    return this.http.get<any>(
      this.commonUrl + 'get-all-project'
    );
  }

  genVoneLink() {
    return this.http.get<any>(
      this.commonUrl + 'v1/get-all-project'
    );
  }

}
