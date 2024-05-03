import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentVerificationService {

  constructor(private http: HttpClient) { }

  private commonUrl: string = environment.BASE_API_URL;

  /*Get ATOS Document details*/
  getAtosDocumentDetails(projectid: any) {
    return this.http.get<any>(this.commonUrl + 'document-validator/document-details?projectid=' + projectid);
  }


  /*Get ATOS Document details*/
  getActiveDocumentDetails(projectid: any) {
    return this.http.get<any>(this.commonUrl + 'document-validator/document-details?projectid=' + projectid);
  }


  /*Get INFOSYS Document details*/
  getInfosysDocumentDetails(projectid: any) {
    return this.http.get<any>(this.commonUrl + 'document-validator/document-details?projectid=' + projectid);
  }

   /*Get File Document details*/
   getFileDownload(url: any) {
    return this.http.get<any>(this.commonUrl + 'admin-project-document-field/download-file?documentUrl=' + url);
  }

  /*Get RBL Document details*/
  getRblDocumentDetails(projectid: any) {
    return this.http.get<any>(this.commonUrl + 'document-validator/document-details?projectid=' + projectid);
  }

  /*Get RBL Document details*/
  getviewAtosDocumentDetails(user_id: any) {
    return this.http.get<any>(this.commonUrl + 'document-validator/document-view-details?userid=' + user_id);
  }

  // Upload Files
  saveProjectUploadFiles(params, uploadFiles: any) {
    let headers = new HttpHeaders();
    let formData: FormData = new FormData();
    formData.append('uploadDocumentList', JSON.stringify(params));
    for (var i = 0; i < uploadFiles.length; i++) {
      formData.append("files", uploadFiles[i]);
    }
    // formData.append('files', uploadFiles);
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(formData);
    return this.http.post<any>(
      this.commonUrl + 'admin-project-document-field/save-document-verification-files',
      formData,
      { headers: headers }
    );
  }

}
