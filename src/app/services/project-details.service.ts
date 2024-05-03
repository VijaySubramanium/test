import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProjectDetailsService {
  constructor(private http: HttpClient) {}
  private commonUrl: string = environment.BASE_API_URL;

  /* Project Details */
  getProjectDetails() {
    return this.http.get<any>(
      this.commonUrl + 'project-details/get-project-details-info'
    );
  }

  /* Project Details */
  getVoneProjectDetails() {
    return this.http.get<any>(
      this.commonUrl + 'project-details/v1/get-project-details-info'
    );
  }

  getProjectAdditionalFields(params: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(
      this.commonUrl + 'admin-project-document-field/projects-based-document-view',
      params,
      { headers: headers }
    );
  }


  fieldStatusChange(params: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(this.commonUrl + 'admin-project-document-field/status-update-documentdetails', params, {
      headers: headers,
    });
  }

  multiSearchUser(params: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(
      this.commonUrl + 'project-details/searchProject',
      params,
      { headers: headers }
    );
  }



  /* Delete Project */
  deleteProject(project_id: any) {
    return this.http.get<any>(
      this.commonUrl + 'project-details/delete-project/' + project_id
    );
  }
  /* Change Project Status */
  changeStatus(changeprojectStatus: any) {
    let headers = new HttpHeaders();
    console.log(changeprojectStatus);
    let formData: FormData = new FormData();
    formData.append('statusRequest', JSON.stringify(changeprojectStatus));
    //formData.append('vaccinationCertificate', files);
    // formData.append('firstName',fname);
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(formData);
    return this.http.post<any>(
      this.commonUrl + 'project-details/change-project-status',
      changeprojectStatus,
      { headers: headers }
    );
  }
  /* Add Project */
  addProject(params, files: any) {
    let headers = new HttpHeaders();
    let formData: FormData = new FormData();
    formData.append('projectRequest', JSON.stringify(params));
    formData.append('termsandcondition', files);
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(formData);
    return this.http.post<any>(
      this.commonUrl + 'project-details/add-project-details',
      formData,
      { headers: headers }
    );
  }
  // addProject(addprojectDetails: any) {
  //   return this.http.post<any>(
  //     this.commonUrl + 'project-details/add-project-details',
  //     addprojectDetails
  //   );
  // }

  /* Update Project */
  updateProjectDetails(params, files: any) {
    let headers = new HttpHeaders();
    let formData: FormData = new FormData();
    formData.append('projectRequest', JSON.stringify(params));
    formData.append('termsandcondition', files);
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(formData);
    return this.http.put<any>(
      this.commonUrl + 'project-details/update-project-details',
      formData,
      { headers: headers }
    );
  }

  // updateProjectDetails(response: any) {
  //   let headers = new HttpHeaders();
  //   headers.append('Access-Control-Allow-Origin', '*');
  //   return this.http.put<any>(
  //     this.commonUrl + 'project-details/update-project-details',
  //     response,
  //     { headers: headers }
  //   );
  // }
  /* Edit Project */
  getEditProjectDetails(project_id: any) {
    return this.http.get<any>(
      this.commonUrl +
        'project-details/find-project-details-by-projectid?projectids=' +
        project_id
    );
  }
  onBulkUpload(file: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(
      this.commonUrl + 'project-details/upload-bulk-projects',
      formData,
      { headers: headers }
    );
  }
  /* view Project */
  getViewProjectDetails(project_id: any) {
    return this.http.get<any>(
      this.commonUrl + 'project-details/project-view-details-by-projectid?projectid=' + project_id );
  }
  /* Generate link */
  generateLink(project_link: any) {
    return this.http.post<any>(
      this.commonUrl + 'user-management/generateLink',
      project_link
    );
  }
  /* Project manager list*/
  getProjectMangaerList() {
    return this.http.get<any>(this.commonUrl + 'get-all-projectManagerList');
  }
  /* Add Project fields */
  addProjectFields(addprojectDetails: any) {
    return this.http.post<any>(
      this.commonUrl + 'admin-project-document-field/save-project-document-field',
      addprojectDetails
    );
  }
  /*Get Project fields */
  getProjectFields(projectId: any) {
    return this.http.get<any>(
      this.commonUrl +
        'admin-project-document-field/project-based-document-view?projectid=' +
        projectId
    );
  }
  /* Delete Project fields */
  deleteProjectFields(documentDetailId: any) {
    return this.http.get<any>(
      this.commonUrl +
        'admin-project-document-field/delete-documentdetails?documentdetailid=' +
        documentDetailId
    );
  }
  /*Get Project fields */
  getProjectFieldList(projectId: any) {
    return this.http.get<any>(
      this.commonUrl +
        'admin-project-document-field/project-based-document-view?projectid=' +
        projectId
    );
  }
}
