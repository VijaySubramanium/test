import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserAdminService {

  constructor(private http: HttpClient) { }
  private commonUrl: string = environment.BASE_API_URL;


  /* User Admin Details */
  getUserAdminDetails(roleIds: any) {
    return this.http.get<any>(this.commonUrl + 'user-management/user-admins?roles=' + roleIds)
  }

  userAdminChangeStatus(params: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(this.commonUrl + 'user-management/change-admin-status', params, { headers: headers })
  }

  addUserAdmin(params: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.post<any>(this.commonUrl + 'user-management/add-admin/', params, { headers: headers });
  }

  updateUserAdminDetails(updateId: any, params: any) {
    let headers = new HttpHeaders();
    headers.append('Access-Control-Allow-Origin', '*');
    return this.http.put<any>(this.commonUrl + 'user-management/update-admin/'+ updateId, params, { headers: headers })
  }

  /* Delete User Admin */
  deleteUserAdmin(deleteUserAdminId: any) {
    return this.http.get<any>(this.commonUrl + 'user-management/delete-admin/' + deleteUserAdminId);
  }


}
