import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotpasswordComponent } from './login/forgotpassword/forgotpassword.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { StudentprofileComponent } from './studentprofile/studentprofile.component';
import { CollegeregComponent } from './register/collegereg/collegereg.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { CollegeComponent } from './college/college.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { BatchDetailsComponent } from './batch-details/batch-details.component';
import { ProgramManagementComponent } from './program-management/program-management.component';
import { AnalyticsReportingComponent } from './analytics-reporting/analytics-reporting.component';
import { ReportsModuleComponent } from './reports-module/reports-module.component';
import { DocumentVerificationComponent } from './document-verification/document-verification.component';
import { FeedbackModuleComponent } from './feedback-module/feedback-module.component';
import { AttendanceModuleComponent } from './attendance-module/attendance-module.component';
import { CourseModuleComponent } from './course-module/course-module.component';
import { CourseDetailsComponent } from './course-module/course-details/course-details.component';
import { StudentRegisterComponent } from './student-module/student-register/student-register.component';
import { ProfessionalRegisterComponent } from './professional-module/professional-register/professional-register.component';
import { HistoricalDataComponent } from './historical-data/historical-data.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NotificationComponent } from './notification/notification.component';
import { DashboardModuleComponent } from './dashboard-module/dashboard-module.component';
import { AdminDocumentVerificationComponent } from './admin-document-verification/admin-document-verification.component';
import { InstantComponent } from './instant/instant.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'passwordreset', component: ForgotpasswordComponent },
  { path: 'studentprofile', component: StudentprofileComponent },
  { path: 'studentregistration', component: StudentRegisterComponent },
  // { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard', component: DashboardModuleComponent },
  { path: 'dashboard/register', component: DashboardModuleComponent },
  { path: 'dashboard/batch', component: DashboardModuleComponent },
  { path: 'dashboard/avgbatch', component: DashboardModuleComponent },

  { path: 'notification', component: NotificationComponent },


  {
    path: 'professionalregistration',
    component: ProfessionalRegisterComponent,
  },
  { path: 'collegeregistration', component: CollegeregComponent },
  { path: 'admincollegedetails', component: CollegeComponent },
  { path: 'adminuserdetails', component: UserManagementComponent },
  { path: 'adminprojectdetails', component: ProjectDetailsComponent },
  { path: 'adminbatchdetails', component: BatchDetailsComponent },
  { path: 'adminprogramdetails', component: ProgramManagementComponent },
  { path: 'reports', component: ReportsModuleComponent },
  { path: 'historicaldata', component: HistoricalDataComponent },
  { path: 'admindocumentverification', component: AdminDocumentVerificationComponent },
  { path: 'adminfeedback', component: FeedbackModuleComponent },
  { path: 'studentfeedback', component: FeedbackModuleComponent },
  { path: 'attendance', component: AttendanceModuleComponent },
  { path: 'coursemanagement', component: CourseModuleComponent },
  { path: 'coursedetail', component: CourseDetailsComponent },
  { path: 'instants', component: InstantComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
export const routingcomponents = [
  RegisterComponent,
  ForgotpasswordComponent,
  StudentprofileComponent,
  UserManagementComponent,
  CollegeComponent,
  BatchDetailsComponent,
];
