import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { MainAdminComponent } from './users/admin/main-admin/main-admin.component';
import { MainGuestComponent } from './users/guest/main-guest/main-guest.component';
import { MainRegularComponent } from './users/regular/main-regular/main-regular.component';
import { ChangePassword } from './auth/change_password/change_password.component';
import { SearchBooksComponent } from './users/guest/search-books/search-books.component';
import { AddBookComponent } from './add-book/add-book.component';
import { ViewBookComponent } from './view-book/view-book.component';
import { ChangeAttributeComponent } from './users/change-attribute/change-attribute.component';
import { ChangeCommentComponent } from './users/change-comment/change-comment.component';
import { VisitUserComponent } from './users/visit-user/visit-user.component';
import { ModeratorComponent } from './users/moderator/moderator.component';
import { ChangeBookComponent } from './change-book/change-book.component';
import { GenreComponent } from './users/admin/genre/genre.component';
import { ApproveBookComponent } from './users/approve-book/approve-book.component';
import { AddEventComponent } from './users/add-event/add-event.component';
import { ViewEventComponent } from './users/view-event/view-event.component';
import { EventPageComponent } from './users/event-page/event-page.component';

const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: SignupComponent},
  { path: 'admin', component: MainAdminComponent},
  { path: 'guest', component: MainGuestComponent},
  { path: 'search-books', component: SearchBooksComponent},
  { path: 'view-book', component: ViewBookComponent},
  { path: 'add-book', component: AddBookComponent},
  { path: 'regular', component: MainRegularComponent},
  { path: 'change_password', component: ChangePassword},
  { path: 'change_user_attribute', component: ChangeAttributeComponent},
  { path: 'change_comment', component: ChangeCommentComponent},
  { path: 'visit-user', component: VisitUserComponent},
  { path: 'moderator', component: ModeratorComponent},
  { path: 'change-book', component: ChangeBookComponent},
  { path: 'genre', component: GenreComponent },
  { path: 'approve-book', component: ApproveBookComponent},
  { path: 'add-event', component: AddEventComponent},
  { path: 'view-event', component: ViewEventComponent},
  { path: 'event-page', component: EventPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
