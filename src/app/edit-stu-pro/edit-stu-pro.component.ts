import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StudentService } from 'src/app/services/student.service';
import { UsermanagementService } from 'src/app/services/user-management.service';
import { MessageService } from 'primeng/api';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-edit-stu-pro',
  templateUrl: './edit-stu-pro.component.html',
  providers: [MessageService],
  styleUrls: ['./edit-stu-pro.component.css'],
})
export class EditStuProComponent implements OnInit {
  @Input() editStuDetails: any = [];
  @Input() editProDetails: any = [];
  @Input() currentUserId: string;
  @Input() stuUploadOption: boolean;
  @Input() proUploadOption: boolean;
  @Input() cityDetails: any = [];
  @Input() stateDetails: any = [];
  @Input() languageIds: any = [];
  @Input() collegeDetails: any = [];
  @Input() filterCityNameList: any = [];
  @Input() organizationNameList: any = [];
  @Input() pageNumber: any;
  @Input() showCount: any;
  @Input() terms_and_conditions_url: string;
  @Output() filterCities = new EventEmitter<any>();
  @Output() callParentGetUserManagement = new EventEmitter<any>();
  roles: any = [];
  user: any;
  currentLoginUserId: number;
  sector_id: number;

  constructor(
    public studentService: StudentService,
    private UsermanagementService: UsermanagementService,
    private messageService: MessageService
  ) {
    this.currentYear = new Date().getFullYear();
    this.roles = JSON.parse(localStorage.getItem('roles'));
    this.user = localStorage.getItem('userId');
    this.currentLoginUserId = JSON.parse(this.user).id;
  }

  public uploadOption: boolean = true;
  dateTime = new Date();
  currentYear: number;
  public files: any;
  message: string = '';

  /* Password hide and show */
  show_button: boolean = false;
  show_eye: boolean = false;

  /* Confirm Password hide and show */
  confirm_show_button: boolean = false;
  confirm_show_eye: boolean = false;
  public languageKnown: '';

  dropdownSettings: IDropdownSettings = {};
  dropdownList: { item_id: number; item_text: string }[];
  public ddllanguage: [{ item_id: string; item_text: string }];

