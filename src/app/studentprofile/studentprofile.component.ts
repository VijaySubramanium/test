import {
  Component,
  OnDestroy,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { StudentProfile } from '../view-models/student-profile';
import { MessageService } from 'primeng/api';
import { QuestionService } from '../helper/question.service';
import { QuestionBase } from '../helper/question-base';
import { Observable, Subscription } from 'rxjs';
import { CommonService } from 'src/app/common.service';
import { data } from 'jquery';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginService } from '../login.service';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-studentprofile',
  templateUrl: './studentprofile.component.html',
  styleUrls: ['./studentprofile.component.css'],
  providers: [QuestionService, MessageService],
})
export class StudentprofileComponent implements OnInit, OnDestroy {
  userModel = new StudentProfile();
  disable = false;
  questions$!: QuestionBase<any>[];
  currentProjectId: any;
  currentProjectName: string;
  loading: boolean = false;
  successmsg: boolean = true;
  successMessage: string = '';
  public files: any;
  user: any = '';
  message: string | undefined;
  projectAddtionalFields: any = [];
  rightSideMenus: any = [];
  projectFields: any = {
    projectAddtionalFields: [],
  };
  public terms_and_conditions_url: string;
  public pro_terms_and_conditions_url: string;
  public pro_terms_and_conditions_url_status: string;

  /* Password hide and show */
  show_button: boolean = false;
  show_eye: boolean = false;
  show_confirmbutton: boolean;
  show_confirmeye: boolean;
  additionalScreen: any = [];
  loggedInRoleName: string;
  loggedInRoleId: number;
  projectsData: any = [];
  private subManager$ = new Subscription();
  public uploadOption: boolean = true;
  userAdditionalFields: number;
  @Output() listOfRightMenus = new EventEmitter<string>();

  constructor(
    service: QuestionService,
    private titleService: Title,
    public commonservice: CommonService,
    private messageService: MessageService,
    private router: Router,
    private datePipe: DatePipe,
    public _loginservice: LoginService
  ) {
    this.user = localStorage.getItem('userId');
    this.getUserDetails(JSON.parse(this.user).id);


    /*Profile Name */
    this.loggedInRoleId = JSON.parse(this.user).user_role.role_id;
    let loggedInRoleName = JSON.parse(this.user).user_role.role;
    this.loggedInRoleName = loggedInRoleName
      .replace(/\w+/g, function (txt) {
        return txt.toUpperCase();
      })
      .replace(/\s/g, '_');

    this.additionalScreen = ['STUDENT', 'PROFESSIONAL'];
  }

