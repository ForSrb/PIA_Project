import { Component, OnInit, OnDestroy } from "@angular/core";
import { User } from "../user.model";
import { AuthService } from "../auth.service";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { RegularService } from "../../users/regular/regular.service";
import { AdminService } from "../../users/admin/admin.service";
import { ModeratorService } from "../../users/moderator/moderator.service";

@Component({
    templateUrl: './change_password.component.html',
    styleUrls: ['./change_password.component.css']
})
export class ChangePassword implements OnInit, OnDestroy {
    private loggedInUser: User;
    private messageSub: Subscription;
    message: string;

    constructor(private authService: AuthService,
    private regularService: RegularService,
    private adminService: AdminService,
    private moderatorService: ModeratorService) {}

    ngOnInit() {
        this.loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        this.messageSub = this.authService.getMessageListener()
            .subscribe(messageStatus => {
                this.message = messageStatus;
            });
        if(this.loggedInUser.type == "regular") {
            this.regularService.regularEnteredSite();
        }
        else if(this.loggedInUser.type == "admin") {
            this.adminService.adminEnteredSite();
        }
        else if(this.loggedInUser.type == "moderator") {
            this.moderatorService.moderatorEnteredSite();
        }
    }

    onChangePassword(form: NgForm) {
        if(form.invalid) {
            return;
        }
        this.authService.changePassword(this.loggedInUser.username, 
        form.value.oldPassword, form.value.newPassword, 
        form.value.newPasswordAgain);
    }

    ngOnDestroy() {
        this.messageSub.unsubscribe();
    }
}
