import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { ProfessionalModel } from '../../view-models/professional-model';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { ProfessionalService } from '../../services/professional.service';
import { MessageService } from 'primeng/api';
import * as moment from 'moment';


@Component({
  selector: 'app-professional-add',
  templateUrl: './professional-add.component.html',
  styleUrls: ['./professional-add.component.css'],
  providers: [MessageService],
})
export class ProfessionalAddComponent implements OnInit {
  userModel = new ProfessionalModel();
  @Input() cityDetails: any = [];
  @Input() stateDetails: any = [];
  @Input() collegeDetails: any = [];
  @Input() filterCityNameList: any = [];
  @Input() loggedInUserId: number;
  @Input() organizationNameList: any = [];
  @Input() pageNumber: any;
  @Input() showCount: any;
  @Input() terms_and_conditions_url: any;
  @Output() filterCities = new EventEmitter<any>();
  @Output() callParentGetUserManagement = new EventEmitter<any>();

  /* Password hide and show */
  show_button: boolean = false;
  show_eye: boolean = false;
  public files: any;
  dateTime = new Date();

  public profstatus: any;
  public loginmessage: any;
  public listOfErrors: any = [];
  public successmsg: boolean = true;
  public : string;


  public receivedmessage: string = '';
  public ddllanguage: [{ item_id: string; item_text: string }];

  industryNameList: any;
  dropdownSettings: IDropdownSettings = {};
  dropdownList: { item_id: number; item_text: string }[];

  message: string | undefined;
  currentYear: number;
  disable = false;
  show_confirmbutton: boolean;
  show_confirmeye: boolean;
  languageIds: any = [];
  roles: any = [];
  sector_id: number;

  constructor(
    public professionalService: ProfessionalService,
    public messageService: MessageService,
  ) {
    this.currentYear = new Date().getFullYear();
    this.roles = JSON.parse(localStorage.getItem('roles'));
    this.terms_and_conditions_url = localStorage.getItem('terms_and_condition_url');
  }

