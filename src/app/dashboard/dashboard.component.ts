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

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [MessageService]
})
export class DashboardComponent implements OnInit {

  rangeReg: Date[];
  rangeBat: Date[];
  rangeScore: Date[];

  selRange: any;
  addFilter: boolean = false;
  startDay: any;
  endDay: any;

  activeProjectList: any;
  isRegDate: boolean = false;
  isBatDate: boolean = false;
  maxDateValue: Date;
  trainerId: any;
  trainerName: string = '';
  trainerDetails: any[];
  BatchName: string = '';
  batchDetails: any[];
  projectsId: any;
  projectsName: any = '';
  batchId: any;

  isProjectSelect: boolean = false;
  _selectedProjects: any[];
  isBatchSelect: boolean = false;
  _selectedBatches: any[];
  isTrainerSelect: boolean = false;
  _selectedTrainer: any[];

  applyFilter: any;
  applyBatchDetails: any[];
  applyTrainerDetails: any[];
  yearArray=[];

  isMandBatch: boolean = false;
  regData: any;
  batData: any;
  fbData: any;
  fbYearData: any;

  regKeys: any[] = ["range", "students", "professional"];
  batKeys: any[] = ["range", "batch"];

  @ViewChild('multiProjects', { static: true }) multiProjects: MultiSelect;    // declare ViewChild
  @ViewChild('multiTrainers', { static: true }) multiTrainers: MultiSelect;    // declare ViewChild
  @ViewChild('multiBatches', { static: true }) multiBatches: MultiSelect;    // declare ViewChild


  constructor(private dashboardService: DashboardService, private titleService: Title,) { }

  // chart1: Chart;
  regChart: any;
  batChart: any;
  fbChart: any;

  fbYearChart2: any;

  Highcharts = Highcharts;

