import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  private commonUrl: string = environment.BASE_API_URL;

  /* Get regestration data*/
  getregesterProjectData(params: any) {
    return this.http.post<any>(
      this.commonUrl + 'user-management/v1/get-date-month-year-wise-registration-record',
      params
    );
  }

  getregesterData(params: any) {
    return this.http.post<any>(
      this.commonUrl + 'user-management/get-date-month-year-wise-registration-record',
      params
    );
  }

  /* Get batch conduct data*/
  getBatchProjectData(params: any) {
    return this.http.post<any>(
      this.commonUrl + 'batch/v1/get-batch-registration-record',
      params
    );
  }


  getBatchWithOutProjectData(params: any) {
    return this.http.post<any>(
      this.commonUrl + 'batch/get-batch-registration-record',
      params
    );
  }

  /* Get Project List*/
  getProjectList() {
    return this.http.get<any>(this.commonUrl + 'project-details/get-projects');
  }


  /* Get Trainer List By Project Id*/
  getTrainerListByProjectId(project_id: any) {
    return this.http.get<any>(
      this.commonUrl + 'project-details/get-trainer-based-on-project/' + project_id
    );
  }

  /* Post Trainers List By Project Ids*/
  getTrainerListByProjectIds(params: any) {
    return this.http.post<any>(
      this.commonUrl + 'project-details/get-trainer-based-on-project',
      params
    );
  }

  /* Get Trainer List By Project Id*/
  getBatchListByProjTrainer(params: any) {
    return this.http.get<any>(
      this.commonUrl + 'project-details/get-batches-based-on-project-and-trainer/' + params.project_id +
      '/' + params.trainer_id
    );
  }

  /* Post Batch List By Project Ids, Trainer Ids*/
  getBatchListByProjTrainers(params: any) {
    return this.http.post<any>(
      this.commonUrl + 'project-details/get-batches-based-on-project-and-trainer',
      params
    );
  }

  /* Get fb score data*/
  getFbData(params: any) {
    return this.http.post<any>(
      this.commonUrl + 'project-details/get-Filter-data',
      params
    );
  }

  /* Get fb score data*/
  getFbYearData(params: any) {
    return this.http.post<any>(
      this.commonUrl + 'project-details/v1/get-yearBased-Filter-data',
      params
    );
  }
}
