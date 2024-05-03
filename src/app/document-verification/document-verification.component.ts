import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Row } from 'jspdf-autotable';
import { MultiSelectModule } from 'primeng/multiselect';
import { DocumentVerificationService } from '../services/document-verification.service';
import { ProjectDetailsService } from 'src/app/services/project-details.service';
import { MessageService } from 'primeng/api';
import * as jsPDF from 'jspdf';
import * as xlsx from 'xlsx';
import 'jspdf-autotable';
import * as FileSaver from 'file-saver';
import { Title } from '@angular/platform-browser';
import { ExportToCsv } from 'export-to-csv';
import { environment } from 'src/environments/environment';
import * as JSZip from 'jszip';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { delay, Observable } from 'rxjs';

@Component({
  selector: 'app-document-verification',
  templateUrl: './document-verification.component.html',
  providers: [MessageService],
  styleUrls: ['./document-verification.component.css']
})
export class DocumentVerificationComponent implements OnInit {

  rightSideMenus: any = [];
  roles: any = [];
  user: any = '';
  public loggedInRoleName: string;
  public accessRoleNames: any = [];
  loggedInRoleId: number;
  currentTab1: string = "atos syntel";
  currentTab2: string = "";
  projectid: any;
  label: any
  currentUserId: number;
  currentProjectId: number;
  document: any;

  withoutValidationFile: any = [];

  /*Atos Tab*/
  _selectedColumns: any[];
  documentDetails: any;
  cols: any[];
  exportColumns: any[];
  exportCols: any[];
  columns: any = [];
  fieldArr: any = [];
  names: any[];
  public atosGlobalFilter: any = [];
  _selectedAtosColumns: any = [];
  _selectedAtosColumnsDub: any = [];
  dbStatus: any = [];
  exportAtos: string = "Atos Syntel Details";

  // RBL-GTTF
  documentRblGttfDetails: any;
  _selectedRblGttfColumns: any = [];
  _selectedRblGttfColumnsDub: any = [];
  selectedRblGttfDetails: any = [];
  exportRblGttf: string = "RBL-GTTF-Details";
  rblGttfCols: any[];
  rblGttfExportColumns: any[];
  rblGttfExportCols: any[];
  rblGttfColumns: any = [];
  fieldrblGttfArr: any = [];
  rblGttfGlobalFilter: any = [];
  uploadedRblGttfCertificate: any = [];


  // Infosys
  documentInfosysDetails: any;
  _selectedInfosysColumns: any = [];
  _selectedInfosysColumnsDub: any = [];
  selectedInfosysDetails: any = [];
  exportInfosys: string = "Infosys-Details";
  infosysCols: any[];
  infosysExportColumns: any[];
  infosysExportCols: any[];
  infoysColumns: any = [];
  fieldInfosysArr: any = [];
  infosysGlobalFilter: any = [];
  uploadedInfosysCertificate: any = [];


  /*RBL Tab*/
  _selectedRblColumns: any = []
  _selectedRblColumnsDub: any = [];
  documentrblDetails: any;
  rblcols: any[];
  rblexportColumns: any[];
  rblexportCols: any[];
  rblcolumns: any = [];
  fieldrblArr: any = [];
  rblGlobalFilter: any = [];
  atosddl: any;
  rowData: any;
  myFiles: any = [];
  validOptions: any = [];
  currentUploadDocIds: any = [];
  uploadedRBLCertificate: any = [];
  uploadedATOSCertificate: any = [];
  exportRbl: string = "RBL-NES-Details";
  selectedRblDetails: any = [];
  selectedAtosDetails: any = [];
  atosWithoutFileUpload: any = [];

  // activeProjects = ['atos syntel', 'rbl-gttf', 'rbl-nes', 'infosys'];
  activeProjects = ['atos syntel', 'rbl-nes', 'infosys'];
  currentProjectsDetails: any;
  listActiveProjects: any = [];

  /*Selected Viewicon*/
  selectedview: any = [];

  constructor(
    private httpClient: HttpClient,
    public documentverificationService: DocumentVerificationService,
    private messageService: MessageService,
    public projectService: ProjectDetailsService,
    private titleService: Title,
  ) {

    /* ATOS Details */
    this._selectedAtosColumns = [
      { field: 'gtt_id', header: 'Gtt Id', align: 'center' },
      { field: 'first_name', header: 'First Name', align: 'center' },
      { field: 'last_name', header: 'Last Name', align: 'center' },
      // { field: 'Father Name', header: 'Father Name', align: 'center' },
      // { field: 'Mother Name', header: 'Mother Name', align: 'center' },
      // { field: 'Total members in the family', header: 'Total Members In The Family', align: 'center' },
      // { field: 'Address', header: 'Address', align: 'center' },
      // { field: 'action', header: 'Action', align: 'center' },
    ];

    this._selectedAtosColumnsDub = this._selectedAtosColumns;

    this.atosGlobalFilter = [
      'gtt_id',
      'first_name',
      'last_name',
      'Father Name',
      'Mother Name'
    ];

    this.uploadedATOSCertificate = [
      'Father Name',
      'Mother Name',
      'Total members in the family',
      'Address',
      '10th marksheet(Original)',
      '12th marksheet(Original)',
      'Graduation consolidated marksheet(Original)',
      'Aadhar/Pan Document(Original)',
      'Income Proof(Ration Card/Income Certificate/Self Declaration)(Original)',
      'Passport size photo(Original)',
      'Updated Resume(Original)'
    ];

    // ================================================

    /* RBL-GTTF Details */
    this._selectedRblGttfColumns = [
      { field: 'gtt_id', header: 'Gtt Id', align: 'center' },
      { field: 'first_name', header: 'First Name', align: 'center' },
      { field: 'last_name', header: 'Last Name', align: 'center' },
      // { field: 'Father Name', header: 'Father Name', align: 'center' },
      // { field: 'Mother Name', header: 'Mother Name', align: 'center' },
    ];

    this._selectedRblGttfColumnsDub = this._selectedRblGttfColumns;

    this.rblGttfGlobalFilter = [
      'gtt_id',
      'first_name',
      'last_name',
      'Father Name',
      'Mother Name'
    ];

    this.uploadedRblGttfCertificate = [
      'Father Name',
      'Mother Name',
      'Pan Number',
      'Religion',
      'Address'
    ];


    /* RBL Details */
    this._selectedRblColumns = [
      { field: 'gtt_id', header: 'Gtt Id', align: 'center' },
      { field: 'first_name', header: 'First Name', align: 'center' },
      { field: 'last_name', header: 'Last Name', align: 'center' },
      // { field: 'Address', header: 'Address', align: 'center' },
    ];
    this._selectedRblColumnsDub = this._selectedRblColumns;

    this.rblGlobalFilter = [
      'gtt_id',
      'first_name',
      'last_name',
    ];

    this.uploadedRBLCertificate = [
      'Aadhar/Pan Document(Original)',
      'Income Proof(Ration Card/Income Certificate/Self Declaration)(Original)',
      'Caste Proof(Leaving Certificate/Caste Certificate)(Original)',
    ];

    /* Infosys Details */
    this._selectedInfosysColumns = [
      { field: 'gtt_id', header: 'Gtt Id', align: 'center' },
      { field: 'first_name', header: 'First Name', align: 'center' },
      { field: 'last_name', header: 'Last Name', align: 'center' },
      // { field: 'Whatsapp Group Name', header: 'Whatsapp Group Name', align: 'center' },
      // { field: 'Father Name', header: 'Father Name', align: 'center' },
      // { field: 'action', header: 'Action', align: 'center' },
    ];

    this._selectedInfosysColumnsDub = this._selectedInfosysColumns;

    this.uploadedInfosysCertificate = [
      'Updated Resume(Original)',
      'Aadhar/Pan Document',
      'Passport size photo(Original)',
      'Signature(Original)',
      '10th marksheet(Original)',
      '10th board certificate(Original)',
      '12th marksheet(Original)',
      '12th board certificate',
      'Graduation consolidated marksheet(Original)',
      'Graduation professional degree certificate',
      'PG consolidated marksheet(Original)',
      'PG provisional degree certificate(Original)',
      'LOI Document(Original)'
    ];

    this.infosysGlobalFilter = [
      'gtt_id',
      'first_name',
      'last_name',
    ];

    this.dbStatus = ['Yet to verify', 'Yes'];

  }