  ngOnInit(): void {
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

  getUserManagementList() {
    let paramRoleIds = this.getStuProRoleIds();
    let event = {
      'paramRoleIds': paramRoleIds,
      'pageNumber': this.pageNumber,
      'showCount': this.showCount
    }
    this.callParentGetUserManagement.next(event);
  }

  getStuProRoleIds() {
    let roleIds = [];
    this.roles.map(function (obj) {
      let roleName = obj.role_name
        .replace(/\w+/g, function (txt) {
          return txt.toUpperCase();
        })
        .replace(/\s/g, '_');
      if (['STUDENT', 'PROFESSIONAL'].includes(roleName)) {
        roleIds.push({
          role_id: obj.role_id,
        });
      }
    });

    let paramRoleIds = roleIds.map((x) => x.role_id).join(',');
    return paramRoleIds;
  }

  resetUserProForm(proForm: NgForm) {
    proForm.resetForm();
  }

  showPassword() {
    this.show_button = !this.show_button;
    this.show_eye = !this.show_eye;
  }
  showConfirmPassword() {
    this.show_confirmbutton = !this.show_confirmbutton;
    this.show_confirmeye = !this.show_confirmeye;
  }
  getFilterCities(value) {
    this.filterCities.next(value);
  }
  FilterCity(value) {
    this.getFilterCities(value);
    this.userModel.currentLocation = '';
  }

  /* Display Sector name list*/
  getSectorName(orgDetail: any) {
    let org = orgDetail.split('_', 2);
    let org_id = org[0];
    this.professionalService.getSectorName(org_id).subscribe((response) => {
      if (response.data != null) {
        this.userModel.sector = response.data.industry;
        this.sector_id = response.data.industry_id;
      }
    });
  }

  isGraduated(value) {
    this.userModel.academiciInstitutionName = '';
    this.userModel.educationalQualification = '';
    this.userModel.subject = '';
    this.userModel.graduationPassingYear = '';
    this.userModel.academicInstitutionCity = '';
    this.userModel.profession = '';
  }

  isPlaced(value) {

    if (value == 'Yes') {
      this.getOrganizationList();
    } else {
      $('#addNameOfPlacedOrg')
      .find('option')
      .remove()
      .end()
      .append('<option value="">Select Placed Organization</option>');
      this.organizationNameList = [];
    }

    this.userModel.placedOrganization = '';
    this.userModel.sector = '';
    this.userModel.designation = '';
    this.userModel.joiningMonth = '';
    this.userModel.isExperience = '';
    this.userModel.employer1 = '';
    this.userModel.employer2 = '';
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

  postGrad(value) {
    this.userModel.postGraduationPassingYear = '';
    this.userModel.postGraduationInstitution = '';
    this.userModel.postGraduationQualification = '';
  }

  isExperience(value) {
    this.userModel.experienceYears = '';
  }

  getCollegeCity(collegeName: any) {
    let collegeInfo = this.collegeDetails.findIndex((x: any) => {
      return x.academic_institution_name == collegeName;
    });
    this.userModel.academicInstitutionCity =
      this.collegeDetails[collegeInfo].city != null
        ? this.collegeDetails[collegeInfo].city_id +
          '_' +
          this.collegeDetails[collegeInfo].city
        : '';
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

    $('#'+ id).val(name);
  }

  /* Add Profession */
  onSubmit(formvalue: any, proForm: NgForm) {
    if (formvalue.valid == true) {
      let state = this.userModel.stateId.split('_', 2);
      let city = this.userModel.currentLocation.split('_', 2);
      let placedOrganization = [];
      if(this.userModel.isPlaced == 'Yes'){
        placedOrganization = this.userModel.placedOrganization.split('_', 2);
      }


      let collegeInfo = '';
      let collegeCity = [];
      if (this.userModel.isGraduated != 'No') {
        collegeInfo = this.collegeDetails.findIndex((x: any) => {
          return (
            x.academic_institution_name ==
            this.userModel.academiciInstitutionName['academic_institution_name']
          );
        });
        collegeCity = this.userModel.academicInstitutionCity.split('_', 2);
      }

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
        academiciInstitutionName: this.userModel.academiciInstitutionName['academic_institution_name'],
        academicInstitutionCity: collegeCity[1],
        aadharNumber: this.userModel.aadharNumber,
        educationalQualification: this.userModel.educationalQualification,
        graduationPassingYear: this.userModel.graduationPassingYear,
        subject: this.userModel.subject,
        profession: this.userModel.profession,
        stateId: this.userModel.stateId,
        cityId: String(city[0]),
        collegeId: collegeInfo != '' && collegeInfo != null
            ? String(this.collegeDetails[collegeInfo].academic_institution_id)
            : '',
        currentLocation: city[1],
        isPlaced: this.userModel.isPlaced,
        gttId: '',
        roleId: '14',
        vaccinationStatus: this.userModel.vaccinationStatus,
        termsAndConditions: String(this.userModel.termsAndConditions),
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
        caste: this.userModel.caste,
        candidateCategory: this.userModel.candidateCategory,
        placedOrganizationId: (placedOrganization.length > 0 && placedOrganization[0] != null)? placedOrganization[0]: "",
        placedOrganization: (placedOrganization.length > 0 && placedOrganization[1] != null)? placedOrganization[1]: "",
        sector: this.sector_id,
        sectorName: this.userModel.sector,
        designation: this.userModel.designation,
        joiningMonth: this.userModel.joiningMonth,
        uploadVaccinationCertificate:
          this.userModel.uploadVaccinationCertificate,
        active: 1,
        status: 'Active',
        insertedby: +this.loggedInUserId
      };
      // this.disable = true;

      $('.spinner').show();
      this.professionalService.addProfessional(params, this.files).subscribe({
        next: (data) => {
          $('.spinner').hide();
          this.profstatus = data.status;
          this.receivedmessage = data.message;
          if (this.profstatus == 'Success') {
            this.successmsg = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: this.receivedmessage,
            });
            this.languageIds = [];
            this.userModel.languageKnown = '';
            ($('#addstudentprofessional') as any).modal('hide');
            this.resetUserProForm(proForm);
            this.getUserManagementList();
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
        },
      });
    }
  }

}
