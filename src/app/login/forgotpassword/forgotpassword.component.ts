import { Component, OnInit } from '@angular/core';
import { Passreset } from 'src/app/passreset';
import { LoginService } from 'src/app/login.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  providers: [MessageService],
  styleUrls: ['./forgotpassword.component.css']
})

export class ForgotpasswordComponent implements OnInit {

  passresetModel = new Passreset('', '');
  public pass = this.passresetModel.confirmpassword;

  public token: any;
  public successmsg: boolean = true;
  public failuremsg: boolean = true;
  public successmsgpassreset: string = "";
  public failuremsgpassreset: string = "";

  tokenvalue: any;

  /* Password hide and show */
  show_button: boolean = false;
  show_eye: boolean = false;
  disable = false;
  show_confirmbutton: boolean;
  show_confirmeye: boolean;


  constructor(
    public _loginservice: LoginService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private messageService: MessageService) { }
  ngOnInit(): void {
    $('.spinner').hide();
    this.route.queryParams.subscribe(params => {
      this.tokenvalue = params['token'];
      console.log(this.tokenvalue);
      //this.orderby = params.orderby;
      //console.log(this.orderby); // price
    }
    );


  }


  passwordresetsubmit(resetvalue: boolean) {
    debugger
    if (resetvalue == true) {
      this.disable = true
      console.log(this.passresetModel);
      $('.spinner').show();
      this._loginservice.passreset(this.passresetModel.newpassword, this.tokenvalue)
        .subscribe(
          data => {
            //this.receivedmessage=data.message;
            console.log(data.message);
            $('.spinner').hide();
            if (data.status == 200) {
              this.successmsg = false;
              this.successmsgpassreset = data.message;
              this.failuremsg = true;
              this.messageService.add({ severity: 'success', summary: 'Success', detail: this.successmsgpassreset });
              // this.toastr.success(this.successmsgpassreset)
            }
            else if (data.status == 1005) {
              this.disable = false;
              this.successmsg = true;
              this.failuremsg = false;
              this.failuremsgpassreset = data.message;
              this.messageService.add({ severity: 'error', summary: 'Error', detail: this.failuremsgpassreset });
              // this.toastr.error(this.failuremsgpassreset)
            }
          },
          error => console.error('errorrrrr', error)
        )



    }

  }
  showPassword() {

    this.show_button = !this.show_button;
    this.show_eye = !this.show_eye;
  }
  showConfirmPassword() {

    this.show_confirmbutton = !this.show_confirmbutton;
    this.show_confirmeye = !this.show_confirmeye;
  }


}

