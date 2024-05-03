import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as Highcharts from 'highcharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ProgramDetailsService } from 'src/app/services/program-details.service';

@Component({
  selector: 'app-batchcreation-dashboard',
  templateUrl: './batchcreation-dashboard.component.html',
  styleUrls: ['./batchcreation-dashboard.component.css'],
  providers: [MessageService]
})
export class BatchcreationDashboardComponent implements OnInit {

  rangeBat: Date[];

  addFilter: boolean = false;
  startDay: any;
  endDay: any;

  isBatDate: boolean = false;
  maxDateValue: Date;
  selectedList: any = 'last7days';



  applyFilter: any;
  applyBatchDetails: any[];
  applyTrainerDetails: any[];
  projectddl: any[];
  selectedProjectLists: any = [];

  isWithProjectChart: string = '';
  isWithOutProjectChart: string = '';


  isMandBatch: boolean = false;
  batData: any;


  batKeys: any[] = ["range", "batch"];

  constructor(public programService: ProgramDetailsService, private dashboardService: DashboardService, private titleService: Title,) { }

  // chart1: Chart;
  regChart: any;
  batWithProjectChart: any;
  batWithOutProjectChart: any
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
    this.projectNameList();
    this.filter('last7days', 'bat');
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }


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


  projectSelect($event) {
    this.filter(this.selectedList, 'bat');
  }

  //Batches Graph Setup
  bat_charts(data, chartType) {

    let category = [];
    let count = [];
    if (data && data.length > 0) {
      data.forEach((elem: any, index: any) => {
        category.push(elem.range);
        count.push(elem.batch);
      });
    }

    if (chartType == 'projectData') {
      this.batWithProjectChart = {
        chart: {
          zoomType: 'x',
          resetZoomButton: {
            position: 'left',
          },
          type: 'column'
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
                    tooltipDesign += '<tr><td style="color: rgb(124, 181, 236); padding: 0px;"><small> Batch: <b style="color:#6b6969">' + elx.batch + '</b><small></td></tr>';
                  });
                } else {
                  tooltipDesign += '<tr><td> <small>Project Name: <b>' + el.projects + '</b></small></td></tr>';
                  tooltipDesign += '<tr><td style="color: rgb(124, 181, 236); padding: 0px;"><small> Batch: <b style="color:#6b6969">' + el.batch + '</b><small></td></tr>';
                }

                tooltipDesign += '</div></table></td></tr>';
                tooltipDesign += '<tr><td style="color: rgb(124, 181, 236); padding: 0px;"> Total Batch Count: <b style="color:#6b6969">' + el.batch + '</b></td></tr>';
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
          name: 'Batch Count',
          data: count,

        }]
      };
    } else {
      this.batWithOutProjectChart = {
        chart: {
          resetZoomButton: {
            position: 'left',
          },
          zoomType: 'x',
          type: 'column',
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
          },
          min: 5,
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




  }


  setValue(event, type) {
    console.log("Event log", event, type);
    this.endDay = undefined;
    this.startDay = undefined;

    if (event == 'cusdate') {
      this.isBatDate = true;
    } else {
      this.isBatDate = false;
      this.filter(event, type);
    }

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

        this.rangeBat = undefined;

        break;
      case 'curmon':
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        this.startDay = moment(firstDay).format('YYYY-MM-DD');
        this.endDay = moment(today).format('YYYY-MM-DD');
        console.log("Current Month    ", this.startDay, this.endDay)

        this.rangeBat = undefined;

        break;
      case 'curyear':
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), 0, 1);
        this.startDay = moment(firstDay).format('YYYY-MM');
        this.endDay = moment(today).format('YYYY-MM');
        console.log("Current Year    ", this.startDay, this.endDay)

        this.rangeBat = undefined;

        break;
      case 'last5years':
        let startYear = new Date();
        const result1 = new Date(startYear.setFullYear(today.getFullYear() - 4));
        this.startDay = moment(result1).format('YYYY');
        this.endDay = moment(today).format('YYYY');
        console.log("Last 5 Years    ", this.startDay, this.endDay)

        this.rangeBat = undefined;

        break;
      default:
        break;
    }
    this.getData(type);

  }


  onSelect(event, type) {

    console.log(this.rangeBat[0], this.rangeBat[1])
    this.startDay = moment(this.rangeBat[0]).format('YYYY-MM-DD');
    this.endDay = moment(this.rangeBat[1]).format('YYYY-MM-DD');
    if (this.rangeBat[0] && this.rangeBat[1]) {
      // this.batCalendar.overlayVisible=false;
      this.getData(type);
    }

  }

  getData(type) {

    if (type == 'bat') {

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
        this.dashboardService.getBatchProjectData(params).subscribe((data) => {
          $('.spinner').hide();
          console.log(data);
          // let data = {
          //   "code": 200,
          //   "data": [
          //     {
          //       'project': "TCS",
          //       "batch": 1,
          //       "range": "Apr 12"
          //     },
          //     {
          //       'project': "TCS_2",
          //       "range": "Apr 12",
          //       "batch": 7
          //     },
          //     {
          //       'project': "TCS_3",
          //       "range": "Apr 14",
          //       "batch": 0
          //     },
          //     {
          //       'project': "TCS_4",
          //       "range": "Apr 15",
          //       "batch": 0
          //     },
          //     {
          //       'project': "TCS_5",
          //       "range": "Apr 16",
          //       "batch": 0
          //     },
          //     {
          //       'project': "TCS_6",
          //       "range": "Apr 17",
          //       "batch": 8
          //     },
          //     {
          //       'project': "TCS_7",
          //       "range": "Apr 17",
          //       "batch": 19
          //     }
          //   ],
          //   "status": "Success",
          //   "message": "Data selected for date range provided."
          // };


          this.batData = data.data;
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
              let batchCounts = 0;
              datas[key].forEach((e, x) => {
                projects.push({
                  'project': e.project,
                  'batch': e.batch,
                });
                batchCounts += e.batch
              });
              charts.push({
                'projects': (projects != null) ? projects : '',
                'batch': batchCounts,
                'range': key
              });
            } else {
              console.log(datas[key])
              charts.push({
                'projects': (datas[key][0]['project'] != null) ? datas[key][0]['project']: '',
                'batch': datas[key][0]['batch'],
                'range': key
              });
            }
          }

          this.bat_charts(charts, this.isWithProjectChart);
        });
      } else {

        this.isWithProjectChart = '';
        this.isWithOutProjectChart = 'withOutProjectData';

        let params = {
          startRange: this.startDay,
          endRange: this.endDay
        }
        $('.spinner').show();
        this.dashboardService.getBatchWithOutProjectData(params).subscribe((data) => {
          $('.spinner').hide();
          this.batData = data.data;
          this.bat_charts(data.data, this.isWithOutProjectChart);
        });
      }


    }

  }



  public downloadPDF(type): void {
    let DATA: any;
    let keys: any;
    let refId: any;
    let name;

    refId = document.getElementById('lineChart');
    if (this.isWithProjectChart == 'projectData') {
      keys = ['Project', 'Range', 'Batch'];
    } else {
      keys = ['Range', 'Batch'];
    }

    DATA = this.batData;
    name = 'batches-conduct-record';

    html2canvas(refId).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('l', 'mm', 'a4');
      PDF.addImage(FILEURI, 'PNG', 10, 10, fileWidth, fileHeight);
      this.arrangeData(keys, DATA, PDF, name);
    });
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
