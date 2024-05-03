import { Component, OnInit } from '@angular/core';
import { College } from 'src/app/view-models/collegereg';
import { CommonService } from 'src/app/common.service';
import { CollegeService } from 'src/app/services/college.service';
import { Router, RouterModule, Routes } from '@angular/router';
import { MessageService } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { UsermanagementService } from 'src/app/services/user-management.service';
import { Title } from '@angular/platform-browser';
import { Observable, forkJoin } from 'rxjs';

interface academicInstitution {
  academicInstitutionId: string;
  academicInstitutionName: string;
  cityname: string;
  cityid: string;
  state: string;
  stateid: string;
  TPOUserName: string;
  TPOuserid: string;
  KAMUserName: string;
  KAMuserid: string;
  agree: string;
}

@Component({
  selector: 'app-collegereg',
  templateUrl: './collegereg.component.html',
  providers: [MessageService],
  styleUrls: ['./collegereg.component.css'],
})
export class CollegeregComponent implements OnInit {
  userModel = new College('', '', '', '', '', '', '', '', '', '', '', '', '');

  public clgstatus: any;
  //public loginmessage:any;
  public successmsg: boolean = false;
  public failuremsg: boolean = false;
  public receivedmessage: string = '';
  collegeDetails: any = [];
  cityDetails: any = [];
  stateDetails: any = [];
  nameDetails: any = [];
  kamNameDetails: any = [];
  topNameDetails: any = [];
  stateddl: any;
  nameddl: any;
  kamddl: any;
  tpoddl: any;
  kamEmailId: string;
  public listOfErrors: any = [];
  collegename: any = [];

  collegeNewDetails: any[];
  selectedCollege: any;
  readonlyField: boolean;
  disabledTPOOption: boolean = false;
  disabledTPOName: string;

  constructor(
    public commonservice: CommonService,
    private titleService: Title,
    public collegeService: CollegeService,
    public _router: Router,
    private messageService: MessageService,
    private UsermanagementService: UsermanagementService
  ) {
    this.getAdminCollegeDetails();
    // this.listOfCollege();

  }

  ngOnInit(): void {
    // $('.spinner').hide();
    this.setTitle('TJM-College Registration');
  }
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  getAdminCollegeDetails() {
    $('.spinner').show();
    let headerName = '';

    this.collegeService.getCollegeDetails().subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.status == 'Success') {
          this.collegeNewDetails = [];
          this.collegeNewDetails = this.pushCollegeDetails(
            response.data,
            this.collegeDetails
          );
        }

        this.listOfState();

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

  pushCollegeDetails(responseData: any, college: any) {
    responseData.forEach((elem: any, index: any) => {
      if (elem.project_managers != null) {
        var projectManagerNames = Object.keys(elem.project_managers).map(
          function (k) {
            return elem.project_managers[k].project_manager_name;
          }
        );

        var projectManagerIds = Object.keys(elem.project_managers).map(
          function (k) {
            return elem.project_managers[k].project_manager_id;
          }
        );
      }

      if (elem.projects != null) {
        var projectIds = Object.keys(elem.projects).map(function (k) {
          return elem.projects[k].project_id;
        });

        var projectNames = Object.keys(elem.projects).map(function (k) {
          return elem.projects[k].project_name;
        });
      }


      let kamLastName = (elem.kam_lastname != null && elem.kam_lastname != '') ? elem.kam_lastname : '';
      let tpoLastName = (elem.tpo_lastname != null && elem.tpo_lastname != '') ? elem.tpo_lastname : '';
      if (elem.tpo_firstname != null && elem.status != null && elem.status.toLowerCase() == 'active') {
        this.collegeNewDetails.push({
          academic_institution_id: elem.academic_institution_id,
          academic_institution_name: elem.academic_institution_name,
          academic_institution_short_name: elem.academicInstitutionShortName,
          address_line: elem.address_line,
          city_id: elem.city_id,
          city: elem.city,
          kam_user_id: elem.kam_user_id,
          kAM_name:
            elem.kam_firstname != '' && elem.kam_firstname != null
              ? elem.kam_firstname + ' ' + kamLastName
              : '',
          project_id: projectIds,
          project_name: projectNames,
          project_manager_id: projectManagerIds,
          project_manager_name: projectManagerNames,
          state_id: elem.state_id,
          state: elem.state,
          status_id: elem.status_id,
          status: elem.status,
          tpo_user_id: elem.tpo_user_id,
          tPO_email: elem.tpo_email,
          tPO_name:
            elem.tpo_firstname != null && elem.tpo_firstname != ''
              ? elem.tpo_firstname + ' ' + tpoLastName
              : '',
          tPO_mobile: elem.tpo_mobile,
          tpo_status: true,
        });
      } else {
        if (elem.status != null && elem.status.toLowerCase() == 'active') {
          this.collegeNewDetails.push({
            academic_institution_id: elem.academic_institution_id,
            academic_institution_name: elem.academic_institution_name,
            academic_institution_short_name: elem.academicInstitutionShortName,
            address_line: elem.address_line,
            city_id: elem.city_id,
            city: elem.city,
            kam_user_id: elem.kam_user_id,
            kAM_name:
              elem.kam_firstname != '' && elem.kam_firstname != null
                ? elem.kam_firstname + ' ' + kamLastName
                : '',
            project_id: projectIds,
            project_name: projectNames,
            project_manager_id: projectManagerIds,
            project_manager_name: projectManagerNames,
            state_id: elem.state_id,
            state: elem.state,
            status_id: elem.status_id,
            status: elem.status,
            tpo_user_id: elem.tpo_user_id,
            tPO_email: elem.tpo_email,
            tPO_name:
              elem.tpo_firstname != null && elem.tpo_firstname != ''
                ? elem.tpo_firstname + ' ' + tpoLastName
                : '',
            tPO_mobile: elem.tpo_mobile,
            tpo_status: false,
          });
        }

      }
    });

    const academicSorted = this.collegeNewDetails.sort((a: any, b: any) =>
      a.academic_institution_name > b.academic_institution_name ? 1 : -1
    );

    this.collegeNewDetails = academicSorted;

    this.collegeNewDetails.push({
      academic_institution_id: 0,
      academic_institution_name: 'Others',
    });

    return this.collegeNewDetails;
  }

  clearEvent(clgForm) {
    clgForm.resetForm();
    this.selectedCollege = null;
    this.disabledTPOOption = false;
  }

  changeCollege($event, clgForm) {
    console.log($event.value);
    if (
      $event.value != null &&
      $event.value.tpo_status != null &&
      $event.value.tpo_status
    ) {
      this.readonlyField = true;
      this.disabledTPOOption = true;
      this.userModel.address = $event.value.address_line;
      this.userModel.state = $event.value.state_id + '_' + $event.value.state;
      if ($event.value.state_id != null) {
        this.collegeService
          .getFilterCity($event.value.state_id)
          .subscribe((response: any) => {
            if (response.data != null) {
              $('.spinner').hide();
              const citySorted = response.data.sort((a: any, b: any) =>
                a.cityname > b.cityname ? 1 : -1
              );
              this.cityDetails = citySorted;
              this.userModel.city = '';
              this.userModel.city =
                $event.value.city_id + '_' + $event.value.city;
            }
          });
      }
      this.disabledTPOName = $event.value.tPO_name;
      this.userModel.tpoUserid =
        $event.value.tpo_user_id + '_' + $event.value.tPO_name;
      this.userModel.tpoContactNumber = $event.value.tPO_mobile;
      this.userModel.tpoEmailId = $event.value.tPO_email;
      this.userModel.kamUserId =
        $event.value.kam_user_id + '_' + $event.value.kAM_name;
      this.userModel.academicInstitutionShortName =
        $event.value.academic_institution_short_name;
      this.userModel.statusvalue = $event.value.status;
      this.userModel.agree = 'true';
    } else {
      this.readonlyField = false;
      if (
        this.selectedCollege != null &&
        this.selectedCollege.academic_institution_name == 'Others'
      ) {
        clgForm.resetForm();
        this.selectedCollege = {
          academic_institution_id: 0,
          academic_institution_name: 'Others',
        };
        this.disabledTPOOption = false;
      } else {
        clgForm.resetForm();
        this.selectedCollege = $event.value;
        this.disabledTPOOption = false;
      }
    }
  }

