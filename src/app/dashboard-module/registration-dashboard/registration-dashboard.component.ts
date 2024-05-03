import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as Highcharts from 'highcharts';
import * as xlsx from 'xlsx';
import { DashboardService } from '../../services/dashboard.service';
import { ProgramDetailsService } from 'src/app/services/program-details.service';
import { Title } from '@angular/platform-browser';
import { formatDate } from '@angular/common';
import { MultiSelect } from 'primeng/multiselect';

@Component({
  selector: 'app-registration-dashboard',
  templateUrl: './registration-dashboard.component.html',
  styleUrls: ['./registration-dashboard.component.css'],
  providers: [MessageService]
})
export class RegistrationDashboardComponent implements OnInit {


  // chart1: Chart;
  regReportChart: any;
  regWithOutReportChart: any;
  batChart: any;
  fbChart: any;
  Highcharts = Highcharts;

  rangeReg: Date[];
  rangeBat: Date[];
  rangeScore: Date[];

  selRange: any;
  addFilter: boolean = false;
  startDay: any;
  endDay: any;
  selectedList: any = 'last7days';
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

  isWithProjectChart: string = '';
  isWithOutProjectChart: string = '';

  isProjectSelect: boolean = false;
  _selectedProjects: any[];
  isBatchSelect: boolean = false;
  _selectedBatches: any[];
  isTrainerSelect: boolean = false;
  _selectedTrainer: any[];

  applyFilter: any;
  applyBatchDetails: any[];
  applyTrainerDetails: any[];
  projectddl: any[];
  selectedProjectLists: any = []

  isMandBatch: boolean = false;
  regData: any;
  batData: any;
  fbData: any;

  regKeys: any[] = ["range", "students", "professional"];
  batKeys: any[] = ["range", "batch"];

  @ViewChild('multiProjects', { static: true }) multiProjects: MultiSelect;    // declare ViewChild
  @ViewChild('multiTrainers', { static: true }) multiTrainers: MultiSelect;    // declare ViewChild
  @ViewChild('multiBatches', { static: true }) multiBatches: MultiSelect;



  constructor(
    private dashboardService: DashboardService,
    public programService: ProgramDetailsService,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    let today = new Date();
    let month = today.getMonth();
    this.maxDateValue = new Date();
    // this.maxDateValue.setMonth(month);

    // this.reg_charts();
    this.projectNameList();
    this.filter('last7days', 'reg');

    // this.filter('last7days', 'bat');
    // this.fb_charts();
    // this.goFb('default');
    // this.getProjectList();

  }


