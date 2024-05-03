export class StudentModel {
  public firstName: string;
  public lastName: string;
  public gender: string;
  public dob: string;
  // public maritalStatus : string;
  public email: string;
  public mobile: string;
  public whatsappNumber: string;
  public password: string;
  public confirmPassword: string;
  public isGraduated: string;
  public stateId: string;
  public collegeCity: string;
  public collegeName: any;
  public aadharNumber: string;
  // public panNumber : string;
  public educationalQualification: string;
  public graduationPassingYear: string;
  public subject: string;
  public profession: string;
  public currentLocation: string;
  // public enrolmentId : "string";
  public gttId: string;
  public roleId: string;
  public roleName: string;
  public isPlaced: string;
  public sector: string;
  public vaccinationStatus: string;
  public termsAndConditions: string;
  public caste: string;
  public candidateCategory: string;
  public placedOrganization: string;
  public designation: string;
  public joiningMonth: string;
  public status: string;
  public uploadVaccinationCertificate: string;
  public dubUploadVaccinationCertificate: string;
  public insertedBy: string;
  // public active : 0
  constructor() {
    (this.firstName = ''),
      (this.lastName = ''),
      (this.gender = ''),
      (this.dob = ''),
      // this.maritalStatus='',
      (this.email = ''),
      (this.mobile = ''),
      (this.whatsappNumber = ''),
      (this.password = ''),
      (this.confirmPassword = ''),
      (this.isGraduated = ''),
      (this.stateId = ''),
      (this.collegeCity = ''),
      (this.collegeName = ''),
      (this.aadharNumber = ''),
      // this.panNumber='',
      (this.educationalQualification = ''),
      (this.graduationPassingYear = ''),
      (this.subject = ''),
      (this.profession = ''),
      (this.currentLocation = ''),
      // this.enrolmentId='',
      (this.gttId = ''),
      (this.roleId = '3'),
      (this.roleName = ''),
      (this.vaccinationStatus = ''),
      (this.termsAndConditions = ''),
      (this.caste = ''),
      (this.candidateCategory = ''),
      (this.placedOrganization = ''),
      (this.designation = ''),
      (this.joiningMonth = ''),
      (this.status = ''),
      (this.uploadVaccinationCertificate = '');
      (this.dubUploadVaccinationCertificate = '');
      (this.insertedBy = '');
  }
}
