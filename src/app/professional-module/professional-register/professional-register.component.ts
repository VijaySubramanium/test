import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { ProfessionalModel } from '../../view-models/professional-model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ProfessionalService } from '../../services/professional.service';
import * as moment from 'moment';
import { Title } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { LoginService } from '../../login.service';

@Component({
  selector: 'app-professional-register',
  templateUrl: './professional-register.component.html',
  styleUrls: ['./professional-register.component.css'],
  providers: [MessageService],
})
export class ProfessionalRegisterComponent implements OnInit {
  userModel = new ProfessionalModel();
  /* Password hide and show */
  show_button: boolean = false;
  show_eye: boolean = false;

  public files: any;
  dateTime = new Date();
  public terms_and_conditions_url: string;
  public profstatus: any;
  public loginmessage: any;
  public listOfErrors: any = [];
  public successmsg: boolean = true;
  // public failuremsg:boolean=true;
  public receivedmessage: string = '';
  public ddllanguage: [{ item_id: string; item_text: string }];
  organizationNameList: any;
  industryNameList: any;
  dropdownSettings: IDropdownSettings = {};
  dropdownList: { item_id: number; item_text: string }[];
  cityddl: any;
  collegeddl: any = [];
  stateDetails: any;
  message: string | undefined;
  currentYear: number;
  disable = false;
  show_confirmbutton: boolean;
  show_confirmeye: boolean;
  languageIds: any = [];
  currentLoginUserId: number;
  sector_id: number;
  constructor(
    public professionalService: ProfessionalService,
    private titleService: Title,
    private router: Router,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    public messageService: MessageService,
    public _loginservice: LoginService
  ) {
    this.currentYear = new Date().getFullYear();
    this.cityList();
    this.collegeList();
    this.listOfState();
    // this.getOrganizationList();
    this.getTermsAndConditionUrl();

    this.activatedRoute.queryParams.subscribe(params => {
      this.currentLoginUserId = params['userId'];
    });

    this.terms_and_conditions_url = localStorage.getItem('terms_and_condition_url');

  }

