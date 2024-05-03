export class Batch {
    constructor(
    public programName : string,
    public courseName: string,
    public noOfStudents: string,
    public days: string,
    public hours: string,
    public courseType: string,
    public startDate: any,
    public endDate: any,
    public projectName: string,
    public projectManagerName: any = [],
    public trainerName: string,
    public programOutline: string,
    public programOutlineUrl: string,
    public feedbackScore: string,
    public overallStatus: string,
    public status: string,

    ){}
}