  downloadFile(url) {
    $('.spinner').show();
    this.documentverificationService.getFileDownload(url).subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.status == 'Success') {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: response.message,
          });
        }
      },
      error: (ErrResponse) => {
        $('.spinner').hide();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: ErrResponse.error.data,
        });
      },
    });
  }


  ngOnInit(): void {
    this.listOfProjects();
    this.setTitle('TJM-Document Verification');
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  listOfProjects() {
    $('.spinner').show();
    this.projectService.getProjectDetails().subscribe({
      next: (response) => {
        $('.spinner').hide();

        // let response = {
        //   "code": 200,
        //   "data": [
        //     {
        //       "project_id": 123,
        //       "project_name": "RBL-GTTF",
        //       "start_date": "2022-04-01 00:00:00",
        //       "end_date": "2023-03-31 00:00:00",
        //       "status": "Inactive",
        //       "terms_and_conditions": "No",
        //       "project_manager_id": "7390",
        //       "project_manager_name": "EmmaPM PM",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 124,
        //       "project_name": "RBL-NES",
        //       "start_date": "2022-05-01 00:00:00",
        //       "end_date": "2022-09-01 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": "Yes",
        //       "project_manager_id": "7390,7391,7482",
        //       "project_manager_name": "EmmaPM PM,GitaPM PM,Zami A",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 125,
        //       "project_name": "Infosys",
        //       "start_date": "2022-04-01 00:00:00",
        //       "end_date": "2023-03-31 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": "No",
        //       "project_manager_id": "7390,7391,7482",
        //       "project_manager_name": "EmmaPM PM,GitaPM PM,Zami A",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 128,
        //       "project_name": "Atos Syntel",
        //       "start_date": "2022-09-09 00:00:00",
        //       "end_date": "2024-01-01 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": "Yes",
        //       "project_manager_id": "7482",
        //       "project_manager_name": "Zami A",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 386,
        //       "project_name": "Tata 2",
        //       "start_date": "2023-02-01 00:00:00",
        //       "end_date": "2023-02-16 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": "No",
        //       "project_manager_id": "7482",
        //       "project_manager_name": "Zami A",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 387,
        //       "project_name": "Project(2022-2023)",
        //       "start_date": "2023-02-01 00:00:00",
        //       "end_date": "2023-02-27 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": "Yes",
        //       "project_manager_id": "7390,7391,7482",
        //       "project_manager_name": "EmmaPM PM,GitaPM PM,Zami A",
        //       "generate_link": null,
        //       "file_name": "Admin Bulk Template (12).xlsx",
        //       "version": "V2.12",
        //       "terms_and_condition_url": "https://tjmfiles.blob.core.windows.net/tjmfiles/termsAndcondtions/387/termsAndcondtion/0.7995164494347373Admin%20Bulk%20Template%20(12).xlsx?sig=1Qnk9GMuYDb%2B2%2BEzmSNo23Xj501ZDX8RtrHWCpP%2FEDQ%3D&st=2023-04-26T19%3A40%3A52Z&se=2023-04-28T10%3A40%3A52Z&sv=2019-02-02&si=DownloadPolicy&sr=b"
        //     },
        //     {
        //       "project_id": 388,
        //       "project_name": "Bts77",
        //       "start_date": "2023-03-01 00:00:00",
        //       "end_date": "2023-03-22 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": "No",
        //       "project_manager_id": "26201",
        //       "project_manager_name": "Yamnini ",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 389,
        //       "project_name": "Demo project",
        //       "start_date": "2023-02-01 00:00:00",
        //       "end_date": "2023-02-22 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": "No",
        //       "project_manager_id": "7482",
        //       "project_manager_name": "Zami A",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 390,
        //       "project_name": "Test project",
        //       "start_date": "2023-03-01 00:00:00",
        //       "end_date": "2023-06-30 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": "No",
        //       "project_manager_id": "26208",
        //       "project_manager_name": "Vijay ",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 391,
        //       "project_name": "Url",
        //       "start_date": "2023-03-01 00:00:00",
        //       "end_date": "2023-05-31 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": "No",
        //       "project_manager_id": "26201,7482",
        //       "project_manager_name": "Yamnini ,Zami A",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 392,
        //       "project_name": "A2",
        //       "start_date": "2023-01-01 00:00:00",
        //       "end_date": "2027-11-24 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": "No",
        //       "project_manager_id": "26201,26208,7482",
        //       "project_manager_name": "Yamnini ,Vijay ,Zami A",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 393,
        //       "project_name": "Project abcd_",
        //       "start_date": "2023-02-01 00:00:00",
        //       "end_date": "2023-05-29 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": "Yes",
        //       "project_manager_id": "26201,7482",
        //       "project_manager_name": "Yamnini ,Zami A",
        //       "generate_link": null,
        //       "file_name": "Bheem.pdf",
        //       "version": "V1.05",
        //       "terms_and_condition_url": "https://tjmfiles.blob.core.windows.net/tjmfiles/termsAndcondtions/393/termsAndcondtion/0.7095783060154425Bheem.pdf?sig=1aZn%2Fnp0dAIfq8zfWgdTwNyDqaxug72i%2FcNwNe9c3ZU%3D&st=2023-04-26T19%3A40%3A52Z&se=2023-04-28T10%3A40%3A52Z&sv=2019-02-02&si=DownloadPolicy&sr=b"
        //     },
        //     {
        //       "project_id": 394,
        //       "project_name": "A2b project",
        //       "start_date": "2023-03-01 00:00:00",
        //       "end_date": "2023-03-31 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": "No",
        //       "project_manager_id": "7391,7482",
        //       "project_manager_name": "GitaPM PM,Zami A",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 395,
        //       "project_name": "Poc",
        //       "start_date": "2023-03-01 00:00:00",
        //       "end_date": "2023-05-31 00:00:00",
        //       "status": "Inactive",
        //       "terms_and_conditions": "No",
        //       "project_manager_id": "7391",
        //       "project_manager_name": "GitaPM PM",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 396,
        //       "project_name": "Aaa",
        //       "start_date": "2023-03-01 00:00:00",
        //       "end_date": "2023-03-31 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": "No",
        //       "project_manager_id": "26201,26208,7482",
        //       "project_manager_name": "Yamnini ,Vijay ,Zami A",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 397,
        //       "project_name": "Ggg",
        //       "start_date": "2023-03-01 00:00:00",
        //       "end_date": "2023-03-31 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": "No",
        //       "project_manager_id": "26226",
        //       "project_manager_name": "Thameem ",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 398,
        //       "project_name": "Url123456",
        //       "start_date": "2023-03-01 00:00:00",
        //       "end_date": "2023-05-31 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": "No",
        //       "project_manager_id": "26227",
        //       "project_manager_name": "Ponmozhi ",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 399,
        //       "project_name": "uiop",
        //       "start_date": "2022-09-12 00:00:00",
        //       "end_date": "2023-09-12 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": null,
        //       "project_manager_id": "26229,26230",
        //       "project_manager_name": "Dheena ,Dheena ",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 400,
        //       "project_name": "Life cell123",
        //       "start_date": "2023-03-01 00:00:00",
        //       "end_date": "2023-04-30 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": "No",
        //       "project_manager_id": "26227,26230",
        //       "project_manager_name": "Ponmozhi ,Dheena ",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 401,
        //       "project_name": "Jd 2",
        //       "start_date": "2023-03-01 00:00:00",
        //       "end_date": "2023-03-31 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": "Yes",
        //       "project_manager_id": "43528,43530,43531",
        //       "project_manager_name": "Reagan Escobar,Damarion Cantu,Briley Buckley",
        //       "generate_link": null,
        //       "file_name": "certificate (3).pdf",
        //       "version": "z1.7",
        //       "terms_and_condition_url": "https://tjmfiles.blob.core.windows.net/tjmfiles/termsAndcondtions/401/termsAndcondtion/0.8959251435663648certificate%20(3).pdf?sig=d7%2BNZn%2BJmvoxNmvF42Ir3FmpHaPfL4zYR9hEHGT14NY%3D&st=2023-04-26T19%3A40%3A52Z&se=2023-04-28T10%3A40%3A52Z&sv=2019-02-02&si=DownloadPolicy&sr=b"
        //     },
        //     {
        //       "project_id": 402,
        //       "project_name": "Ferrary",
        //       "start_date": "2023-04-12 00:00:00",
        //       "end_date": "2023-04-18 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": "No",
        //       "project_manager_id": "43531",
        //       "project_manager_name": "Briley Buckley",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 403,
        //       "project_name": "Hd",
        //       "start_date": "2023-04-01 00:00:00",
        //       "end_date": "2023-05-31 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": "No",
        //       "project_manager_id": "43496,43500,43501,43502",
        //       "project_manager_name": "Cade Weiss,Andreas Ruiz,Desirae Newman,Deven Huffman",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 404,
        //       "project_name": "Demo barclays 2023",
        //       "start_date": "2023-04-12 00:00:00",
        //       "end_date": "2024-01-24 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": "No",
        //       "project_manager_id": "26208",
        //       "project_manager_name": "Vijay ",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 405,
        //       "project_name": "Demo 1 barclays 2023",
        //       "start_date": "2023-04-12 00:00:00",
        //       "end_date": "2023-04-30 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": "No",
        //       "project_manager_id": "26208",
        //       "project_manager_name": "Vijay ",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 406,
        //       "project_name": "Project Denny",
        //       "start_date": "2023-04-13 00:00:00",
        //       "end_date": "2024-08-15 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": null,
        //       "project_manager_id": "43532",
        //       "project_manager_name": "Cassandra Hogan",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 407,
        //       "project_name": "Project 111",
        //       "start_date": "2023-04-01 00:00:00",
        //       "end_date": "2023-05-31 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": "No",
        //       "project_manager_id": "43528,43529,43530,43531",
        //       "project_manager_name": "Reagan Escobar,Alivia Drake,Damarion Cantu,Briley Buckley",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 408,
        //       "project_name": "Barclays",
        //       "start_date": "2023-03-01 00:00:00",
        //       "end_date": "2023-03-29 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": "No",
        //       "project_manager_id": "43532",
        //       "project_manager_name": "Cassandra Hogan",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 409,
        //       "project_name": "Project Dennx",
        //       "start_date": "2023-04-14 00:00:00",
        //       "end_date": "2024-08-15 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": null,
        //       "project_manager_id": "43532",
        //       "project_manager_name": "Cassandra Hogan",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 410,
        //       "project_name": "YT project",
        //       "start_date": "2022-04-14 00:00:00",
        //       "end_date": "2024-08-15 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": null,
        //       "project_manager_id": "43532",
        //       "project_manager_name": "Cassandra Hogan",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 411,
        //       "project_name": "Apr 17th project",
        //       "start_date": "2022-04-14 00:00:00",
        //       "end_date": "2024-08-15 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": null,
        //       "project_manager_id": "43523,43532",
        //       "project_manager_name": "Cooper Nielsen,Cassandra Hogan",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 412,
        //       "project_name": "Apr 17th project 2",
        //       "start_date": "2022-04-14 00:00:00",
        //       "end_date": "2024-08-15 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": null,
        //       "project_manager_id": "43523,43525,43526,43532",
        //       "project_manager_name": "Cooper Nielsen,Franco Armstrong,Ainsley Pena,Cassandra Hogan",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 413,
        //       "project_name": "Project Dennr",
        //       "start_date": "2023-04-18 00:00:00",
        //       "end_date": "2024-08-19 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": null,
        //       "project_manager_id": "43532",
        //       "project_manager_name": "Cassandra Hogan",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 414,
        //       "project_name": "Project 729",
        //       "start_date": "2023-04-18 00:00:00",
        //       "end_date": "2024-08-19 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": null,
        //       "project_manager_id": "43523,43525,43526,43532",
        //       "project_manager_name": "Cooper Nielsen,Franco Armstrong,Ainsley Pena,Cassandra Hogan",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 415,
        //       "project_name": "Ritz",
        //       "start_date": "2023-04-01 00:00:00",
        //       "end_date": "2023-06-30 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": "Yes",
        //       "project_manager_id": "43528,43530,43531",
        //       "project_manager_name": "Reagan Escobar,Damarion Cantu,Briley Buckley",
        //       "generate_link": null,
        //       "file_name": "certificate (8).pdf",
        //       "version": "Z2",
        //       "terms_and_condition_url": "https://tjmfiles.blob.core.windows.net/tjmfiles/termsAndcondtions/415/termsAndcondtion/0.028744059350313544certificate%20(8).pdf?sig=TMoOa5ej8guFCdxZZ2CeGYDlTTIt%2B2uhoRltYSgWxko%3D&st=2023-04-26T19%3A40%3A52Z&se=2023-04-28T10%3A40%3A52Z&sv=2019-02-02&si=DownloadPolicy&sr=b"
        //     },
        //     {
        //       "project_id": 416,
        //       "project_name": "Skta",
        //       "start_date": "2023-04-01 00:00:00",
        //       "end_date": "2023-06-30 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": "No",
        //       "project_manager_id": "43529,43530,43532",
        //       "project_manager_name": "Alivia Drake,Damarion Cantu,Cassandra Hogan",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 417,
        //       "project_name": "Demo java project",
        //       "start_date": "2023-04-26 00:00:00",
        //       "end_date": "2023-04-30 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": "No",
        //       "project_manager_id": "43284",
        //       "project_manager_name": "Philip ",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 418,
        //       "project_name": "Demo python project",
        //       "start_date": "2023-04-26 00:00:00",
        //       "end_date": "2023-04-30 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": "No",
        //       "project_manager_id": "43284",
        //       "project_manager_name": "Philip ",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 419,
        //       "project_name": "Sds",
        //       "start_date": "2023-04-01 00:00:00",
        //       "end_date": "2023-07-31 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": "No",
        //       "project_manager_id": "43528,43529,43531",
        //       "project_manager_name": "Reagan Escobar,Alivia Drake,Briley Buckley",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 420,
        //       "project_name": "Java project 1",
        //       "start_date": "2023-04-26 00:00:00",
        //       "end_date": "2023-04-30 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": "No",
        //       "project_manager_id": "43284",
        //       "project_manager_name": "Philip ",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 421,
        //       "project_name": "Java project 2",
        //       "start_date": "2023-04-26 00:00:00",
        //       "end_date": "2023-04-30 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": "No",
        //       "project_manager_id": "43284",
        //       "project_manager_name": "Philip ",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     },
        //     {
        //       "project_id": 422,
        //       "project_name": "Java project 3",
        //       "start_date": "2023-04-26 00:00:00",
        //       "end_date": "2023-04-30 00:00:00",
        //       "status": "Active",
        //       "terms_and_conditions": "No",
        //       "project_manager_id": "43284",
        //       "project_manager_name": "Philip ",
        //       "generate_link": null,
        //       "file_name": null,
        //       "version": null,
        //       "terms_and_condition_url": null
        //     }
        //   ],
        //   "status": "Success",
        //   "message": "project Details retrieved successfully."
        // };
        this.listActiveProjects = [];
        if (response.status == 'Success' && response.data.length > 0) {

          response.data.forEach((elm, inx) => {
            if (this.activeProjects.includes(elm.project_name.toLowerCase())) {
              this.listActiveProjects.push({
                'project_id': elm.project_id,
                'project_name': elm.project_name
              });
            }
          });



          response.data.forEach((elm, inx) => {
            if (this.activeProjects.includes(elm.project_name.toLowerCase())) {
              if (elm.project_name.toLowerCase() == 'atos syntel') {
                this.getAtosDocumentList(elm.project_id);
                let projectIndex = this.listActiveProjects.findIndex((x: any) => { return x.project_name.toLowerCase() == 'atos syntel' });
                if (projectIndex != -1) {
                  this.currentProjectsDetails = this.listActiveProjects[projectIndex];
                }
              } else if (elm.project_name.toLowerCase() == 'rbl-gttf') {
                this.getRblGttfDocumentList(elm.project_id);
                let projectIndex = this.listActiveProjects.findIndex((x: any) => { return x.project_name.toLowerCase() == 'rbl-gttf' });
                if (projectIndex != -1) {
                  // this.currentProjectsDetails = this.listActiveProjects[projectIndex];
                }
              } else if (elm.project_name.toLowerCase() == 'rbl-nes') {
                this.getRblDocumentList(elm.project_id);
                let projectIndex = this.listActiveProjects.findIndex((x: any) => { return x.project_name.toLowerCase() == 'rbl-nes' });
                if (projectIndex != -1) {
                  // this.currentProjectsDetails = this.listActiveProjects[projectIndex];
                }
              } else if (elm.project_name.toLowerCase() == 'infosys') {
                this.getInfosysDocumentList(elm.project_id);
                let projectIndex = this.listActiveProjects.findIndex((x: any) => { return x.project_name.toLowerCase() == 'infosys' });
                if (projectIndex != -1) {
                  // this.currentProjectsDetails = this.listActiveProjects[projectIndex];
                }
              }
            }
          });
        }
      },
      error: (ErrResponse) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: ErrResponse.error.data,
        });
      },
    });
  }


  @Input() get selectedAtosColumns(): any[] {
    return this._selectedAtosColumns;
  }

  set selectedAtosColumns(val: any[]) {
    this._selectedAtosColumns = this.cols.filter(col => val.includes(col));
  }


  @Input() get selectedRblGttfColumns(): any[] {
    return this._selectedRblGttfColumns;
  }

  set selectedRblGttfColumns(val: any[]) {
    this._selectedRblGttfColumns = this.rblGttfCols.filter(rblGttfCol => val.includes(rblGttfCol));
  }

  @Input() get selectedRblColumns(): any[] {
    return this._selectedRblColumns;
  }

  set selectedRblColumns(val: any[]) {
    this._selectedRblColumns = this.rblcols.filter(rblcol => val.includes(rblcol));
  }

  @Input() get selectedInfosysColumns(): any[] {
    return this._selectedInfosysColumns;
  }

  set selectedInfosysColumns(val: any[]) {
    this._selectedInfosysColumns = this.infosysCols.filter(infosysCol => val.includes(infosysCol));
  }



  onAtosMultiSelect($event) {
    if ($event.value.length == 0) {
      this._selectedAtosColumns = this._selectedAtosColumnsDub;
    }
  }

  onRblGttfMultiSelect($event) {
    if ($event.value.length == 0) {
      this._selectedRblGttfColumns = this._selectedRblGttfColumnsDub;
    }
  }


  onRblMultiSelect($event) {
    if ($event.value.length == 0) {
      this._selectedRblColumns = this._selectedRblColumnsDub;
    }
  }

  onInfosysMultiSelect($event) {
    if ($event.value.length == 0) {
      this._selectedInfosysColumns = this._selectedInfosysColumnsDub;
    }
  }


  /* ## RBL TAB ## */
  /*Get document details*/
  getRblDocumentList(projectid: any) {

    $('.spinner').show();
    this.documentverificationService.getRblDocumentDetails(projectid).subscribe({
      next: response => {
        // $('.spinner').hide();
        if (response.status == "Success") {
          this.documentrblDetails = [];
          this.fieldrblArr = {};
          response.data.projectAddtionalFields.forEach((elem: any, index: any) => {
            let arrrblNew = [];
            this.rblcolumns = [];
            if (!this.documentrblDetails.hasOwnProperty(index)) {
              this.documentrblDetails[index] = {};
            }

            elem.fields.forEach((elm, inx) => {
              if (!arrrblNew.hasOwnProperty(index)) {
                arrrblNew[index] = {};
              }

              if (this.uploadedRBLCertificate.includes(elm.documentFieldName)) {
                arrrblNew[index][elm.lable] = elm.verificationStatus;
              }
            });

            const count1 = Object.values(arrrblNew[index]).filter(x => x == "Yet to verify").length;
            const count2 = Object.values(arrrblNew[index]).filter(x => x == "Yes").length;
            const count3 = Object.values(arrrblNew[index]).filter(x => x == "No").length;
            if (count1 > 0 || count2 > 0 || count3 > 0) {
              this.documentrblDetails[index]['action'] = "true"
            } else {
              this.documentrblDetails[index]['action'] = "false"
            }

            this.fieldrblArr[index] = arrrblNew[index];
            this.documentrblDetails[index]['user_id'] = elem.user_id;
            this.documentrblDetails[index]['gtt_id'] = elem.gtt_id;
            this.documentrblDetails[index]['first_name'] = elem.first_name;
            this.documentrblDetails[index]['last_name'] = elem.last_name;

          });

          let arrrblNek = [];
          for (let key in this.fieldrblArr) {
            arrrblNek.push(this.fieldrblArr[key]);
          }

          let resultrblArr = [];
          resultrblArr = this.documentrblDetails.map((item, i) => Object.assign({}, item, arrrblNek[i]));
          console.log(resultrblArr);

          this.documentrblDetails = resultrblArr;

          if (resultrblArr.length > 0) {
            var rblresult = Object.keys(resultrblArr[0]).map(function (key: string) {
              return key;
            });

            console.log(resultrblArr)
            rblresult.forEach((elem: any, key: any) => {
              let headerName = this.headerCaseString(elem);
              if (elem == 'Aadhar/Pan Document(Original)') {
                headerName = 'Aadhar/Pan ';
              } else if (elem == 'Income Proof(Ration Card/Income Certificate/Self Declaration)(Original)') {
                headerName = 'Income Proof';
              } else if (elem == 'Caste Proof(Leaving Certificate/Caste Certificate)(Original)') {
                headerName = 'Caste Proof';
              }

              if (elem != 'user_id' && elem != 'action' && elem != 'null') {
                this.rblcolumns.push({
                  field: elem,
                  header: headerName,
                  align: 'center',
                });
              }
            });


            this.rblcols = this.rblcolumns;

            console.log(this.documentrblDetails);

          } else {
            this.rblcols = this._selectedRblColumns;
          }
        }
      },
      error: response => {
        $('.spinner').hide();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: (response.error.message == null) ? response.error.error : response.error.message });
      }
    });
  }


  /* ## RBL TAB ## */
  /*Get document details*/
  getRblGttfDocumentList(projectid: any) {
    $('.spinner').show();
    this.documentverificationService.getRblDocumentDetails(projectid).subscribe({
      next: response => {
        $('.spinner').hide();
        if (response.status == "Success") {
          this.documentRblGttfDetails = [];
          this.fieldrblGttfArr = {};
          response.data.projectAddtionalFields.forEach((elem: any, index: any) => {
            let arrRblGttfNew = [];
            this.rblGttfColumns = [];
            if (!this.documentRblGttfDetails.hasOwnProperty(index)) {
              this.documentRblGttfDetails[index] = {};
            }

            elem.fields.forEach((elm, inx) => {
              if (!arrRblGttfNew.hasOwnProperty(index)) {
                arrRblGttfNew[index] = {};
              }

              if (this.uploadedRblGttfCertificate.includes(elm.documentFieldName)) {
                arrRblGttfNew[index][elm.lable] = elm.verificationStatus;
              }
            });

            const count1 = Object.values(arrRblGttfNew[index]).filter(x => x == "Yet to verify").length;
            const count2 = Object.values(arrRblGttfNew[index]).filter(x => x == "Yes").length;
            const count3 = Object.values(arrRblGttfNew[index]).filter(x => x == "No").length;
            if (count1 > 0 || count2 > 0 || count3 > 0) {
              this.documentRblGttfDetails[index]['action'] = "true"
            } else {
              this.documentRblGttfDetails[index]['action'] = "false"
            }

            this.fieldrblArr[index] = arrRblGttfNew[index];
            this.documentRblGttfDetails[index]['user_id'] = elem.user_id;
            this.documentRblGttfDetails[index]['gtt_id'] = elem.gtt_id;
            this.documentRblGttfDetails[index]['first_name'] = elem.first_name;
            this.documentRblGttfDetails[index]['last_name'] = elem.last_name;

          });

          let arrRblGttfNek = [];
          for (let key in this.fieldrblGttfArr) {
            arrRblGttfNek.push(this.fieldrblGttfArr[key]);
          }

          let resultRblGttfArr = [];
          resultRblGttfArr = this.documentRblGttfDetails.map((item, i) => Object.assign({}, item, arrRblGttfNek[i]));

          this.documentRblGttfDetails = resultRblGttfArr;

          if (resultRblGttfArr.length > 0) {
            var rblGttfresult = Object.keys(resultRblGttfArr[0]).map(function (key: string) {
              return key;
            });

            rblGttfresult.forEach((elem: any, key: any) => {
              let headerName = this.headerCaseString(elem);
              if (elem != 'user_id' && elem != 'action' && elem != 'null') {
                this.rblGttfColumns.push({
                  field: elem,
                  header: headerName,
                  align: 'center',
                });
              }
            });

            this.rblGttfCols = this.rblGttfColumns;
          } else {
            this.rblGttfCols = this._selectedRblGttfColumns;
          }
        }
      },
      error: response => {
        $('.spinner').hide();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: (response.error.message == null) ? response.error.error : response.error.message });
      }
    });
  }


  /*View document */
  viewAtosdocument(rowData: any, project) {
    this.names = [];
    $('.spinner').show();
    this.currentUserId = rowData.user_id;
    this.withoutValidationFile = [];
    this.documentverificationService.getviewAtosDocumentDetails(rowData.user_id).subscribe({
      next: (response) => {
        $('.spinner').hide();
        if (response.status == 'Success' && response.data.doumentFileds.length > 0) {

          if (project == 'rbl-nes') {
            ($('#rblview') as any).modal('show');
          } else if (project == 'atos syntel') {
            ($('#atosview') as any).modal('show');
          } else if (project == 'rbl-gttf') {
            ($('#rblgttfview') as any).modal('show');
          } else if (project == 'infosys') {
            ($('#infosysview') as any).modal('show');
          }


          this.names = [];
          this.selectedview = [];
          this.validOptions = [];
          response.data.doumentFileds.forEach((elem: any, index: any) => {

            if (project == 'atos syntel') {
              if (this.uploadedATOSCertificate.includes(elem.document_field_name)) {
                let field_type = this.names.findIndex((x: any) => { return x.document_field_name == elem.document_field_name });
                if (field_type == -1) {
                  this.names.push({
                    document_field_index: index,
                    document_detail_id: elem.document_detail_id,
                    document_id: elem.document_id,
                    document_field_name: elem.document_field_name,
                    document_value: elem.document_value,
                    document_url: elem.document_url,
                    document_type: elem.document_value.substr(elem.document_value.lastIndexOf('.') + 1),
                    download_path: environment.BASE_API_URL + 'document-validator/document-download?fileName=' + elem.dowload_path,
                    verification_Status: elem.verification_Status
                  });
                }
              }
            } else if (project == 'rbl-gttf') {
              if (this.uploadedRblGttfCertificate.includes(elem.document_field_name)) {
                let field_type = this.names.findIndex((x: any) => { return x.document_field_name == elem.document_field_name });
                if (field_type == -1) {
                  this.names.push({
                    document_field_index: index,
                    document_detail_id: elem.document_detail_id,
                    document_id: elem.document_id,
                    document_field_name: elem.document_field_name,
                    document_value: elem.document_value,
                    document_url: elem.document_url,
                    document_type: elem.document_value.substr(elem.document_value.lastIndexOf('.') + 1),
                    download_path: environment.BASE_API_URL + 'document-validator/document-download?fileName=' + elem.dowload_path,
                    verification_Status: elem.verification_Status
                  });
                }
              }
            } else if (project == 'rbl-nes') {
              if (this.uploadedRBLCertificate.includes(elem.document_field_name)) {
                let field_type = this.names.findIndex((x: any) => { return x.document_field_name == elem.document_field_name });
                if (field_type == -1) {
                  this.names.push({
                    document_field_index: index,
                    document_detail_id: elem.document_detail_id,
                    document_id: elem.document_id,
                    document_field_name: elem.document_field_name,
                    document_value: elem.document_value,
                    document_url: elem.document_url,
                    document_type: elem.document_value.substr(elem.document_value.lastIndexOf('.') + 1),
                    download_path: environment.BASE_API_URL + 'document-validator/document-download?fileName=' + elem.dowload_path,
                    verification_Status: elem.verification_Status
                  });
                }
              }
            } else {
              if (this.uploadedInfosysCertificate.includes(elem.document_field_name)) {
                let field_type = this.names.findIndex((x: any) => { return x.document_field_name == elem.document_field_name });
                if (field_type == -1) {
                  this.names.push({
                    document_field_index: index,
                    document_detail_id: elem.document_detail_id,
                    document_id: elem.document_id,
                    document_field_name: elem.document_field_name,
                    document_value: elem.document_value,
                    document_url: elem.document_url,
                    document_type: elem.document_value.substr(elem.document_value.lastIndexOf('.') + 1),
                    download_path: environment.BASE_API_URL + 'document-validator/document-download?fileName=' + elem.dowload_path,
                    verification_Status: elem.verification_Status
                  });
                }
              }
            }
          });
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: "Additional field not mapped this user" });
        }
      },
      error: (response) => {
        $('.spinner').hide();
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: response.message,
        });
      },
    });
  }


  onChangeFilesNo($event: any, value, index, docId, docFieldName: any, documentFileName: any) {

    if (value == "Yes") {
      this.names[index].verification_Status = "Yes";
      let fileArray = this.myFiles;
      let validOpts = this.validOptions;
      fileArray.forEach((elem, indx) => {
        if (Object.keys(elem)[0] == docId) {
          this.myFiles.splice(indx, 1);
        }
      });

      this.validOptions.push({
        'fileName': documentFileName,
        'name': docFieldName,
        'valid': "Yes"
      });

      const withoutFileIndex = this.withoutValidationFile.indexOf(docFieldName);
      if (withoutFileIndex > -1) { // only splice array when item is found
        this.withoutValidationFile.splice(withoutFileIndex, 1); // 2nd parameter means remove one item only
      }


    } else {
      this.names[index].verification_Status = "No";
      this.withoutValidationFile.push(docFieldName);
      this.validOptions.forEach((elem, indx) => {
        if (elem.fileName == documentFileName) {
          this.validOptions.splice(indx, 1);
        }
      });

      this.validOptions.push({
        'fileName': documentFileName,
        'name': docFieldName,
        'valid': "No"
      });

    }
  }



  selectFiles($event: any, verification_status, documentFileName: any) {

    this.validOptions.forEach((elem, indx) => {
      if (elem.fileName == documentFileName) {
        this.validOptions.splice(indx, 1);
      }
    });

    const file = $event.target.files[0];
    var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
    let _validFileExtensions = ['jpeg', 'xlsx', 'jpg', 'pdf', 'doc', 'png', 'xls', 'docx', 'PNG', 'JPEG', 'JPG'];
    if ($event.target.files.length > 0 && _validFileExtensions.includes(ext)) {
      if (file.size > 2000000) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: "File size is more than 2MB" });
      } else {

        let searchFiles = this.myFiles.filter(FileData => Object.keys(FileData)[0] == $event.target.id)
        console.log(searchFiles);

        const withoutFileIndex = this.withoutValidationFile.indexOf($event.target.name);
        if (withoutFileIndex > -1) { // only splice array when item is found
          this.withoutValidationFile.splice(withoutFileIndex, 1); // 2nd parameter means remove one item only
        }

        console.log(this.withoutValidationFile);

        if (searchFiles.length > 0) {
          this.myFiles.forEach((fielData, index) => {
            var obj = { [$event.target.id]: file }
            console.log(Object.keys(fielData)[0]);
            if (Object.keys(fielData)[0] == $event.target.id) {
              this.myFiles[index] = obj;
              let documentFileName = $event.target.name.replace(/ /g, '_');
              this.currentUploadDocIds[index] = { 'documentFieldId': $event.target.id, 'documentFieldName': $event.target.name, 'documentFileName': documentFileName + '.' + ext };
            }
          })
        } else {
          var obj = { [$event.target.id]: file }
          this.myFiles.push(obj);
          let documentFileName = $event.target.name.replace(/ /g, '_');
          this.currentUploadDocIds.push({ 'documentFieldId': $event.target.id, 'documentFieldName': $event.target.name, 'documentFileName': documentFileName + '.' + ext });
        }
      }
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Invalid file format" });
    }
  }


  onRblGttfFileUpload() {

    let uploadFiles: any = [];
    let documentReuploadList: any = [];

    if (this.myFiles.length > 0 || this.validOptions.length > 0) {
      for (var i = 0; i < this.myFiles.length; i++) {
        uploadFiles.push(this.myFiles[i][this.currentUploadDocIds[i].documentFieldId]);
        documentReuploadList.push({
          'fileName': this.currentUploadDocIds[i].documentFileName,
          'name': this.currentUploadDocIds[i].documentFieldName,
          'valid': "Yes"
        });
      }

      let documentList = documentReuploadList.concat(this.validOptions);
      let params = {
        'userid': this.currentUserId,
        'projectid': this.currentProjectsDetails.project_id,
        'documentReuploadList': documentList
      };

      $('.spinner').show();
      this.documentverificationService.saveProjectUploadFiles(params, uploadFiles).subscribe({
        next: response => {
          if (response.status == "Success") {
            $('.spinner').hide();
            this.getRblDocumentList(this.currentProjectsDetails.project_id);
            ($('#rblgttfview') as any).modal('hide');

            this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
            this.myFiles = [];
            this.validOptions = [];
            this.currentUploadDocIds = [];
          } else {
            $('.spinner').hide();
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        },
        error: response => {
          $('.spinner').hide();
          this.messageService.add({ severity: 'error', summary: 'Error', detail: (response.error.message == null) ? response.error.error : response.error.message });
        }
      });
    } else {
      this.myFiles = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Please upload your documents" });
    }
  }



  onRblFileUpload() {


    let uploadFiles: any = [];
    let documentReuploadList: any = [];

    if (this.myFiles.length > 0 || this.validOptions.length > 0) {

      for (var i = 0; i < this.myFiles.length; i++) {
        uploadFiles.push(this.myFiles[i][this.currentUploadDocIds[i].documentFieldId]);
        documentReuploadList.push({
          'fileName': this.currentUploadDocIds[i].documentFileName,
          'name': this.currentUploadDocIds[i].documentFieldName,
          'valid': "Yes"
        });
      }

      let documentList = documentReuploadList.concat(this.validOptions);
      let params = {
        'userid': this.currentUserId,
        'projectid': this.currentProjectsDetails.project_id,
        'documentReuploadList': documentList
      };

      $('.spinner').show();
      this.documentverificationService.saveProjectUploadFiles(params, uploadFiles).subscribe({
        next: response => {
          if (response.status == "Success") {
            $('.spinner').hide();
            this.getRblDocumentList(this.currentProjectsDetails.project_id);
            ($('#rblview') as any).modal('hide');

            this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
            this.myFiles = [];
            this.validOptions = [];
            this.currentUploadDocIds = [];
          } else {
            $('.spinner').hide();
            this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
          }
        },
        error: response => {
          $('.spinner').hide();
          this.messageService.add({ severity: 'error', summary: 'Error', detail: (response.error.message == null) ? response.error.error : response.error.message });
        }
      });
    } else {
      this.myFiles = [];
      this.messageService.add({ severity: 'error', summary: 'Error', detail: "Please upload your documents" });
    }
  }


  /*
   ==================== RBL GTTF Export  Start ==============
  */

  rblGttfExportExcel() {

    let rblGttfExcelDetails: any = [];
    let columns: any = [];

    this.selectedRblGttfDetails.forEach((elem, inx) => {
      if (!rblGttfExcelDetails.hasOwnProperty(inx)) {
        rblGttfExcelDetails[inx] = {};
      }
      this._selectedRblGttfColumns.forEach((elm, indx) => {
        rblGttfExcelDetails[inx][elm.field] = elem[elm.field];
      })
    });



    if (this.selectedRblGttfDetails.length == 0) {
      this._selectedRblGttfColumns.forEach((elm, indx) => {
        columns[elm.header] = "";
      })
      rblGttfExcelDetails.push(columns);
    }


    const worksheet = xlsx.utils.json_to_sheet(rblGttfExcelDetails);
    const workbook = { Sheets: { 'RBL-GTTF-Details': worksheet }, SheetNames: ['RBL-GTTF-Details'] };
    const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, "RBL-GTTF-Details");
  }

  /*
   ==================== End RBL GTTF Export  ==============
  */


  /*
   ==================== RBL NES Export  Start ==============
  */

  rblExportCSV() {
    let rblExcelDetails: any = [];
    let columns: any = [];

    this.selectedRblDetails.forEach((elem, inx) => {
      if (!rblExcelDetails.hasOwnProperty(inx)) {
        rblExcelDetails[inx] = {};
      }
      this._selectedRblColumns.forEach((elm, indx) => {
        let headerName = elm.field.replace(/\s/g, '');
        rblExcelDetails[inx][headerName] = elem[elm.field];
      })
    });

    if (this.selectedRblDetails.length == 0) {
      this._selectedRblColumns.forEach((elm, indx) => {
        let headerName = elm.field.replace(/\s/g, '');
        columns[elm.header] = "";
      })
      rblExcelDetails.push(columns);
    }

    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      filename: 'RBL-Details',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(rblExcelDetails);
    this.selectedRblDetails = [];

  }

  rblExportExcel() {

    let rblExcelDetails: any = [];
    let columns: any = [];

    this.selectedRblDetails.forEach((elem, inx) => {
      if (!rblExcelDetails.hasOwnProperty(inx)) {
        rblExcelDetails[inx] = {};
      }
      this._selectedRblColumns.forEach((elm, indx) => {
        let headerName = elm.field.replace(/\s/g, '');
        rblExcelDetails[inx][headerName] = elem[elm.field];
      })
    });

    if (this.selectedRblDetails.length == 0) {
      this._selectedRblColumns.forEach((elm, indx) => {
        let headerName = elm.field.replace(/\s/g, '');
        columns[elm.header] = "";
      })
      rblExcelDetails.push(columns);
    }


    const worksheet = xlsx.utils.json_to_sheet(rblExcelDetails);
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, "RBL-Details");
  }



  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
  }


  exportRblPdf(dt: any) {
    var doc: any = new jsPDF.default('p', 'pt', 'a1', true);
    this.exportColumns = [];
    Object.keys(this._selectedRblColumns).forEach(key => {
      this.exportColumns.push({
        'title': this._selectedRblColumns[key].header,
        'dataKey': this._selectedRblColumns[key].field
      });
    });
    doc.autoTable(this.exportColumns, this.selectedRblDetails, {
      bodyStyles: { valign: 'middle' },
      styles: { overflow: 'linebreak', columnWidth: '1000' },
      columnStyles: {
        text: {
          cellWidth: '100',
        },
        description: {
          cellWidth: '107',
        },
      },
    });
    doc.save('RBL-Details.pdf');
  }


  /*
   ==================== End RBL Export  ==============
  */






  /*
  ==================== Start ATOS   ==============
 */


  /* ## ATOS TAB ## */
  /*Get document details*/
  getAtosDocumentList(projectid: any) {

    $('.spinner').show();
    this.documentverificationService.getAtosDocumentDetails(projectid).subscribe({
      next: response => {
        console.log(response);
        $('.spinner').hide();
        if (response.status == "Success") {
          this.documentDetails = [];
          this.columns = [];
          this.fieldArr = {};
          response.data.projectAddtionalFields.forEach((elem: any, index: any) => {
            let arrNew = [];
            this.atosWithoutFileUpload = [
              'Father Name',
              'Mother Name',
              'Total members in the family',
              'Address'
            ];

            if (!this.documentDetails.hasOwnProperty(index)) {
              this.documentDetails[index] = {};
            }

            elem.fields.forEach((elm, inx) => {
              if (!arrNew.hasOwnProperty(index)) {
                arrNew[index] = {};
              }

              if (this.uploadedATOSCertificate.includes(elm.documentFieldName)) {
                if (this.atosWithoutFileUpload.includes(elm.documentFieldName)) {
                  arrNew[index][elm.lable] = elm.documentValue;
                } else {
                  arrNew[index][elm.lable] = elm.verificationStatus;
                }
              }

            });


            console.log(arrNew);

            const count1 = Object.values(arrNew[index]).filter(x => x == "Yet to verify").length;
            const count2 = Object.values(arrNew[index]).filter(x => x == "Yes").length;
            const count3 = Object.values(arrNew[index]).filter(x => x == "No").length;
            if (count1 > 0 || count2 > 0 || count3 > 0) {
              this.documentDetails[index]['action'] = "true"
            } else {
              this.documentDetails[index]['action'] = "false"
            }

            this.fieldArr[index] = arrNew[index];
            this.documentDetails[index]['user_id'] = elem.user_id;
            this.documentDetails[index]['gtt_id'] = elem.gtt_id;
            this.documentDetails[index]['first_name'] = elem.first_name;
            this.documentDetails[index]['last_name'] = elem.last_name;
          });

          let arrNek = [];
          for (let key in this.fieldArr) {
            arrNek.push(this.fieldArr[key]);
          }

          let resultArr = [];
          resultArr = this.documentDetails.map((item, i) => Object.assign({}, item, arrNek[i]));
          this.documentDetails = resultArr;
          debugger

          if (resultArr.length > 0) {
            var result = Object.keys(resultArr[0]).map(function (
              key: string
            ) {
              return key;
            });


            result.forEach((elem: any, key: any) => {
              let headerName = this.headerCaseString(elem);
              // if (elem == '10th Mark sheet') {
              //   headerName = '10th Marksheet ';
              // } else if (elem == '12th Mark sheet') {
              //   headerName = '12th Marksheet';
              // } else if (elem == 'UG Marksheet') {
              //   headerName = 'UG Marksheet';
              // } else if (elem == 'UG Marksheet') {
              //   headerName = 'PG Marksheet';
              // } else if (elem == 'ID Proof (only Aadhar Card applicable both side scan)') {
              //   headerName = 'ID Proof (Aadhar Card)';
              // } else if (elem == 'Income Proof (Any one member in the family only salary slip, income certificate, form 16 applicable)') {
              //   headerName = 'Income Proof';
              // }


              // && elem != '' && elem != '10th Marksheet' && elem != '12th Marksheet' && elem != 'Adhar Card'
              //   && elem != 'Current Location' && elem != 'Family Income' && elem != 'Graduation Marksheet' && elem != 'PG Qualification'
              //   && elem != 'Passing Year' && elem != 'Projectinfo' && elem != 'Subject/Stream' && elem != 'Textbox' && elem != 'UG Qualification'
              if (elem != 'user_id' && elem != 'action' && elem != 'null') {
                this.columns.push({
                  field: elem,
                  header: headerName,
                  align: 'center',
                });
              }
            });
            this.cols = this.columns;

          } else {
            this.cols = this._selectedAtosColumns;
          }
        }
      },
      error: response => {
        $('.spinner').hide();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: (response.error.message == null) ? response.error.error : response.error.message });
      }
    });
  }


  /* ## ATOS TAB ## */
  /*Get document details*/
  getInfosysDocumentList(projectid: any) {
    $('.spinner').show();
    this.documentverificationService.getInfosysDocumentDetails(projectid).subscribe({
      next: response => {
        $('.spinner').hide();
        if (response.status == "Success") {
          this.documentInfosysDetails = [];
          this.infosysCols = [];
          this.fieldInfosysArr = {};
          response.data.projectAddtionalFields.forEach((elem: any, index: any) => {
            let arrNew = [];
            if (!this.documentInfosysDetails.hasOwnProperty(index)) {
              this.documentInfosysDetails[index] = {};
            }

            elem.fields.forEach((elm, inx) => {
              if (!arrNew.hasOwnProperty(index)) {
                arrNew[index] = {};
              }

              if (this.uploadedInfosysCertificate.includes(elm.documentFieldName)) {
                arrNew[index][elm.lable] = elm.verificationStatus;
              }

            });


            console.log(arrNew);

            const count1 = Object.values(arrNew[index]).filter(x => x == "Yet to verify").length;
            const count2 = Object.values(arrNew[index]).filter(x => x == "Yes").length;
            const count3 = Object.values(arrNew[index]).filter(x => x == "No").length;
            if (count1 > 0 || count2 > 0 || count3 > 0) {
              this.documentInfosysDetails[index]['action'] = "true"
            } else {
              this.documentInfosysDetails[index]['action'] = "false"
            }

            this.fieldInfosysArr[index] = arrNew[index];
            this.documentInfosysDetails[index]['user_id'] = elem.user_id;
            this.documentInfosysDetails[index]['gtt_id'] = elem.gtt_id;
            this.documentInfosysDetails[index]['first_name'] = elem.first_name;
            this.documentInfosysDetails[index]['last_name'] = elem.last_name;
          });

          let arrNek = [];
          for (let key in this.fieldInfosysArr) {
            arrNek.push(this.fieldInfosysArr[key]);
          }

          let resultArr = [];
          resultArr = this.documentInfosysDetails.map((item, i) => Object.assign({}, item, arrNek[i]));
          this.documentInfosysDetails = resultArr;

          if (resultArr.length > 0) {
            var result = Object.keys(resultArr[0]).map(function (
              key: string
            ) {
              return key;
            });

            result.forEach((elem: any, key: any) => {
              let headerName = this.headerCaseString(elem);
              if (elem == '10th Mark sheet') {
                headerName = '10th Marksheet ';
              } else if (elem == '12th Mark sheet') {
                headerName = '12th Marksheet';
              } else if (elem == 'UG Marksheet') {
                headerName = 'UG Marksheet';
              } else if (elem == 'UG Marksheet') {
                headerName = 'PG Marksheet';
              } else if (elem == 'ID Proof (only Aadhar Card applicable both side scan)') {
                headerName = 'ID Proof (Aadhar Card)';
              } else if (elem == 'Income Proof (Any one member in the family only salary slip, income certificate, form 16 applicable)') {
                headerName = 'Income Proof';
              }


              // && elem != '' && elem != '10th Marksheet' && elem != '12th Marksheet' && elem != 'Adhar Card'
              //   && elem != 'Current Location' && elem != 'Family Income' && elem != 'Graduation Marksheet' && elem != 'PG Qualification'
              //   && elem != 'Passing Year' && elem != 'Projectinfo' && elem != 'Subject/Stream' && elem != 'Textbox' && elem != 'UG Qualification'
              if (elem != 'user_id' && elem != 'action' && elem != 'null') {
                this.infoysColumns.push({
                  field: elem,
                  header: headerName,
                  align: 'center',
                });
              }
            });

            this.infosysCols = this.infoysColumns;
          } else {
            this.infosysCols = this._selectedInfosysColumns;
          }


          // this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
          // this.exportCols = this.cols.map(col => ({ dataKey: col.field }));
        }
      },
      error: response => {
        $('.spinner').hide();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: (response.error.message == null) ? response.error.error : response.error.message });
      }
    });
  }


  onAtosFileUpload() {
    // if (this.myFiles.length > 0) {
    let uploadFiles: any = [];
    let documentReuploadList: any = [];
    for (var i = 0; i < this.myFiles.length; i++) {
      uploadFiles.push(this.myFiles[i][this.currentUploadDocIds[i].documentFieldId]);
      documentReuploadList.push({
        'fileName': this.currentUploadDocIds[i].documentFileName,
        'name': this.currentUploadDocIds[i].documentFieldName,
        'valid': "Yes"
      });
    }

    let documentList = documentReuploadList.concat(this.validOptions);
    let params = {
      'userid': this.currentUserId,
      'projectid': this.currentProjectsDetails.project_id,
      'documentReuploadList': documentList
    };

    $('.spinner').show();
    this.documentverificationService.saveProjectUploadFiles(params, uploadFiles).subscribe({
      next: response => {
        if (response.status == "Success") {
          $('.spinner').hide();
          this.getAtosDocumentList(this.currentProjectsDetails.project_id);
          ($('#atosview') as any).modal('hide');
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.myFiles = [];
          this.validOptions = [];
          this.currentUploadDocIds = [];
        } else {
          $('.spinner').hide();
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
        }
      },
      error: response => {
        $('.spinner').hide();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: (response.error.message == null) ? response.error.error : response.error.message });
      }
    });
    // } else {
    //   this.myFiles = [];
    //   this.messageService.add({ severity: 'error', summary: 'Error', detail: "Please upload your documents" });
    // }
  }


  onInfosysFileUpload() {
    // if (this.myFiles.length > 0) {
    let uploadFiles: any = [];
    let documentReuploadList: any = [];
    for (var i = 0; i < this.myFiles.length; i++) {
      uploadFiles.push(this.myFiles[i][this.currentUploadDocIds[i].documentFieldId]);
      documentReuploadList.push({
        'fileName': this.currentUploadDocIds[i].documentFileName,
        'name': this.currentUploadDocIds[i].documentFieldName,
        'valid': "Yes"
      });
    }

    let documentList = documentReuploadList.concat(this.validOptions);
    let params = {
      'userid': this.currentUserId,
      'projectid': this.currentProjectsDetails.project_id,
      'documentReuploadList': documentList
    };

    $('.spinner').show();
    this.documentverificationService.saveProjectUploadFiles(params, uploadFiles).subscribe({
      next: response => {
        if (response.status == "Success") {
          $('.spinner').hide();
          this.getInfosysDocumentList(this.currentProjectsDetails.project_id);
          ($('#infosysview') as any).modal('hide');
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message });
          this.myFiles = [];
          this.validOptions = [];
          this.currentUploadDocIds = [];
        } else {
          $('.spinner').hide();
          this.messageService.add({ severity: 'error', summary: 'Error', detail: response.message });
        }
      },
      error: response => {
        $('.spinner').hide();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: (response.error.message == null) ? response.error.error : response.error.message });
      }
    });
    // } else {
    //   this.myFiles = [];
    //   this.messageService.add({ severity: 'error', summary: 'Error', detail: "Please upload your documents" });
    // }
  }


  // Export ATOS
  exportAtosExcel() {

    let atosExcelDetails: any = [];
    let columns: any = [];

    this.selectedAtosDetails.forEach((elem, inx) => {
      if (!atosExcelDetails.hasOwnProperty(inx)) {
        atosExcelDetails[inx] = {};
      }
      this._selectedAtosColumns.forEach((elm, indx) => {
        atosExcelDetails[inx][elm.field] = elem[elm.field];
      })
    });

    if (this.selectedAtosDetails.length == 0) {
      this._selectedAtosColumns.forEach((elm, indx) => {
        columns[elm.header] = "";
      })
      atosExcelDetails.push(columns);
    }


    const worksheet = xlsx.utils.json_to_sheet(atosExcelDetails);
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, "ATOS-Details");
  }


  exportAtosPdf(dt: any) {
    var doc: any = new jsPDF.default('p', 'pt', 'a1', true);
    this.exportColumns = [];
    Object.keys(this._selectedAtosColumns).forEach(key => {
      this.exportColumns.push({
        'title': this._selectedAtosColumns[key].header,
        'dataKey': this._selectedAtosColumns[key].field
      });
    });
    doc.autoTable(this.exportColumns, this.selectedAtosDetails, {
      bodyStyles: { valign: 'middle' },
      styles: { overflow: 'linebreak', columnWidth: '1000' },
      columnStyles: {
        text: {
          cellWidth: '100',
        },
        description: {
          cellWidth: '107',
        },
      },
    });
    doc.save('ATOS-Details.pdf');
  }

  /*
==================== End ATOS Export  ==============
*/

  // Export Infosys

  exportInfosysCSV() {

    let infosysExcelDetails: any = [];
    let columns: any = [];

    this.selectedInfosysDetails.forEach((elem, inx) => {
      if (!infosysExcelDetails.hasOwnProperty(inx)) {
        infosysExcelDetails[inx] = {};
      }
      this._selectedInfosysColumns.forEach((elm, indx) => {
        let headerName = elm.field.replace(/\s/g, '');
        infosysExcelDetails[inx][headerName] = elem[elm.field];
      })
    });

    if (this.selectedInfosysDetails.length == 0) {
      this._selectedInfosysColumns.forEach((elm, indx) => {
        let headerName = elm.header.replace(/\s/g, '');
        columns[headerName] = "";
      })
      infosysExcelDetails.push(columns);
    }

    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      filename: 'Infosys-Details',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
      // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(infosysExcelDetails);
    this.selectedInfosysDetails = [];
  }




  exportInfosysExcel() {

    let infosysExcelDetails: any = [];
    let columns: any = [];

    this.selectedInfosysDetails.forEach((elem, inx) => {
      if (!infosysExcelDetails.hasOwnProperty(inx)) {
        infosysExcelDetails[inx] = {};
      }
      this._selectedInfosysColumns.forEach((elm, indx) => {
        let headerName = elm.field.replace(/\s/g, '');
        infosysExcelDetails[inx][headerName] = elem[elm.field];
      })
    });

    if (this.selectedInfosysDetails.length == 0) {
      this._selectedInfosysColumns.forEach((elm, indx) => {
        let headerName = elm.header.replace(/\s/g, '');
        columns[headerName] = "";
      })
      infosysExcelDetails.push(columns);
    }

    const worksheet = xlsx.utils.json_to_sheet(infosysExcelDetails);
    const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, "Infosys-Details");

  }


  exportInfosysPdf(dt: any) {
    var doc: any = new jsPDF.default('p', 'pt', 'a1', true);
    this.infosysExportColumns = [];
    Object.keys(this._selectedInfosysColumns).forEach(key => {
      this.infosysExportColumns.push({
        'title': this._selectedInfosysColumns[key].header,
        'dataKey': this._selectedInfosysColumns[key].field
      });
    });
    doc.autoTable(this.infosysExportColumns, this.selectedInfosysDetails, {
      bodyStyles: { valign: 'middle' },
      styles: { overflow: 'linebreak', columnWidth: '1000' },
      columnStyles: {
        text: {
          cellWidth: '100',
        },
        description: {
          cellWidth: '107',
        },
      },
    });
    doc.save('Infosys-Details.pdf');
  }

  /*
  ==================== End Infosys Export  ==============
 */



  headerCaseString(string: any) {
    let titleCaseString = string
      .replace(/(_|-)/g, ' ')
      .trim()
      .replace(/\w\S*/g, function (str: any) {
        return str.charAt(0).toUpperCase() + str.substr(1)
      })
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');

    return titleCaseString;
  }

  /*Side menu */
  onListOfRightMenus(eventData: string) {
    let fieldArr = JSON.parse(eventData);
    Object.entries(fieldArr).forEach(
      ([key, value]) => this.rightSideMenus.push(value)
    );
  }

  /*Tab*/
  getDocumentTab($event: any) {
    console.log($event);
    if (!$event.index) {
      this.currentTab1 = 'atos';
      this.currentTab2 = '';
      $('#inlineRadio_atos').trigger('click');
      this.myFiles = [];
    } else if ($event.index == 1) {
      this.currentTab2 = 'rbl';
      this.currentTab1 = '';
      $('#inlineRadio_rbl').trigger('click');
      this.myFiles = [];
    } else if ($event.index == 2) {
      this.currentTab2 = 'infosys';
      this.currentTab1 = '';
      $('#inlineRadio_infosys').trigger('click');
      this.myFiles = [];
    }

    let projectIndex = this.listActiveProjects.findIndex((x: any) => { return x.project_name.toLowerCase() == this.activeProjects[$event.index] });
    if (projectIndex != -1) {
      this.currentProjectsDetails = this.listActiveProjects[projectIndex];
    }

    console.log(this.currentProjectsDetails)
  }

  showLogout(document_type) {
    if (document_type == 'pdf' || document_type == 'png' || document_type == 'jpeg' || document_type == 'jpg' || document_type == 'PNG' || document_type == 'JPEG' || document_type == 'JPG')
      return true;
    else
      return false;
  }

  /*downloadView project details*/
  downloadRblView() {
    // import('xlsx').then((xlsx) => {
    //   const worksheet = xlsx.utils.json_to_sheet(this.names);
    //   const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    //   const excelBuffer: any = xlsx.write(workbook, {
    //     bookType: 'xlsx',
    //     type: 'array',
    //   });
    //   this.saveAsExcelFile(excelBuffer, 'Document-Verification');
    //   //this.saveAsExcelFile(excelBuffer, "BulkStudentRegistrationTemplate");
    // });

    let selected = this.selectedview;
    var multi_download = environment.BASE_API_URL + 'document-validator/document-download-all-files?userid=' + this.currentUserId + '&documentids=';
    for (var i = 0; i < selected.length; i++) {
      multi_download = multi_download + selected[i].document_id;
      if (selected.length != (i + 1)) {
        multi_download = multi_download + ','
      }
    }
    window.open(multi_download, '_blank');
  }

}
