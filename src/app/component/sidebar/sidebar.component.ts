import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CollegeService } from 'src/app/services/college.service';
import { MessageService } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  providers: [MessageService, CookieService],
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  constructor(
    private router: Router,
    public collegeService: CollegeService,
    private messageService: MessageService,
    private cookieService: CookieService
  ) { }

  @Output() listOfRightMenus = new EventEmitter<string>();
  menus: any = [];
  currentPath: any;
  activeNode:any;
  bookTitle: any;
  toastMsg: boolean = false;
  contextJson: any;
  ngOnInit(): void {
    // document.cookie = "myValue=5;path=/;secure=true;domain=skillsalpha.mobiusservices.co.in";
    // var myDate = new Date();
    // this.cookieService.set('test', 'Hello World', { expires: 2, domain: 'skillsalpha.mobiusservices.co.in', sameSite: 'Lax' });
    // this.createCookie('Google', 'test', myDate, 'skillsalpha.mobiusservices.co.in')
    let routerArr = this.router.url.split('/');
    this.currentPath = routerArr[1];
    if(this.currentPath == 'dashboard' && routerArr[2]){
      this.activeNode = routerArr[2];
    } else{
      this.activeNode = 'register';
    }
    
    var cookieName = 'Domain';
    var cookieValue = 'TJM';
    var myDate = new Date();
    myDate.setMonth(myDate.getMonth() + 12);
    document.cookie = cookieName + "=" + cookieValue + ";expires=" + myDate + ";domain=skillsalpha.mobiusservices.co.in;path=/";

    this.menus = JSON.parse(localStorage.getItem('roleMenus'));
    console.log('menuList', this.menus);

    this.menus.forEach((elem, index) => {
      if (elem.sub_menus.length > 0) {
        elem.sub_menus.forEach((subElem, subIndex) => {
          if (
            subElem.sub_menu_action != null &&
            subElem.sub_menu_action_url != null
          ) {
            this.menus[index].sub_menus[subIndex].sub_menu_action =
              subElem.sub_menu_action.split(',');
            this.menus[index].sub_menus[subIndex].sub_menu_action_url =
              subElem.sub_menu_action_url.split(',');
          }
        });
      }
    });

    this.onListOfRightMenus(this.menus);

    this.menus.sort(function (a, b) {
      return a.menu_order - b.menu_order;
    });
    console.log(this.menus)
  }


  redirectToSkillsAlpha() {

    $('.spinner').show();

    let userDetails = localStorage.getItem('userId');

    let params = {
      "subDomainName": "skillsalpha.mobiusservices.co.in",
      "userName": JSON.parse(userDetails).first_name,
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
          this.cookieService.set('ngStorage-tjmToSA', 'true', myDate, '/', '.mobiusservices.co.in');
          this.cookieService.set('ngStorage-isloginTypeFed', 'false', myDate, '/', '.mobiusservices.co.in');
          this.cookieService.set('ngStorage-assessmentFeature', 'false', myDate, '/', '.mobiusservices.co.in');
          this.cookieService.set('ngStorage-sessionID', response.saResult.result.sessionId, myDate, '/', '.mobiusservices.co.in');
          this.cookieService.set('ngStorage-tenantID', response.saResult.result.tenantOID, myDate, '/', '.mobiusservices.co.in');
          this.cookieService.set('ngStorage-userID', response.saResult.result.userOID, myDate, '/', '.mobiusservices.co.in');
          if (response.saResult.result.systemRoleList[0] == 'L_AND_D_MANAGER' || response.saResult.result.systemRoleList[1] == 'L_AND_D_MANAGER' || response.saResult.result.systemRoleList[2] == 'L_AND_D_MANAGER') {
            this.cookieService.set('ngStorage-systemRole', 'L_AND_D_MANAGER', myDate, '/', '.mobiusservices.co.in');
            this.cookieService.set('ngStorage-sysRoleList', response.saResult.result.systemRoleList.toString(), myDate, '/', '.mobiusservices.co.in');
            this.cookieService.set('ngStorage-dynamicKarmaName', response.saResult.result.karmaPointLable, myDate, '/', '.mobiusservices.co.in');
          } else {
            this.cookieService.set('ngStorage-systemRole', response.saResult.result.systemRoleList[0], myDate, '/', '.mobiusservices.co.in');
            this.cookieService.set('ngStorage-sysRoleList', response.saResult.result.systemRoleList.toString(), myDate, '/', '.mobiusservices.co.in');
            this.cookieService.set('ngStorage-dynamicKarmaName', response.saResult.result.karmaPointLable, myDate, '/', '.mobiusservices.co.in');
          }

          if (this.validImageUrl(response.saResult.result.photoURL)) {
            this.cookieService.set('ngStorage-photoUrl', response.saResult.result.photoURL, myDate, '/', '.mobiusservices.co.in');
          } else {
            this.cookieService.set('ngStorage-photoUrl', 'images/placeholder.png', myDate, '/', '.mobiusservices.co.in');
          }

          this.cookieService.set('ngStorage-ouID', response.saResult.result.businessUnit.businessID, myDate, '/', '.mobiusservices.co.in');
          this.cookieService.set('ngStorage-firstName', response.saResult.result.firstName, myDate, '/', '.mobiusservices.co.in');
          this.cookieService.set('ngStorage-lastName', response.saResult.result.lastName, myDate, '/', '.mobiusservices.co.in');
          this.cookieService.set('ngStorage-skillApprovalFlag', response.saResult.result.skillApprovalFlag, myDate, '/', '.mobiusservices.co.in');
          this.cookieService.set('ngStorage-roleApprovalFlag', response.saResult.result.roleApprovalFlag, myDate, '/', '.mobiusservices.co.in');
          this.cookieService.set('ngStorage-skillScoreApprovalFlag', response.saResult.result.skillScoreApprovalFlag, myDate, '/', '.mobiusservices.co.in');

          this.cookieService.set('ngStorage-tenantPhotoUrl', response.saResult.result.tenantUrl, myDate, '/', '.mobiusservices.co.in');

          try {
            this.cookieService.set('ngStorage-careerPath', this.removeU0026(response.saResult.result.customTitles.careerPath), myDate, '/', '.mobiusservices.co.in');
            this.cookieService.set('ngStorage-manager', this.removeU0026(response.saResult.result.customTitles.manager), myDate, '/', '.mobiusservices.co.in');
            this.cookieService.set('ngStorage-lnd', this.removeU0026(response.saResult.result.customTitles.lnd), myDate, '/', '.mobiusservices.co.in');
            this.cookieService.set('ngStorage-coach', this.removeU0026(response.saResult.result.customTitles.coach), myDate, '/', '.mobiusservices.co.in');
            this.cookieService.set('ngStorage-managerPlural', this.removeU0026(response.saResult.result.customTitles.manager) + 's', myDate, '/', '.mobiusservices.co.in');
            this.cookieService.set('ngStorage-coachPlural', this.removeU0026(response.saResult.result.customTitles.coach) + 'es', myDate, '/', '.mobiusservices.co.in');
            this.cookieService.set('ngStorage-isDisableIcon', response.saResult.result.disableIcon, myDate, '/', '.mobiusservices.co.in');
          }
          catch (err) {
            this.cookieService.set('ngStorage-careerPath', 'Career Path', myDate, '/', '.mobiusservices.co.in');
            this.cookieService.set('ngStorage-manager', 'Manager', myDate, '/', '.mobiusservices.co.in');
            this.cookieService.set('ngStorage-lnd', 'L&D', myDate, '/', '.mobiusservices.co.in');
            this.cookieService.set('ngStorage-coach', 'Coach', myDate, '/', '.mobiusservices.co.in');
            this.cookieService.set('ngStorage-managerPlural', 'Managers' + 's', myDate, '/', '.mobiusservices.co.in');
            this.cookieService.set('ngStorage-coachPlural', 'Coaches' + 's', myDate, '/', '.mobiusservices.co.in');
            this.cookieService.set('ngStorage-isDisableIcon', 'false', myDate, '/', '.mobiusservices.co.in');
          }

          this.cookieService.set('ngStorage-loginUserId', response.saResult.result.userName, myDate, '/', '.mobiusservices.co.in');
          this.cookieService.set('ngStorage-firstTimeLogin', 'true', myDate, '/', '.mobiusservices.co.in');
          this.cookieService.set('ngStorage-allowLinkdine', response.saResult.result.linkedInFlag, myDate, '/', '.mobiusservices.co.in');
          this.cookieService.set('ngStorage-ratingFlag', response.saResult.result.ratingFlag, myDate, '/', '.mobiusservices.co.in');
          this.cookieService.set('ngStorage-programApprovalFlag', response.saResult.result.programApprovalFlag, myDate, '/', '.mobiusservices.co.in');
          this.cookieService.set('ngStorage-isTenantAdmin', 'false', myDate, '/', '.mobiusservices.co.in');
          this.cookieService.set('ngStorage-inactivityTime', response.saResult.result.inactivityTime, myDate, '/', '.mobiusservices.co.in');

          for (var t = 0; t < response.saResult.result.systemRoleList.length; t++) {
            if (response.saResult.result.systemRoleList[t] == "TENANT_ADMIN") {
              this.cookieService.set('ngStorage-isTenantAdmin', 'true', myDate, '/', '.mobiusservices.co.in');
            }
          }

          this.cookieService.set('ngStorage-linkdinProfileURL', response.saResult.result.linkdinProfileURL, myDate, '/', '.mobiusservices.co.in');


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
                this.cookieService.set('ngStorage-ouID', responseUser.saResult.result.businessUnit.businessID, myDate, '/', '.mobiusservices.co.in');
                this.cookieService.set('ngStorage-userOuId', responseUser.saResult.result.businessUnit.businessID, myDate, '/', '.mobiusservices.co.in');
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

          this.cookieService.set('ngStorage-traningProgramMailFlag', 'false', myDate, '/', '.mobiusservices.co.in');
          this.cookieService.set('ngStorage-traningProgramFeedbackMailFlag', 'false', myDate, '/', '.mobiusservices.co.in');

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
                  this.cookieService.set('ngStorage-firstLogin', 'false', myDate, '/', '.mobiusservices.co.in');
                  this.cookieService.set('ngStorage-showDisclaimerForFirstLogin', 'false', myDate, '/', '.mobiusservices.co.in');

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
                  this.cookieService.set('ngStorage-firstLogin', 'true', myDate, '/', '.mobiusservices.co.in');
                  this.cookieService.set('ngStorage-showDisclaimerForFirstLogin', 'false', myDate, '/', '.mobiusservices.co.in');
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
                  this.cookieService.set('ngStorage-firstLogin', 'true', myDate, '/', '.mobiusservices.co.in');
                  this.cookieService.set('ngStorage-showDisclaimerForFirstLogin', 'true', myDate, '/', '.mobiusservices.co.in');
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
            'http://skillsalpha.mobiusservices.co.in:8080/#/landingPage/',
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


  createCookie(name, value, days, domain) {
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      var expires = "; expires=" + date;
    } else {
      var expires = "";
    }
    document.cookie = name + "=" + value + expires + ";domain=" + domain + "" + "; path=/;";
  }


  onListOfRightMenus(menus: any) {
    let rightSideMenus = {};
    menus.forEach((element, index) => {
      if (element.menu_name == this.currentPath) {
        element.sub_menus.forEach((subElem, subElemIndx) => {
          if (subElem.sub_menu_action != null) {
            subElem.sub_menu_action.forEach((actionElem, actionIndx) => {
              if (!rightSideMenus.hasOwnProperty(subElem.sub_menu_url)) {
                rightSideMenus[subElem.sub_menu_url] = {};
                rightSideMenus[subElem.sub_menu_url]['sub_menu_name'] =
                  subElem.sub_menu_display_name;
                rightSideMenus[subElem.sub_menu_url]['sub_menu_url'] =
                  subElem.sub_menu_url;
                rightSideMenus[subElem.sub_menu_url]['sub_menu_order'] =
                  subElem.sub_menu_order;
                rightSideMenus[subElem.sub_menu_url]['sub_menu_action'] = [];
              }

              rightSideMenus[subElem.sub_menu_url]['sub_menu_action'].push({
                action_name: actionElem,
                action_url: subElem.sub_menu_action_url[actionIndx],
                action_order: actionIndx + 1,
              });
            });
          } else {
            if (!rightSideMenus.hasOwnProperty(subElem.sub_menu_url)) {
              rightSideMenus[subElem.sub_menu_url] = {};
              rightSideMenus[subElem.sub_menu_url]['sub_menu_name'] =
                subElem.sub_menu_display_name;
              rightSideMenus[subElem.sub_menu_url]['sub_menu_url'] =
                subElem.sub_menu_url;
              rightSideMenus[subElem.sub_menu_url]['sub_menu_order'] =
                subElem.sub_menu_order;
              rightSideMenus[subElem.sub_menu_url]['sub_menu_action'] = [];
            }
          }
        });
      }
    });

    this.listOfRightMenus.emit(JSON.stringify(rightSideMenus));
  }
}
