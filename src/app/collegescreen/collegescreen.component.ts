import { Component, OnInit } from '@angular/core';
import { College } from 'src/app/view-models/collegereg';
import { CommonService } from 'src/app/common.service';
import { CollegeService } from 'src/app/services/college.service';
import { Router, RouterModule, Routes } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Title } from '@angular/platform-browser';

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
  selector: 'app-collegescreen',
  templateUrl: './collegescreen.component.html',
  styleUrls: ['./collegescreen.component.css'],
})
export class CollegescreenComponent implements OnInit {
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
  public listOfErrors: any = [];

  constructor(
    public commonservice: CommonService,
    private titleService: Title,
    public collegeService: CollegeService,
    public _router: Router,
    private messageService: MessageService
  ) {
    this.listOfCollege();
    this.listOfCity();
    this.listOfState();
    this.listOfKAMName();
    this.listOfTPOName();
  }

  ngOnInit(): void {
    $('.spinner').hide();
    this.setTitle('TJM-College');
  }
  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
  FilterCity(value: any) {
    console.log(value);
    let stateDetails = value.split('_', 2);
    this.collegeService
      .getFilterCity(stateDetails[0])
      .subscribe((response: any) => {
        if (response.data != null) {
          const citySorted = response.data.sort((a: any, b: any) =>
            a.cityname > b.cityname ? 1 : -1
          );
          this.cityDetails = citySorted;
        }
      });
  }

  onSubmit(formvalue: any) {
    const formData = new FormData();
    let tpoUser = this.userModel.tpoUserid.split('_', 2);
    let kamName = this.userModel.kamUserId.split('_', 2);
    let state = this.userModel.state.split('_', 2);

    let params = {
      academicInstitutionName: this.userModel.academicInstitutionName,
      address: this.userModel.address,
      state: state[1],
      city: this.userModel.city,
      code: this.userModel.code,
      tpoUserid: +tpoUser[0],
      tpoName: tpoUser[1],
      tpoContactNumber: this.userModel.tpoContactNumber,
      tpoEmailId: this.userModel.tpoEmailId,
      academicInstitutionShortName: this.userModel.academicInstitutionShortName,
      kamUserId: +kamName[0],
      kamName: kamName[1],
    };

    if (formvalue.valid == true) {
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
    this.collegeService.getCollege().subscribe((response: any) => {
      if (response.data != null) {
        const academicSorted = response.data.sort((a: any, b: any) =>
          a.academicInstitutionName > b.academicInstitutionName ? 1 : -1
        );
        this.collegeDetails = academicSorted;
      }
    });
  }

  /* list Of City */
  listOfCity() {
    this.collegeService.getCity().subscribe((response: any) => {
      if (response.data != null) {
        const citySorted = response.data.sort((a: any, b: any) =>
          a.cityname > b.cityname ? 1 : -1
        );
        this.cityDetails = citySorted;
      }
    });
  }

  /* state based city*/
  listOfState() {
    this.collegeService.getState().subscribe((response: any) => {
      if (response.data != null) {
        const stateSorted = response.data.sort((a: any, b: any) =>
          a.state > b.state ? 1 : -1
        );
        this.stateDetails = stateSorted;
      }
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
    });
  }
}

// @Component({
//   selector: 'app-collegescreen',
//   templateUrl: './collegescreen.component.html',
//   styleUrls: ['./collegescreen.component.css']
// })
// export class CollegescreenComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }
