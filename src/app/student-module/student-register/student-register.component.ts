import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { StudentModel } from '../../view-models/student-model';
import { StudentService } from '../../services/student.service';
import { ProjectDetailsService } from 'src/app/services/project-details.service';
import { FormControl, FormGroup } from '@angular/forms';
import { QuestionService } from '../../helper/question.service';
import { QuestionBase } from '../../helper/question-base';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';
import { LoginService } from '../../login.service';


@Component({
  selector: 'app-student-register',
  templateUrl: './student-register.component.html',
  styleUrls: ['./student-register.component.css'],
  providers: [QuestionService, MessageService],
})
export class StudentRegisterComponent implements OnInit {
  public stustatus: any;
  public loginmessage: any;
  public successmsg: boolean = true;
  public receivedmessage: string = '';
  loading: boolean = false;
  NextEnabled: boolean = false;
  show_button: boolean = false;
  show_eye: boolean = false;
  public files: any;
  public listOfErrors: any = [];
  questions$!: QuestionBase<any>[];
  projectId: any;
  projectName: any;
  filterCityNameList: any = [];
  private subManager$ = new Subscription();
  userModel = new StudentModel();
  collegeNameList: any = [];
  stateNameList: any;
  cityNameList: any;
  organizationNameList: any;
  industryNameList: any;
  collegeCityNameList: any;
  file: any;
  dateTime = new Date();
  maxDate!: string;
  message: string | undefined;
  currentYear: number;
  disable = false;
  show_confirmbutton: boolean;
  show_confirmeye: boolean;
  yearRange: string;
  assignProject: boolean;
  currentProjectId: any;
  projectDetails: any = [];
  sector_id: number;
  user: any = '';
  loggedInRoleId: number;
  roles: any = [];
  currentLoginUserId: number;
  terms_and_conditions_url: any;
  pro_terms_and_conditions_url: any;
  placedOrgDisplay: boolean = false;

