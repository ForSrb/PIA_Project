import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { ErrorComponent } from "../../error/error.component";
import { MatDialog } from "@angular/material/dialog";
import { User } from "../user.model";
import { GuestService } from "../../users/guest/guest.service";
import { RegularService } from "../../users/regular/regular.service";
import { AdminService } from "../../users/admin/admin.service";
import { ModeratorService } from "../../users/moderator/moderator.service";

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
    private messageSub: Subscription;
    isLoggedInUser = false;
    private loggedInSub: Subscription;
    message: string;

    constructor(private authService: AuthService,
        private router: Router, private dialog: MatDialog,
        private guestService: GuestService,
        private regularService: RegularService,
        private adminService: AdminService,
        private moderatorService: ModeratorService) { }

    ngOnInit() {
        this.isLoggedInUser = this.authService.getIsUserLoggedIn();
        let user: User = this.authService.getLoggedInUser();
        if (this.isLoggedInUser) {
            if (user.type == "regular") {
                this.router.navigate(['/regular']);
                this.dialog.open(ErrorComponent, { data: { message: "Morate se prvo odjaviti" } });
            }
            else if (user.type == "admin") {
                this.router.navigate(['/admin']);
                this.dialog.open(ErrorComponent, { data: { message: "Morate se prvo odjaviti" } });
            }
            else {
                this.router.navigate(['/moderator']);
                this.dialog.open(ErrorComponent, { data: { message: "Morate se prvo odjaviti" } });
            }
        }
        this.messageSub = this.authService.getMessageListener()
            .subscribe(messageStatus => {
                this.message = messageStatus;
            })
        this.guestService.guestLeftSite();
        this.adminService.adminLeftSite();
        this.regularService.regularLeftSite();
        this.moderatorService.moderatorLeftSite();
    }

    onLogin(form: NgForm) {
        if (form.invalid) {
            return;
        }
        this.authService.login(form.value.username,
            form.value.password);
    }

    ngOnDestroy() {
        this.messageSub.unsubscribe();
    }
}