  ngOnInit() {
    // this.maxDateValue = new Date();
    this.setTitle('TJM-Dashboard');
    let today = new Date();
    let month = today.getMonth();
    this.maxDateValue = new Date();
    // this.maxDateValue.setMonth(month);

    // this.reg_charts();
    this.filter('last7days', 'reg');
    this.filter('last7days', 'bat');
    // this.fb_charts();

    this.goFb('default');
    this.getProjectList();
    this.yearFb();
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  yearFb(){
    let today = new Date();
    let curYear = moment(today).format('YYYY');
    while(this.yearArray.length<7){
      this.yearArray.push(moment(today).format('YYYY'));
      today.setFullYear(today.getFullYear() - 1);
    }
    this.yearFilter(curYear);
  }

  columnFilter($event: any, type: String) {
    if (type == 'projects') {
      this._selectedProjects = undefined;
      this._selectedProjects = $event.value;
      if (this._selectedProjects.length > 0) {
        this.isProjectSelect = true;
        const found = this._selectedProjects.find(el => el.project_id === 0);
        if (found) {
          this._selectedProjects.forEach((element, index) => {
            if (element.project_id != 0) delete this._selectedProjects[index];
          });
          this.multiProjects.maxSelectionLimitReached = this._selectedProjects.length >= 1;    // Set limit flag
        }
      } else {
        this.isProjectSelect = false;
        this.multiProjects.maxSelectionLimitReached = false;
      }
    } else if (type == 'trainers') {
      this._selectedTrainer = undefined;
      this._selectedTrainer = $event.value;
      if (this._selectedTrainer.length > 0 && this.isProjectSelect) {
        this.isTrainerSelect = true;
        const found = this._selectedTrainer.find(el => el.trainerid === 0);
        if (found) {
          this._selectedTrainer.forEach((element, index) => {
            if (element.trainerid != 0) delete this._selectedTrainer[index];
          });
          this.multiTrainers.maxSelectionLimitReached = this._selectedTrainer.length >= 1;    // Set limit flag
        }
      } else {
        this.isTrainerSelect = false;
        this.multiTrainers.maxSelectionLimitReached = false;
      }
    } else if (type == 'batches') {
      this._selectedBatches = undefined;
      this._selectedBatches = $event.value;
      if (this._selectedBatches.length > 0 && this.isProjectSelect && this.isTrainerSelect) {
        this.isBatchSelect = true;
        const found = this._selectedBatches.find(el => el.batchid === 0);
        if (found) {
          this._selectedBatches.forEach((element, index) => {
            if (element.batchid != 0) delete this._selectedBatches[index];
          });
          this.multiBatches.maxSelectionLimitReached = this._selectedBatches.length >= 1;    // Set limit flag
        }
      } else {
        this.isBatchSelect = false;
        this.multiBatches.maxSelectionLimitReached = false;
      }
    }
  }

  // Registration Graph Setup
  reg_charts(data) {
    this.regData = data;
    let category = [];
    let student = [];
    let professional = [];
    if (data && data.length > 0) {
      data.forEach((elem: any, index: any) => {
        category.push(elem.range);
        student.push(elem.students);
        professional.push(elem.professional);
      });
    }
    this.regChart = {
      chart: {
        zoomType: 'x',
        type: 'column'
      },
      title: {
        text: 'No. of Registrations'
      },
      subtitle: {
        text: 'Click and drag on graph for Zoom-In.'
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories: category,
        crosshair: true
      },
      yAxis: {
        title: {
          useHTML: true,
          text: 'Registrations'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.1,
          borderWidth: 0
        }
      },
      series: [{
        name: 'Student',
        data: student,

      }, {
        name: 'Professional',
        data: professional

      }]
    };
  }

  //Batches Graph Setup
  bat_charts(data) {
    this.batData = data;
    let category = [];
    let count = [];
    if (data && data.length > 0) {
      data.forEach((elem: any, index: any) => {
        category.push(elem.range);
        count.push(elem.batch);
      });
    }
    this.batChart = {
      chart: {
        zoomType: 'x',
        type: 'line'
      },
      title: {
        text: 'No. of batches conduct'
      },
      subtitle: {
        text: 'Click and drag on graph for Zoom-In.'
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories: category,
        crosshair: true
      },
      yAxis: {
        title: {
          useHTML: true,
          text: 'Batches'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.1,
          borderWidth: 0
        }
      },
      series: [{
        name: 'Batch Count',
        data: count,

      }]
    };
  }

  // Avg. Batch score Graph Setup
  fb_charts(data) {
    this.fbData = data;
    let batches = [];
    let countObj = [];
    if (data && data.length > 0) {
      data.forEach((elem: any, index: any) => {
        batches.push(elem.batchcode);
        let obj = {
          y: elem.batchscore,
          pn: elem.projectname,
          tn: elem.trainername,
          ns: elem.noofstudents
        }
        countObj.push(obj);
      });
    }
    this.fbChart = {
      chart: {
        zoomType: 'x',
        type: 'column'
      },
      title: {
        text: 'Avg. Batch score'
      },
      subtitle: {
        text: 'Click and drag on graph for Zoom-In.'
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories: batches,
        crosshair: true
      },
      yAxis: {
        title: {
          useHTML: true,
          text: 'Score'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px"><b>{point.key}</b></span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>' +
          '<tr><td>Students in batch:  </td>' + ' <td style="padding:0"><b>{point.ns}</b></td></tr>' +
          '<tr><td>Project Name:  </td>' + ' <td style="padding:0"><b>{point.pn}</b></td></tr>' +
          '<tr><td>Trainer Name:  </td>' + ' <td style="padding:0"><b>{point.tn}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.1,
          borderWidth: 0
        }
      },
      series: [{
        name: 'Avg. Score',
        data: countObj,

      }]
    };
  }





  // Avg. Batch score Graph Setup
  fb_year_charts(data) {
    this.fbYearData = data;
    let batches = [];
    let countObj = [];
    if (data && data.length > 0) {
      data.forEach((elem: any, index: any) => {
        batches.push(elem.batchcode);
        let obj = {
          y: elem.batchscore,
          pn: elem.projectname,
          tn: elem.trainername,
          ns: elem.noofstudents
        }
        countObj.push(obj);
      });
    }
    this.fbYearChart2 = {
      chart: {
        zoomType: 'x',
        type: 'column'
      },
      title: {
        text: 'Year Avg. Score'
      },
      subtitle: {
        text: 'Click and drag on graph for Zoom-In.'
      },
      credits: {
        enabled: false
      },
      xAxis: {
        categories: batches,
        crosshair: true
      },
      yAxis: {
        title: {
          useHTML: true,
          text: 'Score'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px"><b>{point.key}</b></span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>' +
          '<tr><td>Students in batch:  </td>' + ' <td style="padding:0"><b>{point.ns}</b></td></tr>' +
          '<tr><td>Project Name:  </td>' + ' <td style="padding:0"><b>{point.pn}</b></td></tr>' +
          '<tr><td>Trainer Name:  </td>' + ' <td style="padding:0"><b>{point.tn}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.1,
          borderWidth: 0        }
      },
      series: [{
        name: 'Avg. Year Score',
        data: countObj,

      }]

    };

  }

  randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

  setValue(event, type) {
    console.log("Event log", event, type);
    this.endDay = undefined;
    this.startDay = undefined;
    if (type == 'reg') {
      if (event == 'cusdate') {
        this.isRegDate = true;
      } else {
        this.isRegDate = false;
        this.filter(event, type);
      }
    } else {
      if (event == 'cusdate') {
        this.isBatDate = true;
      } else {
        this.isBatDate = false;
        this.filter(event, type);
      }
    }
  }

  yearFilter(event){
    let params = {
      "year": event
    }
    console.log("Data :----   ", params)
    $('.spinner').show();
    this.dashboardService.getFbYearData(params).subscribe((data) => {
      $('.spinner').hide();
      console.log("fbCharts:----- ", data);
      this.fb_year_charts(data.data);
    });
  }

  filter(event, type) {
    let today = new Date();
    switch (event) {
      case 'last7days':
        let startDate = new Date();
        const result = new Date(startDate.setDate(today.getDate() - 6));
        this.startDay = moment(result).format('YYYY-MM-DD');
        this.endDay = moment(today).format('YYYY-MM-DD');
        console.log("Last 7 Days    ", this.startDay, this.endDay)
        if (type == 'reg') {
          this.rangeReg = undefined;
        } else if (type == 'bat') {
          this.rangeBat = undefined;
        }
        break;
      case 'curmon':
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        this.startDay = moment(firstDay).format('YYYY-MM-DD');
        this.endDay = moment(today).format('YYYY-MM-DD');
        console.log("Current Month    ", this.startDay, this.endDay)
        if (type == 'reg') {
          this.rangeReg = undefined;
        } else if (type == 'bat') {
          this.rangeBat = undefined;
        }
        break;
      case 'curyear':
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), 0, 1);
        this.startDay = moment(firstDay).format('YYYY-MM');
        this.endDay = moment(today).format('YYYY-MM');
        console.log("Current Year    ", this.startDay, this.endDay)
        if (type == 'reg') {
          this.rangeReg = undefined;
        } else if (type == 'bat') {
          this.rangeBat = undefined;
        }
        break;
      case 'last5years':
        let startYear = new Date();
        const result1 = new Date(startYear.setFullYear(today.getFullYear() - 4));
        this.startDay = moment(result1).format('YYYY');
        this.endDay = moment(today).format('YYYY');
        console.log("Last 5 Years    ", this.startDay, this.endDay)
        if (type == 'reg') {
          this.rangeReg = undefined;
        } else if (type == 'bat') {
          this.rangeBat = undefined;
        }
        break;
      default:
        break;
    }
    this.getData(type);

  }

  onTabSelection(type) {
    this.selRange = type;
    this.rangeScore = undefined;
  }
  closePicker() {
    this.selRange = undefined;
    this.rangeScore = undefined;
  }

  clearFilter() {
    this._selectedProjects = undefined;
    this.projectsName = '';
    this.trainerDetails = undefined;
    this._selectedTrainer = undefined;
    this.trainerName = '';
    this.batchDetails = undefined;
    this.BatchName = '';
    this._selectedBatches = null;
    this.rangeScore = undefined;
    this.goFb('default');
  }

  onFilter(isApplied) {
    if (isApplied) {
      if (this.applyFilter) {
        if (this.applyFilter && this.applyFilter.projectid) {
          this._selectedProjects = [];
          if ((this.activeProjectList.length - 1) == this.applyFilter.projectid.length) {
            const initial = {
              "project_id": 0,
              "project_name": "All",
              "status": 'Active'
            }
            this._selectedProjects.push(initial);
          } else {
            for (let i = 0; i < this.activeProjectList.length; i++) {
              if (this.applyFilter.projectid.includes(this.activeProjectList[i].project_id)) {
                this._selectedProjects.push(this.activeProjectList[i]);
              }
            }
          }
        }

        if (this.applyFilter && this.applyFilter.trainerid) {
          this.trainerDetails = undefined;
          this.trainerDetails = this.applyTrainerDetails;
          this._selectedTrainer = [];
          if ((this.trainerDetails?.length - 1) == this.applyFilter.trainerid.length) {
            const initial = {
              "trainerid": 0,
              "trainer_name": "All"
            }
            this._selectedTrainer.push(initial);
          } else {
            for (let i = 0; i < this.trainerDetails?.length; i++) {
              if (this.applyFilter.trainerid.includes(this.trainerDetails[i].trainerid)) {
                this._selectedTrainer.push(this.trainerDetails[i]);
              }
            }
          }
        }

        if (this.applyFilter && this.applyFilter.batchid) {
          this.batchDetails = undefined;
          this.batchDetails = this.applyBatchDetails;
          this._selectedBatches = [];
          if ((this.batchDetails?.length - 1) == this.applyFilter.batchid.length) {
            const initial = {
              "batchid": 0,
              "batchcode": "All"
            }
            this._selectedBatches.push(initial);
          } else {
            for (let i = 0; i < this.batchDetails?.length; i++) {
              if (this.applyFilter.batchid.includes(this.batchDetails[i].batchid)) {
                this._selectedBatches.push(this.batchDetails[i]);
              }
            }
          }
        }

        if (this.applyFilter && this.applyFilter.orgStartRange && this.applyFilter.orgEndRange) {
          this.rangeScore = [];
          this.rangeScore[0] = new Date(this.applyFilter.orgStartRange);
          this.rangeScore[1] = new Date(this.applyFilter.orgEndRange);
        }
      }
    } else {
      this._selectedProjects = undefined;
      this.trainerDetails = undefined;
      this._selectedTrainer = undefined;
      this.batchDetails = undefined;
      this._selectedBatches = null;
      this.rangeScore = undefined;
    }
  }

  goFb(nav) {
    this.isMandBatch = false;
    const project_ids = [];
    if (this._selectedProjects && this._selectedProjects.length > 0) {
      const found = this._selectedProjects.find(el => el.project_id === 0);
      if (found) {
        for (let i = 0; i < this.activeProjectList.length; i++) {
          if (this.activeProjectList[i].project_id != 0) {
            project_ids.push(this.activeProjectList[i].project_id);
          }
        }
      } else {
        for (let i = 0; i < this._selectedProjects.length; i++) {
          project_ids.push(this._selectedProjects[i].project_id);
        }
      }
    }

    const trainer_ids = [];
    if (this._selectedTrainer && this._selectedTrainer.length > 0 && this.isProjectSelect) {
      const found = this._selectedTrainer.find(el => el.trainerid === 0);
      if (found) {
        for (let i = 0; i < this.trainerDetails.length; i++) {
          if (this.trainerDetails[i].trainerid != 0) {
            trainer_ids.push(this.trainerDetails[i].trainerid);
          }
        }
      } else {
        for (let i = 0; i < this._selectedTrainer.length; i++) {
          trainer_ids.push(this._selectedTrainer[i].trainerid);
        }
      }
    }

    const batch_ids = [];
    if (this._selectedBatches && this._selectedBatches.length > 0 && this.isProjectSelect && this.isTrainerSelect) {
      const found = this._selectedBatches.find(el => el.batchid === 0);
      if (found) {
        for (let i = 0; i < this.batchDetails.length; i++) {
          if (this.batchDetails[i].batchid != 0) {
            batch_ids.push(this.batchDetails[i].batchid);
          }
        }
      } else {
        for (let i = 0; i < this._selectedBatches.length; i++) {
          batch_ids.push(this._selectedBatches[i].batchid);
        }
      }
    }

    let params = {};
    this.addFilter = false;
    if (project_ids && project_ids.length > 0) {
      Object.assign(params, { projectid: project_ids });
      this.addFilter = true;
    } else {
      Object.assign(params, { projectid: [] });
    }

    if (trainer_ids && trainer_ids.length > 0) {
      Object.assign(params, { trainerid: trainer_ids });
      this.addFilter = true;
    } else {
      Object.assign(params, { trainerid: [] });
    }
    if (batch_ids && batch_ids.length > 0) {
      Object.assign(params, { batchid: batch_ids });
      this.addFilter = true;
    } else {
      Object.assign(params, { batchid: [] });
    }

    if (this.rangeScore && this.rangeScore[1] && this.rangeScore[0]) {
      Object.assign(params, { startRange: moment(this.rangeScore[0]).format('YYYY-MM-DD') });
      Object.assign(params, { endRange: moment(this.rangeScore[1]).format('YYYY-MM-DD') });
      this.addFilter = true;
    } else {
      const today = new Date();
      if (nav == 'default') {
        let dt = new Date();
        dt.setMonth(dt.getMonth() - 1)
        Object.assign(params, { startRange: moment(dt).format('YYYY-MM-DD') });
        Object.assign(params, { endRange: moment(today).format('YYYY-MM-DD') });
      } else {
        var firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        Object.assign(params, { startRange: moment(firstDay).format('YYYY-MM-DD') });
        Object.assign(params, { endRange: moment(today).format('YYYY-MM-DD') });
      }

    }

    if (trainer_ids && trainer_ids.length > 0) {
      if (!batch_ids || batch_ids.length == 0) {
        this.isMandBatch = true;
        return;
      }
    }

    console.log("Data :----   ", params)
    $('.spinner').show();
    this.dashboardService.getFbData(params).subscribe((data) => {
      $('.spinner').hide();
      console.log("fbCharts:----- ", data);
      if (this.rangeScore && this.rangeScore[1] && this.rangeScore[0]) {
        Object.assign(params, { orgStartRange: moment(this.rangeScore[0]).format('YYYY-MM-DD') });
        Object.assign(params, { orgEndRange: moment(this.rangeScore[1]).format('YYYY-MM-DD') });
      }
      this.applyFilter = params;
      this.applyBatchDetails = this.batchDetails;
      this.applyTrainerDetails = this.trainerDetails;
      ($('#filter') as any).modal('hide');
      this.fb_charts(data.data);
    });

  }

  onSelect(event, type) {
    if (type == 'reg') {
      console.log(this.rangeReg[0], this.rangeReg[1])
      this.startDay = moment(this.rangeReg[0]).format('YYYY-MM-DD');
      this.endDay = moment(this.rangeReg[1]).format('YYYY-MM-DD');
      if (this.rangeReg[0] && this.rangeReg[1]) {
        // this.regCalendar.overlayVisible=false;
        this.getData(type);
      }
    } else if (type == 'bat') {
      console.log(this.rangeBat[0], this.rangeBat[1])
      this.startDay = moment(this.rangeBat[0]).format('YYYY-MM-DD');
      this.endDay = moment(this.rangeBat[1]).format('YYYY-MM-DD');
      if (this.rangeBat[0] && this.rangeBat[1]) {
        // this.batCalendar.overlayVisible=false;
        this.getData(type);
      }
    }
    // else {
    //   // console.log(this.rangeScore[0], this.rangeScore[1])
    //   // this.startDay = moment(this.rangeScore[0]).format('YYYY-MM-DD');
    //   // this.endDay = moment(this.rangeScore[1]).format('YYYY-MM-DD');
    //   if(this.rangeScore[1]){
    //     this.fbCalendar.overlayVisible=false;
    //     // this.getData(type);
    //   }
    // }

  }

  getData(type) {
    if (type == 'reg') {
      let params = {
        startRange: this.startDay,
        endRange: this.endDay
      }
      $('.spinner').show();
      this.dashboardService.getregesterData(params).subscribe((data) => {
        $('.spinner').hide();
        console.log(data);
        this.reg_charts(data.data);
        // this.exportExcel(data.data,'reg');
      });
    } else if (type == 'bat') {
      let params = {
        startRange: this.startDay,
        endRange: this.endDay
      }
      $('.spinner').show();
      this.dashboardService.getBatchWithOutProjectData(params).subscribe((data) => {
        $('.spinner').hide();
        console.log(data);
        this.bat_charts(data.data);
      });
    } else {

    }
  }

  getProjectList() {
    $('.spinner').show();
    this.dashboardService.getProjectList().subscribe((data) => {
      $('.spinner').hide();
      console.log(data);
      let projectDetails = data.data.sort((a: any, b: any) =>
        a.project_name > b.project_name ? 1 : -1
      );
      const ProjectList = projectDetails.filter(function (el) {
        return el.status == 'Active';
      });
      if (ProjectList?.length > 0) {
        const initial = {
          "project_id": 0,
          "project_name": "All",
          "status": 'Active'
        }
        this.activeProjectList = [initial].concat(ProjectList);
      } else {
        this.activeProjectList = ProjectList;
      }

    });
  }

  /* Display Program List*/
  getTrainerByProjectId(project: any) {
    this.trainerName = "";
    this.trainerDetails = [];
    this.BatchName = "";
    this.batchDetails = [];
    console.log(this.projectsName);
    let projectInfo = project.split('_', 2);
    this.projectsId = projectInfo[0];
    // this.projectsName = project;
    $('.spinner').show();
    this.dashboardService
      .getTrainerListByProjectId(this.projectsId)
      .subscribe((data) => {
        $('.spinner').hide();
        this.trainerDetails = data.data.sort((a: any, b: any) =>
          a.trainer_name > b.trainer_name ? 1 : -1
        );

      });
  }

  getTrainersByProjectId() {
    console.log("Ids:------  ", this._selectedProjects)
    this.trainerDetails = undefined;
    this._selectedTrainer = undefined;
    this.batchDetails = undefined;
    this._selectedBatches = undefined;
    const project_ids = [];
    const found = this._selectedProjects.find(el => el.project_id === 0);
    if (found) {
      for (let i = 0; i < this.activeProjectList.length; i++) {
        if (this.activeProjectList[i].project_id != 0) {
          project_ids.push(this.activeProjectList[i].project_id);
        }
      }
    } else {
      for (let i = 0; i < this._selectedProjects.length; i++) {
        project_ids.push(this._selectedProjects[i].project_id);
      }
    }

    const params = {
      projectids: project_ids
    }
    console.log("Multi Projects ids:---  ", params);

    $('.spinner').show();
    this.dashboardService
      .getTrainerListByProjectIds(params)
      .subscribe((data) => {
        $('.spinner').hide();
        const trainers = data.data.sort((a: any, b: any) =>
          a.trainer_name > b.trainer_name ? 1 : -1
        );
        if (trainers?.length > 0) {
          const initial = {
            "trainerid": 0,
            "trainer_name": "All"
          }
          this.trainerDetails = [initial].concat(trainers);
        } else {
          this.trainerDetails = trainers;
        }

        this.batchDetails = undefined;
        this._selectedBatches = undefined;
        this.isBatchSelect = false;

      });

    // const data = [{ "trainerid": 7794, "trainer_name": "Rahim Nisha" }, { "trainer_name": "AnneTR TR", "trainerid": 7393 }, { "trainerid": 7403, "trainer_name": "Hrithik Bhatt" }];
  }

  /* Display Trainer List*/
  getBatchByProjTrainerId(trainer: any) {
    this.BatchName = "";
    this.batchDetails = [];

    let trainerInfo = trainer.split('_', 2);
    this.trainerId = trainerInfo[0];
    // this.trainerName = trainer;

    let params = {
      project_id: this.projectsId,
      trainer_id: this.trainerId
    }
    $('.spinner').show();
    this.dashboardService
      .getBatchListByProjTrainer(params)
      .subscribe((data) => {
        $('.spinner').hide();
        this.batchDetails = data.data.sort((a: any, b: any) =>
          a.batchcode > b.batchcode ? 1 : -1
        );
      });
  }

  getBatchsByProjTrainerId() {
    this.batchDetails = undefined;
    this._selectedBatches = undefined;
    const project_ids = [];
    const found = this._selectedProjects.find(el => el.project_id === 0);
    if (found) {
      for (let i = 0; i < this.activeProjectList.length; i++) {
        if (this.activeProjectList[i].project_id != 0) {
          project_ids.push(this.activeProjectList[i].project_id);
        }
      }
    } else {
      for (let i = 0; i < this._selectedProjects.length; i++) {
        project_ids.push(this._selectedProjects[i].project_id);
      }
    }

    const trainer_ids = [];
    const found1 = this._selectedTrainer.find(el => el.trainerid === 0);
    if (found1) {
      for (let i = 0; i < this.trainerDetails.length; i++) {
        if (this.trainerDetails[i].trainerid != 0) {
          trainer_ids.push(this.trainerDetails[i].trainerid);
        }
      }
    } else {
      for (let i = 0; i < this._selectedTrainer.length; i++) {
        trainer_ids.push(this._selectedTrainer[i].trainerid);
      }
    }

    let params = {
      projectids: project_ids,
      trainerids: trainer_ids,
    };
    console.log("Multi trainers ids:---  ", params);

    $('.spinner').show();
    this.dashboardService
      .getBatchListByProjTrainers(params)
      .subscribe((data) => {
        $('.spinner').hide();
        const batches = data.data.sort((a: any, b: any) =>
          a.batchcode > b.batchcode ? 1 : -1
        );
        if (batches?.length > 0) {
          const initial = {
            "batchid": 0,
            "batchcode": "All"
          }
          this.batchDetails = [initial].concat(batches);
        } else {
          this.batchDetails = batches;
        }

      });
    // const data = [{ "batchid": 77, "batchcode": "Atos Syntel001-KKT" }];


  }
  getBatchId(batch: any) {
    let batchInfo = batch.split('_', 2);
    this.batchId = batchInfo[0];
    // this.BatchName = batchInfo[1];
  }

  public downloadPDF(type): void {
    let DATA: any;
    let keys: any;
    let refId: any;
    let name;
    if (type == 'reg') {
      refId = document.getElementById('barChart');
      DATA = this.regData;
      keys = ['Range', 'Students', 'Professional'];
      name = 'registration-record';
    } else if (type == 'bat') {
      refId = document.getElementById('lineChart');
      keys = ['Range', 'Batch'];
      DATA = this.batData;
      name = 'batches-conduct-record';
    } else if(type == 'yfb'){
      refId = document.getElementById('singlebarChart2');
      keys = ['Project name', 'Trainer name', 'Batch code', 'Students in batch', 'Batch score'];
      DATA = this.fbYearData;
      name = 'year-batch-score-record';
    } else {
      refId = document.getElementById('singlebarChart');
      keys = ['Project name', 'Trainer name', 'Batch code', 'Students in batch', 'Batch score'];
      DATA = this.fbData;
      name = 'batch-score-record';
    }

    html2canvas(refId).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('l', 'mm', 'a4');
      PDF.addImage(FILEURI, 'PNG', 10, 10, fileWidth, fileHeight);
      this.arrangeData(keys, DATA, PDF, name);
    });

    // html2canvas(refId).then((canvas) => {
    //   const workbook = xlsx.utils.book_new(); // create a new blank book

    //   const base64Canvas = canvas.toDataURL("image/jpeg").split(';base64,')[1];
    //   const workSheet = xlsx.utils.json_to_sheet(data);

    //   const imageId2 = workbook.addImage({
    //     base64: base64Canvas,
    //     extension: 'png',
    //   });


    // });

    // this.exportExcel(DATA, name);
  }

  arrangeData(key, data, pdf, name) {
    let keys: any = key;
    let values: any = [];
    if (data.length > 0) {
      // for (let key in data[0]) {
      //   // Whatever you want to do with key or obj[key]
      //   // console.log("Keys:    ",key,data[0][key]);
      //   keys.push(key);
      // }
      data.forEach(element => {
        var temp = [];
        keys.forEach(key => {
          if (key == 'Students in batch') {
            key = 'No. of students'
          }
          temp.push(element[key.toLowerCase().replace(/[\W_]/g, "")]);
        });
        values.push(temp);
      });
      pdf.addPage();
      pdf.autoTable(keys, values, {
        tableLineColor: [189, 195, 199],
        tableLineWidth: 0.75,
        theme: "grid",
        styles: {
          halign: 'center'
        },
        startY: 10,
        margin: {
          top: 10
        },
        headerStyles: {
          //Not getting what to be done here
        },
      });
      pdf.save(name + '.pdf');

    }
  }

  exportExcel(data, name) {
    const workBook = xlsx.utils.book_new(); // create a new blank book
    const workSheet = xlsx.utils.json_to_sheet(data);

    xlsx.utils.book_append_sheet(workBook, workSheet, name); // add the worksheet to the book
    xlsx.writeFile(workBook, name + '.xlsx'); // initiate a file download in browser
  }


  onPointSelect(event) {
    console.log("Clicking event", event)
  }

}




