export class addProgramDetails {


    constructor(
    public programName :string,
    public courses :any,
    public programOutline:string,
   // public status :string,
    public startDate :any,
    public endDate:any,
    public programStatus:string,
    public projectName:any,
    public projectManagerId:any,
    public projectManagerName:any

    ){}

      }

      export class editProgramDetails {


        constructor(
        public programMapId: any,
        public programName :string,
        public courseId: any,
        public courseName :any,
        public programOutline:string,
        public status :string,
        public startdate :any,
        public enddate:any,
        //public programStatus:string,
        public projectName:any,
        public projectManagerId:any,
        public projectManagerName:any

        ){}

          }
