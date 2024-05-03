import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StudentModel } from '../../view-models/student-model';
import { StudentService } from '../../services/student.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';

import { stringify } from 'querystring';

@Component({
  selector: 'app-student-add',
  templateUrl: './student-add.component.html',
  styleUrls: ['./student-add.component.css'],
})
export class StudentAddComponent implements OnInit {
  @Input() editStudentDetails: any;
  @Input() cityDetails: any = [];
  @Input() stateDetails: any = [];
  @Input() collegeDetails: any = [];
  @Input() filterCityNameList: any = [];
  @Input() loggedInUserId: number;
  @Input() organizationNameList: any = [];
  @Input() pageNumber: any;
  @Input() showCount: any;
  @Input() terms_and_conditions_url: string;
  @Output() filterCities = new EventEmitter<any>();
  @Output() callParentGetUserManagement = new EventEmitter<any>();
  roles: any = [];
  public stustatus: any;
  public loginmessage: any;
  public successmsg: boolean = true;
  public receivedmessage: string = '';
  userModel = new StudentModel();
  /* Password hide and show */
  show_button: boolean = false;
  show_eye: boolean = false;
  public files: any;
  message: string | undefined;
  public listOfErrors: any = [];
  file: any;
  dateTime = new Date();
  currentYear: number;
  disable = false;
  show_confirmbutton: boolean;
  show_confirmeye: boolean;
  sector_id: number;

  constructor(
    public studentService: StudentService,
    private messageService: MessageService
  ) {
    this.dateTime.setDate(this.dateTime.getDate());
    this.currentYear = new Date().getFullYear();
    this.roles = JSON.parse(localStorage.getItem('roles'));
  }

  ngOnInit(): void { }

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

  getFilterCities(value) {
    this.filterCities.next(value);
  }
  FilterCity(value: any) {
    this.getFilterCities(value);
    this.userModel.currentLocation = '';
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

  getUserManagementList() {
    let paramRoleIds = this.getStuProRoleIds();
    let event = {
      'paramRoleIds': paramRoleIds,
      'pageNumber': this.pageNumber,
      'showCount': this.showCount
    }
    this.callParentGetUserManagement.next(event);
  }

  resetUserStuForm(userStuForm: NgForm) {
    userStuForm.resetForm();
  }

  isGraduated(value) {
    this.userModel.collegeName = '';
    this.userModel.educationalQualification = '';
    this.userModel.subject = '';
    this.userModel.graduationPassingYear = '';
    this.userModel.collegeCity = '';
    this.userModel.profession = '';
  }

  isPlaced(value) {

    if(value == 'Yes'){
      this.getOrganizationList();
    }else{
      this.organizationNameList = [];
    }

    this.userModel.placedOrganization = '';
    this.userModel.sector = '';
    this.userModel.designation = '';
    this.userModel.joiningMonth = '';
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

  /* get College city by college name */
  getCollegeCity(collegeName: any) {
    let collegeInfo = this.collegeDetails.findIndex((x: any) => {
      return x.academic_institution_name == collegeName;
    });
    this.userModel.collegeCity =
      this.collegeDetails[collegeInfo].city != null
        ? this.collegeDetails[collegeInfo].city_id +
        '_' +
        this.collegeDetails[collegeInfo].city
        : '';
  }

  /* Display Sector name by OrgnizationId*/
  getSectorName(orgDetail: any) {
    $('.spinner').show();
    let org = orgDetail.split('_', 2);
    let org_id = org[0];
    this.studentService.getSectorName(org_id).subscribe((response) => {
      $('.spinner').hide();
      if (response.data != null) {
        this.userModel.sector = response.data.industry;
        this.sector_id = response.data.industry_id;
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

  /* Add Student */
  onSubmit(formvalue: any, stuForm: NgForm) {
    if (formvalue.valid == true) {
      let state = this.userModel.stateId.split('_', 2);
      let city = this.userModel.currentLocation.split('_', 2);
      let placedOrganization = this.userModel.placedOrganization.split('_', 2);
      let collegeInfo = '';
      let collegeCity = [];

      if (this.userModel.isGraduated != 'No') {
        collegeInfo = this.collegeDetails.findIndex((x: any) => {
          return x.academic_institution_name == this.userModel.collegeName;
        });
        collegeCity = this.userModel.collegeCity.split('_', 2);
      }

      let params = {
        firstName: this.userModel.firstName,
        lastName: this.userModel.lastName,
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
        collegeId: (collegeInfo != String(-1) && collegeInfo != '' && collegeInfo != null)
          ? String(this.collegeDetails[collegeInfo].academic_institution_id)
          : '',
        currentLocation: city[1],
        isGraduated: this.userModel.isGraduated,
        collegeName: this.userModel.collegeName['academic_institution_name'],
        collegeCity: collegeCity[1],
        educationalQualification: this.userModel.educationalQualification,
        graduationPassingYear: this.userModel.graduationPassingYear,
        subject: this.userModel.subject,
        isPlaced: this.userModel.isPlaced,
        designation: this.userModel.designation,
        joiningMonth: this.userModel.joiningMonth,
        placedOrganizationId: placedOrganization[0],
        placedOrganization: placedOrganization[1],
        sector: this.sector_id,
        sectorName: this.userModel.sector,
        caste: this.userModel.caste,
        vaccinationStatus: this.userModel.vaccinationStatus,
        uploadVaccinationCertificate:
          this.userModel.uploadVaccinationCertificate != null
            ? this.userModel.uploadVaccinationCertificate
            : '',
        termsAndConditions: String(this.userModel.termsAndConditions),
        profession: this.userModel.profession,
        candidateCategory: this.userModel.candidateCategory,
        roleId: '3',
        active: 1,
        insertedby: +this.loggedInUserId
      };

      let files =
        this.files == null || this.files == undefined ? '' : this.files;

      $('.spinner').show();
      this.studentService.addStudent(params, files).subscribe({
        next: (data) => {
          $('.spinner').hide();
          this.stustatus = data.status;
          this.receivedmessage = data.message;
          if (this.stustatus == 'Success') {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: this.receivedmessage,
            });
            ($('#addstudentprofessional') as any).modal('hide');
            this.getUserManagementList();
            this.resetUserStuForm(stuForm);
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
