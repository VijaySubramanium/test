export class QuestionBase<T> {
  value: T|undefined;
  key: string;
  label: string;
  required: boolean;
  order: number;
  controlType: string;
  type: string;
  options: {key: string, value: string}[];
  projectAddtionalFields:[{id:1}]

  constructor(options: {
      value?: T;
      key?: string;
      label?: string;
      required?: boolean;
      order?: number;
      controlType?: string;
      type?: string;
      options?: {key: string, value: string}[];
    } = {}) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.order = options.order === undefined ? 1 : options.order;
    this.controlType = options.controlType || '';
    this.type = options.type || '';
    this.options = options.options || [];
  }
}
export class AdditionalFieldsCls<T> {
  comments: string;
  docConfigId: number;
  documentDetailId: number;
  documentFieldName: string;
  documentId: number;
  documentUrl: string;
  documentValue: string;
  fieldOrder: number;
  fieldType: string;
  insertedBy: number;
  isActive: number;
  isMandatory: number;
  lable: string;
  projectId: number;
  recordStatus: number;
  verificationStatus:string;

  constructor(options: {
    comments: string;
    docConfigId: number;
    documentDetailId: number,
    documentFieldName: string,
    documentId: number,
    documentUrl: string,
    documentValue: string,
    fieldOrder: number,
    fieldType: string,
    insertedBy: number,
    isActive: number,
    isMandatory: number,
    lable: string,
    projectId: number,
    recordStatus: number,
    verificationStatus:string
    } = {
    comments: "",
    docConfigId: 0,
    documentDetailId: 0,
    documentFieldName: "",
    documentId: 0,
    documentUrl: "",
    documentValue: "",
    fieldOrder: 0,
    fieldType: "",
    insertedBy: 0,
    isActive: 0,
    isMandatory: 0,
    lable: "",
    projectId: 0,
    recordStatus: 0,
    verificationStatus: ""
  }) {   
    this.comments= options.comments;
    this.docConfigId= options.docConfigId;
    this.documentDetailId= options.documentDetailId;
    this.documentFieldName=  options.documentFieldName;
    this.documentId=  options.documentId;
    this.documentUrl= options.documentUrl;
    this.documentValue=  options.documentValue;
    this.fieldOrder=  options.fieldOrder;
    this.fieldType=  options.fieldType;
    this.insertedBy=  options.insertedBy;
    this.isActive=  options.isActive;
    this.isMandatory= options.isMandatory;
    this.lable=  options.lable;
    this.projectId=  options.projectId;
    this.recordStatus=  options.recordStatus;
    this.verificationStatus= options.verificationStatus;
  }
}
