import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as Highcharts from 'highcharts';
import * as xlsx from 'xlsx';
import { DashboardService } from '../services/dashboard.service';
import { Title } from '@angular/platform-browser';
import { formatDate } from '@angular/common';
import { MultiSelect } from 'primeng/multiselect';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-module',
  templateUrl: './dashboard-module.component.html',
  styleUrls: ['./dashboard-module.component.css'],
  providers: [MessageService]
})
export class DashboardModuleComponent implements OnInit {

  currentPath;
  activeNode;
  constructor(private titleService: Title, private router: Router) { }

  ngOnInit(): void {
    let routerArr = this.router.url.split('/');
    this.currentPath = routerArr[1];
    if(this.currentPath == 'dashboard' && routerArr[2]){
      this.activeNode = routerArr[2];
    } else{
      this.activeNode = 'register';
    }
    console.log("Router path    ",routerArr,' ',this.currentPath)
    this.setTitle('TJM-Dashboard');

  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }


}
