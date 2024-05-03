import { Injectable } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
import { User } from './user';
import { environment } from '../environments/environment';

//import { Http,  Response , RequestOptions, Headers, URLSearchParams} from '@angular/core';
import { HttpClient, HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

   private commonUrl: string = environment.BASE_API_URL;
   private keyCloakUrl: string = environment.KEYCLOAK_URL;
   private clientId: string = environment.CLIENT_ID;

  // _url='https://tjm-service.azurewebsites.net/tjm-services/tjm-student/login-access';
  // _urlfoget='https://tjm-service.azurewebsites.net/tjm-services/tjm-student/forgot-password';
  // _urlpassreset='https://tjm-service.azurewebsites.net/tjm-services/tjm-student/reset-password';
  _url = this.commonUrl + 'tjm-student/login-access-keycloak';
  // _keycloakUrl = "http://20.235.89.29:8082/auth/realms/master/protocol/openid-connect/token";
  _keycloakUrl = this.keyCloakUrl;
  _urlfoget = this.commonUrl + 'tjm-student/forgot-password';
  _urlV1foget = this.commonUrl + 'tjm-student/v1/forgot-password';
  _urlpassreset = this.commonUrl + 'tjm-student/reset-password';
  _urlV1passreset = this.commonUrl + 'tjm-student/v1/reset-password';


  constructor(private _http: HttpClient) { }

  login(uname: any, pass: any) {
    let headers = new HttpHeaders();
    let formData: FormData = new FormData();
    formData.append('email', uname);
    formData.append('password', pass);
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(formData)
    return this._http.post<any>(this._url, formData, { headers: headers })
  }

  keycloakLogin(uname: any, pass: any) {
    // let headers = new HttpHeaders();
    // let formData: FormData = new FormData();
    // formData.append('username', uname);
    // formData.append('password', pass);
    // formData.append('grant_type', 'password');
    // formData.append('client_id', 'tjmtestservices');
    // headers.append('Access-Control-Allow-Origin', '*');
    // console.log(formData)
    // return this._http.post<any>(this._keycloakUrl, formData, { headers: headers })


        return fetch(this._keycloakUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'username': uname,
                'password': pass,
                'grant_type': 'password',
                'client_id': this.clientId
            })
        })
        .then((response) => {
            if (!response.ok) {
              return "error";
              // throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.json();
          })
          .then((response) => {
            console.log(response);
            return response;
          });
  }

  forgetpassword(uname: any) {
    let headers = new HttpHeaders();
    let formData: FormData = new FormData();
    formData.append('email', uname);
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(formData)
    return this._http.post<any>(this._urlfoget, formData, { headers: headers })
  }

  forgetVonepassword(uname: any) {
    let headers = new HttpHeaders();
    let formData: FormData = new FormData();
    formData.append('email', uname);
    headers.append('Access-Control-Allow-Origin', '*');
    console.log(formData)
    return this._http.post<any>(this._urlV1foget, formData, { headers: headers })
  }


  getRoleList(){
    return this._http.get<any>(this.commonUrl + 'userRole/list');
  }

   /* Get Role Menus Details */
  getRoleMenus(roleId: any) {
    return this._http.get<any>(this.commonUrl + 'user-management/get-menu-by-roleid/' + roleId)
  }

  getTermUrl(){
    return this._http.get<any>(this.commonUrl + 'terms-conditions/get-gen-terms-condition-by');
  }

  getVOneTermUrl(){
    return this._http.get<any>(this.commonUrl + 'terms-conditions/v1/get-gen-terms-condition-by');
  }

  passreset(pass: any, tokenvalue: any) {
    let headers = new HttpHeaders();
    let formData: FormData = new FormData();

    //let params = new URLSearchParams();
    //params.append('token',tokenvalue);
    //params.append('password',pass);

    //const body = { token: tokenvalue, password:pass};

    formData.append('token', tokenvalue);
    formData.append('password', pass);
    headers.append('Access-Control-Allow-Origin', '*');
    //console.log(this._http.put<any>(this._urlpassreset,params.toString,{headers: headers}))
    /* return this._http.put<any>(this._urlpassreset,formData,{headers: headers}) */
    /* return this._http.put<any>(this._urlpassreset,body,{headers: headers}) */
    return this._http.put<any>(this._urlV1passreset, formData, { headers: headers })
  }

}
