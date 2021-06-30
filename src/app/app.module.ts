import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RecaptchaModule, RecaptchaFormsModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { HttpClientModule} from '@angular/common/http';

import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ChangePassword } from './auth/change_password/change_password.component'; 
import { HeaderComponent } from './header/header.component'; 
import { FooterComponent } from './footer/footer.component';
import { ErrorComponent } from './error/error.component';
import { MainAdminComponent } from './users/admin/main-admin/main-admin.component';
import { MainGuestComponent } from './users/guest/main-guest/main-guest.component';
import { ModeratorComponent } from './users/moderator/moderator.component';
import { SearchBooksComponent } from './users/guest/search-books/search-books.component';
import { ViewBookComponent } from './view-book/view-book.component';
import { AddBookComponent } from './add-book/add-book.component';
import { MainRegularComponent } from './users/regular/main-regular/main-regular.component';
import { ChangeAttributeComponent } from './users/change-attribute/change-attribute.component';
import { ChangeCommentComponent } from './users/change-comment/change-comment.component';
import { VisitUserComponent } from './users/visit-user/visit-user.component';
import { ChangeBookComponent } from './change-book/change-book.component';
import { GenreComponent } from './users/admin/genre/genre.component';
import { ApproveBookComponent } from './users/approve-book/approve-book.component';
import { AddEventComponent} from './users/add-event/add-event.component';
import { ViewEventComponent } from './users/view-event/view-event.component';
import { EventPageComponent } from './users/event-page/event-page.component'; 

import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ChangePassword,
    HeaderComponent,
    FooterComponent,
    ErrorComponent,
    MainGuestComponent,
    SearchBooksComponent,
    ViewBookComponent,
    AddBookComponent,
    MainAdminComponent,
    MainRegularComponent,
    ModeratorComponent,
    ChangeAttributeComponent,
    ChangeCommentComponent,
    VisitUserComponent,
    ChangeBookComponent,
    GenreComponent,
    ApproveBookComponent,
    AddEventComponent,
    ViewEventComponent,
    EventPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatListModule,
    MatSelectModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatRadioModule,
    MatProgressBarModule,
    MatTableModule,
    MatStepperModule,
    HttpClientModule,
  ],
  providers: [MatDatepickerModule, DatePipe,
  {
    provide: RECAPTCHA_SETTINGS,
    useValue: { siteKey: "6LdmhMYZAAAAAL-WdvUf23zR0D468Njzr8C-v1nV"} as RecaptchaSettings
  }],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