  constructor(
    public studentService: StudentService,
    private titleService: Title,
    private routers: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    public projectService: ProjectDetailsService,
    private activatedRoute: ActivatedRoute,
    public _loginservice: LoginService
  ) {
    //this.file=this.formvalue.controls['file'].disable()
    this.dateTime.setDate(this.dateTime.getDate());
    this.currentYear = new Date().getFullYear();
    this.yearRange =
      new Date().getFullYear() - 5 + ':' + (new Date().getFullYear() + 30);
    this.collegeList();
    this.stateList();
    this.cityList();
    //this.FilterCity()

    this.generateLink();
    this.getTermsAndConditionUrl();

    this.routers.queryParams.subscribe((res) => {
      let queryString = res;
      if (queryString['studentProjectAssignId']) {
        this.projectId = queryString['studentProjectAssignId'];
        this.assignProject = true;
      } else {
        this.assignProject = false;
      }
    });


    this.activatedRoute.queryParams.subscribe(params => {
      this.currentLoginUserId = params['userId'];
    });


    // this.user = localStorage.getItem('userId');
    // this.roles = JSON.parse(localStorage.getItem('roles'));
    // this.loggedInRoleId = JSON.parse(this.user).user_role.role_id;
    // let loggedInRoleName = JSON.parse(this.user).user_role.role;


    // console.log(this.user);
    // console.log(this.loggedInRoleId);
    // console.log(this.currentLoginUserId);

  }
  ngOnInit(): void {
    this.setTitle('TJM-Student');
    this.loading = true;
    $('.spinner').hide();
    this.getProjectList();

    //   var dummy:any={"userId":2888,"projectAddtionalFields":[{"projectId":56,"fields":[
    //     {"documentDetailId":865,"docConfigId":0,"documentId":0,"documentFieldName":"How you come to know about GTT?","documentUrl":null,"documentValue":null,"lable":"How you come to know about GTT?","fieldType":"File upload","fieldOrder":1,"comments":null,"verificationStatus":null,"projectId":56,"isMandatory":1,"isActive":1,"recordStatus":1,"insertedBy":2888,"projectname":"Infosys","programname":[],"coursename":null,"batchname":[],"trainername":[],"trainercoordinatorname":[],"dropDownData":[{key:0,value:'Yes'},{key:1,value:'No'}],"errors":null,"validation":null,"projectmanagername":[]},
    //     {"documentDetailId":950,"docConfigId":0,"documentId":0,"documentFieldName":"10th Marksheet","documentUrl":null,"documentValue":null,"lable":"10th Marksheet","fieldType":"File upload","fieldOrder":1,"comments":null,"verificationStatus":null,"projectId":56,"isMandatory":1,"isActive":1,"recordStatus":0,"insertedBy":2888,"projectname":"Infosys","programname":[],"coursename":null,"batchname":[],"trainername":[],"trainercoordinatorname":[],"dropDownData":null,"errors":null,"validation":null,"projectmanagername":[]},
    //     {"documentDetailId":950,"docConfigId":0,"documentId":0,"documentFieldName":"10th Marksheet","documentUrl":null,"documentValue":null,"lable":"10th Marksheet","fieldType":"File upload","fieldOrder":1,"comments":null,"verificationStatus":null,"projectId":56,"isMandatory":1,"isActive":1,"recordStatus":0,"insertedBy":2888,"projectname":"Infosys","programname":[],"coursename":null,"batchname":[],"trainername":[],"trainercoordinatorname":[],"dropDownData":null,"errors":null,"validation":null,"projectmanagername":[]}
    //   ]},
    //   {"projectId":59,"fields":[
    //     {"documentDetailId":865,"docConfigId":0,"documentId":0,"documentFieldName":"How you come to know about GTT?","documentUrl":null,"documentValue":null,"lable":"How you come to know about GTT?","fieldType":"File upload","fieldOrder":1,"comments":null,"verificationStatus":null,"projectId":56,"isMandatory":1,"isActive":1,"recordStatus":1,"insertedBy":2888,"projectname":"TCS","programname":[],"coursename":null,"batchname":[],"trainername":[],"trainercoordinatorname":[],"dropDownData":[{key:0,value:'Yes'},{key:1,value:'No'}],"errors":null,"validation":null,"projectmanagername":[]},
    //     {"documentDetailId":950,"docConfigId":0,"documentId":0,"documentFieldName":"10th Marksheet","documentUrl":null,"documentValue":null,"lable":"10th Marksheet","fieldType":"File upload","fieldOrder":1,"comments":null,"verificationStatus":null,"projectId":56,"isMandatory":1,"isActive":1,"recordStatus":0,"insertedBy":2888,"projectname":"Infosys","programname":[],"coursename":null,"batchname":[],"trainername":[],"trainercoordinatorname":[],"dropDownData":null,"errors":null,"validation":null,"projectmanagername":[]}
    //   ]}
    // ],registeration:true,projectID:56};
    // this.questions$ = dummy;
    // this.loading = false;
    // this.NextEnabled = true;
  }
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }



  /*Get project details*/
  getProjectList() {
    $('.spinner').show();
    this.projectService.getVoneProjectDetails().subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.status == 'Success') {
          this.projectDetails = [];
          response.data.forEach((elem: any, index: any) => {
            if (elem.project_id == this.projectId) {
              this.projectName = elem.project_name;
            }

            this.projectDetails.push({
              project_id: elem.project_id,
              project_name: elem.project_name,
              start_date: moment(elem.start_date).format('YYYY-MM-DD'),
              end_date: moment(elem.end_date).format('YYYY-MM-DD'),
              status: elem.status,
              project_manager_name: elem.project_manager_name,
              project_manager_id: elem.project_manager_id,
              overall_status: elem.overall_status,
              generate_link: elem.generate_link,
            });
          });

          let projectInx = this.projectDetails.findIndex((x: any) => {
            return x.project_id == this.projectId;
          });

          if (projectInx != -1) {
            let text = this.projectDetails[projectInx].project_name;
            let position = text.search('Barclays');
            if (position != -1) {
              this.userModel.vaccinationStatus = 'Yes';
            }
          }
        }
      },
      error: (response) => {
        $('.spinner').hide();
        // this.messageService.add({ severity: 'error', summary: 'Error', detail: (response.error.message == null) ? response.error.error : response.error.message });
      },
    });
  }

  onFileChange(event: any) {
    this.disable = false;
    const file = event.target.files[0];

    this.files = file;
    var ext = file.name.substr(file.name.lastIndexOf('.') + 1);

    let _validFileExtensions = ['jpg', 'jpeg', 'pdf', 'csv', 'xlsx'];
    if (event.target.files.length > 0 && _validFileExtensions.includes(ext)) {
      this.message = '';
      if (this.files.size > 2000000) {
        this.message = 'File size less than 2MB';
        this.disable = true;
      } else {
        this.message = '';
        this.userModel.uploadVaccinationCertificate = file.name;
      }
    } else {
      this.message = 'Invalid file format';
      this.disable = true;
    }
  }

  myGroup = new FormGroup({
    file: new FormControl(),
  });

  Next(formvalue: any) {
    this.NextEnabled = true;
  }


  sentenceCase(input, lowercaseBefore) {
    input = (input === undefined || input === null) ? '' : input;
    if (lowercaseBefore) { input = input.toLowerCase(); }
    return input.toString().replace(/(^|\. *)([a-z])/g, function (match, separator, char) {
      return separator + char.toUpperCase();
    });
  }

  dotAfterCaptilize(input, id) {

    if (input && input.length >= 1) {
      var firstChar = input.charAt(0);
      var remainingStr = input.slice(1);
      input = firstChar.toUpperCase() + remainingStr;
    }

    var name = input;
    name = name.replace(/\b[a-z]/g, function (letter) {
      return letter.toUpperCase();
    });

    $('#' + id).val(name);
  }

  // /* Display college name list*/
  // collegeList() {
  //   this.collegeService.getCollegeDetails().subscribe((data) => {
  //     if (data.data != null) {
  //       const academicSorted = data.data.sort((a: any, b: any) =>
  //         a.academic_institution_name > b.academic_institution_name ? 1 : -1
  //       );

  //       this.collegeNameList = academicSorted;

  //     }
  //   });
  // }

  /* Display college list*/
  collegeList() {
    this.studentService.getVoneCollege().subscribe((response) => {
      response.data.forEach((elem: any, index: any) => {
        // if (elem.status == 'Active') {
        this.collegeNameList.push({
          academic_institution_id: elem.academicInstitutionId,
          academic_institution_name: elem.academicInstitutionName,
        });
        // }
      });

      const academicSorted = this.collegeNameList.sort((a: any, b: any) =>
        a.academic_institution_name > b.academic_institution_name ? 1 : -1
      );
      this.collegeNameList = academicSorted;
    });
  }

  placeOrg(value: any) {
    if (value == 'Yes') {
      this.getOrganizationList();
    } else {
      this.organizationNameList = [];
    }

    this.userModel.designation = '';
    this.userModel.placedOrganization = '';
    this.userModel.joiningMonth = '';
  }

  isGraduated(value) {
    this.userModel.educationalQualification = '';
    this.userModel.subject = '';
    this.userModel.profession = '';
    this.userModel.collegeName = '';
    this.userModel.graduationPassingYear = '';
    this.userModel.collegeCity = '';
  }

  /* Display state name list*/
  stateList() {
    this.studentService.getVoneState().subscribe((response: any) => {
      if (response.data != null) {
        const stateSorted = response.data.sort((a: any, b: any) =>
          a.state > b.state ? 1 : -1
        );
        this.stateNameList = stateSorted;
      }
    });
  }

  /* Display city name list*/
  cityList() {
    this.studentService.getVoneCity().subscribe((response) => {
      if (response.data != null) {
        const citySorted = response.data.sort((a: any, b: any) =>
          a.cityname > b.cityname ? 1 : -1
        );
        this.cityNameList = citySorted;
      }
    });
  }

  /* Filter city list*/
  FilterCity(value: any) {
    let stateNameList = value.split('_', 2);
    this.studentService
      .getVoneFilterCity(stateNameList[0])
      .subscribe((response: any) => {
        if (response.data != null) {
          const citySorted = response.data.sort((a: any, b: any) =>
            a.cityname > b.cityname ? 1 : -1
          );
          this.filterCityNameList = citySorted;
          this.userModel.currentLocation = '';
        }
      });
  }

  /* Display Organization name list*/
  getOrganizationList() {
    $('.spinner').show();
    this.studentService.getVoneOrganizationList().subscribe((response) => {
      $('.spinner').hide();
      if (response.data != null) {
        const orgSorted = response.data.sort((a: any, b: any) =>
          a.placement_employer_name > b.placement_employer_name ? 1 : -1
        );
        this.organizationNameList = orgSorted;
        $('#addNameOfPlacedOrg').append('<option value="">  Select Placed Organgiation </option>');
        this.organizationNameList.forEach((el, ix) => {
          let key = el.placementemployer_id + '_' + el.placement_employer_name;
          $('#addNameOfPlacedOrg').append('<option value="' + key + '">' + el.placement_employer_name + '</option>');
        });

      }
    });
  }

  /* Display Sector name list*/
  getSectorName(orgDetail: any) {
    $('.spinner').show();
    let org = orgDetail.split('_', 2);
    let org_id = org[0];
    this.studentService.getVoneSectorName(org_id).subscribe((response) => {
      $('.spinner').hide();
      if (response.data != null) {
        this.userModel.sector = response.data.industry;
        this.sector_id = response.data.industry_id;
      }
    });
  }

  /* Display Industry name list*/
  getIndustryList() {
    this.studentService.getIndustryList().subscribe((response) => {
      if (response.data != null) {
        const industrySorted = response.data.sort((a: any, b: any) =>
          a.industry > b.industry ? 1 : -1
        );
        this.industryNameList = industrySorted;
      }
    });
  }

  showPassword() {
    this.show_button = !this.show_button;
    this.show_eye = !this.show_eye;
  }

  showConfirmPassword() {
    this.show_confirmbutton = !this.show_confirmbutton;
    this.show_confirmeye = !this.show_confirmeye;
  }

  /* get College Details */
  getCollegeCity($event: any) {
    let collegeName = $event.value.academic_institution_name;
    let collegeInfo = this.collegeNameList.findIndex((x: any) => {
      return x.academic_institution_name == collegeName;
    });
    this.userModel.collegeCity =
      this.collegeNameList[collegeInfo].city != null
        ? this.collegeNameList[collegeInfo].city_id +
        '_' +
        this.collegeNameList[collegeInfo].city
        : '';
  }


  getTermsAndConditionUrl() {
    $('.spinner').show();
    this._loginservice.getVOneTermUrl().subscribe({
      next: (res) => {
        $('.spinner').hide();
        if (res.status.toLowerCase() == "success") {
          this.terms_and_conditions_url = res.data.url_path
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

  /* add Student Details */
  onSubmit(formvalue: any) {

    if (formvalue.valid == true) {
      let state = this.userModel.stateId.split('_', 2);
      let city = this.userModel.currentLocation.split('_', 2);
      let placedOrganization = this.userModel.placedOrganization.split('_', 2);
      let collegeInfo = '';
      let collegeCity = [];
      if (this.userModel.isGraduated != 'No') {
        collegeInfo = this.collegeNameList.findIndex((x: any) => {
          return x.academic_institution_name == this.userModel.collegeName;
        });
        collegeCity = this.userModel.collegeCity.split('_', 2);
      }

      let params = {
        firstName: (this.userModel.firstName.length == 1) ? this.userModel.firstName.toUpperCase() : this.userModel.firstName,
        lastName: (this.userModel.lastName.length == 1) ? this.userModel.lastName.toUpperCase() : this.userModel.lastName,
        gender: this.userModel.gender,
        dob: moment(this.userModel.dob).format('YYYY-MM-DD'),
        aadharNumber: this.userModel.aadharNumber,
        email: this.userModel.email,
        mobile: this.userModel.mobile,
        whatsappNumber: this.userModel.whatsappNumber,
        password: this.userModel.password,
        confirmPassword: this.userModel.confirmPassword,
        stateId: String(state[0]),
        state_name: state[1],
        cityId: String(city[0]),
        collegeId:
          (collegeInfo != String(-1) && collegeInfo != '' && collegeInfo != null)
            ? String(this.collegeNameList[collegeInfo].academic_institution_id)
            : '',
        currentLocation: city[1],
        isGraduated: this.userModel.isGraduated,
        collegeName: this.userModel.collegeName['academic_institution_name'],
        collegeCity: collegeCity[1],
        educationalQualification: this.userModel.educationalQualification,
        graduationPassingYear: this.userModel.graduationPassingYear,
        subject: this.userModel.subject,
        isPlaced: this.userModel.isPlaced,
        placedOrganizationId: placedOrganization[0],
        placedOrganization: placedOrganization[1],
        sector: this.sector_id,
        sectorName: this.userModel.sector,
        designation: this.userModel.designation,
        joiningMonth: this.userModel.joiningMonth,

        caste: this.userModel.caste,
        vaccinationStatus: this.userModel.vaccinationStatus,
        uploadVaccinationCertificate: this.userModel
          .uploadVaccinationCertificate
          ? this.userModel.uploadVaccinationCertificate
          : '',
        termsAndConditions: String(this.userModel.termsAndConditions),
        profession: this.userModel.profession,
        candidateCategory: this.userModel.candidateCategory,
        insertedby: (this.currentLoginUserId != null) ? +this.currentLoginUserId : 1,
        roleId: '3',
        active: 1,
      };

      $('.spinner').show();

      this.studentService.addVoneStudent(params, this.files).subscribe({
        next: (studentData) => {
          this.stustatus = studentData.status;
          this.receivedmessage = studentData.message;
          if (!this.assignProject) {
            if (this.stustatus == 'Success') {
              $('.spinner').hide();
              this.successmsg = false;
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Student registration is successful',
              });
              setTimeout(() => {
                this.router.navigate(['/login']);
              }, 2000);
            }
          } else {
            let addProjectUser = {
              projectId: this.projectId,
              userId: studentData.data.id,
              projectUserRole: 'Student',
            };

            this.studentService.addProjectUsers(addProjectUser).subscribe({
              next: (projectdata) => {
                if (projectdata.status == 'Success') {
                  this.subManager$.add(
                    this.studentService
                      .additionalFields(studentData.data.id)
                      .subscribe({
                        next: (data) => {
                          $('.spinner').hide();
                          debugger
                          data.data.projectID = this.projectId;
                          data.data.registeration = true;
                          this.questions$ = data.data;
                          if (data.data.projectAddtionalFields.length > 0) {
                            data.data.projectAddtionalFields.forEach((val, indx) => {
                              if (val.fields.length > 0) {
                                this.NextEnabled = true;
                                this.pro_terms_and_conditions_url = (data.data.projectAddtionalFields[0].terms_url != null) ? data.data.projectAddtionalFields[0].terms_url : null;
                                console.log(this.pro_terms_and_conditions_url);
                                this.loading = false;
                              } else {
                                this.router.navigate(['/login']);
                              }
                            });
                          }
                        },
                        error: (e) => { },
                      })
                  );
                } else {
                  this.disable = false;
                  $('.spinner').hide();
                  this.listOfErrors = projectdata.error.data;
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: this.listOfErrors,
                  });
                }
              },
            });
          }
        },
        error: (data) => {
          this.disable = false;
          $('.spinner').hide();
          this.listOfErrors = data.error.data;
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: this.listOfErrors,
          });
          // setTimeout(function () { $("#db_error").hide(); });
        },
      });
    }
  }

  generateLink() {
    this.studentService.genVoneLink().subscribe((response: any) => { });
  }
}