  ngOnInit(): void {

    console.log(this.editProDetails);
    console.log(this.editProDetails.currentLocation);
    this.files = [];
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

  /* Display Sector name list*/
  getSectorName(orgDetail: any) {
    let org = orgDetail.split('_', 2);
    let org_id = org[0];
    this.studentService.getSectorName(org_id).subscribe((response) => {
      if (response.data != null) {
        this.editStuDetails.sector = response.data.industry;
        this.editProDetails.sector = response.data.industry;
        this.sector_id = response.data.industry_id;
      }
    });
  }

  onSelectLanguage($event) {
    if (!this.languageIds.includes($event.item_id)) {
      this.languageIds.push($event.item_id);
    }

    this.languageKnown = this.languageIds.toString();
  }

  onDeSelectLanguage($event) {
    var index = this.languageIds.indexOf($event.item_id);
    if (index !== -1) {
      this.languageIds.splice(index, 1);
    }

    this.languageKnown = this.languageIds.toString();
  }

  onSelectAllLanguage($event) {
    $event.forEach((elm, inx) => {
      if (!this.languageIds.includes(elm.item_id)) {
        this.languageIds.push(elm.item_id);
      }
    });
    this.languageKnown = this.languageIds.toString();
  }

  onDeSelectAllLanguage($event) {
    this.languageIds = [];
    this.languageKnown = '';
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

  getFilterCities(value) {
    this.filterCities.next(value);
  }

  FilterCity(value: any) {
    this.getFilterCities(value);
    this.editStuDetails.currentLocation = '';
  }

  isExperience(value) {
    this.editProDetails.experienceYears = '';
  }

  UploadCerticate(value) {
    this.uploadOption = value;
    this.message = '';
    // if (value == true) {
    //   this.getEditDetails.terms_and_conditions = (this.editExistsUploadFileName != null && this.editExistsUploadFileName != undefined) ? this.editExistsUploadFileName : "";
    //   this.editMessage = '';
    // }
    if (value == true) {
      this.files = undefined;
    }
  }


  stuUploadCerticate(value) {
    this.stuUploadOption = value;
    console.log(this.stuUploadOption);
    this.message = '';
    if (value == true) {
      this.files = undefined;
    }
  }


  proUploadCerticate(value) {
    this.proUploadOption = value;
    this.message = '';
    if (value == true) {
      this.files = undefined;
    }
  }

  getCollegeCity(collegeName: any) {

    let collegeInfo = this.collegeDetails.findIndex((x: any) => {
      return x.academic_institution_name.toLowerCase() == collegeName.toLowerCase();
    });
    this.editProDetails.academicInstitutionCity =
      this.collegeDetails[collegeInfo].city != null
        ? this.collegeDetails[collegeInfo].city_id +
        '_' +
        this.collegeDetails[collegeInfo].city
        : '';
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    this.files = file;
    var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
    let _validFileExtensions = ['jpg', 'jpeg', 'pdf', 'csv', 'xlsx'];
    if (event.target.files.length > 0 && _validFileExtensions.includes(ext)) {
      this.message = '';
      if (this.files.size > 2000000) {
        this.message = 'File size less than 2MB';
        // this.uploadOption = true;
      } else {
        this.message = '';
        this.editStuDetails.uploadVaccinationCertificate = file.name;
        this.stuUploadOption = true;
      }
    } else {
      this.message = 'Invalid file format';
      this.stuUploadOption = false;
    }
  }


  onFileProChange(event: any) {
    const file = event.target.files[0];
    this.files = file;
    var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
    let _validFileExtensions = ['jpg', 'jpeg', 'pdf', 'csv', 'xlsx'];
    if (event.target.files.length > 0 && _validFileExtensions.includes(ext)) {
      this.message = '';
      if (this.files.size > 2000000) {
        this.message = 'File size less than 2MB';
        // this.uploadOption = true;
      } else {
        this.message = '';
        this.editProDetails.uploadVaccinationCertificate = file.name;
        this.proUploadOption = true;
      }
    } else {
      this.message = 'Invalid file format';
      this.proUploadOption = false;
    }
  }

  myGroup = new FormGroup({
    file: new FormControl(),
  });

  showPassword() {
    this.show_button = !this.show_button;
    this.show_eye = !this.show_eye;
  }


  humanize(string: any) {
    let titleCaseString = string
      .replace(/(_|-)/g, ' ')
      .trim()
      .replace(/\w\S*/g, function (str: any) {
        return str.charAt(0).toUpperCase() + str.substr(1);
      })
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
    return titleCaseString;
  }

  confirmShowPassword() {
    this.confirm_show_button = !this.confirm_show_button;
    this.confirm_show_eye = !this.confirm_show_eye;
  }

  isPlaced(value, type) {

    if (value == 'Yes') {
      $('#editNameOfPlacedOrg')
      .find('option')
      .remove()
      .end();
      this.getOrganizationList();
    } else {
      $('#editNameOfPlacedOrg')
        .find('option')
        .remove()
        .end()
        .append('<option value="">Select Placed Organization</option>');
      this.organizationNameList = [];
    }

    if (type == 'student') {
      this.editStuDetails.placedOrganization = '';
      this.editStuDetails.sector = '';
      this.editStuDetails.designation = '';
      this.editStuDetails.joiningMonth = '';
    } else {
      this.editProDetails.placedOrganization = '';
      this.editProDetails.sector = '';
      this.editProDetails.designation = '';
      this.editProDetails.joiningMonth = '';
    }


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
        $('#editNameOfPlacedOrg').append('<option value="">  Select Placed Organgiation </option>');
        this.organizationNameList.forEach((el, ix) => {
          let key = el.placementemployer_id + '_' + el.placement_employer_name;
          $('#editNameOfPlacedOrg').append('<option value="' + key + '">' + el.placement_employer_name + '</option>');
        });
      }
    });
  }


  /* Update Professional */
  onSubmitUpdateUserProfession(formValue: any) {

    debugger

    if (formValue.valid && formValue.value.edit_pro_pswd == formValue.value.edit_pro_cpswd && this.message == '') {
      let loc = formValue.value.edit_pro_location.split('_', 2);
      let state = formValue.value.edu_pro_state.split('_', 2);

      var langugae = Object.keys(formValue.value.edit_pro_language).map(
        function (k) {
          return formValue.value.edit_pro_language[k].item_text;
        }
      );

      let collegeInfo: number;
      let collegeCity = [];
      let org = [];
      if (
        formValue.value.edit_pro_graduated != 'No' &&
        formValue.value.edit_pro_graduated != undefined
      ) {
        collegeInfo = this.collegeDetails.findIndex((x: any) => {
          return (
            x.academic_institution_name == formValue.value.edit_pro_collegename
          );
        });
        collegeCity = formValue.value.edit_pro_collegecity.split('_', 2);
      }


      if (
        formValue.value.edit_pro_placedorganization != 'No' &&
        formValue.value.edit_pro_placedorganization != undefined
      ) {
        org = formValue.value.edit_pro_org.split('_', 2);
      }

      let UniqueLanguages = [...new Set(this.languageIds)];
      let academic_institution_name = '';
      if(formValue.value.edit_pro_collegename != undefined && formValue.value.edit_pro_collegename['academic_institution_name'] != undefined){
        academic_institution_name = (formValue.value.edit_pro_collegename['academic_institution_name'] != null) ? this.humanize(formValue.value.edit_pro_collegename['academic_institution_name']) : '';
      }

      let post_academic_institution_name = '';
      if(formValue.value.edit_pro_postclgName  != undefined && formValue.value.edit_pro_postclgName['academic_institution_name'] != undefined){
        post_academic_institution_name = (formValue.value.edit_pro_postclgName['academic_institution_name'] != null) ? this.humanize(formValue.value.edit_pro_postclgName['academic_institution_name']) : '';
      }

      let params = {
        id: this.currentUserId,
        firstName: formValue.value.edit_pro_first,
        lastName: formValue.value.edit_pro_last,
        gender: formValue.value.edit_pro_gender,
        dob: moment(formValue.value.edit_pro_dob).format('YYYY-MM-DD'),
        maritalStatus: formValue.value.edit_pro_maritalstatus,
        email: formValue.value.edit_pro_email,
        mobile: formValue.value.edit_pro_mobile,
        whatsappNumber: formValue.value.edit_pro_whatsapp,
        password: formValue.value.edit_pro_pswd,
        confirmPassword: formValue.value.edit_pro_cpswd,
        isGraduated: formValue.value.edit_pro_graduated,
        academicInstitutionCity: collegeCity[1],
        academiciInstitutionName: academic_institution_name,
        aadharNumber: formValue.value.edit_pro_aadhar,
        educationalQualification: formValue.value.edit_pro_qualification,
        graduationPassingYear: formValue.value.edit_pro_graguate_pass_year,
        subject: formValue.value.edit_pro_subject,
        profession: formValue.value.edit_pro_profession,
        stateId: String(state[0]),
        currentLocation: loc[1],
        gttId: this.editProDetails.gttId,
        roleId: '14',
        vaccinationStatus: formValue.value.edit_pro_vaccination,
        termsAndConditions: String(formValue.value.edit_pro_agree),
        pursuingPostGraduate: formValue.value.edit_pro_postorg,
        postGraduationQualification: formValue.value.edit_pro_postQualification,
        postGraduationPassingYear: formValue.value.edit_pro_postyear,
        postGraduationInstitution: post_academic_institution_name,
        alternateNumber: formValue.value.edit_pro_alt_mobile_no,
        fathersName: formValue.value.edit_pro_fathername,
        mothersName: formValue.value.edit_pro_mothername,
        guardiansName: formValue.value.edit_pro_guardianname,
        pincode: formValue.value.edit_pro_pinCode,
        disabilityType: formValue.value.edit_pro_disability_type,
        percentageMarks: formValue.value.edit_pro_markper,
        languageKnown: UniqueLanguages.toString(),
        isExperience: formValue.value.edit_pro_experiance,
        experienceYears: formValue.value.edit_pro_years,
        employer1: formValue.value.edit_pro_emp1,
        employer2: formValue.value.edit_pro_emp2,
        caste: formValue.value.edit_pro_caste,
        candidateCategory: '',
        isPlaced: formValue.value.edit_pro_placedorganization,
        placedOrganizationId: +org[0],
        placedOrganization: org[1],
        sector: +this.sector_id,
        sectorName: this.editProDetails.sector,
        designation: formValue.value.edit_pro_des,
        joiningMonth: formValue.value.edit_pro_month,
        uploadVaccinationCertificate:
          this.editProDetails.uploadVaccinationCertificate,
        vaccinationCertificateFileName:
          this.editProDetails.uploadVaccinationCertificate,
        status: formValue.value.edit_pro_status,
        cityId: +loc[0],
        collegeId:
          collegeInfo != -1 &&
            this.collegeDetails.length > 0 &&
            collegeInfo != undefined
            ? +this.collegeDetails[collegeInfo].academic_institution_id
            : null,
        active: formValue.value.edit_pro_status == 'Active' ? 1 : 0,
        insertedby: +this.editProDetails.insertedBy,
        updatedBy: +this.currentLoginUserId,
        updatedtime: moment().format('YYYY-MM-DD')
      };

      $('.spinner').show();
      this.UsermanagementService.updateProfessionDetails(
        params,
        this.files
      ).subscribe({
        next: (response) => {
          $('.spinner').hide();
          if (response.status == 'Success') {
            ($('#edit_user_pro_details') as any).modal('hide');
            this.getUserManagementList();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: response.message,
            });
          } else {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: response.data[0],
            });
          }
        },
        error: (response) => {
          $('.spinner').hide();
          if (response.error.status == 'Failed') {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                response.error.data == null
                  ? response.error.message
                  : response.error.data[0].toString(),
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                response.error.message == null
                  ? response.error.error
                  : response.error.message,
            });
          }
        },
      });
    }
  }

  changeVaccinationStatus(value: any, type: any) {
    if(type == 'stu'){
      if (value == 'Yes') {
        this.stuUploadCerticate(false);
      } else {
        this.stuUploadCerticate(true);
      }
    }else{
      if (value == 'Yes') {
        this.proUploadCerticate(false);
      } else {
        this.proUploadCerticate(true);
      }
    }

  }

  /* Update Student */
  onSubmitUpdateUser(formValue: any) {
    if (formValue.valid && formValue.value.edit_stu_pswd == formValue.value.edit_stu_cpswd  && this.message == '') {
      let state = formValue.value.edu_stu_state.split('_', 2);
      let currentLoc = formValue.value.edit_stu_location.split('_', 2);
      let collegeInfo: number;
      let collegeCity = [];
      if (
        formValue.value.edit_stu_graduated != 'No' &&
        formValue.value.edit_stu_graduated != undefined
      ) {
        collegeInfo = this.collegeDetails.findIndex((x: any) => {
          return (
            x.academic_institution_name == formValue.value.edit_stu_collegename['academic_institution_name']
          );
        });
        collegeCity = formValue.value.edit_stu_collegecity.split('_', 2);
      }

      let org = [];
      if (
        formValue.value.edit_stu_placedorganization != 'No' &&
        formValue.value.edit_stu_placedorganization != undefined
      ) {
        org = formValue.value.edit_stu_org.split('_', 2);
      }

      console.log(this.editStuDetails);

      let params = {
        id: this.currentUserId,
        firstName: formValue.value.edit_stu_first,
        lastName: formValue.value.edit_stu_last,
        gender: formValue.value.edit_stu_gender,
        dob: moment(formValue.value.edit_stu_dob).format('YYYY-MM-DD'),
        email: formValue.value.edit_stu_email,
        mobile: formValue.value.edit_stu_mobile,
        whatsappNumber: formValue.value.edit_stu_whatsapp,
        password: formValue.value.edit_stu_pswd,
        confirmPassword: formValue.value.edit_stu_cpswd,
        isGraduated: formValue.value.edit_stu_graduated,
        collegeCity: collegeCity[1],
        collegeName: (formValue.value.edit_stu_collegename != undefined && formValue.value.edit_stu_collegename['academic_institution_name'] != undefined) ? formValue.value.edit_stu_collegename['academic_institution_name']: "",
        aadharNumber: formValue.value.edut_stu_aadhar,
        stateId: +state[0],
        state_name: state[1],
        cityId: +currentLoc[0],
        collegeId: collegeInfo != -1 && this.collegeDetails.length > 0 && collegeInfo != undefined ? +this.collegeDetails[collegeInfo].academic_institution_id : null,
        currentLocation: currentLoc[1],
        educationalQualification: formValue.value.edit_stu_qualification,
        graduationPassingYear: formValue.value.edit_stu_year,
        subject: formValue.value.edit_stu_sub,
        profession: formValue.value.edit_stu_profession,
        gttId: this.editStuDetails.gttId,
        roleId: this.editStuDetails.roleId,
        roleName: this.editStuDetails.roleName,
        vaccinationStatus: formValue.value.edit_stu_vaccination,
        termsAndConditions: String(formValue.value.edit_stu_agree),
        caste: formValue.value.edit_stu_caste,
        candidateCategory: '',
        isPlaced: formValue.value.edit_stu_placedorganization,
        placedOrganizationId: +org[0],
        placedOrganization: org[1],
        sector: +this.sector_id,
        sectorName: this.editStuDetails.sector,
        designation: formValue.value.edit_stu_designation,
        joiningMonth: formValue.value.edit_stu_month,
        uploadVaccinationCertificate: this.editStuDetails.uploadVaccinationCertificate,
        active: formValue.value.edit_stu_status == 'Active' ? 1 : 0,
        vaccinationCertificateFileName: this.editStuDetails.uploadVaccinationCertificat,
        status: formValue.value.edit_stu_status,
        insertedby: +this.editStuDetails.insertedBy,
        updatedBy: +this.currentLoginUserId,
        updatedtime: moment().format('YYYY-MM-DD')
      };

      $('.spinner').show();

      this.UsermanagementService.updateUserDetails(
        params,
        this.files
      ).subscribe({
        next: (response) => {
          $('.spinner').hide();
          if (response.status == 'Success') {
            ($('#edit_user_stu_details') as any).modal('hide');
            this.getUserManagementList();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: response.message,
            });
          } else {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: response.data[0],
            });
          }
        },
        error: (response) => {
          $('.spinner').hide();
          if (response.error.status == 'Failed') {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.error.data[0],
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail:
                response.error.message == null
                  ? response.error.error
                  : response.error.message,
            });
          }
        },
      });
    }
  }
}
