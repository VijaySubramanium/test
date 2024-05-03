import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdditionalFieldsCls } from '../helper/question-base';
import { CommonService } from '../common.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as JSZip from 'jszip';
import { MessageService } from 'primeng/api';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  providers: [MessageService],
  styleUrls: ['./dynamic-form.component.css']
})

export class DynamicFormComponent implements OnInit {
  @Input() questions: any = [];
  @Input() currentProjectId: any;
  @Input() terms_and_conditions_url: any;
  @Input() terms_and_conditions_url_status: any;
  @Input() currentProjectName: string;
  @ViewChild("agree") agree;

  form!: FormGroup;
  payLoad = '';
  objArray: any = [];
  fileUploadDocuments: any = '';
  fileValidateLabels: any = [];
  replaceRegex = /\//g;
  successmsg: boolean = true;
  successMessage: string = '';
  filesBulkData: any = [];
  zipFiles: any = null;
  agreeCheckBox: boolean;
  spinner: boolean = false;
  currentIndex: string = '0';

  fileValidation: boolean = true;

  constructor(private fb: FormBuilder, private commonService: CommonService,
    private router: Router,
    private toastr: ToastrService,
    private messageService: MessageService,) {
    this.form = this.fb.group({
      questions: this.fb.array([])
    })
  }

