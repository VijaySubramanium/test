export class FieldsMappingModel {
  public field_name: any;
  public project: any;
  public mandatory: any;
  public field_type: any;
  public validation: any;

  constructor() {
    (this.field_name = ''),
      (this.project = ''),
      (this.mandatory = ''),
      (this.field_type = ''),
      (this.validation = '');
  }
}
