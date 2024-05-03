import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  constructor(private http: HttpClient) { }
  private commonUrl: string = environment.BASE_API_URL;

  /*Course List */
  getcoursedetail() {
    return this.http.get<any>(this.commonUrl + 'course/getcoursedetailgrid');
  }
  /*Online Course List */
  getonlinecoursedetail(user_id: any) {
    return this.http.get<any>(
      this.commonUrl + 'course/course-details/' + user_id + '/online'
    );
  }

  /* View Course Details */
  viewCourseDetails(params: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    const formData = new FormData();
    formData.append('coursename', params);
    return this.http.post<any>(
      this.commonUrl + 'course/getcoursedetail',
      formData,
      { headers: headers }
    );
  }




  /*Self Course List */
  getselfcoursedetail(user_id: any) {
    return this.http.get<any>(
      this.commonUrl + 'course/course-details/' + user_id + '/self_paced'
    );
  }
  /*Classroom Course List */
  getclassroomcoursedetail(user_id: any) {
    return this.http.get<any>(
      this.commonUrl + 'course/course-details/' + user_id + '/classroom'
    );
  }

  /*Learning Resource List */
  getLearningResourcesByCourseId(params: any) {
    return this.http.get<any>(
      this.commonUrl +
      'learning-resources/get-learning-resources-info?courseid=' +
      params.course_id +
      '&userid=' +
      params.user_id +
      '&batchid=' +
      params.batch_id
    );
  }

  /*Learning Resource Path */
  getLearningResourcePathByCourseIdAndLrID(params: any) {
    return this.http.get<any>(
      this.commonUrl +
      'learning-resources/get-learning-resources-path?lrId=' +
      params.lr_id +
      '&courseId=' +
      params.course_id
    );
  }

  download(url: string): Observable<Blob> {
    return this.http.get(url, {
      responseType: 'blob'
    })
  }

  /*Course Duration */
  getCourseDuration(lrDetail: any) {
    const formData = new FormData();
    formData.append('lrDetails', JSON.stringify(lrDetail));
    return this.http.post<any>(
      this.commonUrl + 'course/coursedurationupdate',
      formData
    );
  }

  multiSearchUser(params: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(
      this.commonUrl + 'course/searchCourse',
      params,
      { headers: headers }
    );
  }

}