  ngOnInit() {

    console.log(this.currentProjectId)

    $('.spinner').hide();
    if (!this.questions.projectID && this.questions.projectAddtionalFields.length > 0) {
      this.questions.projectID = this.questions.projectAddtionalFields[0].projectId;
    }

    if (this.questions.projectAddtionalFields.length > 0) {
      this.questions.projectAddtionalFields.forEach((val, indx) => {
        if (val.fields.length > 0) {
          if (val.projectId == this.currentProjectId) {
            this.terms_and_conditions_url_status = val.terms_url_status;
            this.currentIndex = indx;
            this.currentProjectName = (val.fields[0].projectname == null) ? this.currentProjectName : val.fields[0].projectname;
            val.fields.forEach((value: any) => {
              if (value.isActive && value.fieldType) {
                value.validation = value.validation ? value.validation : '';
                let multipleValues = [];
                if (value.fieldType == 'Multiple') {
                  console.log(value.dropDownData);
                  if (value.documentValue != null) {
                    debugger
                    let multipleValueArr = value.documentValue.split(',');
                    multipleValueArr.forEach((el, ix) => {
                      let dropDownObj = value.dropDownData.findIndex((x: any) => {
                        return x.value == el.trim();
                      });

                      if (dropDownObj != -1) {
                        multipleValues.push(value.dropDownData[dropDownObj]);
                      }

                    });

                    console.log(multipleValues);
                  }

                }

                let question = this.fb.group(
                  {
                    text: this.fb.group({
                      fieldType: value.fieldType == 'Text' ? [value.fieldType] : [],
                      value: value.fieldType == 'Text' ? [value.documentValue, [value.isMandatory ? Validators.required : Validators.nullValidator, Validators.pattern(value.validation)]] : [""],
                      label: value.fieldType == 'Text' ? [value.lable] : [],
                      disabled: value.fieldType == 'Text' ? [value.documentValue != '' && value.documentValue != null && !this.questions.registeration ? true : null] : [],
                      options: value.fieldType == 'Text' ? [{ id: 1, value: 'test' }] : [],
                      mandatory: value.fieldType == 'Text' ? [value.isMandatory] : [],
                      documentDetailId: value.fieldType == 'Text' ? [value.documentDetailId] : [],
                      documentFieldName: value.fieldType == 'Text' ? [value.documentFieldName] : []
                    }),

                    date: this.fb.group({
                      fieldType: value.fieldType == 'Date' ? [value.fieldType] : [],
                      value: value.fieldType == 'Date' ? [value.documentValue, [value.isMandatory ? Validators.required : Validators.nullValidator, Validators.pattern(value.validation)]] : [""],
                      label: value.fieldType == 'Date' ? [value.lable] : [],
                      disabled: value.fieldType == 'Date' ? [value.documentValue != '' && value.documentValue != null && !this.questions.registeration ? true : null] : [],
                      options: value.fieldType == 'Date' ? [{ id: 1, value: 'test' }] : [],
                      mandatory: value.fieldType == 'Date' ? [value.isMandatory] : [],
                      documentDetailId: value.fieldType == 'Date' ? [value.documentDetailId] : [],
                      documentFieldName: value.fieldType == 'Date' ? [value.documentFieldName] : []
                    }),

                    varchar1: this.fb.group({
                      fieldType: value.fieldType == 'Varchar 1' ? [value.fieldType] : [],
                      value: value.fieldType == 'Varchar 1' ? [value.documentValue, [value.isMandatory ? Validators.required : Validators.nullValidator, Validators.pattern(value.validation)]] : [""],
                      label: value.fieldType == 'Varchar 1' ? [value.lable] : [],
                      disabled: value.fieldType == 'Varchar 1' ? [value.documentValue != '' && value.documentValue != null && !this.questions.registeration ? true : null] : [],
                      options: value.fieldType == 'Varchar 1' ? [{ id: 1, value: 'test' }] : [],
                      mandatory: value.fieldType == 'Varchar 1' ? [value.isMandatory] : [],
                      documentDetailId: value.fieldType == 'Varchar 1' ? [value.documentDetailId] : [],
                      documentFieldName: value.fieldType == 'Varchar 1' ? [value.documentFieldName] : []
                    }),

                    varchar2: this.fb.group({
                      fieldType: value.fieldType == 'Varchar 2' ? [value.fieldType] : [],
                      value: value.fieldType == 'Varchar 2' ? [value.documentValue, [value.isMandatory ? Validators.required : Validators.nullValidator, Validators.pattern(value.validation)]] : [""],
                      label: value.fieldType == 'Varchar 2' ? [value.lable] : [],
                      disabled: value.fieldType == 'Varchar 2' ? [value.documentValue != '' && value.documentValue != null && !this.questions.registeration ? true : null] : [],
                      options: value.fieldType == 'Varchar 2' ? [{ id: 1, value: 'test' }] : [],
                      mandatory: value.fieldType == 'Varchar 2' ? [value.isMandatory] : [],
                      documentDetailId: value.fieldType == 'Varchar 2' ? [value.documentDetailId] : [],
                      documentFieldName: value.fieldType == 'Varchar 2' ? [value.documentFieldName] : []
                    }),

                    varchar3: this.fb.group({
                      fieldType: value.fieldType == 'Varchar 3' ? [value.fieldType] : [],
                      value: value.fieldType == 'Varchar 3' ? [value.documentValue, [value.isMandatory ? Validators.required : Validators.nullValidator, Validators.pattern(value.validation)]] : [""],
                      label: value.fieldType == 'Varchar 3' ? [value.lable] : [],
                      disabled: value.fieldType == 'Varchar 3' ? [value.documentValue != '' && value.documentValue != null && !this.questions.registeration ? true : null] : [],
                      options: value.fieldType == 'Varchar 3' ? [{ id: 1, value: 'test' }] : [],
                      mandatory: value.fieldType == 'Varchar 3' ? [value.isMandatory] : [],
                      documentDetailId: value.fieldType == 'Varchar 3' ? [value.documentDetailId] : [],
                      documentFieldName: value.fieldType == 'Varchar 3' ? [value.documentFieldName] : []
                    }),

                    int: this.fb.group({
                      fieldType: value.fieldType == 'INT' ? [value.fieldType] : [],
                      value: value.fieldType == 'INT' ? [value.documentValue, [value.isMandatory ? Validators.required : Validators.nullValidator, Validators.pattern(value.validation)]] : [""],
                      label: value.fieldType == 'INT' ? [value.lable] : [],
                      disabled: value.fieldType == 'INT' ? [value.documentValue != '' && value.documentValue != null && !this.questions.registeration ? true : null] : [],
                      options: value.fieldType == 'INT' ? [{ id: 1, value: 'test' }] : [],
                      mandatory: value.fieldType == 'INT' ? [value.isMandatory] : [],
                      documentDetailId: value.fieldType == 'INT' ? [value.documentDetailId] : [],
                      documentFieldName: value.fieldType == 'INT' ? [value.documentFieldName] : []
                    }),

                    percentage: this.fb.group({
                      fieldType: value.fieldType == 'Percentage' ? [value.fieldType] : [],
                      value: value.fieldType == 'Percentage' ? [value.documentValue, [value.isMandatory ? Validators.required : Validators.nullValidator, Validators.pattern(value.validation)]] : [""],
                      label: value.fieldType == 'Percentage' ? [value.lable] : [],
                      disabled: value.fieldType == 'Percentage' ? [value.documentValue != '' && value.documentValue != null && !this.questions.registeration ? true : null] : [],
                      options: value.fieldType == 'Percentage' ? [{ id: 1, value: 'test' }] : [],
                      mandatory: value.fieldType == 'Percentage' ? [value.isMandatory] : [],
                      documentDetailId: value.fieldType == 'Percentage' ? [value.documentDetailId] : [],
                      documentFieldName: value.fieldType == 'Percentage' ? [value.documentFieldName] : []
                    }),

                    fileupload: this.fb.group({
                      fieldType: value.fieldType == 'File upload' ? [value.fieldType] : [],
                      value: value.fieldType == 'File upload' ? ['', [value.isMandatory && (value.documentValue == '' || value.documentValue == null) ? Validators.required : Validators.nullValidator, Validators.pattern(value.validation)]] : [""],
                      label: value.fieldType == 'File upload' ? [value.lable] : [],
                      disabled: value.fieldType == 'File upload' ? [value.documentValue != '' && value.documentValue != null && !this.questions.registeration ? true : null] : [],
                      options: value.fieldType == 'File upload' ? [{ id: 1, value: 'test' }] : [],
                      mandatory: value.fieldType == 'File upload' ? [value.isMandatory] : [],
                      documentDetailId: value.fieldType == 'File upload' ? [value.documentDetailId] : [],
                      documentFieldName: value.fieldType == 'File upload' ? [value.documentFieldName] : [],
                      uploadFileName: value.fieldType == 'File upload' ? [value.documentValue] : [""],
                    }),

                    video: this.fb.group({
                      fieldType: value.fieldType == 'Video' ? [value.fieldType] : [],
                      value: value.fieldType == 'Video' ? ['', [value.isMandatory && (value.documentValue == '' || value.documentValue == null) ? Validators.required : Validators.nullValidator, Validators.pattern(value.validation)]] : [""],
                      label: value.fieldType == 'Video' ? [value.lable] : [],
                      disabled: value.fieldType == 'Video' ? [value.documentValue != '' && value.documentValue != null && !this.questions.registeration ? true : null] : [],
                      options: value.fieldType == 'Video' ? [{ id: 1, value: 'test' }] : [],
                      mandatory: value.fieldType == 'Video' ? [value.isMandatory] : [],
                      documentDetailId: value.fieldType == 'Video' ? [value.documentDetailId] : [],
                      documentFieldName: value.fieldType == 'Video' ? [value.documentFieldName] : [],
                      uploadFileName: value.fieldType == 'Video' ? [value.documentValue] : [""],
                    }),

                    dropdown: this.fb.group({
                      fieldType: value.fieldType == 'DropDown' ? [value.fieldType] : [],
                      value: value.fieldType == 'DropDown' ? [value.documentValue, [value.isMandatory ? Validators.required : Validators.nullValidator, Validators.pattern(value.validation)]] : [""],
                      label: value.fieldType == 'DropDown' ? [value.lable] : [],
                      disabled: value.fieldType == 'DropDown' ? [value.documentValue != '' && value.documentValue != null && !this.questions.registeration ? true : null] : [],
                      optionsValue: value.fieldType == 'DropDown' ? [value.dropDownData] : [],
                      mandatory: value.fieldType == 'DropDown' ? [value.isMandatory] : [],
                      documentDetailId: value.fieldType == 'DropDown' ? [value.documentDetailId] : [],
                      documentFieldName: value.fieldType == 'DropDown' ? [value.documentFieldName] : [],

                    }),
                    multiple: this.fb.group({
                      fieldType: value.fieldType == 'Multiple' ? [value.fieldType] : [],
                      value: value.fieldType == 'Multiple' ? [multipleValues, [value.isMandatory ? Validators.required : Validators.nullValidator, Validators.pattern(value.validation)]] : [""],
                      label: value.fieldType == 'Multiple' ? [value.lable] : [],
                      disabled: value.fieldType == 'Multiple' ? [value.documentValue != '' && value.documentValue != null && !this.questions.registeration ? true : null] : [],
                      optionsValue: value.fieldType == 'Multiple' ? [value.dropDownData] : [],
                      mandatory: value.fieldType == 'Multiple' ? [value.isMandatory] : [],
                      documentDetailId: value.fieldType == 'Multiple' ? [value.documentDetailId] : [],
                      documentFieldName: value.fieldType == 'Multiple' ? [value.documentFieldName] : []
                    }),
                  });

                this.questionsArray.push(question)
              }
            })
          }
        } else {

        }
      });
    }




    console.log(this.questionsArray);
  }
  newQuestions(): FormGroup {
    return this.fb.group(
      {
        text1: [],
        selector: [],
        text2: []
      })
  };
  get questionsArray(): FormArray {
    return this.form.get('questions') as FormArray
  }
  addQuestions() {
    this.questionsArray.push(this.newQuestions())
  }
  get textValidation() {
    return
  }

