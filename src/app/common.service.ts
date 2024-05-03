import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { College } from './view-models/collegereg';
import { StudentProfile } from './view-models/student-profile';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(private http: HttpClient) {}

  // private commonUrl = 'https://tjm-service.azurewebsites.net/tjm-services/';
  private commonUrl: string = environment.BASE_API_URL;

  college(userModel: College) {
    let headers = new HttpHeaders();
    console.log(userModel);
    let formData: FormData = new FormData();
    formData.append('InputRequest', JSON.stringify(userModel));
    // formData.append('firstName',fname);
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(formData);
    return this.http.post<any>(
      this.commonUrl + 'api/collegeregistration',
      userModel,
      { headers: headers }
    );
  }

  student(params, files: any) {
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

  bulkTemplateFileUpload(bulkUploadFile: File) {
    var myFormData = new FormData();
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    myFormData.append('file', bulkUploadFile);
    return this.http.post('../assets/template/', myFormData, {
      headers: headers,
    });
  }

  professional(params, files: any) {
    let headers = new HttpHeaders();
    console.log(params);
    let formData: FormData = new FormData();
    formData.append('professionalRequest', JSON.stringify(params));
    formData.append('vaccinationCertificate', files);
    // formData.append('firstName',fname);
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(formData);
    return this.http.post<any>(
      this.commonUrl + 'professional/registration',
      formData,
      { headers: headers }
    );
  }

  //  studentProfile(userModel: StudentProfile){
  //   let headers = new HttpHeaders ();
  //   console.log(userModel);
  //   //let formData: FormData = new FormData();
  //    //formData.append("",JSON.stringify(userModel));
  //   // formData.append('firstName',fname);
  //   let queryParams = new HttpParams();
  //   queryParams = queryParams.append("id",1);
  //   headers.append('Access-Control-Allow-Origin', '*');
  //   //console.log(formData)
  //   return this.http.get<any>(this.commonUrl + 'student/getStudentDetails?id=1',{params:queryParams})

  //    }

  changeStatus(userModel: any) {
    let headers = new HttpHeaders();
    console.log(userModel);
    let formData: FormData = new FormData();
    formData.append('statusRequest', JSON.stringify(userModel));
    //formData.append('vaccinationCertificate', files);
    // formData.append('firstName',fname);
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(formData);
    return this.http.post<any>(
      this.commonUrl + 'userManagement/changeStatus',
      userModel,
      { headers: headers }
    );
  }

  resetPassword(passwordReset: any) {
    let headers = new HttpHeaders();
    console.log(passwordReset);
    let formData: FormData = new FormData();
    formData.append('passwordRequest', JSON.stringify(passwordReset));
    //formData.append('vaccinationCertificate', files);
    // formData.append('firstName',fname);
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(formData);
    return this.http.post<any>(
      this.commonUrl + 'user-management/v1/students/resetpassword',
      passwordReset,
      { headers: headers }
    );
  }


  getCollege() {
    return this.http.get<any>(this.commonUrl + 'api/find-all-college-names');
  }

  /* Get User Details */
  getUserDetails(userId: any) {
    return this.http.get<any>(
      this.commonUrl + 'student/getStudentDetails?id=' + userId
    );
  }

  /* Get User Details By Id */
  getUserDetailById(userId: any) {
    return this.http.get<any>(
      this.commonUrl + 'user-management/getUser?userId=' + userId
    );
  }

  getCity() {
    // const citySorted = response.data.sort((a: any, b: any) => a.cityname > b.cityname ? 1 : -1);
    return this.http.get<any>(this.commonUrl + 'api/get-cities');
  }

  getState() {
    return this.http.get<any>(this.commonUrl + 'api/get-states');
  }

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
  // additionalFielsTest():Promise<any>{
  //   return new Promise((resolve, reject) =>{
  //     let headers = new HttpHeaders ();
  //   let params = new HttpParams();
  //   params = params.append('userId', 1);
  //   headers.append('Access-Control-Allow-Origin', '*');
  //   this.http.get<any>(this.commonUrl + 'studentProfile/addtionalDetails',{params: params}).subscribe({next:data=>{
  //     if(data.code==200){
  //       resolve(data.data.projectAddtionalFields[0].fields)
  //     }
  //   },error:error => {
  //     if (error.status == 401) {
  //     reject(error);
  //     }
  //   }});
  //   })
  // }
  // additionalFieldsSaveTest():Promise<any>{
  //   return new Promise((resolve,reject)=>{
  //     let headers = new HttpHeaders ();
  //   let params = new HttpParams();
  //   params = params.append('userId', 1);
  //   headers.append('Access-Control-Allow-Origin', '*');
  //   this.http.get<any>(this.commonUrl + 'studentProfile/addtionalDetails',{params: params}).subscribe({next:data=>{
  //     if(data.code==200){
  //       resolve(data);
  //     }
  //   },error:error=>{
  //     if(error.status==401){
  //       reject(error);
  //     }
  //   }});
  //   })

  // }
  additionalFieldsSave(body: any, fileUploadDocuments: any): Observable<any> {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const formData = new FormData();
    formData.append('studentProfileRequest', JSON.stringify(body));
    formData.append('uploadFile', fileUploadDocuments);
    return this.http.post<any>(
      this.commonUrl + 'studentProfile/saveAddtionalDetails',
      formData,
      { headers: headers }
    );
  }

  studentProfile(UserId: any) {
    let headers = new HttpHeaders();
    let params = new HttpParams();
    params = params.append('id', UserId);
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.get<any>(this.commonUrl + 'student/getStudentDetails', {
      params: params,
    });
  }
  changePassword(studentDetails: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(
      this.commonUrl + 'student/update',
      studentDetails,
      { headers: headers }
    );
  }
  updateUser(params) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(
      this.commonUrl + 'user-management/updateUser',
      params,
      { headers: headers }
    );
  }
  addProjectUsers(ProjectUser: any) {
    return this.http.post<any>(
      this.commonUrl + 'projectUserDetails/addProjectUsers',
      ProjectUser
    );
  }
}