  ngOnInit(): void {
    this.setTitle('TJM-Profile');
    this.loading = true;
    this.getTermsAndConditionUrl();

    // this.commonservice.additionalFielsTest().then(data=>{
    //   this.questions$=data;
    //   this.loading=false;
    // }).catch(error=>{
    // })
    // .finally(()=>{
    // // this.loading=false;
    // })

    // var dummy:any={"userId":2888,"projectAddtionalFields":[{"projectId":56,"fields":[
    //       {"documentDetailId":865,"docConfigId":0,"documentId":0,"documentFieldName":"How you come to know about GTT?","documentUrl":null,"documentValue":null,"lable":"How you come to know about GTT?","fieldType":"File upload","fieldOrder":1,"comments":null,"verificationStatus":null,"projectId":56,"isMandatory":1,"isActive":1,"recordStatus":1,"insertedBy":2888,"projectname":"Infosys","programname":[],"coursename":null,"batchname":[],"trainername":[],"trainercoordinatorname":[],"dropDownData":[{key:0,value:'Yes'},{key:1,value:'No'}],"errors":null,"validation":null,"projectmanagername":[]},
    //       {"documentDetailId":950,"docConfigId":0,"documentId":0,"documentFieldName":"10th Marksheet","documentUrl":null,"documentValue":null,"lable":"10th Marksheet","fieldType":"File upload","fieldOrder":1,"comments":null,"verificationStatus":null,"projectId":56,"isMandatory":1,"isActive":1,"recordStatus":0,"insertedBy":2888,"projectname":"Infosys","programname":[],"coursename":null,"batchname":[],"trainername":[],"trainercoordinatorname":[],"dropDownData":null,"errors":null,"validation":null,"projectmanagername":[]}
    //     ]},
    //     {"projectId":59,"fields":[
    //       {"documentDetailId":865,"docConfigId":0,"documentId":0,"documentFieldName":"How you come to know about GTT?","documentUrl":null,"documentValue":null,"lable":"How you come to know about GTT?","fieldType":"File upload","fieldOrder":1,"comments":null,"verificationStatus":null,"projectId":56,"isMandatory":1,"isActive":1,"recordStatus":1,"insertedBy":2888,"projectname":"TCS","programname":[],"coursename":null,"batchname":[],"trainername":[],"trainercoordinatorname":[],"dropDownData":[{key:0,value:'Yes'},{key:1,value:'No'}],"errors":null,"validation":null,"projectmanagername":[]},
    //       {"documentDetailId":950,"docConfigId":0,"documentId":0,"documentFieldName":"10th Marksheet","documentUrl":null,"documentValue":null,"lable":"10th Marksheet","fieldType":"File upload","fieldOrder":1,"comments":null,"verificationStatus":null,"projectId":56,"isMandatory":1,"isActive":1,"recordStatus":0,"insertedBy":2888,"projectname":"Infosys","programname":[],"coursename":null,"batchname":[],"trainername":[],"trainercoordinatorname":[],"dropDownData":null,"errors":null,"validation":null,"projectmanagername":[]}
    //     ]}
    //   ],registeration:false,projectID:56};
    //   this.questions$ = dummy;
    //   this.loading = false;
    //   this.projectsData=dummy.projectAddtionalFields;

    this.subManager$.add(
      this.commonservice.additionalFields(JSON.parse(this.user).id).subscribe({
        next: (data) => {
          if(data.data.projectAddtionalFields.length > 0){
            this.currentProjectId = data.data.projectAddtionalFields[0].projectId;
            this.pro_terms_and_conditions_url =  (data.data.projectAddtionalFields[0].terms_url != null) ? data.data.projectAddtionalFields[0].terms_url : null;
            this.pro_terms_and_conditions_url_status = (data.data.projectAddtionalFields[0].terms_url_status != null) ? data.data.projectAddtionalFields[0].terms_url_status : 'no';
          }

          data.data.registeration = false;
          this.questions$ = data.data;
          // this.projectsData = data.data.projectAddtionalFields;
          this.loading = false;
        },
        error: (e) => {},
      })
    );
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  getTermsAndConditionUrl() {
    $('.spinner').show();
    this._loginservice.getTermUrl().subscribe({
      next: (res) => {
        $('.spinner').hide();
        if (res.status.toLowerCase() == "success") {
          this.terms_and_conditions_url = res.data.url_path;
        }
      },
      error: (response) => {
        $('.spinner').hide();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            response.error.message == null
              ? response.error.error
              : response.error.message,
        });
      },
    });
  }


  NextProject(projectid: any) {
    this.loading = true;
    this.questions$ = [];
    this.subManager$.add(
      this.commonservice.additionalFields(JSON.parse(this.user).id).subscribe({
        next: (data) => {
          debugger
          this.currentProjectId = projectid;
          data.data.registeration = false;
          data.data.projectID = projectid;

          this.questions$ = data.data;
          if(this.projectsData.length > 0){
            this.projectsData.forEach((val, indx) => {
              if (val.projectId == this.currentProjectId) {
                this.currentProjectName = this.projectsData[indx].projectname;
              }
            });
          }


          console.log(this.questions$);

          // this.projectsData = data.data.projectAddtionalFields;
          this.loading = false;
        },
        error: (e) => {},
      })
    );
  }

  ngOnDestroy(): void {
    this.subManager$.unsubscribe();
  }

  onListOfRightMenus(eventData: string) {
    let arr = JSON.parse(eventData);
    Object.entries(arr).forEach(([key, value]) =>
      this.rightSideMenus.push(value)
    );
  }

  UploadCerticate(value) {
    debugger;
    this.uploadOption = value;
  }

  myGroup = new FormGroup({
    file: new FormControl(),
  });


  onFileChange(event: any) {
    const file = event.target.files[0];
    this.files = file;
    var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
    let _validFileExtensions = ['jpg', 'jpeg', 'pdf', 'csv', 'xlsx'];
    if (event.target.files.length > 0 && _validFileExtensions.includes(ext)) {
      this.message = '';
      if (this.files.size > 2000000) {
        this.message = 'File size less than 2MB';
      } else {
        this.message = '';
        this.userModel.vaccinationcertificatefilename = file.name;
      }
    } else {
      this.message = 'Invalid file format';
    }
  }

  getUserDetails(userId: any) {
    this.commonservice.getUserDetailById(userId).subscribe({
      next: (response) => {
        debugger
        console.log(response.data.user);
        let userDetails = response.data.user;

        let additionalFields = response.data.projectAddtionalFields;
        this.projectsData = response.data.projectAddtionalFields;

        console.log(this.projectsData);
        this.userAdditionalFields = additionalFields.length;
        $('.spinner').hide();
        if (response.status == 'Success') {
          if (response.data != null) {
            this.userModel = userDetails;
            if(response.data.projectAddtionalFields.length > 0){
              this.currentProjectName = response.data.projectAddtionalFields[0].projectname;
            }

            // console.log(response.data.user.postGraduationPassingYear);
            this.userModel.postgraduationPassingyear =
              response.data.user.postGraduationPassingYear;
            this.userModel.postgraduationInstitution =
              response.data.user.postGraduationInstitution;
            this.userModel.postqraduationQualification =
              response.data.user.postGraduationQualification;
            this.userModel.uploadVaccinationCertificate =
              response.data.user.uploadVaccinationCertificate;
            this.projectAddtionalFields = additionalFields;
            // this.userModel.dob = moment(this.userModel.dob).format('DD-MM-YYYY');
            // this.userModel.confirmPassword = this.userModel.password = '';
            this.userModel.termsAndConditions = '';
          }
        }
      },
      error: (response) => {
        $('.spinner').hide();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: response.message,
        });
      },
    });
  }

  onSubmit(formvalue: boolean) {
    // this.userModel.dob = moment(this.userModel.dob).format('YYYY-MM-DD');
    let dropdownlist = [
      { item_id: 1, item_text: 'English' },
      { item_id: 2, item_text: 'Hindi' },
      { item_id: 3, item_text: 'Marathi' },
      { item_id: 4, item_text: 'Tamil' },
      { item_id: 5, item_text: 'Telugu' },
      { item_id: 6, item_text: 'Kannada' },
      { item_id: 7, item_text: 'Other' },
    ];
    let languageIds = [];
    if (this.userModel.languageKnown != null) {

      var arr1 = this.userModel.languageKnown.split(",").map(function(item) {
        return item.trim();
      });
      // const arr1 = this.userModel.languageKnown.split(',')
      //   .split(',')
      //   .map((element) => +element.trim());

      dropdownlist.forEach((elm, inx) => {
        if (arr1.includes(elm.item_text)) {
          languageIds.push(elm.item_id);
        }
      });
    }
    this.userModel.languageKnown = languageIds.toString();
    let params = {
      user: this.userModel,
      projectAddtionalFields: this.projectAddtionalFields,
    };

    debugger

    console.log(params);

    if (formvalue == true) {
      this.disable = true;
      $('.spinner').show();
      this.commonservice.updateUser(params).subscribe({
        next: (response) => {
          $('.spinner').hide();
          if (response.status == 'Success') {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: response.message,
            });
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 2000);

            // this.successMessage = 'Successfully Password Changed';
            // this.userModel.confirmPassword = this.userModel.password = '';
            // this.userModel.termsAndConditions = '';
          } else {
            this.disable = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.message,
            });
          }
        },
        error: (response) => {
          $('.spinner').hide();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              response.error.message == null
                ? response.error.error
                : response.error.message,
          });
        },
      });
      // this.disable = true;
    }
  }

  profile(formvalue: boolean) {
    if (formvalue == true) {
      //alert("welcome")
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
