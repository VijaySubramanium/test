import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import mockdata from '../component/header/notification.json'
import { UsermanagementService } from '../services/user-management.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  providers: [MessageService]
})
export class NotificationComponent implements OnInit {
  data: any;
  id: any;
  user: any = '';
  roles: any = [];
  loggedInRoleId: number;
  currentLoginUserId: number;

  constructor(private usermanagementservice: UsermanagementService, private messageService: MessageService) { }

  ngOnInit(): void {
    $('.spinner').show();

    this.user = localStorage.getItem('userId');
    this.roles = JSON.parse(localStorage.getItem('roles'));

    this.loggedInRoleId = JSON.parse(this.user).user_role.role_id;
    let loggedInRoleName = JSON.parse(this.user).user_role.role;
    this.currentLoginUserId = JSON.parse(this.user).id;

    this.dataInit();
    this.id = setInterval(() => {
      this.dataInit();
      $('.spinner').hide();
    }, 1000);

  }

  dataInit() {
    const notiData = this.usermanagementservice.getNotificationData();
    let loggedInRoleName = JSON.parse(this.user).user_role.role;
    if (notiData != undefined && notiData.length > 0) {
      this.data = [];
      if (loggedInRoleName != 'GTT Admin') {
        notiData.forEach((elem, ix) => {
          if (this.currentLoginUserId == elem.userid) {
            this.data.push(elem);
          }
        });
      } else {
        this.data = notiData;
      }
    }

    debugger
    console.log(this.data);
  }

  ngOnDestroy() {
    if (this.id) {
      clearInterval(this.id);
    }
  }

}
