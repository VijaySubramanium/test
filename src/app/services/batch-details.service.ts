import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BatchDetailsService {
  constructor(private http: HttpClient) {}
  private commonUrl: string = environment.BASE_API_URL;

/* User Details */
getBatchDetails() {
  return this.http.get<any>(
    this.commonUrl +
    //http://localhost:8082/tjm-services/batch/getAllBatchs?offset=0&pageSize=10
    'batch/getAllBatchs'
  );
}

  /* Batch Lists */
  getBatchList() {
    return this.http.get<any>(this.commonUrl + 'batch/getAllBatchs');
  }


  /* Course Type Lists */
  getCourseTypes() {
    return this.http.get<any>(
      this.commonUrl +
        'batch/coursetype'
    );
  }

  multiSearchUser(params: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(
      this.commonUrl + 'batch/searchBatch',
      params,
      { headers: headers }
    );
  }

  /* Trainer Lists */
  getTrainerLists(role_id: any) {
    return this.http.get<any>(
      this.commonUrl +
        'user-management/get-trainer-or-training-coordinator/' +
        role_id
    );
  }

  /* Project Lists */
  getProgramsList(project_id: any) {
    return this.http.get<any>(
      this.commonUrl + 'user-management/get-program-by-projectid/' + project_id
    );
  }

  getProjectBasedByProgram(program_id: any) {
    return this.http.get<any>(
      this.commonUrl +
        'batch/course/project?programid='+ program_id +'&courseid=&projectid='
    );
  }

  getProjectBasedByCourse(program_id: any, course_id: any) {
    return this.http.get<any>(
      this.commonUrl +
        'batch/course/project?programid='+program_id+'&courseid='+course_id+'&projectid='
    );
  }


  getBatchByProjectId(project_id: any) {
    return this.http.get<any>(
      this.commonUrl + 'user-management/get-batch-by-projectid/' + project_id
    );
  }
  getUserByBatchId(batch_id: any) {
    return this.http.get<any>(
      this.commonUrl + 'user-management/get-user/' + batch_id
    );
  }

  // getAPIProjectManagerListBasedProject(project_id: any){
  //    return this.http.get<any>(this.commonUrl + 'user-management/get-project-manager-by-projectid/'+ project_id);
  // }

  getAPIProjectManagerListBasedProject(params: any) {
    // let headers = new HttpHeaders();
    // headers.append('Access-Control-Allow-Origin', '*');
    // const formData = new FormData();
    // formData.append('projectids', JSON.stringify(params));
    // return this.http.post<any>(
    //   this.commonUrl + 'project-details/find-project-details-by-projectids',
    //   formData,
    //   { headers: headers }
    // );
    http://localhost:80/tjm-services/batch/view/programoutlie?programid=51&projectid=287&courseid=36
    return this.http.get<any>(this.commonUrl + 'batch/view/programoutlie?programid='+ params.program_id + '&projectid=' + params.project_id + '&courseid=' + params.course_id);
  }

  onBulkUpload(file: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const formData = new FormData();
    formData.append('bulkBatchFile', file);
    return this.http.post<any>(
      this.commonUrl + 'batch/uploadBulkBatch',
      formData,
      { headers: headers }
    );
  }

  // getBatchList(batchIds: any) {
  //   return this.http.get<any>(this.commonUrl + 'batch/getBatch?batchId='+ batchIds);
  // }

  /* Program Lists */
  getProgramLists() {
    return this.http.get<any>(this.commonUrl + 'get-all-programList');
  }

  /* Program Lists */
  getProgramBasedRecords(program_id: any) {
    return this.http.get<any>(
      this.commonUrl +
        'admin-program-details/get-program-by-programid/' +
        program_id
    );
  }

  /* Filter Course */
  getFilterCourse(programId: any) {
    return this.http.get<any>(
      this.commonUrl + 'admin-program-details/get-course-details/' + programId
    );
  }

  addBatch(params: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(this.commonUrl + 'batch/addBatch/', params, {
      headers: headers,
    });
  }

  updateBatchDetails(updateId: any, params: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.put<any>(
      this.commonUrl + 'batch/update-batch/' + updateId,
      params,
      { headers: headers }
    );
  }

  batchChangeStatus(params: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.put<any>(this.commonUrl + 'batch/batchStatus', params, {
      headers: headers,
    });
  }

  getViewBatchList(batch_id:any) {
    return this.http.get<any>(this.commonUrl + 'batch/v1/getBatch?batchId=' + batch_id);
  }
}
