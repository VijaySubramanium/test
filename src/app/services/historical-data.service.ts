import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HistoricalDataService {

  constructor(private http: HttpClient) { }
  private commonUrl: string = environment.BASE_API_URL;

  // Save Files
  saveFiles(params, uploadFiles: any) {
    let headers = new HttpHeaders();
    let formData: FormData = new FormData();
    formData.append('inputjson', JSON.stringify(params));
    if (uploadFiles.length > 0) {
      for (var i = 0; i < uploadFiles.length; i++) {
        formData.append("attachments", uploadFiles[i]);
      }
    } else {
      formData.append("attachments", null);
    }
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(
      this.commonUrl + 'historicaldata/save-files',
      formData,
      { headers: headers }
    );
  }


  /* Get Project based on folder list */
  getProjectViewFolders(projectId) {
    return this.http.get<any>(this.commonUrl + 'historicaldata/getyear/' + projectId);
  }

  /* Get Folder based on Batch List */
  getFolderViewBatches(year, projectId) {
    return this.http.get<any>(this.commonUrl + 'historicaldata/getbatchdetails/' + projectId + '/' + year);
  }


  /* Get Batch based on Student List */
  getBatchViewStudents(viewFile) {
    return this.http.get<any>(this.commonUrl + 'historicaldata/getuserdetails/' + viewFile.form.value.viewprojectname + '/' + viewFile.form.value.viewyear + '/' + viewFile.form.value.viewbatch);
  }

  /* Get Project List*/
  getProjectList() {
    return this.http.get<any>(this.commonUrl + 'project-details/get-projects');
  }


  /* Get Student based on student files */
  getBatchViewStudentFiles(params) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(
      this.commonUrl + 'historicaldata/getstudentdetails/',
      params,
      { headers: headers });

  }



  /* Get Student based on student files */
  getDownloadFiles(params) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(JSON.stringify(params));
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('inputjson', JSON.stringify(params));
    return this.http.get<any>(
      this.commonUrl +
      'historicaldata/v2/document-download-files'
    );

    // return this.http.post<any>(
    //   this.commonUrl + 'historicaldata/document-download-files',
    //   params,
    //   { headers: headers });

  }



}