  projectSelect($event) {
    this.filter(this.selectedList, 'reg');
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

  /* projectmanagerList  project details*/
  /* Display Project list*/
  projectNameList() {
    this.programService.getProjectList().subscribe((data) => {
      let activeRecords: any = [];
      if (data.data.length > 0) {
        data.data.forEach((elm, inx) => {
          if (elm.status == 'Active') {
            activeRecords.push(elm);
          }
        });
      }

      this.projectddl = activeRecords.sort((a: any, b: any) =>
        a.project_name.toLowerCase() > b.project_name.toLowerCase() ? 1 : -1
      );

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


  getData(type) {

    if (type == 'reg') {

      if (this.selectedProjectLists.length > 0) {
        this.isWithProjectChart = 'projectData';
        this.isWithOutProjectChart = '';
        let projectIds = this.selectedProjectLists.map(
          (x: { project_id: any }) => x.project_id
        );

        let params = {
          startRange: this.startDay,
          endRange: this.endDay,
          projectId: projectIds
        }


        $('.spinner').show();
        this.dashboardService.getregesterProjectData(params).subscribe((data) => {
          $('.spinner').hide();
          // console.log(data);
          //  let data = {
          //   "code": 200,
          //   "data": [
          //     {
          //       "students": 0,
          //       "project": "0",
          //       "range": "Apr 01",
          //       "professional": 0
          //     },
          //     {
          //       "students": 0,
          //       "project": "0",
          //       "range": "Apr 02",
          //       "professional": 0
          //     },
          //     {
          //       "range": "Apr 03",
          //       "students": 0,
          //       "project": "0",
          //       "professional": 0
          //     },
          //     {
          //       "range": "Apr 04",
          //       "students": 1,
          //       "project": "Infosys",
          //       "professional": 0
          //     },
          //     {
          //       "range": "Apr 05",
          //       "students": 0,
          //       "project": "0",
          //       "professional": 0
          //     },
          //     {
          //       "range": "Apr 06",
          //       "students": 0,
          //       "project": "0",
          //       "professional": 0
          //     },
          //     {
          //       "range": "Apr 07",
          //       "students": 0,
          //       "project": "0",
          //       "professional": 0
          //     },
          //     {
          //       "range": "Apr 08",
          //       "students": 17,
          //       "project": "0",
          //       "professional": 89
          //     },
          //     {
          //       "range": "Apr 09",
          //       "students": 0,
          //       "project": "0",
          //       "professional": 10
          //     },
          //     {
          //       "students": 0,
          //       "project": "0",
          //       "range": "Apr 10",
          //       "professional": 0
          //     },
          //     {
          //       "students": 0,
          //       "project": "0",
          //       "range": "Apr 11",
          //       "professional": 12
          //     },


          //   ],
          //   "status": "Success",
          //   "message": "Data selected for date range provided."
          // };

          this.regData = data.data;
          let datas: any = [];
          data.data.forEach((elem, inx) => {
            if (!datas.hasOwnProperty(elem.range)) {
              datas[elem.range] = [];
            }
            datas[elem.range].push(elem);
          });

          let charts = [];
          for (var key in datas) {

            if (datas[key].length > 1) {
              let projects = [];
              let stuCounts = 0;
              let proCounts = 0;
              datas[key].forEach((e, x) => {
                projects.push({
                  'project': e.project,
                  'students': e.students,
                  'professional': e.professional
                });
                stuCounts += e.students
                proCounts += e.professional;
              });
              charts.push({
                'projects': (projects != null) ? projects: '',
                'students': stuCounts,
                'professional': proCounts,
                'range': key
              });
            } else {
              console.log(datas[key])
              charts.push({
                'projects': (datas[key][0]['project'] != null) ? datas[key][0]['project'] : '',
                'students': datas[key][0]['students'],
                'professional': datas[key][0]['professional'],
                'range': key
              });
            }
          }

          this.reg_charts(charts, this.isWithProjectChart);
          // this.exportExcel(data.data,'reg');
        });
      } else {
        let params = {
          startRange: this.startDay,
          endRange: this.endDay
        }
        this.isWithProjectChart = '';
        this.isWithOutProjectChart = 'withOutProjectData';
        $('.spinner').show();
        this.dashboardService.getregesterData(params).subscribe((data) => {
          $('.spinner').hide();
          console.log(data);
          this.regData = data.data;
          this.reg_charts(data.data, this.isWithOutProjectChart);
          // this.exportExcel(data.data,'reg');
        });

      }
    }
  }



  // Registration Graph Setup
  reg_charts(data, chartType) {

debugger
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
    if (chartType == 'projectData') {
      this.regReportChart = {
        chart: {
          zoomType: 'x',
          resetZoomButton: {
            position: 'left',
          },
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
          },
          min: 1,

        },
        tooltip: {
          // headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
          // pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          //   '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
          // footerFormat: '</table>',
          formatter: function () {
            var xaxis = this.points[0].x;
            var tooltipDesign = '<table>';
            data.forEach((el, ix) => {
              if (xaxis == el.range) {
                tooltipDesign += '<tr><td><small>' + el.range + '<small></td></tr>';
                tooltipDesign += '<tr><td><div style="white-space: normal; max-height: 185px; width: 173px;overflow-y:auto;pointer-events:inherit;"><table>';
                if (Array.isArray(el.projects)) {
                  el.projects.forEach((elx, ixx) => {
                    tooltipDesign += '<tr><td> <small>Project Name: <b>' + elx.project + '</b></small></td></tr>';
                    tooltipDesign += '<tr><td style="color: rgb(124, 181, 236); padding: 0px;"><small> Student: <b style="color:#6b6969">' + elx.students + '</b><small></td></tr>';
                    tooltipDesign += '<tr><td> <small> Professional: <b style="color:#6b6969">' + elx.professional + '</b></td></tr>';
                  });
                } else {
                  tooltipDesign += '<tr><td> <small>Project Name: <b>' + el.projects + '</b></small></td></tr>';
                  tooltipDesign += '<tr><td style="color: rgb(124, 181, 236); padding: 0px;"><small> Student: <b style="color:#6b6969">' + el.students + '</b><small></td></tr>';
                  tooltipDesign += '<tr><td> <small> Professional: <b style="color:#6b6969">' + el.professional + '</b></td></tr>';
                }

                tooltipDesign += '</div></table></td></tr>';
                tooltipDesign += '<tr><td style="color: rgb(124, 181, 236); padding: 0px;"> Total Student: <b style="color:#6b6969">' + el.students + '</b></td></tr>';
                tooltipDesign += '<tr><td> Total Professional: <b style="color:#6b6969">' + el.professional + '</b></td></tr>';
              }
            });

            tooltipDesign += '</table>';
            return tooltipDesign;
          },
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
        },
        ]
      };
    } else {

      this.regWithOutReportChart = {
        chart: {
          zoomType: 'x',
          resetZoomButton: {
            position: 'left',
          },
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
          },
          min: 1,

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
        },
        ]
      };
    }

  }

  onSelect(event, type) {
    console.log(this.rangeReg[0], this.rangeReg[1])
    this.startDay = moment(this.rangeReg[0]).format('YYYY-MM-DD');
    this.endDay = moment(this.rangeReg[1]).format('YYYY-MM-DD');
    if (this.rangeReg[0] && this.rangeReg[1]) {
      // this.regCalendar.overlayVisible=false;
      this.getData(type);
    }

  }


  public downloadPDF(type): void {
    let DATA: any;
    let keys: any;
    let refId: any;
    let name;
    refId = document.getElementById('barChart');
    DATA = this.regData;
    if (this.isWithProjectChart) {
      keys = ['Project', 'Range', 'Students', 'Professional'];
    } else {
      keys = ['Range', 'Students', 'Professional'];
    }

    name = 'registration-record';


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

}