  keyPressNumber(evt, label) {
    var charCode = (evt.which) ? evt.which : evt.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

    return true;
  }

  // Only AlphaNumeric
  keyPressAlpha(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z ]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }


  isChecked() {
    if (this.agree.nativeElement.checked) {
      this.agreeCheckBox = true;
    } else {
      this.agreeCheckBox = false;
    }

  }

  keyPressChar($event, fieldType) {
    let regex: string;
    switch (fieldType) {
      // case 'Text':
      //   regex = '^[a-zA-Z]*$';
      //   break;
      case 'INT':
        regex = '^[0-9]+';
        break;
      case 'Percentage':
        regex = '[+-]?([0-9]*[.])?[0-9]+';
        break;
      case 'File upload':
        regex = '';
        break;
      case 'Video':
        regex = '';
        break;
      case 'DropDown':
        regex = '';
        break;
      case 'Multiple':
        regex = '';
        break;
      case 'Varchar 1':
        regex = '^[ A-Za-z0-9_@./#&+-,]*$';
        break;
      case 'Varchar 2':
        regex = '^[ A-Za-z_@./#&+-]*$';
        break;
      case 'Varchar 3':
        regex = '^[ A-Za-z0-9]*$';
        break;
      default:
        regex = '';
        break;
    }


    const globalRegex = new RegExp(regex);
    var inp = String.fromCharCode($event.keyCode);
    if (globalRegex.test(inp)) {
      return true;
    } else {
      $event.preventDefault();
      return false;
    }
  }


  onVideoFileSelect(event: any, docFieldName) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.size <= 60000000) {
        debugger
        var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
        let _validFileExtensions = ['MPEG', 'MPEG4', 'MP4', 'MOV', 'WMV', 'AVI', 'AVCHD', 'MTS', 'MKV', 'WEBM'];
        if (event.target.files.length > 0 && _validFileExtensions.includes(ext.toUpperCase())) {

          this.fileValidation = true;
          const withoutFileIndex = this.fileValidateLabels.indexOf(docFieldName);
          if (withoutFileIndex > -1) { // only splice array when item is found
            this.fileValidateLabels.splice(withoutFileIndex, 1); // 2nd parameter means remove one item only
          }

          let searchFiles = this.filesBulkData.filter(FileData => Object.keys(FileData)[0] == event.target.id)
          if (searchFiles.length > 0) {
            this.filesBulkData.forEach((fielData, index) => {
              var obj = { [event.target.id]: file }
              if (Object.keys(fielData)[0] == event.target.id) {
                this.filesBulkData[index] = obj;
              }
            })
          } else {
            var obj = { [event.target.id]: file }
            this.filesBulkData.push(obj);
          }

          this.fileUploadDocuments = this.filesBulkData;
          var zip = new JSZip();
          //var fieFolder = zip.folder("final");
          for (let i = 0; i < this.fileUploadDocuments?.length; i++) {
            var ext = this.fileUploadDocuments[i][(Object.keys(this.fileUploadDocuments[i])[0])].name.substr(this.fileUploadDocuments[i][(Object.keys(this.fileUploadDocuments[i])[0])].name.lastIndexOf('.') + 1);
            let fileReplace = Object.keys(this.fileUploadDocuments[i])[0].replace(this.replaceRegex, "-");
            let fileName = fileReplace + '.' + ext;
            // zip.file((Object.keys(this.fileUploadDocuments[i])[0]), this.fileUploadDocuments[i][(Object.keys(this.fileUploadDocuments[i])[0])]);
           debugger
            console.log(fileName);
            zip.file((fileName), this.fileUploadDocuments[i][(Object.keys(this.fileUploadDocuments[i])[0])]);
          }

          zip.generateAsync({ type: "blob" })
            .then((content: any) => {
              this.zipFiles = content;
            });

        } else {
          this.fileValidation = false;
          if (!this.fileValidateLabels.includes(docFieldName)) {
            this.fileValidateLabels.push(docFieldName);
          }
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Invalid File Format',
          });
        }
      } else {
        event.target.value = null;
        this.fileValidation = false;

        if (!this.fileValidateLabels.includes(docFieldName)) {
          this.fileValidateLabels.push(docFieldName);
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'File size should be less than 60MB',
        });
      }
    }
  }


  onFileSelect(event: any, docFieldName) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.size <= 2000000) {
        var ext = file.name.substr(file.name.lastIndexOf('.') + 1);
        let _validFileExtensions = ['jpeg', 'xlsx', 'jpg', 'pdf', 'doc', 'png', 'xls', 'docx', 'PNG', 'JPEG', 'JPG'];
        if (event.target.files.length > 0 && _validFileExtensions.includes(ext)) {

          this.fileValidation = true;
          const withoutFileIndex = this.fileValidateLabels.indexOf(docFieldName);
          if (withoutFileIndex > -1) { // only splice array when item is found
            this.fileValidateLabels.splice(withoutFileIndex, 1); // 2nd parameter means remove one item only
          }

          let searchFiles = this.filesBulkData.filter(FileData => Object.keys(FileData)[0] == event.target.id)
          if (searchFiles.length > 0) {
            this.filesBulkData.forEach((fielData, index) => {
              var obj = { [event.target.id]: file }
              if (Object.keys(fielData)[0] == event.target.id) {
                this.filesBulkData[index] = obj;
              }
            })
          } else {
            var obj = { [event.target.id]: file }
            this.filesBulkData.push(obj);
          }

          this.fileUploadDocuments = this.filesBulkData;
          var zip = new JSZip();
          //var fieFolder = zip.folder("final");
          for (let i = 0; i < this.fileUploadDocuments?.length; i++) {
            var ext = this.fileUploadDocuments[i][(Object.keys(this.fileUploadDocuments[i])[0])].name.substr(this.fileUploadDocuments[i][(Object.keys(this.fileUploadDocuments[i])[0])].name.lastIndexOf('.') + 1);
            let fileReplace = Object.keys(this.fileUploadDocuments[i])[0].replace(this.replaceRegex, "-");
            let fileName = fileReplace + '.' + ext;
            debugger
            console.log(fileName);
            // zip.file((Object.keys(this.fileUploadDocuments[i])[0]), this.fileUploadDocuments[i][(Object.keys(this.fileUploadDocuments[i])[0])]);

            zip.file((fileName), this.fileUploadDocuments[i][(Object.keys(this.fileUploadDocuments[i])[0])]);
          }

          zip.generateAsync({ type: "blob" })
            .then((content: any) => {
              this.zipFiles = content;
            });

        } else {
          this.fileValidation = false;
          if (!this.fileValidateLabels.includes(docFieldName)) {
            this.fileValidateLabels.push(docFieldName);
          }
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Invalid File Format',
          });
        }
      } else {
        event.target.value = null;
        this.fileValidation = false;

        if (!this.fileValidateLabels.includes(docFieldName)) {
          this.fileValidateLabels.push(docFieldName);
        }
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'File size should be less than 2MB',
        });
      }
    }
  }

  columnFilter(e) {

  }

  onSubmit() {

    console.log(this.fileValidateLabels);
    console.log(this.fileValidation);
    debugger
    if (this.form.valid && this.fileValidateLabels.length == 0) {

      this.form.value.questions.forEach((formValues: any) => {
        let obj = new AdditionalFieldsCls();
        if (formValues.text.value && !formValues.text.disabled) {
          obj.fieldType = formValues.text.fieldType;
          obj.documentValue = formValues.text.value;
          obj.documentDetailId = formValues.text.documentDetailId;
          obj.documentFieldName = formValues.text.documentFieldName.replace(this.replaceRegex, "-");
        } else if (formValues.int.value && !formValues.int.disabled) {
          obj.fieldType = formValues.int.fieldType;
          obj.documentValue = formValues.int.value;
          obj.documentDetailId = formValues.int.documentDetailId;
          obj.documentFieldName = formValues.int.documentFieldName.replace(this.replaceRegex, "-");
        } else if (formValues.percentage.value && !formValues.percentage.disabled) {
          obj.fieldType = formValues.percentage.fieldType;
          obj.documentValue = formValues.percentage.value;
          obj.documentDetailId = formValues.percentage.documentDetailId;
          obj.documentFieldName = formValues.percentage.documentFieldName.replace(this.replaceRegex, "-");
        } else if (formValues.fileupload.value && !formValues.fileupload.disabled) {
          obj.fieldType = formValues.fileupload.fieldType;
          let filenameArray = (formValues.fileupload.value).split(/[\\]/);
          obj.documentValue = filenameArray[(formValues.fileupload.value).split(/[\\]/).length - 1];
          obj.documentDetailId = formValues.fileupload.documentDetailId;
          obj.documentFieldName = formValues.fileupload.documentFieldName.replace(this.replaceRegex, "-");
        } else if (formValues.video.value && !formValues.video.disabled) {
          obj.fieldType = formValues.video.fieldType;
          let filenameArray = (formValues.video.value).split(/[\\]/);
          obj.documentValue = filenameArray[(formValues.video.value).split(/[\\]/).length - 1];
          obj.documentDetailId = formValues.video.documentDetailId;
          obj.documentFieldName = formValues.video.documentFieldName.replace(this.replaceRegex, "-");
        } else if (formValues.dropdown.value && !formValues.dropdown.disabled) {
          obj.fieldType = formValues.dropdown.fieldType;
          obj.documentValue = formValues.dropdown.value;
          obj.documentDetailId = formValues.dropdown.documentDetailId;
          obj.documentFieldName = formValues.dropdown.documentFieldName.replace(this.replaceRegex, "-");
        } else if (formValues.multiple.value && !formValues.multiple.disabled) {
          let multipleValues = formValues.multiple.value.map((x) => x.value).join(',');
          obj.fieldType = formValues.multiple.fieldType;
          obj.documentValue = multipleValues;
          obj.documentDetailId = formValues.multiple.documentDetailId;
          obj.documentFieldName = formValues.multiple.documentFieldName.replace(this.replaceRegex, "-");
        } else if (formValues.date.value && !formValues.date.disabled) {
          obj.fieldType = formValues.date.fieldType;
          obj.documentValue = formValues.date.value;
          obj.documentDetailId = formValues.date.documentDetailId;
          obj.documentFieldName = formValues.date.documentFieldName.replace(this.replaceRegex, "-");
        } else if (formValues.varchar1.value && !formValues.varchar1.disabled) {
          obj.fieldType = formValues.varchar1.fieldType;
          obj.documentValue = formValues.varchar1.value;
          obj.documentDetailId = formValues.varchar1.documentDetailId;
          obj.documentFieldName = formValues.varchar1.documentFieldName.replace(this.replaceRegex, "-");
        } else if (formValues.varchar2.value && !formValues.varchar2.disabled) {
          obj.fieldType = formValues.varchar2.fieldType;
          obj.documentValue = formValues.varchar2.value;
          obj.documentDetailId = formValues.varchar2.documentDetailId;
          obj.documentFieldName = formValues.varchar2.documentFieldName.replace(this.replaceRegex, "-");
        } else if (formValues.varchar3.value && !formValues.varchar3.disabled) {
          obj.fieldType = formValues.varchar3.fieldType;
          obj.documentValue = formValues.varchar3.value;
          obj.documentDetailId = formValues.varchar3.documentDetailId;
          obj.documentFieldName = formValues.varchar3.documentFieldName.replace(this.replaceRegex, "-");
        }

        if (obj.fieldType && obj.fieldType != '') {
          this.objArray.push(obj)
        }
      });
      let AdditionalFieldsSave = {
        "userId": this.questions.userId,
        "projectAddtionalFields": [
          {
            "projectId": this.questions.projectID,
            "fields": this.objArray
          }
        ]
      }
      this.successmsg = false;
      this.spinner = true;
      $('.spinner').show();
      console.log(this.questions.registeration);
      this.commonService.additionalFieldsSave(AdditionalFieldsSave, this.zipFiles).subscribe({
        next: data => {
          if (data.status == "Success") {
            this.spinner = false;
            $('.spinner').hide();

            this.successMessage = data.message;
            this.toastr.success('Registration Successful');
            // if (this.questions.registeration) {
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 5000);
            // }
          } else {
            this.toastr.success(data.message);
            $('.spinner').hide();
          }

        }, error: e => {
          console.error(e)
          $('.spinner').hide();
        }
      })
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please upload valid file ' + this.fileValidateLabels.toString(),
      });
    }
  }

}
