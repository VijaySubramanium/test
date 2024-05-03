import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UsermanagementService } from 'src/app/services/user-management.service';
import * as FileSaver from 'file-saver';
import { MessageService } from 'primeng/api';
import * as jsPDF from 'jspdf';
import * as xlsx from 'xlsx';
import 'jspdf-autotable';
import { CommonService } from '../common.service';
import { CollegeService } from 'src/app/services/college.service';
import { Table } from 'primeng/table';
import { DatePipe } from '@angular/common';
import mockdata from './mockdata.json';
import * as moment from 'moment';
import { param } from 'jquery';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-analytics-reporting',
  templateUrl: './analytics-reporting.component.html',
  styleUrls: ['./analytics-reporting.component.css'],
  providers: [MessageService, DatePipe],
})
export class AnalyticsReportingComponent implements OnInit {
  loading: boolean = false;
  reportsList: any[];
  rangeDates: Date[];
  startDay: any;
  endDay: any;
  /* Registration Report */
  _registrationReportDefaultColumns: any[];
  _registrationReportDefaultColumnsCopy: any[];
  _registrationReportColumnHeader: any[];
  _registrationReportColumnDataKey: any[];
  _registrationReportColumnTitle: any[];
  selectedUserDetails: any = [];
  public userDetails: any = [];
  _registrationReportColumns: any = [];
  public _registrationReportFilter: any = [];
  exportRegistrationReport: string = 'RegistrationReport';

  /* Project Based Registration Report */
  _projectBasedDefaultColumns: any[];
  _projectBasedDefaultColumnsCopy: any[];
  _projectBasedReportColumnHeader: any[];
  _projectBasedReportColumnDataKey: any[];
  _projectBasedReportColumnTitle: any[];
  selectedProjectBasedDetail: any = [];
  public finalProjectBasedReports: any = [];
  _projectBasedReportColumns: any = [];
  public _projectBasedFilter: any = [];
  exportProjectBased: string = 'ProjectBasedReport';
  _projectBasedManagerList: any[];
  public projectBasedmanager: any = [];
  /* Project Assign Registration Report */
  _projectAssignDefaultColumns: any[];
  _projectAssignDefaultColumnsCopy: any[];
  _projectAssignReportColumnHeader: any[];
  _projectAssignReportColumnDataKey: any[];
  _projectAssignReportColumnTitle: any[];
  selectedProjectAssignDetails: any = [];
  public finalProjectAssignReports: any = [];
  _projectAssignReportColumns: any = [];
  public _projectAssignFilter: any = [];
  exportProjectAssign: string = 'ProjectAssignReport';

  /* ----------------------------- */
  @ViewChild(Table) dt: Table;
  @ViewChild(Table) ct: Table;
  @ViewChild(Table) at: Table;
  // columns: any = [];
  currentTab1: string = 'RegistrationReport';
  currentTab2: string = '';
  currentTab3: string = '';

  rightSideMenus: any = [];

  user: any = '';
  roleDetails: any = [];
  loggedInRoleId: number;
  roles: any = [];

  public loggedInRoleName: string;
  public accessRoleNames: any = [];

  constructor(
    public commonservice: CommonService,
    private titleService: Title,
    public collegeService: CollegeService,
    private UsermanagementService: UsermanagementService,
    private messageService: MessageService,
    private datePipe: DatePipe,
    private router: Router
  ) {
    this._registrationReportDefaultColumns = [
      { field: 'gttId', header: 'Gtt Id' },
      { field: 'firstName', header: 'First Name' },
      { field: 'lastName', header: 'Last Name' },
      { field: 'gender', header: 'Gender' },
      { field: 'fatherName', header: 'Father Name' },
      { field: 'email', header: 'Email' },
      { field: 'mobile', header: 'Mobile' },
      { field: 'status', header: 'Status' },
      { field: 'registerDate', header: 'Register Date' },
    ];
    this._registrationReportDefaultColumnsCopy =
      this._registrationReportDefaultColumns;
    this._registrationReportFilter = [
      'firstName',
      'lastName',
      'email',
      'mobile',
      'status',
      'whatsappNumber',
      'collegeCity',
      'academiciInstitutionName',
      'currentLocation',
      'roleName',
      'pincode',
      'disabilityType',
      'educationalQualification',
      'status',
      'experienceYears',
    ];

    this._projectBasedDefaultColumns = [
      { field: 'gttId', header: 'Gtt Id' },
      { field: 'firstName', header: 'First Name' },
      { field: 'lastName', header: 'Last Name' },
      { field: 'gender', header: 'Gender' },
      { field: 'mobileNumber', header: 'Mobile Number' },
      { field: 'projectName', header: 'Project Name' },
      { field: 'projectManagerName', header: 'Project Manager Name' },
      { field: 'familyIncome', header: 'Family Income' },
      { field: 'knownGTT', header: 'Known about GTT' },
    ];
    this._projectBasedDefaultColumnsCopy = this._projectBasedDefaultColumns;
    this._projectBasedFilter = [
      'gttId',
      'firstName',
      'lastName',
      'gender',
      'emailId',
      'dob',
      'projectName',
      'projectManagerName',
      'mobileNumber',
      'annualIncome',
    ];
    this._projectAssignDefaultColumns = [
      { field: 'gttId', header: 'Gtt Id' },
      { field: 'firstName', header: 'First Name' },
      { field: 'lastName', header: 'Last Name' },
      { field: 'gender', header: 'Gender' },
      { field: 'mobileNumber', header: 'Mobile Number' },
      { field: 'projectName', header: 'Project Name' },
      { field: 'programName', header: 'Program Name' },
      { field: 'courseName', header: 'Course Name' },
      { field: 'projectManagerName', header: 'Project Manager Name' },
      { field: 'trainerName', header: 'Trainer Name' },
    ];
    this._projectAssignDefaultColumnsCopy = this._projectAssignDefaultColumns;
    this._projectAssignFilter = [
      'gttId',
      'firstName',
      'lastName',
      'gender',
      'emailId',
      'dob',
      'projectName',
      'projectManagerName',
      'programName',
      'courseName',
      'batchName',
      'trainerName',
    ];
    /*Profile Name */
    this.user = localStorage.getItem('userId');
    this.roles = JSON.parse(localStorage.getItem('roles'));
    this.roleDetails = [];
    this.roles.forEach((elem, indx) => {
      let roleName = elem.role_name
        .replace(/\w+/g, function (txt) {
          return txt.toUpperCase();
        })
        .replace(/\s/g, '_');
      if (
        !['ROLE_ADMIN', 'STUDENT', 'PROFESSIONAL'].includes(roleName.trim())
      ) {
        this.roleDetails.push(elem);
      }
    });

    this.loggedInRoleId = JSON.parse(this.user).user_role.role_id;
    let loggedInRoleName = JSON.parse(this.user).user_role.role;
    this.loggedInRoleName = loggedInRoleName
      .replace(/\w+/g, function (txt) {
        return txt.toUpperCase();
      })
      .replace(/\s/g, '_');

    this.accessRoleNames = ['GTT_ADMIN', 'PROJECT_MANAGER'];
  }

