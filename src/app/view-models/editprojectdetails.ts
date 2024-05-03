export class editprojectDetails {

    constructor(
    public  project_id :string,
    public project_name :string,
    public start_date :any,
    public end_date:any,
    public status :string,
    public project_manager_id : any,
    //public project_manager_name :string,
    //public project_manager_lastname :string,
    public overall_status:string,
    public terms_and_conditions: any,
    public terms_and_conditions_status: any,
    public version: any

    ){}
}
