export class FeedbackViewModel {
  public projectName: any;
  public programName: any;
  public BatchName: any;
  public CourseName: any;
  public FormName: any;
  public CreateFormName: any;
  public NewFormName: any;

  constructor() {
    (this.projectName = ''),
      (this.programName = ''),
      (this.BatchName = ''),
      (this.CourseName = ''),
      (this.FormName = ''),
      (this.NewFormName = ''),
      (this.CreateFormName = '');
  }
}