  ngOnInit(): void {
    this.loading = true;
    this.getRegistrationReport();
    this.getRegistrationProjectBasedReport();
    this.setTitle('TJM-Reports');
  }
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
  analyticalReports($event: any) {
    if (!$event.index) {
      this.currentTab1 = 'RegistrationReport';
      this.currentTab2 = '';
      this.currentTab3 = '';
      $('#inlineRadio_student1').trigger('click');
    } else if ($event.index == 1) {
      this.currentTab2 = 'ProjectBasedRegistrationReports';
      this.currentTab1 = '';
      this.currentTab3 = '';
      $('#inlineRadio_coor1').trigger('click');
    } else if ($event.index == 2) {
      this.currentTab3 = 'ProjectAssignedReports';
      this.currentTab1 = '';
      this.currentTab2 = '';
      $('#inlineRadio_admin1').trigger('click');
    }
  }

  /* ================================================ Registration Report Start ================================================ */

  getRegistrationProjectBasedReport() {
    $('.spinner').show();
    this.loading = true;
    let studpro = [3, 14];
    this.UsermanagementService.getUserProjectAnalyticsBasedDetailReports(
      studpro
    ).subscribe({
      next: (response) => {
        $('.spinner').hide();
        this.loading = false;
        if (response.status == 'Success') {
          if (response.data != null) {
            this.reportsList = response.data;
          }
          this.getProjectBasedRegistrationReport('ALL');
          this.getProjectAssignRegistrationReport('ALL');
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
  resetRegistrationReport() {
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }
  onSelect() {
    this.startDay = moment(this.rangeDates[0]).format('YYYY-MM-DD');
    this.endDay = moment(this.rangeDates[1]).format('YYYY-MM-DD');

    debugger
    let params = {
      startDate: this.startDay,
      endDate: this.endDay,
    };
    if (this.startDay != 'Invalid date' && this.endDay != 'Invalid date') {
      $('.spinner').show();
      this.UsermanagementService.getUserByDateFilter(params).subscribe({
        next: (response) => {
          $('.spinner').hide();
          if (response.status == 'Success') {
            if (response.data != null) {
              this.reportsList = response.data;
              this.userDetails = [];
              response.data.forEach((elem: any, index: any) => {
                this.userDetails.push({
                  gttId: elem.gttid,
                  firstName: elem.firstname,
                  lastName: elem.lastname,
                  gender: elem.gender,
                  registerDate:
                    elem.Registerdate != null && elem.Registerdate != ''
                      ? moment(elem.Registerdate).format('YYYY-MM-DD')
                      : '',
                  dob: elem.DOB,
                  maritalStatus: elem.maritalStatus,
                  email: elem.email,
                  mobile: elem.mobile,
                  whatsappNumber: elem.whatsappnumber,
                  password: elem.password,
                  confirmPassword: elem.confirmpassword,
                  roleName: elem.rolename,
                  isGraduated: elem.isgraduated,
                  academiciInstitutionName: elem.collegename,
                  aadharNumber: elem.aadharnumber,
                  currentEducationalQualification:
                    elem.educationalqualification,
                  graduationPassingYear: elem.graduationpassingyear,
                  collegeName: elem.collegename,
                  collegeShortName: elem.collegeshortname,
                  addressLine: elem.addressline,
                  collegeCity: elem.collegecityname,
                  state: elem.statename,
                  TPOName:
                    elem.TPOfirstname != null
                      ? elem.TPOfirstname + ' ' + elem.TPOlastname
                      : '',
                  TPOMobile: elem.TPOmobile,
                  TPOEmail: elem.TPOemail,
                  KAMName:
                    elem.KAMfirstname != null
                      ? elem.KAMfirstname + ' ' + elem.KAMlastname
                      : '',
                  subject: elem.subject_stream,
                  profession: elem.profession,
                  currentLocation: elem.currentlocation,
                  isPlaced: elem.isplaced,
                  vaccinationStatus: elem.vaccination_status,
                  vaccinationCertificate: elem.upload_VC,
                  vaccinationCertificateName:
                    elem.vaccinationcertificatefilename,
                  caste: elem.caste,
                  placedOrganization: elem.placed_organization,
                  designation: elem.designation,
                  joiningMonth: elem.joining_month,
                  postalAddress: elem.postaladdress,
                  pursuingPostGraduate: elem.pursuing_postgraduate,
                  postGraduationQualification:
                    elem.postqraduation_qualification,
                  postGraduationPassingYear: elem.postgraduationpassingyear,
                  postGraduationInstitution: elem.postgraduation_institution,
                  alternateNumber: elem.alternatenumber,
                  fatherName: elem.fathersname,
                  motherName: elem.mothername,
                  guardianName: elem.guardiansname,
                  disabilityType: elem.disabilitytype,
                  percentageMarks: elem.percentage_marks,
                  languageKnown: elem.languageknown,
                  isExperience: elem.isexperience,
                  experienceYears: elem.experience_years,
                  employer1: elem.employer1,
                  employer2: elem.employer2,
                  droppedStatus: elem.droppedstatus,
                  status: elem.status,
                  placedStatus: elem.placed,
                });
              });
              var result = Object.keys(this.userDetails[0]).map(function (
                key: string
              ) {
                return key;
              });
              let headerName = '';
              result.forEach((elem: any, key: any) => {
                headerName = this.headerCaseString(elem);
                if (elem == 'disabilityPercent') {
                  headerName = 'Disability %';
                } else if (elem == 'percentage/marks') {
                  headerName = '% Marks';
                } else if (elem == 'dob') {
                  headerName = 'DOB';
                } else if (elem == 'isGraduated') {
                  headerName = 'Graduated';
                } else if (elem == 'subject') {
                  headerName = 'Subject Stream';
                } else if (elem == 'isPlaced') {
                  headerName = 'Are you placed in any organization?';
                }

                if (
                  elem != 'panNumber' &&
                  elem != 'disabilityPercent' &&
                  elem != 'candidateCategory' &&
                  elem != 'termsAndConditions' &&
                  elem != 'roleId' &&
                  elem != 'active' &&
                  elem != 'projectId'
                ) {
                  this._registrationReportColumns.push({
                    field: elem,
                    header: headerName,
                  });
                }
              });

              this._registrationReportColumnHeader =
                this._registrationReportColumns;
              this._registrationReportColumnTitle =
                this._registrationReportColumnHeader.map((col) => ({
                  title: col.header,
                  dataKey: col.field,
                }));

              this._registrationReportColumnDataKey =
                this._registrationReportColumnHeader.map((col) => ({
                  dataKey: col.field,
                }));
            }
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
  }

  getRegistrationReport() {
    $('.spinner').show();
    let studpro = [3, 14];
    this.UsermanagementService.getUserDetailReports(studpro).subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.status == 'Success') {
          if (response.data != null) {
            this.reportsList = response.data;
            this.userDetails = [];
            response.data.forEach((elem: any, index: any) => {
              this.userDetails.push({
                gttId: elem.gttid,
                firstName: elem.firstname,
                lastName: elem.lastname,
                gender: elem.gender,
                registerDate:
                  elem.Registerdate != null && elem.Registerdate != ''
                    ? moment(elem.Registerdate).format('YYYY-MM-DD')
                    : '',
                dob: elem.DOB,
                maritalStatus: elem.maritalStatus,
                email: elem.email,
                mobile: elem.mobile,
                whatsappNumber: elem.whatsappnumber,
                password: elem.password,
                confirmPassword: elem.confirmpassword,
                roleName: elem.rolename,
                isGraduated: elem.isgraduated,
                academiciInstitutionName: elem.collegename,
                aadharNumber: elem.aadharnumber,
                currentEducationalQualification: elem.educationalqualification,
                graduationPassingYear: elem.graduationpassingyear,
                collegeName: elem.collegename,
                collegeShortName: elem.collegeshortname,
                addressLine: elem.addressline,
                collegeCity: elem.collegecityname,
                state: elem.statename,
                TPOName:
                  elem.TPOfirstname != null
                    ? elem.TPOfirstname + ' ' + elem.TPOlastname
                    : '',
                TPOMobile: elem.TPOmobile,
                TPOEmail: elem.TPOemail,
                KAMName:
                  elem.KAMfirstname != null
                    ? elem.KAMfirstname + ' ' + elem.KAMlastname
                    : '',
                subject: elem.subject_stream,
                profession: elem.profession,
                currentLocation: elem.currentlocation,
                isPlaced: elem.isplaced,
                vaccinationStatus: elem.vaccination_status,
                vaccinationCertificate: elem.upload_VC,
                vaccinationCertificateName: elem.vaccinationcertificatefilename,
                caste: elem.caste,
                placedOrganization: elem.placed_organization,
                designation: elem.designation,
                joiningMonth: elem.joining_month,
                postalAddress: elem.postaladdress,
                pursuingPostGraduate: elem.pursuing_postgraduate,
                postGraduationQualification: elem.postqraduation_qualification,
                postGraduationPassingYear: elem.postgraduationpassingyear,
                postGraduationInstitution: elem.postgraduation_institution,
                alternateNumber: elem.alternatenumber,
                fatherName: elem.fathersname,
                motherName: elem.mothername,
                guardianName: elem.guardiansname,
                disabilityType: elem.disabilitytype,
                percentageMarks: elem.percentage_marks,
                languageKnown: elem.languageknown,
                isExperience: elem.isexperience,
                experienceYears: elem.experience_years,
                employer1: elem.employer1,
                employer2: elem.employer2,
                droppedStatus: elem.droppedstatus,
                status: elem.status,
                placedStatus: elem.placed,
              });
            });
            var result = Object.keys(this.userDetails[0]).map(function (
              key: string
            ) {
              return key;
            });
            let headerName = '';
            result.forEach((elem: any, key: any) => {
              headerName = this.headerCaseString(elem);
              if (elem == 'disabilityPercent') {
                headerName = 'Disability %';
              } else if (elem == 'percentage/marks') {
                headerName = '% Marks';
              } else if (elem == 'dob') {
                headerName = 'DOB';
              } else if (elem == 'isGraduated') {
                headerName = 'Graduated';
              } else if (elem == 'subject') {
                headerName = 'Subject Stream';
              } else if (elem == 'isPlaced') {
                headerName = 'Are you placed in any organization?';
              }

              if (
                elem != 'panNumber' &&
                elem != 'disabilityPercent' &&
                elem != 'candidateCategory' &&
                elem != 'termsAndConditions' &&
                elem != 'roleId' &&
                elem != 'active' &&
                elem != 'projectId'
              ) {
                this._registrationReportColumns.push({
                  field: elem,
                  header: headerName,
                });
              }
            });

            this._registrationReportColumnHeader =
              this._registrationReportColumns;
            this._registrationReportColumnTitle =
              this._registrationReportColumnHeader.map((col) => ({
                title: col.header,
                dataKey: col.field,
              }));

            this._registrationReportColumnDataKey =
              this._registrationReportColumnHeader.map((col) => ({
                dataKey: col.field,
              }));
          }
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

  @Input() get registrationReportColumns(): any[] {
    return this._registrationReportDefaultColumns;
  }

  set registrationReportColumns(val: any[]) {
    this._registrationReportDefaultColumns =
      this._registrationReportColumnHeader.filter((col) => val.includes(col));
  }

  registrationFilter($event: any) {
    if ($event.value.length == 0) {
      this._registrationReportDefaultColumns =
        this._registrationReportDefaultColumnsCopy;
    } else {
      this._registrationReportDefaultColumns = $event.value;
    }
  }

  exportRegistrationExcel() {
    let stuProExcelDetails: any = [];
    let columnsdata: any = [];

    this.selectedUserDetails.forEach((elem, inx) => {
      if (!stuProExcelDetails.hasOwnProperty(inx)) {
        stuProExcelDetails[inx] = {};
      }
      this._registrationReportDefaultColumns.forEach((elm, indx) => {
        stuProExcelDetails[inx][elm.field] =
          elem[elm.field] != null || elem[elm.field] != undefined
            ? elem[elm.field].toString()
            : null;
      });
    });

    if (this.selectedUserDetails.length == 0) {
      this._registrationReportDefaultColumns.forEach((elm, indx) => {
        columnsdata[elm.header] = '';
      });
      stuProExcelDetails.push(columnsdata);
    }

    const worksheet = xlsx.utils.json_to_sheet(stuProExcelDetails);
    const workbook = { Sheets: { 'Registration-Report': worksheet }, SheetNames: ['Registration-Report'] };
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'Registration-Report');
  }

  exportRegistrationPDF(dt: any) {
    var doc: any = new jsPDF.default('p', 'pt', 'a0', true);
    this._registrationReportColumnTitle = [];

    Object.keys(this._registrationReportDefaultColumns).forEach((key) => {
      this._registrationReportColumnTitle.push({
        title: this._registrationReportDefaultColumns[key].header,
        dataKey: this._registrationReportDefaultColumns[key].field,
      });
    });

    doc.autoTable(
      this._registrationReportColumnTitle,
      this.selectedUserDetails,
      {
        bodyStyles: { valign: 'middle' },
        styles: { overflow: 'linebreak', columnWidth: '1000' },
        columnStyles: {
          text: {
            cellWidth: 'wrap',
          },
          description: {
            cellWidth: '107',
          },
        },
      }
    );
    doc.save('Registration-Report.pdf');
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }
  /* ================================================ Registration Report End ================================================ */

  /* ================================================ Project Based Registration Reports Start ================================================ */
  getProjectBasedRegistrationReport($event: any) {
    var managername = $event;
    if (this.reportsList != null) {
      let projectBasedReportArray = [];
      this.reportsList.map((x) => {
        let projectList = '';
        let projectAddtionalFields = x.projectAddtionalFields;

        if (projectAddtionalFields != 0) {
          for (let i = 0; i < projectAddtionalFields.length; i += 1) {
            projectList = projectAddtionalFields[i].fields;
            const data = {
              user: x.user,
              projectinfos: x.projectAddtionalFields,
              fields: projectList,
            };
            projectBasedReportArray.push(data);
          }
        } else {
          const data = {
            user: x.user,
            projectinfos: x.projectAddtionalFields,
            fields: [],
          };
          projectBasedReportArray.push(data);
        }
      });
      let projectBasedReports = [];
      projectBasedReportArray.forEach((elem: any, index: any) => {
        projectBasedReports.push({
          gttId: elem.user.gttId,
          firstName: elem.user.firstName,
          lastName: elem.user.lastName,
          gender: elem.user.gender,
          dob: elem.user.dob,
          email: elem.user.email,
          mobile: elem.user.mobile,
          projectname: elem.projectinfos.map((y) => {
            return y.projectname;
          }),
          projectmanagername: elem.projectinfos.map((y) => {
            return y.projectmanagername;
          }),
          postalAddress: elem.user.postalAddress,
          AreyoupursuingPostGraduation: elem.user.pursuingPostGraduate,
          // PGQualification: elem.user.postGraduationQualification,
          // PGPassingYear: elem.user.postGraduationPassingYear,
          fatherName: elem.user.fatherName,
          motherName: elem.user.motherName,
          guardianName: elem.user.guardianName,
          pincode: elem.user.pincode,
          UGQualification: elem.user.educationalQualification,
          UGPassingYear: elem.user.graduationPassingYear,

          // UGPassingYear: elem.fields.filter(function (el) {
          //   return el.documentFieldName == 'UG Passing Year';
          // }),
          PGQualification: elem.fields.filter(function (el) {
            return el.documentFieldName == 'PG Qualification';
          }),
          PGPassingYear: elem.fields.filter(function (el) {
            return el.documentFieldName == 'Passing Year';
          }),
          FamilyIncome: elem.fields.filter(function (el) {
            return el.documentFieldName == 'Family Income';
          }),
          RationCardNo: elem.fields.filter(function (el) {
            return el.documentFieldName == 'Ration Card No';
          }),
          RationCardColor: elem.fields.filter(function (el) {
            return el.documentFieldName == 'Ration Card Color';
          }),
          IncomeMentionedinRationcard: elem.fields.filter(function (el) {
            return el.documentFieldName == 'Income Mentioned in Ration card';
          }),
          MainEarningMemberofFamily: elem.fields.filter(function (el) {
            return el.documentFieldName == 'Main Earning Member of Family';
          }),
          OccupationofthemainearningoftheFamily: elem.fields.filter(function (
            el
          ) {
            return (
              el.documentFieldName ==
              'Occupation of the main earning of the Family'
            );
          }),
          AnnualIncome: elem.fields.filter(function (el) {
            return el.documentFieldName == 'Annual Income';
          }),
          IncomeProofValidity: elem.fields.filter(function (el) {
            return el.documentFieldName == 'Income Proof Validity';
          }),
          Passport: elem.fields.filter(function (el) {
            return el.documentFieldName == 'Passport Size Photo';
          }),
          TenthMarksheet: elem.fields.filter(function (el) {
            return el.documentFieldName == '10th Marksheet';
          }),
          TwelthMarksheet: elem.fields.filter(function (el) {
            return el.documentFieldName == '12th Marksheet';
          }),
          UGMarksheet: elem.fields.filter(function (el) {
            return el.documentFieldName == 'UG Marksheet';
          }),
          PGMarksheet: elem.fields.filter(function (el) {
            return el.documentFieldName == 'PG Marksheet';
          }),
          IDProof: elem.fields.filter(function (el) {
            return el.documentFieldName == 'Id Proof(Aadhar)';
          }),
          UpdatedResume: elem.fields.filter(function (el) {
            return el.documentFieldName == 'Updated Resume';
          }),
          LOI: elem.fields.filter(function (el) {
            return el.documentFieldName == 'LOI';
          }),
          IncomeProof: elem.fields.filter(function (el) {
            return el.documentFieldName == 'Income Proof';
          }),
          Pan: elem.fields.filter(function (el) {
            return el.documentFieldName == 'Pan';
          }),
          RationCard: elem.fields.filter(function (el) {
            return el.documentFieldName == 'Ration Card';
          }),
          CasteCertificate: elem.fields.filter(function (el) {
            return el.documentFieldName == 'Caste Certificate';
          }),
          KnownaboutGTT: elem.fields.filter(function (el) {
            return el.documentFieldName == 'How you come to know about GTT?';
          }),
        });
      });
      this.finalProjectBasedReports = [];

      projectBasedReports.forEach((elem: any, index: any) => {
        this.finalProjectBasedReports.push({
          gttId: elem.gttId,
          firstName: elem.firstName,
          lastName: elem.lastName,
          gender: elem.gender,
          dob: elem.dob,
          emailId: elem.email,
          mobileNumber: elem.mobile,
          fatherName: elem.fatherName,
          motherName: elem.motherName,
          guardianName: elem.guardianName,
          postalAddress: elem.postalAddress,
          pinCode: elem.pincode,

          tenthMarkSheet: !elem.TenthMarksheet.length
            ? ''
            : (elem.TenthMarksheet[0]?.verificationStatus == 'Yet to verify'
                ? 'Yet to verify'
                : elem.TenthMarksheet[0]?.verificationStatus == 'Yes'
                ? 'Valid'
                : 'Not Valid') +
              '-' +
              (elem.TenthMarksheet[0]?.documentValue == null
                ? ''
                : elem.TenthMarksheet[0]?.documentValue),

          twelthMarkSheet: !elem.TwelthMarksheet.length
            ? ''
            : (elem.TwelthMarksheet[0]?.verificationStatus == 'Yet to verify'
                ? 'Yet to verify'
                : elem.TwelthMarksheet[0]?.verificationStatus == 'Yes'
                ? 'Valid'
                : 'Not Valid') +
              '-' +
              (elem.TwelthMarksheet[0]?.documentValue == null
                ? ''
                : elem.TwelthMarksheet[0]?.documentValue),
          ugQualification: elem.UGQualification,
          ugMarkSheet: !elem.UGMarksheet.length
            ? ''
            : (elem.UGMarksheet[0]?.verificationStatus == 'Yet to verify'
                ? 'Yet to verify'
                : elem.UGMarksheet[0]?.verificationStatus == 'Yes'
                ? 'Valid'
                : 'Not Valid') +
              '-' +
              (elem.UGMarksheet[0]?.documentValue == null
                ? ''
                : elem.UGMarksheet[0]?.documentValue),
          ugPassingYear: elem.UGPassingYear,
          pursuingPG: elem.AreyoupursuingPostGraduation,
          // pgQualification: elem.PGQualification,

          pgQualification: elem.PGQualification[0]?.documentValue,
          pgMarkSheet: !elem.PGMarksheet.length
            ? ''
            : (elem.PGMarksheet[0]?.verificationStatus == 'Yet to verify'
                ? 'Yet to verify'
                : elem.PGMarksheet[0]?.verificationStatus == 'Yes'
                ? 'Valid'
                : 'Not Valid') +
              '-' +
              (elem.PGMarksheet[0]?.documentValue == null
                ? ''
                : elem.PGMarksheet[0]?.documentValue),
          pgPassingYear: elem.PGPassingYear[0]?.documentValue,

          mainEarningMember: !elem.MainEarningMemberofFamily.length
            ? ''
            : (elem.MainEarningMemberofFamily[0]?.verificationStatus ==
              'Yet to verify'
                ? 'Yet to verify'
                : elem.MainEarningMemberofFamily[0]?.verificationStatus == 'Yes'
                ? 'Valid'
                : 'Not Valid') +
              '-' +
              (elem.MainEarningMemberofFamily[0]?.documentValue == null
                ? ''
                : elem.MainEarningMemberofFamily[0]?.documentValue),

          occupationMainEarningMember: !elem
            .OccupationofthemainearningoftheFamily.length
            ? ''
            : (elem.OccupationofthemainearningoftheFamily[0]
                ?.verificationStatus == 'Yet to verify'
                ? 'Yet to verify'
                : elem.OccupationofthemainearningoftheFamily[0]
                    ?.verificationStatus == 'Yes'
                ? 'Valid'
                : 'Not Valid') +
              '-' +
              (elem.OccupationofthemainearningoftheFamily[0]?.documentValue ==
              null
                ? ''
                : elem.OccupationofthemainearningoftheFamily[0]?.documentValue),

          familyIncome: elem.FamilyIncome[0]?.documentValue,
          annualIncome: elem.AnnualIncome[0]?.documentValue,
          incomeProof: !elem.IncomeProof.length
            ? ''
            : (elem.IncomeProof[0]?.verificationStatus == 'Yet to verify'
                ? 'Yet to verify'
                : elem.IncomeProof[0]?.verificationStatus == 'Yes'
                ? 'Valid'
                : 'Not Valid') +
              '-' +
              (elem.IncomeProof[0]?.documentValue == null
                ? ''
                : elem.IncomeProof[0]?.documentValue),

          incomeProofValidity: !elem.IncomeProofValidity.length
            ? ''
            : (elem.IncomeProofValidity[0]?.verificationStatus ==
              'Yet to verify'
                ? 'Yet to verify'
                : elem.IncomeProofValidity[0]?.verificationStatus == 'Yes'
                ? 'Valid'
                : 'Not Valid') +
              '-' +
              (elem.IncomeProofValidity[0]?.documentValue == null
                ? ''
                : elem.IncomeProofValidity[0]?.documentValue),

          panCard: !elem.Pan.length
            ? ''
            : (elem.Pan[0]?.verificationStatus == 'Yet to verify'
                ? 'Yet to verify'
                : elem.Pan[0]?.verificationStatus == 'Yes'
                ? 'Valid'
                : 'Not Valid') +
              '-' +
              (elem.Pan[0]?.documentValue == null
                ? ''
                : elem.Pan[0]?.documentValue),

          knownGTT: !elem.KnownaboutGTT.length
            ? ''
            : (elem.KnownaboutGTT[0]?.verificationStatus == 'Yet to verify'
                ? 'Yet to verify'
                : elem.KnownaboutGTT[0]?.verificationStatus == 'Yes'
                ? 'Valid'
                : 'Not Valid') +
              '-' +
              (elem.KnownaboutGTT[0]?.documentValue == null
                ? ''
                : elem.KnownaboutGTT[0]?.documentValue),

          CasteCertificate: !elem.CasteCertificate.length
            ? ''
            : (elem.CasteCertificate[0]?.verificationStatus == 'Yet to verify'
                ? 'Yet to verify'
                : elem.CasteCertificate[0]?.verificationStatus == 'Yes'
                ? 'Valid'
                : 'Not Valid') +
              '-' +
              (elem.CasteCertificate[0]?.documentValue == null
                ? ''
                : elem.CasteCertificate[0]?.documentValue),

          aadharIdProof: !elem.IDProof.length
            ? ''
            : (elem.IDProof[0]?.verificationStatus == 'Yet to verify'
                ? 'Yet to verify'
                : elem.IDProof[0]?.verificationStatus == 'Yes'
                ? 'Valid'
                : 'Not Valid') +
              '-' +
              (elem.IDProof[0]?.documentValue == null
                ? ''
                : elem.IDProof[0]?.documentValue),

          rationCard: !elem.RationCard.length
            ? ''
            : (elem.RationCard[0]?.verificationStatus == 'Yet to verify'
                ? 'Yet to verify'
                : elem.RationCard[0]?.verificationStatus == 'Yes'
                ? 'Valid'
                : 'Not Valid') +
              '-' +
              (elem.RationCard[0]?.documentValue == null
                ? ''
                : elem.RationCard[0]?.documentValue),

          rationCardNumber: !elem.RationCardNo.length
            ? ''
            : (elem.RationCardNo[0]?.verificationStatus == 'Yet to verify'
                ? 'Yet to verify'
                : elem.RationCardNo[0]?.verificationStatus == 'Yes'
                ? 'Valid'
                : 'Not Valid') +
              '-' +
              (elem.RationCardNo[0]?.documentValue == null
                ? ''
                : elem.RationCardNo[0]?.documentValue),

          rationCardColor: !elem.RationCardColor.length
            ? ''
            : (elem.RationCardColor[0]?.verificationStatus == 'Yet to verify'
                ? 'Yet to verify'
                : elem.RationCardColor[0]?.verificationStatus == 'Yes'
                ? 'Valid'
                : 'Not Valid') +
              '-' +
              (elem.RationCardColor[0]?.documentValue == null
                ? ''
                : elem.RationCardColor[0]?.documentValue),

          incomeMentionedInRationCard: !elem.IncomeMentionedinRationcard.length
            ? ''
            : (elem.IncomeMentionedinRationcard[0]?.verificationStatus ==
              'Yet to verify'
                ? 'Yet to verify'
                : elem.IncomeMentionedinRationcard[0]?.verificationStatus ==
                  'Yes'
                ? 'Valid'
                : 'Not Valid') +
              '-' +
              (elem.IncomeMentionedinRationcard[0]?.documentValue == null
                ? ''
                : elem.IncomeMentionedinRationcard[0]?.documentValue),

          photo: !elem.Passport.length
            ? ''
            : (elem.Passport[0]?.verificationStatus == 'Yet to verify'
                ? 'Yet to verify'
                : elem.Passport[0]?.verificationStatus == 'Yes'
                ? 'Valid'
                : 'Not Valid') +
              '-' +
              (elem.Passport[0]?.documentValue == null
                ? ''
                : elem.Passport[0]?.documentValue),

          updatedResume: !elem.UpdatedResume.length
            ? ''
            : (elem.UpdatedResume[0]?.verificationStatus == 'Yet to verify'
                ? 'Yet to verify'
                : elem.UpdatedResume[0]?.verificationStatus == 'Yes'
                ? 'Valid'
                : 'Not Valid') +
              '-' +
              (elem.UpdatedResume[0]?.documentValue == null
                ? ''
                : elem.UpdatedResume[0]?.documentValue),

          LOI: !elem.LOI.length
            ? ''
            : (elem.LOI[0]?.verificationStatus == 'Yet to verify'
                ? 'Yet to verify'
                : elem.LOI[0]?.verificationStatus == 'Yes'
                ? 'Valid'
                : 'Not Valid') +
              '-' +
              (elem.LOI[0]?.documentValue == null
                ? ''
                : elem.LOI[0]?.documentValue),

          projectName: elem.projectname[0],
          projectManagerName: elem.projectmanagername[0],
        });
      });

      var projectManager = this.finalProjectBasedReports.map((data) => {
        if (data.projectManagerName != 0) {
          return data.projectManagerName;
        }
      });
      var managerdata = projectManager.filter(function (element) {
        return element !== undefined;
      });
      let managerArray = managerdata.flat();

      let projectManagerList = [...new Set(managerArray)];

      let projectarrays = [];
      if (managername == 'ALL') {
        this.finalProjectBasedReports;
      } else {
        this.finalProjectBasedReports.map((project) => {
          let data = project.projectManagerName?.includes(managername);
          if (data == true) {
            return projectarrays.push(project);
          }
        });
        this.finalProjectBasedReports = projectarrays;
      }

      var result = Object.keys(this.finalProjectBasedReports[0]).map(function (
        key: string
      ) {
        return key;
      });

      let headerName = '';
      result.forEach((elem: any, key: any) => {
        headerName = this.headerCaseString(elem);
        if (elem == 'dob') {
          headerName = 'DOB';
        } else if (elem == 'tenthMarkSheet') {
          headerName = '10th MarkSheet';
        } else if (elem == 'twelthMarkSheet') {
          headerName = '12th MarkSheet';
        } else if (elem == 'ugMarkSheet') {
          headerName = 'UG MarkSheet';
        } else if (elem == 'pgMarkSheet') {
          headerName = 'PG MarkSheet';
        } else if (elem == 'ugQualification') {
          headerName = 'UG Qualification';
        } else if (elem == 'pgQualification') {
          headerName = 'PG Qualification';
        } else if (elem == 'pursuingPG') {
          headerName = 'Pursuing PG';
        } else if (elem == 'knownGTT') {
          headerName = 'Known about GTT';
        }

        if (
          elem != 'panNumber' &&
          elem != 'disabilityPercent' &&
          elem != 'candidateCategory' &&
          elem != 'placedStatus' &&
          elem != 'droppedStatus' &&
          elem != 'termsAndConditions' &&
          elem != 'roleId' &&
          elem != 'active' &&
          elem != 'projectId'
        ) {
          this._projectBasedReportColumns.push({
            field: elem,
            header: headerName,
          });
        }
      });

      this.projectBasedmanager = projectManagerList;

      this._projectBasedReportColumnHeader = this._projectBasedReportColumns;
      this._projectBasedReportColumnTitle =
        this._projectBasedReportColumnHeader.map((col) => ({
          title: col.header,
          dataKey: col.field,
        }));

      this._projectBasedReportColumnDataKey =
        this._projectBasedReportColumnHeader.map((col) => ({
          dataKey: col.field,
        }));
    }
  }

  @Input() get projectBasedRegistrationColumns(): any[] {
    return this._projectBasedDefaultColumns;
  }

  set projectBasedRegistrationColumns(val: any[]) {
    this._projectBasedDefaultColumns =
      this._projectBasedReportColumnHeader.filter((col) => val.includes(col));
  }

  @Input() get projectBasedProjectManager(): any[] {
    return this._projectBasedDefaultColumns;
  }

  set projectBasedProjectManager(val: any[]) {
    this._projectBasedDefaultColumns = this._projectBasedManagerList.filter(
      (col) => val.includes(col)
    );
  }

  projectBasedFilter($event: any) {
    var result = $event.value.reduce((unique, o) => {
      if (
        !unique.some((obj) => obj.field === o.field && obj.header === o.header)
      ) {
        unique.push(o);
      }
      return unique;
    }, []);

    if ($event.value.length == 0) {
      this._projectBasedDefaultColumns = this._projectBasedDefaultColumnsCopy;
    } else {
      this._projectBasedDefaultColumns = result;
    }
  }

  exportProjectBasedExcel() {
    let projectBasedExcelDetails: any = [];
    let projectColumnsData: any = [];

    this.selectedProjectBasedDetail.forEach((elem, inx) => {
      if (!projectBasedExcelDetails.hasOwnProperty(inx)) {
        projectBasedExcelDetails[inx] = {};
      }
      this._projectBasedDefaultColumns.forEach((elm, indx) => {
        projectBasedExcelDetails[inx][elm.field] =
          elem[elm.field] != null || elem[elm.field] != undefined
            ? elem[elm.field].toString()
            : null;
      });
    });

    if (this.selectedProjectBasedDetail.length == 0) {
      this._projectBasedDefaultColumns.forEach((elm, indx) => {
        projectColumnsData[elm.header] = '';
      });
      projectBasedExcelDetails.push(projectColumnsData);
    }

    const worksheet = xlsx.utils.json_to_sheet(projectBasedExcelDetails);
    const workbook = { Sheets: { 'ProjectBased-Report': worksheet }, SheetNames: ['ProjectBased-Report'] };
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'ProjectBased-Report');
  }

  exportProjectBasedPDF(dt: any) {
    var doc: any = new jsPDF.default('p', 'pt', 'a0', true);

    this._projectBasedReportColumnTitle = [];

    Object.keys(this._projectBasedDefaultColumns).forEach((key) => {
      this._projectBasedReportColumnTitle.push({
        title: this._projectBasedDefaultColumns[key].header,
        dataKey: this._projectBasedDefaultColumns[key].field,
      });
    });

    doc.autoTable(
      this._projectBasedReportColumnTitle,
      this.selectedProjectBasedDetail,
      {
        bodyStyles: { valign: 'middle' },
        styles: { overflow: 'linebreak', columnWidth: '1000' },
        columnStyles: {
          text: {
            cellWidth: 'wrap',
          },
          description: {
            cellWidth: '107',
          },
        },
      }
    );
    doc.save('ProjectBased-Report.pdf');
  }
  /* ================================================ Project Based Registration Reports End ================================================ */
  /* ================================================ Project Assign Registration Reports Start ================================================ */
  getProjectAssignRegistrationReport($event: any) {
    var managername = $event;

    if (this.reportsList != null) {
      let projectAssignReportArray = [];
      this.reportsList.map((x) => {
        let projectList = '';
        let projectAddtionalFields = x.projectAddtionalFields;

        if (projectAddtionalFields != 0) {
          for (let i = 0; i < projectAddtionalFields.length; i += 1) {
            projectList = projectAddtionalFields[i].fields;
            const data = {
              user: x.user,
              projectinfos: x.projectAddtionalFields,
              fields: projectList,
            };
            projectAssignReportArray.push(data);
          }
        }
      });
      let projectAssignReports = [];
      projectAssignReports = [];
      projectAssignReportArray.forEach((elem: any, index: any) => {
        projectAssignReports.push({
          gttId: elem.user.gttId,
          firstName: elem.user.firstName,
          lastName: elem.user.lastName,
          gender: elem.user.gender,
          dob: elem.user.dob,
          email: elem.user.email,
          mobile: elem.user.mobile,
          fatherName: elem.user.fatherName,
          motherName: elem.user.motherName,
          guardianName: elem.user.guardianName,
          postalAddress: elem.user.postalAddress,
          pincode: elem.user.pincode,
          projectname: elem.projectinfos.map((y) => {
            return y.projectname;
          }),
          projectmanagername: elem.projectinfos.map((y) => {
            return y.projectmanagername;
          }),
          programname: elem.projectinfos.map((y) => {
            return y.programname;
          }),
          batchname: elem.projectinfos.map((y) => {
            return y.batchname;
          }),
          coursename: elem.projectinfos.map((y) => {
            return y.coursename;
          }),
          trainername: elem.projectinfos.map((y) => {
            return y.trainername;
          }),
          trainercoordinatorname: elem.projectinfos.map((y) => {
            return y.trainercoordinatorname;
          }),
          KnownaboutGTT: elem.fields.filter(function (el) {
            return el.documentFieldName == 'How you come to know about GTT?';
          }),
          AreyoupursuingPostGraduation: elem.fields.filter(function (el) {
            return el.documentFieldName == 'Are you pursuing Post Graduation?';
          }),
          PGQualification: elem.fields.filter(function (el) {
            return el.documentFieldName == 'PG Qualification?';
          }),
          PassingYear: elem.fields.filter(function (el) {
            return el.documentFieldName == 'Passing Year?';
          }),
          UGQualification: elem.fields.filter(function (el) {
            return el.documentFieldName == 'UG Qualification';
          }),
          IncomeMentionedinRationcard: elem.fields.filter(function (el) {
            return el.documentFieldName == 'Income Mentioned in Ration card';
          }),
          MainEarningMemberofFamily: elem.fields.filter(function (el) {
            return el.documentFieldName == 'Main Earning Member of Family';
          }),
          OccupationofthemainearningoftheFamily: elem.fields.filter(function (
            el
          ) {
            return (
              el.documentFieldName ==
              'Occupation of the main earning of the Family'
            );
          }),
          AnnualIncome: elem.fields.filter(function (el) {
            return el.documentFieldName == 'Annual Income';
          }),
          IncomeProofValidity: elem.fields.filter(function (el) {
            return el.documentFieldName == 'Income Proof Validity';
          }),
          TenthMarksheet: elem.fields.filter(function (el) {
            return el.documentFieldName == '10th Marksheet';
          }),
          TwelthMarksheet: elem.fields.filter(function (el) {
            return el.documentFieldName == '12th Marksheet';
          }),
          UGMarksheet: elem.fields.filter(function (el) {
            return (
              el.documentFieldName ==
              'UG Mark sheet (If pursuing then mark sheet of current semester)'
            );
          }),
          PGMarksheet: elem.fields.filter(function (el) {
            return (
              el.documentFieldName ==
              'PG (If pursuing then mark sheet of current semester)'
            );
          }),
          IDProof: elem.fields.filter(function (el) {
            return (
              el.documentFieldName ==
              'ID Proof (only Aadhar Card applicable both side scan)'
            );
          }),
          UpdatedResume: elem.fields.filter(function (el) {
            return el.documentFieldName == 'Updated Resume';
          }),
          LOI: elem.fields.filter(function (el) {
            return el.documentFieldName == 'LOI';
          }),
          IncomeProof: elem.fields.filter(function (el) {
            return (
              el.documentFieldName ==
              'Income Proof (Any one member in the family only salary slip, income certificate, form 16 applicable)'
            );
          }),
          Pan: elem.fields.filter(function (el) {
            return el.documentFieldName == 'Pan';
          }),
          RationCardNo: elem.fields.filter(function (el) {
            return el.documentFieldName == 'Ration Card No';
          }),
          FamilyIncome: elem.fields.filter(function (el) {
            return el.documentFieldName == 'Family Income';
          }),
          RationCardColor: elem.fields.filter(function (el) {
            return el.documentFieldName == 'Ration Card Color';
          }),
          CasteCertificate: elem.fields.filter(function (el) {
            return el.documentFieldName == 'Caste Certificate';
          }),
          Passport: elem.fields.filter(function (el) {
            return el.documentFieldName == 'Passport';
          }),
          RationCard: elem.fields.filter(function (el) {
            return el.documentFieldName == 'Ration Card';
          }),
        });
      });
      this.finalProjectAssignReports = [];
      projectAssignReports.forEach((elem: any, index: any) => {
        this.finalProjectAssignReports.push({
          gttId: elem.gttId,
          firstName: elem.firstName,
          lastName: elem.lastName,
          gender: elem.gender,
          dob: elem.dob,
          emailId: elem.email,
          mobileNumber: elem.mobile,
          projectName: elem.projectname[0],
          projectManagerName: elem.projectmanagername[0],
          programName: elem.programname[0],
          courseName: elem.coursename[0],
          batchName: elem.batchname[0],
          trainerName: elem.trainername[0],
          trainerCoordinatorName: elem.trainercoordinatorname[0],
        });
      });

      var projectManager = this.finalProjectAssignReports.map((data) => {
        return data.projectName;
      });
      let projectManagerList = [...new Set(projectManager)];

      let projectarrays = [];
      if (managername == 'ALL') {
        this.finalProjectAssignReports;
      } else {
        this.finalProjectAssignReports.map((project) => {
          let data = project.projectManagerName?.includes(managername);
          if (data == true) {
            return projectarrays.push(project);
          }
        });
        this.finalProjectAssignReports = projectarrays;
      }

      var result = Object.keys(this.finalProjectAssignReports[0]).map(function (
        key: string
      ) {
        return key;
      });

      let headerName = '';
      result.forEach((elem: any, key: any) => {
        headerName = this.headerCaseString(elem);
        if (elem == 'dob') {
          headerName = 'DOB';
        }
        if (
          elem != 'panNumber' &&
          elem != 'disabilityPercent' &&
          elem != 'candidateCategory' &&
          elem != 'placedStatus' &&
          elem != 'droppedStatus' &&
          elem != 'termsAndConditions' &&
          elem != 'roleId' &&
          elem != 'active' &&
          elem != 'projectId'
        ) {
          this._projectAssignReportColumns.push({
            field: elem,
            header: headerName,
          });
        }
      });

      this._projectBasedManagerList = projectManagerList;
      this._projectAssignReportColumnHeader = this._projectAssignReportColumns;
      this._projectAssignReportColumnTitle =
        this._projectAssignReportColumnHeader.map((col) => ({
          title: col.header,
          dataKey: col.field,
        }));

      this._projectAssignReportColumnDataKey =
        this._projectAssignReportColumnHeader.map((col) => ({
          dataKey: col.field,
        }));
    }
  }

  @Input() get projectAssignedColumns(): any[] {
    return this._projectAssignDefaultColumns;
  }

  set projectAssignedColumns(val: any[]) {
    this._projectAssignDefaultColumns =
      this._projectAssignReportColumnHeader.filter((col) => val.includes(col));
  }

  projectAssignFilter($event: any) {
    var result = $event.value.reduce((unique, o) => {
      if (
        !unique.some((obj) => obj.field === o.field && obj.header === o.header)
      ) {
        unique.push(o);
      }
      return unique;
    }, []);
    if ($event.value.length == 0) {
      this._projectAssignDefaultColumns = this._projectAssignDefaultColumnsCopy;
    } else {
      this._projectAssignDefaultColumns = result;
    }
  }

  exportProjectAssignExcel() {
    let projectAssignExcelDetails: any = [];
    let projectColumnsDatas: any = [];

    this.selectedProjectAssignDetails.forEach((elem, inx) => {
      if (!projectAssignExcelDetails.hasOwnProperty(inx)) {
        projectAssignExcelDetails[inx] = {};
      }
      this._projectAssignDefaultColumns.forEach((elm, indx) => {
        projectAssignExcelDetails[inx][elm.field] = elem[elm.field];
      });
    });

    if (this.selectedProjectAssignDetails.length == 0) {
      this._projectAssignDefaultColumns.forEach((elm, indx) => {
        projectColumnsDatas[elm.header] = '';
      });
      projectAssignExcelDetails.push(projectColumnsDatas);
    }

    const worksheet = xlsx.utils.json_to_sheet(projectAssignExcelDetails);
    const workbook = { Sheets: { 'ProjectAssign-Report': worksheet }, SheetNames: ['ProjectAssign-Report'] };
    const excelBuffer: any = xlsx.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, 'ProjectAssign-Report');
  }

  exportProjectAssignPDF(dt: any) {
    var doc: any = new jsPDF.default('p', 'pt', 'a1', true);
    this._projectAssignReportColumnTitle = [];

    Object.keys(this._projectAssignDefaultColumns).forEach((key) => {
      this._projectAssignReportColumnTitle.push({
        title: this._projectAssignDefaultColumns[key].header,
        dataKey: this._projectAssignDefaultColumns[key].field,
      });
    });

    doc.autoTable(
      this._projectAssignReportColumnTitle,
      this.selectedProjectAssignDetails,
      {
        bodyStyles: { valign: 'middle' },
        styles: { overflow: 'linebreak', columnWidth: '1000' },
        columnStyles: {
          text: {
            cellWidth: 'wrap',
          },
          description: {
            cellWidth: '107',
          },
        },
      }
    );
    doc.save('ProjectAssign-Report.pdf');
  }
  /* ================================================ Project Assign Registration Reports End ================================================ */
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

  onListOfRightMenus(eventData: string) {
    let arr = JSON.parse(eventData);
    Object.entries(arr).forEach(([key, value]) =>
      this.rightSideMenus.push(value)
    );
  }

  headerCaseString(string: any) {
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
}
