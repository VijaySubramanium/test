import { NgModule } from '@angular/core';
import { BrowserModule, Title } from '@angular/platform-browser';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
//import { CalendarModule } from 'primeng/calendar';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
//import bootstrap from "bootstrap";
import { QuestionControlService } from './helper/question-control.service';
//import {NgForm} from '@angular/forms';

import { SharedModule } from './shared.module';
import { ToastrModule } from 'ngx-toastr';
import { CalendarModule } from 'primeng/calendar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { PanelMenuModule } from 'primeng/panelmenu';
import { AppRoutingModule, routingcomponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './component/header/header.component';
import { SidebarComponent } from './component/sidebar/sidebar.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentprofileComponent } from './studentprofile/studentprofile.component';
import { CollegeregComponent } from './register/collegereg/collegereg.component';
import { UserManagementComponent } from './user-management/user-management.component';
//import { StudentregistrationComponent } from './register/studentregistration/studentregistration.component';
//import { ForgotpasswordComponent } from './login/forgotpassword/forgotpassword.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { DynamicFormInputfieldsComponent } from './dynamic-form-inputfields/dynamic-form-inputfields.component';
import { UsermanagementService } from './services/user-management.service';
import { AdminDocumentVerificationComponent } from './admin-document-verification/admin-document-verification.component';
import { CollegescreenComponent } from './collegescreen/collegescreen.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { BatchDetailsComponent } from './batch-details/batch-details.component';
import { ProgramManagementComponent } from './program-management/program-management.component';
import { EditStuProComponent } from './edit-stu-pro/edit-stu-pro.component';
import { DocumentVerificationComponent } from './document-verification/document-verification.component';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { CarouselModule } from 'primeng/carousel';
import { PaginatorModule } from 'primeng/paginator';
import { ChipsModule } from 'primeng/chips';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

//import { ProgramDetailsComponent } from './program-details/program-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeadersInterceptor } from './headers.interceptor';
import { DialogModule } from 'primeng/dialog';
import { AnalyticsReportingComponent } from './analytics-reporting/analytics-reporting.component';
import { FeedbackModuleComponent } from './feedback-module/feedback-module.component';
import { FeedbackQuestionsComponent } from './feedback-module/feedback-questions/feedback-questions.component';
import { FeedbackResponsesComponent } from './feedback-module/feedback-responses/feedback-responses.component';
import { FeedbackViewformsComponent } from './feedback-module/feedback-viewforms/feedback-viewforms.component';
import { FeedbackUsersComponent } from './feedback-module/feedback-users/feedback-users.component';
import { AttendanceModuleComponent } from './attendance-module/attendance-module.component';
import { AttendanceStudentComponent } from './attendance-module/attendance-student/attendance-student.component';
import { AttendanceTrainerComponent } from './attendance-module/attendance-trainer/attendance-trainer.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CourseModuleComponent } from './course-module/course-module.component';
import { CourseOnlineComponent } from './course-module/course-online/course-online.component';
import { CourseSelfComponent } from './course-module/course-self/course-self.component';
import { CourseClassroomComponent } from './course-module/course-classroom/course-classroom.component';
import { CollegeComponent } from './college/college.component';
import { CourseAdminComponent } from './course-module/course-admin/course-admin.component';
import { DropdownModule } from 'primeng/dropdown';
import { StudentRegisterComponent } from './student-module/student-register/student-register.component';
import { StudentAddComponent } from './student-module/student-add/student-add.component';
import { ProfessionalAddComponent } from './professional-module/professional-add/professional-add.component';
import { ProfessionalRegisterComponent } from './professional-module/professional-register/professional-register.component';
import { CourseDetailsComponent } from './course-module/course-details/course-details.component';
import { AttendanceAdminComponent } from './attendance-module/attendance-admin/attendance-admin.component';
import { ReportsModuleComponent } from './reports-module/reports-module.component';
import { FeedbackDownloadComponent } from './feedback-module/feedback-download/feedback-download.component';
import { HistoricalDataComponent } from './historical-data/historical-data.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { MessagesModule } from 'primeng/messages';
import { NotificationComponent } from './notification/notification.component';
import { DashboardModuleComponent } from './dashboard-module/dashboard-module.component';
import { RegistrationDashboardComponent } from './dashboard-module/registration-dashboard/registration-dashboard.component';
import { BatchcreationDashboardComponent } from './dashboard-module/batchcreation-dashboard/batchcreation-dashboard.component';
import { AveragefeedbackDashboardComponent } from './dashboard-module/averagefeedback-dashboard/averagefeedback-dashboard.component';
import { InstantComponent } from './instant/instant.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    LoginComponent,
    routingcomponents,
    CollegeComponent,
    RegisterComponent,
    StudentprofileComponent,
    CollegeregComponent,
    DynamicFormComponent,
    DashboardComponent,
    DynamicFormInputfieldsComponent,
    UserManagementComponent,
    HistoricalDataComponent,
    CollegescreenComponent,
    SpinnerComponent,
    ProjectDetailsComponent,
    BatchDetailsComponent,
    ProgramManagementComponent,
    EditStuProComponent,
    DocumentVerificationComponent,
    AnalyticsReportingComponent,
    FeedbackModuleComponent,
    FeedbackQuestionsComponent,
    FeedbackResponsesComponent,
    FeedbackViewformsComponent,
    FeedbackUsersComponent,
    AttendanceModuleComponent,
    AttendanceStudentComponent,
    AttendanceTrainerComponent,
    CourseModuleComponent,
    CourseOnlineComponent,
    CourseSelfComponent,
    CourseClassroomComponent,
    CourseAdminComponent,
    StudentRegisterComponent,
    StudentAddComponent,
    ProfessionalAddComponent,
    ProfessionalRegisterComponent,
    CourseDetailsComponent,
    AttendanceAdminComponent,
    ReportsModuleComponent,
    FeedbackDownloadComponent,
    NotificationComponent,
    DashboardModuleComponent,
    RegistrationDashboardComponent,
    BatchcreationDashboardComponent,
    AveragefeedbackDashboardComponent,
    AdminDocumentVerificationComponent,
    InstantComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatTabsModule,
    CarouselModule,
    MatBadgeModule,
    FormsModule,
    HttpClientModule,
    NgMultiSelectDropDownModule,
    CalendarModule,
    ReactiveFormsModule,
    SharedModule,
    DialogModule,
    NgbModule,
    RadioButtonModule,
    DropdownModule,
    ToastrModule.forRoot(),
    MatProgressBarModule,
    PaginatorModule,
    ChipsModule,
    HighchartsChartModule,
    NgbCarouselModule,
    PanelMenuModule,
    MessagesModule,
    NgxExtendedPdfViewerModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeadersInterceptor,
      multi: true
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    QuestionControlService, UsermanagementService, DatePipe, Title],
  bootstrap: [AppComponent],
})
export class AppModule { }