  ngOnInit(): void {

    this.setTitle('TJM-Professional');
    $('.spinner').hide();

    this.dropdownList = [
      { item_id: 1, item_text: 'English' },
      { item_id: 2, item_text: 'Hindi' },
      { item_id: 3, item_text: 'Marathi' },
      { item_id: 4, item_text: 'Tamil' },
      { item_id: 5, item_text: 'Telugu' },
      { item_id: 6, item_text: 'Kannada' },
      { item_id: 7, item_text: 'Other' },
    ];

    this.dropdownSettings = {
      idField: 'item_id',
      textField: 'item_text',
    };

  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
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
      }
    } else {
      this.message = 'Invalid file format';
      this.disable = true;
    }
  }

  myGroup = new FormGroup({
    file: new FormControl(),
  });

  onSelectLanguage($event) {
    if (!this.languageIds.includes($event.item_id)) {
      this.languageIds.push($event.item_id);
    }
    this.userModel.languageKnown = this.languageIds.toString();
  }

  onDeSelectLanguage($event) {
    var index = this.languageIds.indexOf($event.item_id);
    if (index !== -1) {
      this.languageIds.splice(index, 1);
    }
    this.userModel.languageKnown = this.languageIds.toString();
  }

  onSelectAllLanguage($event) {
    $event.forEach((elm, inx) => {
      if (!this.languageIds.includes(elm.item_id)) {
        this.languageIds.push(elm.item_id);
      }
    });
    this.userModel.languageKnown = this.languageIds.toString();
  }

  onDeSelectAllLanguage($event) {
    this.languageIds = [];
    this.userModel.languageKnown = '';
  }

  onLanguageChange() {
    let sample = this.ddllanguage.map((x) => x.item_id);
    var language = '';
    sample.forEach((obj) => {
      if (obj != '0') {
        if (language != '') {
          language = language + ',' + obj;
        } else {
          language = obj;
        }
      }
      // else{
      //   language = obj;
      // }
    });
    this.userModel.languageKnown = language;
  }

  /*Add Professional Details*/
  onSubmit(formvalue: any) {
    let state = this.userModel.stateId.split('_', 2);
    let city = this.userModel.currentLocation.split('_', 2);
    let placedOrganization = [];
      if(this.userModel.isPlaced == 'Yes'){
        placedOrganization = this.userModel.placedOrganization.split('_', 2);
      }

    let collegeInfo = '';
    if (this.userModel.isGraduated != 'No') {
      collegeInfo = this.collegeddl.findIndex((x: any) => {
        return (
          x.academic_institution_name == this.userModel.academiciInstitutionName['academic_institution_name']
        );
      });
    }

    if (formvalue == true) {
      $('.spinner').show();

      let params = {
        firstName: this.userModel.firstName,
        lastName: this.userModel.lastName,
        gender: this.userModel.gender,
        dob: moment(this.userModel.dob).format('YYYY-MM-DD'),
        maritalStatus: this.userModel.maritalStatus,
        email: this.userModel.email,
        mobile: this.userModel.mobile,
        whatsappNumber: this.userModel.whatsappNumber,
        password: this.userModel.password,
        confirmPassword: this.userModel.confirmPassword,
        isGraduated: this.userModel.isGraduated,
        academicInstitutionCity: this.userModel.academicInstitutionCity,
        academiciInstitutionName: this.userModel.academiciInstitutionName['academic_institution_name'],
        aadharNumber: this.userModel.aadharNumber,
        educationalQualification: this.userModel.educationalQualification,
        graduationPassingYear: this.userModel.graduationPassingYear,
        subject: this.userModel.subject,
        profession: this.userModel.profession,
        stateId: this.userModel.stateId,
        cityId: String(city[0]),
        collegeId:
          collegeInfo != '' && collegeInfo != null
            ? String(this.collegeddl[collegeInfo].academic_institution_id)
            : '',
        currentLocation: String(city[1]),
        isPlaced: this.userModel.isPlaced,
        gttId: '',
        roleId: '14',
        vaccinationStatus: this.userModel.vaccinationStatus,
        termsAndConditions: this.userModel.termsAndConditions,
        pursuingPostGraduate: this.userModel.pursuingPostGraduate,
        postGraduationQualification: this.userModel.postGraduationQualification,
        postGraduationPassingYear: this.userModel.postGraduationPassingYear,
        postGraduationInstitution: this.userModel.postGraduationInstitution['academic_institution_name'],
        alternateNumber: this.userModel.alternateNumber,
        fathersName: this.userModel.fatherName,
        mothersName: this.userModel.motherName,
        guardiansName: this.userModel.guardianName,
        pincode: this.userModel.pincode,
        disabilityType: this.userModel.disabilityType,
        percentageMarks: this.userModel.percentageMarks,
        languageKnown: this.userModel.languageKnown,
        isExperience: this.userModel.isExperience,
        experienceYears: this.userModel.experienceYears,
        employer1: this.userModel.employer1,
        employer2: this.userModel.employer2,
        placedOrganizationId: (placedOrganization.length > 0 && placedOrganization[0] != null)? placedOrganization[0]: "",
        placedOrganization: (placedOrganization.length > 0 && placedOrganization[1] != null)? placedOrganization[1]: "",
        sector: this.sector_id,
        sectorName: this.userModel.sector,
        caste: this.userModel.caste,
        candidateCategory: this.userModel.candidateCategory,
        designation: this.userModel.designation,
        joiningMonth: this.userModel.joiningMonth,
        uploadVaccinationCertificate: this.userModel.uploadVaccinationCertificate,
        insertedby: (this.currentLoginUserId != null) ? +this.currentLoginUserId : 1,
        active: '1',
        status: 'Active',
      };
      console.log('params', params);
      $('.spinner').show();
      this.professionalService.addVOneProfessional(params, this.files).subscribe({
        next: (data) => {
          $('.spinner').hide();
          this.profstatus = data.status;
          this.receivedmessage = data.message;
          if (this.profstatus == 'Success') {
            this.successmsg = false;
            this.toastr.success(this.receivedmessage);
            //setTimeout(function () { $("#succ_msg").hide(); }, 4000);
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          }
        },
        error: (data) => {
          this.disable = false;
          $('.spinner').hide();
          this.listOfErrors = data.error.data;
          // setTimeout(function () { $("#db_error").hide(); }, 5000);
          this.toastr.error(this.listOfErrors);
        },
      });
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

  // /* Display college list*/
  // collegeList() {
  //   this.commonservice.getCollege().subscribe((data) => {
  //     if (data.data != null) {
  //       const academicSorted = data.data.sort((a, b) => a.academic_institution_name.localeCompare(b.academic_institution_name))
  //       this.collegeddl = academicSorted;
  //     }
  //   });
  // }

  /* Display college list*/
  collegeList() {
    this.professionalService.getVoneCollege().subscribe((response) => {
      response.data.forEach((elem: any, index: any) => {
        if (elem.status == 'Active') {
          this.collegeddl.push({
            academic_institution_id: elem.academicInstitutionId,
            academic_institution_name: elem.academicInstitutionName,
          });
        }
      });

      const academicSorted = this.collegeddl.sort((a: any, b: any) =>
        a.academic_institution_name > b.academic_institution_name ? 1 : -1
      );
      this.collegeddl = academicSorted;
    });
  }

  /* Filter the city */
  FilterCity(value: any) {
    let stateDetails = value.split('_', 2);
    this.professionalService
      .getVoneFilterCity(stateDetails[0])
      .subscribe((response: any) => {
        if (response.data != null) {
          const citySorted = response.data.sort((a: any, b: any) =>
            a.cityname > b.cityname ? 1 : -1
          );
          this.userModel.academicInstitutionCity = '';
          this.cityddl = citySorted;
        }
      });
  }

  /* Display Organization name list*/
  getOrganizationList() {
    $('.spinner').show();
    this.professionalService.getVOneOrganizationList().subscribe((response) => {
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
    this.professionalService.getVoneSectorName(org_id).subscribe((response) => {
      $('.spinner').hide();
      if (response.data != null) {
        this.userModel.sector = response.data.industry;
        this.sector_id = response.data.industry_id;
      }
    });
  }
  /* Display Industry name list*/
  getIndustryList() {
    this.professionalService.getIndustryList().subscribe((response) => {
      if (response.data != null) {
        const industrySorted = response.data.sort((a: any, b: any) =>
          a.industry > b.industry ? 1 : -1
        );
        this.industryNameList = industrySorted;
      }
    });
  }
  isGraduated(value) {
    this.userModel.academiciInstitutionName = '';
    this.userModel.academicInstitutionCity = '';
    this.userModel.subject = '';
    this.userModel.educationalQualification = '';
    this.userModel.graduationPassingYear = '';
  }

  onPlacedOrgChange(value) {

    if (value == 'Yes') {
      this.getOrganizationList();
    } else {
      this.organizationNameList = [];
    }

    this.userModel.employer1 = '';
    this.userModel.employer2 = '';
    this.userModel.designation = '';
    this.userModel.joiningMonth = '';
    this.userModel.placedOrganization = '';
  }

  onExpChange(value) {
    this.userModel.experienceYears = '';
  }

  onPgChange(value) {
    this.userModel.postGraduationQualification = '';
    this.userModel.postGraduationPassingYear = '';
    this.userModel.postGraduationInstitution = '';
  }

  placeOrg(value) {
    this.userModel.designation = '';
    this.userModel.placedOrganization = '';
    this.userModel.joiningMonth = '';
  }
  /* Display state list*/
  listOfState() {
    this.professionalService.getVoneState().subscribe((response: any) => {
      if (response.data != null) {
        const stateSorted = response.data.sort((a: any, b: any) =>
          a.state > b.state ? 1 : -1
        );
        this.stateDetails = stateSorted;
      }
    });
  }

  /* Display city list*/
  cityList() {
    this.professionalService.getVOneCity().subscribe((data) => {
      this.cityddl = data.data.sort((a: any, b: any) =>
        a.cityname > b.cityname ? 1 : -1
      );
    });
  }
}
