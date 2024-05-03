import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/common.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import mockdata from './notification.json'
import { UsermanagementService } from 'src/app/services/user-management.service';
import { interval, mergeMap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { CollegeService } from 'src/app/services/college.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  providers: [MessageService, CookieService],
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {

  private domainId: string = environment.DOMAIN_ID;
  private cookieDomainId: string = environment.COOKIE_DOMAIN_ID;

  user: any;
  profileName: string;
  data: any = [];
  orgData: any;
  isMigrate: any;
  contextJson: any;
  toastMsg: boolean = false;
  private saUrl: string = environment.BASE_SA_API_URL;
  notiSub: any;
  notificationIconDis: any;
  currentLoginUserId: number;
  public loggedInRoleName: string;
  constructor(
    public commonservice: CommonService,
    private messageService: MessageService,
    private cookieService: CookieService,
    public collegeService: CollegeService,
    private router: Router,
    private usermanagementservice: UsermanagementService
  ) {
    this.isMigrate = localStorage.getItem('isMigrate');
    this.user = JSON.parse(localStorage.getItem('userId'));
    this.profileName = this.user.first_name;

  }

  ngOnInit(): void {
    // this.orgData = mockdata.data;
    // this.data = mockdata.data.slice(0, 3);
    this.user = localStorage.getItem('userId');
    let loggedInRoleName = JSON.parse(this.user).user_role.role;
    this.loggedInRoleName = loggedInRoleName;
    this.currentLoginUserId = JSON.parse(this.user).id;
    this.notificationIconDis = ['ROLE_ADMIN', 'GTT Admin', 'Training Coordinator', 'Project Manager', 'Program Lead'];
    this.getNotifications();
    this.notiSub = this.usermanagementservice.mySubject.subscribe(
      result => {
        this.getNotifications();
      }
    )
  }


  redirectToSkillsAlpha() {

    $('.spinner').show();

    let userDetails = localStorage.getItem('userId');

    let params = {
      "subDomainName": this.domainId,
      "userName": JSON.parse(userDetails).email,
      "password": JSON.parse(userDetails).confirm_password
    }

    // let params = {
    //   "subDomainName": "skillsalpha.mobiusservices.co.in",
    //   "userName": "rajvinoth",
    //   "password": "saldap123$"
    // }

    this.toastMsg = true;
    this.collegeService.reDirectSkillsAlpha(params).subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.statusCode == 200) {

          var myDate = new Date();
          myDate.setMonth(myDate.getMonth() + 12);
          this.cookieService.set('ngStorage-tjmToSA', 'true', myDate, '/', this.cookieDomainId);
          this.cookieService.set('ngStorage-isloginTypeFed', 'false', myDate, '/', this.cookieDomainId);
          this.cookieService.set('ngStorage-assessmentFeature', 'false', myDate, '/', this.cookieDomainId);
          this.cookieService.set('ngStorage-sessionID', response.saResult.result.sessionId, myDate, '/', this.cookieDomainId);
          this.cookieService.set('ngStorage-tenantID', response.saResult.result.tenantOID, myDate, '/', this.cookieDomainId);
          this.cookieService.set('ngStorage-userID', response.saResult.result.userOID, myDate, '/', this.cookieDomainId);
          if (response.saResult.result.systemRoleList[0] == 'L_AND_D_MANAGER' || response.saResult.result.systemRoleList[1] == 'L_AND_D_MANAGER' || response.saResult.result.systemRoleList[2] == 'L_AND_D_MANAGER') {
            this.cookieService.set('ngStorage-systemRole', 'L_AND_D_MANAGER', myDate, '/', this.cookieDomainId);
            this.cookieService.set('ngStorage-sysRoleList', response.saResult.result.systemRoleList.toString(), myDate, '/', this.cookieDomainId);
            this.cookieService.set('ngStorage-dynamicKarmaName', response.saResult.result.karmaPointLable, myDate, '/', this.cookieDomainId);
          } else {
            this.cookieService.set('ngStorage-systemRole', response.saResult.result.systemRoleList[0], myDate, '/', this.cookieDomainId);
            this.cookieService.set('ngStorage-sysRoleList', response.saResult.result.systemRoleList.toString(), myDate, '/', this.cookieDomainId);
            this.cookieService.set('ngStorage-dynamicKarmaName', response.saResult.result.karmaPointLable, myDate, '/', this.cookieDomainId);
          }

          if (this.validImageUrl(response.saResult.result.photoURL)) {
            this.cookieService.set('ngStorage-photoUrl', response.saResult.result.photoURL, myDate, '/', this.cookieDomainId);
          } else {
            this.cookieService.set('ngStorage-photoUrl', 'images/placeholder.png', myDate, '/', this.cookieDomainId);
          }

          this.cookieService.set('ngStorage-ouID', response.saResult.result.businessUnit.businessID, myDate, '/', this.cookieDomainId);
          this.cookieService.set('ngStorage-firstName', response.saResult.result.firstName, myDate, '/', this.cookieDomainId);
          this.cookieService.set('ngStorage-lastName', response.saResult.result.lastName, myDate, '/', this.cookieDomainId);
          this.cookieService.set('ngStorage-skillApprovalFlag', response.saResult.result.skillApprovalFlag, myDate, '/', this.cookieDomainId);
          this.cookieService.set('ngStorage-roleApprovalFlag', response.saResult.result.roleApprovalFlag, myDate, '/', this.cookieDomainId);
          this.cookieService.set('ngStorage-skillScoreApprovalFlag', response.saResult.result.skillScoreApprovalFlag, myDate, '/', this.cookieDomainId);

          this.cookieService.set('ngStorage-tenantPhotoUrl', response.saResult.result.tenantUrl, myDate, '/', this.cookieDomainId);

          try {
            this.cookieService.set('ngStorage-careerPath', this.removeU0026(response.saResult.result.customTitles.careerPath), myDate, '/', this.cookieDomainId);
            this.cookieService.set('ngStorage-manager', this.removeU0026(response.saResult.result.customTitles.manager), myDate, '/', this.cookieDomainId);
            this.cookieService.set('ngStorage-lnd', this.removeU0026(response.saResult.result.customTitles.lnd), myDate, '/', this.cookieDomainId);
            this.cookieService.set('ngStorage-coach', this.removeU0026(response.saResult.result.customTitles.coach), myDate, '/', this.cookieDomainId);
            this.cookieService.set('ngStorage-managerPlural', this.removeU0026(response.saResult.result.customTitles.manager) + 's', myDate, '/', this.cookieDomainId);
            this.cookieService.set('ngStorage-coachPlural', this.removeU0026(response.saResult.result.customTitles.coach) + 'es', myDate, '/', this.cookieDomainId);
            this.cookieService.set('ngStorage-isDisableIcon', response.saResult.result.disableIcon, myDate, '/', this.cookieDomainId);
          }
          catch (err) {
            this.cookieService.set('ngStorage-careerPath', 'Career Path', myDate, '/', this.cookieDomainId);
            this.cookieService.set('ngStorage-manager', 'Manager', myDate, '/', this.cookieDomainId);
            this.cookieService.set('ngStorage-lnd', 'L&D', myDate, '/', this.cookieDomainId);
            this.cookieService.set('ngStorage-coach', 'Coach', myDate, '/', this.cookieDomainId);
            this.cookieService.set('ngStorage-managerPlural', 'Managers' + 's', myDate, '/', this.cookieDomainId);
            this.cookieService.set('ngStorage-coachPlural', 'Coaches' + 's', myDate, '/', this.cookieDomainId);
            this.cookieService.set('ngStorage-isDisableIcon', 'false', myDate, '/', this.cookieDomainId);
          }

          this.cookieService.set('ngStorage-loginUserId', response.saResult.result.userName, myDate, '/', this.cookieDomainId);
          this.cookieService.set('ngStorage-firstTimeLogin', 'true', myDate, '/', this.cookieDomainId);
          this.cookieService.set('ngStorage-allowLinkdine', response.saResult.result.linkedInFlag, myDate, '/', this.cookieDomainId);
          this.cookieService.set('ngStorage-ratingFlag', response.saResult.result.ratingFlag, myDate, '/', this.cookieDomainId);
          this.cookieService.set('ngStorage-programApprovalFlag', response.saResult.result.programApprovalFlag, myDate, '/', this.cookieDomainId);
          this.cookieService.set('ngStorage-isTenantAdmin', 'false', myDate, '/', this.cookieDomainId);
          this.cookieService.set('ngStorage-inactivityTime', response.saResult.result.inactivityTime, myDate, '/', this.cookieDomainId);

          for (var t = 0; t < response.saResult.result.systemRoleList.length; t++) {
            if (response.saResult.result.systemRoleList[t] == "TENANT_ADMIN") {
              this.cookieService.set('ngStorage-isTenantAdmin', 'true', myDate, '/', this.cookieDomainId);
            }
          }

          this.cookieService.set('ngStorage-linkdinProfileURL', response.saResult.result.linkdinProfileURL, myDate, '/', this.cookieDomainId);


          let obj = {
            "criteriaList": [
              {
                "key": "UserID",
                "match": "ExactMatch",
                "value": response.saResult.result.userOID
              }
            ],
            "searchUserInformationKey": [
              "UserSkills",
              "BasicInfo",
              "UserRole"
            ],
            "start": 0
          }


          this.collegeService.getSkillAlphaUser(obj, response.saResult.result.sessionId).subscribe({
            next: (responseUser) => {
              $('.spinner').hide();
              if (responseUser.statusCode == "200") {
                this.cookieService.set('ngStorage-ouID', responseUser.saResult.result.businessUnit.businessID, myDate, '/', this.cookieDomainId);
                this.cookieService.set('ngStorage-userOuId', responseUser.saResult.result.businessUnit.businessID, myDate, '/', this.cookieDomainId);
              }
            },
            error: (response) => {
              $('.spinner').hide();
              console.log(response);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: response.error.statusMessage
              });
            },
          });

          this.cookieService.set('ngStorage-traningProgramMailFlag', 'false', myDate, '/', this.cookieDomainId);
          this.cookieService.set('ngStorage-traningProgramFeedbackMailFlag', 'false', myDate, '/', this.cookieDomainId);

          let data = {
            "tenantOid": response.saResult.result.tenantOID,
            "userOid": response.saResult.result.userOID,
            "userKey": "location"
          }

          this.collegeService.getCheckLatestScreenView(data, response.saResult.result.sessionId).subscribe({
            next: (responseView) => {
              $('.spinner').hide();
              if (responseView.statusCode == 200 || responseView.statusCode == "OK") {
                var jsondata = JSON.parse(responseView.saResult.result.contextOid);
                if (jsondata != "" && jsondata != null) {
                  this.contextJson = jsondata.location;
                  this.cookieService.set('ngStorage-firstLogin', 'false', myDate, '/', this.cookieDomainId);
                  this.cookieService.set('ngStorage-showDisclaimerForFirstLogin', 'false', myDate, '/', this.cookieDomainId);

                  this.contextJson = 'landing';
                  let createContextData = {
                    "tenantOid": response.saResult.result.tenantOID,
                    "userOid": response.saResult.result.userOID,
                    "contextJson": "{\"location\":\"" + this.contextJson + "\"}",
                    // "contextJson": this.contextJson,
                    "userKey": "location"
                  }


                  this.collegeService.getCreateUserContext(createContextData, response.saResult.result.sessionId).subscribe({
                    next: (responseView) => {
                      $('.spinner').hide();

                    },
                    error: (response) => {
                      $('.spinner').hide();
                      console.log(response);
                      this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: response.error.statusMessage
                      });
                    },
                  });

                } else {
                  this.cookieService.set('ngStorage-firstLogin', 'true', myDate, '/', this.cookieDomainId);
                  this.cookieService.set('ngStorage-showDisclaimerForFirstLogin', 'false', myDate, '/', this.cookieDomainId);
                }

              } else {
                var isSuperAdmin = false;
                response.saResult.result.systemRoleList.forEach((e, x) => {
                  if (e == 'SUPER_ADMIN') {
                    isSuperAdmin = true;
                  }
                });
                if (isSuperAdmin) {

                }
                else {
                  this.cookieService.set('ngStorage-firstLogin', 'true', myDate, '/', this.cookieDomainId);
                  this.cookieService.set('ngStorage-showDisclaimerForFirstLogin', 'true', myDate, '/', this.cookieDomainId);
                }
              }
            },
            error: (response) => {
              $('.spinner').hide();
              console.log(response);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: response.error.statusMessage
              });
            },
          });



          var w = window.open(
            this.saUrl + '#/landingPage/',
            '_blank' // <- This is what makes it open in a new window.
          );


        } else {
          $('.spinner').hide();
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'User not migrted to Skills Alpha'
          });

        }



      },
      error: (response) => {
        $('.spinner').hide();
        $('#skillsAlphaId').trigger('click');
        console.log(response);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: response.error.statusMessage
        });
      },
    });
  }

  validImageUrl(url) {
    return url && (url.indexOf('.jpg') > -1
      || url.indexOf('.jpeg') > -1
      || url.indexOf('.png') > -1);
  }

  removeU0026(str) {
    let sub = "u0026";
    if (str.includes(sub)) {
      console.log("removing 'u0026' from " + str + " and putting '&'");
    }
    return str.replace(/u0026/g, "&");
  }

  profileOnSubmit() {
    this.router.navigate(['/studentprofile']);
  }

  logout() {
    localStorage.removeItem('roleMenus');
    localStorage.removeItem('userId');
    localStorage.removeItem('courseId');
    localStorage.removeItem('batchId');
    localStorage.removeItem('roles');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('isMigrate');
  }

  notificationNavigation() {
    this.router.navigate(['/notification']);
  }

  getNotifications() {
    this.usermanagementservice.getNotificationDetails().subscribe({
      next: (response) => {
        // $('.spinner').hide();
        if (response.status == 'Success') {
          this.usermanagementservice.notifications = response.data;
          this.orgData = response.data;
          this.data = [];
          if (this.loggedInRoleName != 'GTT Admin') {
            response.data.forEach((elem, ix) => {
              if (this.currentLoginUserId == elem.userid) {
                this.data.push(elem);
              }
            });
          } else {
            this.data = response.data;
          }
          this.data = this.data.slice(0, 3);
          this.repeatNotification();
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
      }
    })
  }

  repeatNotification() {
    interval(2 * 60 * 1000)
      .pipe(
        mergeMap(() => this.usermanagementservice.getNotificationDetails())
      )
      .subscribe({
        next: (response) => {
          // $('.spinner').hide();
          if (response.status == 'Success') {
            this.usermanagementservice.notifications = response.data;
            this.orgData = response.data;
            this.data = [];
            if (this.loggedInRoleName != 'GTT Admin') {
              response.data.forEach((elem, ix) => {
                if (this.currentLoginUserId == elem.userid) {
                  this.data.push(elem);
                }
              });
            } else {
              this.data = response.data;
            }
            this.data = this.data.slice(0, 3);
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
        }
      })
  }


}