  FilterCity(value: any) {
    $('.spinner').show();
    let stateDetails = value.split('_', 2);
    this.collegeService
      .getFilterCity(stateDetails[0])
      .subscribe((response: any) => {
        $('.spinner').hide();
        if (response.data != null) {
          const citySorted = response.data.sort((a: any, b: any) =>
            a.cityname > b.cityname ? 1 : -1
          );
          this.cityDetails = citySorted;
          this.userModel.city = '';
        }
      });
  }

  /* get TPO UserDetails */
  getTPODetails(tpo: any) {
    $('.spinner').show();
    let tpoDetails = tpo.split('_', 2);
    this.UsermanagementService.getUser(tpoDetails[0]).subscribe((response) => {
      $('.spinner').hide();
      let TPOInfo = response.data.user;
      this.userModel.tpoContactNumber = TPOInfo.mobile;
      this.userModel.tpoEmailId = TPOInfo.email;
    });
  }

  /* get KAM UserDetails */
  getKAMDetails(kam: any) {
    let kamDetails = kam.split('_', 2);
    this.UsermanagementService.getUser(kamDetails[0]).subscribe((response) => {
      let KAMInfo = response.data.user;
      this.kamEmailId = KAMInfo.email;
    });
  }

  /* get College Details */
  getCollegeDetails(collegeId: any) {
    this.collegeService.getCollegeDetails().subscribe({
      next: (response) => {
        console.log(response);
        let CollegeDetails = response.data;
        var collegeInfo = CollegeDetails.filter(function (el) {
          return el.academic_institution_name == collegeId;
        });
        this.userModel.address = collegeInfo[0].address_line;
        this.userModel.state =
          collegeInfo[0].state != null
            ? collegeInfo[0].state_id + '_' + collegeInfo[0].state
            : '';
        this.userModel.city =
          collegeInfo[0].city != null
            ? collegeInfo[0].city_id + '_' + collegeInfo[0].city
            : '';
        this.userModel.academicInstitutionShortName =
          collegeInfo[0].academic_institution_short_name;
        this.userModel.tpoUserid =
          collegeInfo[0].tpo_firstname != null
            ? collegeInfo[0].tpo_user_id + '_' + collegeInfo[0].tpo_firstname
            : '';
        this.userModel.tpoContactNumber = collegeInfo[0].tpo_mobile;
        this.userModel.tpoEmailId = collegeInfo[0].tpo_email;
        this.userModel.kamUserId =
          collegeInfo[0].kam_firstname != null
            ? collegeInfo[0].kam_user_id + '_' + collegeInfo[0].kam_firstname
            : '';
      },
    });
  }

  resetCollegeForm(collegeForm: NgForm) {
    collegeForm.resetForm();
  }

  /* add College Details */
  onSubmit(formvalue: any, collegeForm: NgForm) {
    const formData = new FormData();

    if (formvalue.valid == true) {
      let tpoUser = this.userModel.tpoUserid.split('_', 2);
      let kamName = this.userModel.kamUserId.split('_', 2);
      let state = this.userModel.state.split('_', 2);
      let city = this.userModel.city.split('_', 2);

      let params = {
        academicInstitutionId:formvalue.value.collegename.academic_institution_id,
        academicInstitutionName:
          formvalue.value.collegename.academic_institution_id != 0
            ? formvalue.value.collegename.academic_institution_name
            : this.userModel.otherAcademicInstitutionName,
        // academicInstitutionName: this.userModel.academicInstitutionName,
        address: this.userModel.address,
        state: state[0],
        city: city[0],
        academicInstitutionShortName:
          this.userModel.academicInstitutionShortName,
        tpoUserid: +tpoUser[0],
        tpoName: tpoUser[1],
        tpoEmailId: this.userModel.tpoEmailId,
        tpoContactNumber: this.userModel.tpoContactNumber,
        kamUserId: +kamName[0],
        kamName: kamName[1],
        kamEmailId: this.kamEmailId,
        status: this.userModel.statusvalue,
        isdb: 1,
        isactive: this.userModel.statusvalue == 'Active' ? 1 : 0,
      };

      $('.spinner').show();
      this.collegeService.insertCollegeDetails(params).subscribe({
        next: (response) => {
          $('.spinner').hide();
          if (response.status == 'Success') {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: response.message,
            });
            this.resetCollegeForm(collegeForm);
            this.listOfTPOName();
            this.getAdminCollegeDetails();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: response.message,
            });
          }
        },
        error: (response) => {
          $('.spinner').hide();
          let message = '';

          if (response.error.message != null) {
            message = response.error.message;
          } else {
            message = response.message;
          }

          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
          });
        },
      });
    }
  }

  /* List of colleges */
  listOfCollege() {
    $('.spinner').show();
    this.collegeService.getDeRegisterCollege().subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.data != null) {
          this.collegename = [];
          response.data.forEach((elem: any, index: any) => {
            if (elem.status == 'Active') {
              this.collegename.push({
                academic_institution_id: elem.academicInstitutionId,
                academic_institution_name: elem.academicInstitutionName,
              });
            }
          });
          const academicSorted = this.collegename.sort((a, b) =>
            a.academic_institution_name > b.academic_institution_name ? 1 : -1
          );
          this.collegeDetails = academicSorted;
        }
      },
      error: (response) => {
        $('.spinner').hide();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: response.error.message,
        });
      },
    });
  }

  /* list Of City */
  listOfCity() {
    this.cityDetails = [];
    this.collegeService.getCity().subscribe((response: any) => {
      if (response.data != null) {
        const citySorted = response.data.sort((a: any, b: any) =>
          a.cityname > b.cityname ? 1 : -1
        );
        this.cityDetails = citySorted;
      }
      this.listOfTPOName();
    });
  }

  /* state based city*/
  listOfState() {
    this.stateDetails = [];
    // $('.spinner').show();
    this.collegeService.getState().subscribe((response: any) => {
      // $('.spinner').hide();
      if (response.data != null) {
        const stateSorted = response.data.sort((a: any, b: any) =>
          a.state > b.state ? 1 : -1
        );
        this.stateDetails = stateSorted;
      }
      this.listOfCity();

    });
  }

  /* list of KAM Name */
  listOfKAMName() {
    this.kamNameDetails = [];
    this.collegeService.getKamName().subscribe((response: any) => {
      if (response.data != null) {
        const sortedKAMName = response.data.sort((a: any, b: any) =>
          a.firstname > b.firstname ? 1 : -1
        );
        sortedKAMName.forEach((elem: any, index: number) => {
          if (elem.firstname != null) {
            this.kamNameDetails.push(elem);
          }
        });
      }
    });
  }

  /* list of TPO Name */
  listOfTPOName() {
    this.topNameDetails = [];
    this.collegeService.getTpoName().subscribe((response: any) => {
      if (response.data != null) {
        const sortedTPOName = response.data.sort((a: any, b: any) =>
          a.firstname > b.firstname ? 1 : -1
        );
        sortedTPOName.forEach((elem: any, index: number) => {
          if (elem.firstname != null) {
            this.topNameDetails.push(elem);
          }
        });
      }
      this.listOfKAMName();
    });
  }
}
