import { Component, OnInit } from '@angular/core';
import { User } from '../user';
import { LoginService } from '../login.service';
import { Router, RouterModule, Routes } from '@angular/router';
import { StudentprofileComponent } from '../studentprofile/studentprofile.component';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
declare var $: any;
//import { data } from 'jquery';
/* import { FormBuilder } from '@angular/forms'; */


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [MessageService],
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {

  public roles: any = [];
  disable = false;
  public loginsection: boolean = false;
  public forgotsection: boolean = true;
  public passwordsection: boolean = true;
  //submitted = false;

  userModel = new User('', '');
  forgotModel = new User('', '');
  public email = this.userModel.email;
  public pass = this.userModel.password;

  //received data --login
  public loginstatus: any;
  public loginmessage: any;
  public successmsg: boolean = true;
  public failuremsg: boolean = true;
  public receivedmessage: string = "";


  /* for forgot password */
  public forgotpasswordstatus: any;
  public successmsgforgot: boolean = true;
  public failuremsgforgot: boolean = true;
  public receivedmessageforgot: string = "";

  /* Password hide and show */
  show_button: boolean = false;
  show_eye: boolean = false;

  public done: boolean = false;
  public menus: any = [];

  isJqueryWorking: any;
  navigateMenu: string;
  constructor(
    public _loginservice: LoginService,
    public _router: Router,
    private toastr: ToastrService,
    private messageService: MessageService
  ) { }
  ngOnInit(): void {
    $('.spinner').hide();
  }


  showPassword() {
    this.show_button = !this.show_button;
    this.show_eye = !this.show_eye;
  }

  forgotpassection() {
    this.loginsection = true;
    this.forgotsection = false;
    this.successmsg = true;
    this.failuremsg = true;
  }

  /* for forgot password */
  forgotsubmit(formemailvalue: boolean) {
    if (formemailvalue == true) {
      this.disable = true;
      //this.successmsgforgot=false;
      $('.spinner').show();
      this._loginservice.forgetVonepassword(this.forgotModel.email)
        .subscribe(
          data => {
            //this.forgotpasswordstatus=data.status;
            //console.log(this.forgotpasswordstatus);
            $('.spinner').hide();
            this.receivedmessageforgot = data.message;
            console.log("to test");
            if (data.status == 200) {
              this.successmsgforgot = false;
              this.failuremsgforgot = true;
              this.messageService.add({ severity: 'success', summary: 'Success', detail: this.receivedmessageforgot });
              // this.toastr.success(this.receivedmessageforgot)
            }
            else if (data.status == 1004) {
              //this.loginstatus=false;
              this.disable = false;
              console.log(data.status);
              this.successmsgforgot = true;
              this.failuremsgforgot = false;
              this.messageService.add({ severity: 'error', summary: 'Error', detail: this.receivedmessageforgot });
              // this.toastr.error(this.receivedmessageforgot)

            }

          },
          error => console.error('errorrrrr', error)
        )

    }

  }

  backtologin() {
    this.forgotsection = true;
    this.loginsection = false;
    this.passwordsection = true;
    this.successmsgforgot = true;
    this.successmsgforgot = true;
    this.failuremsgforgot = true;
  }

  onFocus() {
    this.failuremsg = true;
    this.failuremsgforgot = true;
  }


  getUserRoleMenus(roleId: number, data: any) {
    $('.spinner').show();
    this.menus = [];
    this._loginservice.getRoleMenus(roleId).subscribe({
      next: response => {
        if (response.status == "Success") {
          console.log(response);
          debugger
          if (response.data.length != 0) {
            $('.spinner').hide();
            this.menus = response.data;

            this.navigateMenu = (this.menus[0].menu_url == 'collegeregistration' ? this.menus[1].menu_url : this.menus[0].menu_url);
            localStorage.setItem('roleMenus', JSON.stringify(this.menus));
            this.messageService.add({ severity: 'success', summary: 'Success', detail: data.message });
            localStorage.setItem('userId', JSON.stringify(data.result));
            setTimeout(() => {
              this._router.navigate(['/' + this.navigateMenu]);
            }, 2000);

            this.listOfRoles();

          } else {
            debugger
            $('.spinner').hide();
            this.disable = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "No access" });
          }
        }
      },
      error: response => {
        $('.spinner').hide();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: (response.error.message == null) ? response.error.error : response.error.message });
      }
    });
  }


  listOfRoles() {

    this._loginservice.getRoleList().subscribe({
      next: response => {
        if (response.status == "Success") {
          console.log(response);
          if (response.data != null) {
            let roles = response.data;
            roles.forEach(element => {
              this.roles.push({
                'role_id': element.roleId,
                "role_name": element.role,
              });
            });

            localStorage.setItem('roles', JSON.stringify(this.roles));

          }
        }
      },
      error: response => {
        $('.spinner').hide();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: (response.error.message == null) ? response.error.error : response.error.message });
      }
    });
  }


  /* For Login screen */
  onSubmit(formvalue: boolean) {

    if (formvalue == true) {
      this.disable = true;
      $('.spinner').show();
      try {
        this._loginservice.keycloakLogin(this.userModel.email, this.userModel.password)
        .then(
          (response) => {
            if(response!="error"){
              if (response.access_token) {
                localStorage.setItem('auth_token', response.token_type + ' ' + response.access_token);
                this.onLogin();
              } else {
                $('.spinner').hide();
                this.disable = false;
                this.successmsg = true;
                this.failuremsg = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: response.error_description });
              }
            } else{
              $('.spinner').hide();
              this.disable = false;
              this.successmsg = true;
              this.failuremsg = false;
              this.messageService.add({ severity: 'error', summary: 'Error', detail: "Something went wrong, Try Again." });
            }


          }
          // ,
          // error: response => {
          //   $('.spinner').hide();
          //   this.disable = false;
          //   this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          // }
        )
          .catch(function (error) {                        // catch
            $('.spinner').hide();
            this.disable = false;
            // this.successmsg = true;
            // this.failuremsg = false;
            this.messageService.add({ severity: 'error', summary: 'Error', detail: "Something went wrong, Try Again." });
          });

      } catch (error) {
        $('.spinner').hide();
        // this.disable = false;
        // this.successmsg = true;
        // this.failuremsg = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "Something went wrong, Try Again." });
      }

    }
  }

  onLogin() {
    var token = localStorage.getItem('auth_token');
    console.log(token);
    this._loginservice.login(this.userModel.email, this.userModel.password).subscribe({
      next: response => {
        $('.spinner').hide();
        if (response.status == 200) {
          this.successmsg = false;
          this.failuremsg = true;
          localStorage.setItem('isMigrate', response.result.isMigratetoSA);
          let roleId = response.result.user_role.role_id;
          if (roleId != null) {
            this.getUserRoleMenus(roleId, response);
          }

        } else if (response.status == 1001) {
          this.disable = false;
          this.successmsg = true;
          this.failuremsg = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
        }
        else if (response.status == 1002) {
          this.disable = false;
          this.successmsg = true;
          this.failuremsg = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
        } else {
          this.disable = false;
          this.successmsg = true;
          this.failuremsg = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
        }
      },
      error: response => {
        $('.spinner').hide();
        this.disable = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
      }
    });
  }
/* pwdshow() {
  $("#upassword").attr('type', 'text');
  $('.showspan').removeClass('la-eye-slash');
  $('.showspan').addClass('fa-eye');
}
pwdhide() {
  $("#upassword").attr('type', 'password');
  $('.showspan').removeClass('fa-eye');
  $('.showspan').addClass('la-eye-slash');
}

 */}


/* $("#pwdshow").click(function () {
  alert("Hello! I am an alert box!!");
  $("#upassword").attr('type', 'text');
  $('.showspan').removeClass('la-eye-slash');
  $('.showspan').addClass('fa-eye');
}); */




