import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { GuestService } from "../users/guest/guest.service";
import { AdminService } from "../users/admin/admin.service";
import { User } from "../auth/user.model";
import { Router } from "@angular/router";
import { RegularService } from "../users/regular/regular.service";
import { ModeratorService } from "../users/moderator/moderator.service";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
    isLoggedInUser = false;
    isGuest = false;
    isAdmin = false;
    isRegular = false;
    isModerator = false;
    private loggedInSub: Subscription;
    private isGuestSub: Subscription;
    private isAdminSub: Subscription;
    private isRegularSub: Subscription;
    private isModeratorSub: Subscription;

    constructor(public authService: AuthService,
    public guestService: GuestService,
    public adminService: AdminService,
    public regularService: RegularService,
    public moderatorService: ModeratorService,
    private router: Router) {}

    ngOnInit() {
        this.isLoggedInUser = JSON.parse(localStorage.getItem("isLoggedInUser"));
        //this.loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        this.loggedInSub = this.authService.getLoggedInListener()
            .subscribe(loggedInStatus => {
                this.isLoggedInUser = loggedInStatus;
            });
        this.isGuestSub = this.guestService.getGuestListener()
            .subscribe(guestInStatus => {
                this.isGuest = guestInStatus;
            })
        this.isAdminSub = this.adminService.getAdminListener()
            .subscribe(adminInStatus => {
                this.isAdmin = adminInStatus;
            })
        this.isRegularSub = this.regularService.getRegularListener()
            .subscribe(regularInStatus => {
                this.isRegular = regularInStatus;
            })
        this.isModeratorSub = this.moderatorService.getModeratorListener()
            .subscribe(moderatorInStatus => {
                this.isModerator = moderatorInStatus;
            })
    }

    onMainPage() {
       if(this.isAdmin) {
           this.router.navigate(['/admin']);
       }
       else if(this.isRegular) {
           this.router.navigate(['/regular']);
       }
       else if(this.isModerator) {
           this.router.navigate(['/moderator']);
       }
    }

    ngOnDestroy() {
        this.loggedInSub.unsubscribe();
        this.isGuestSub.unsubscribe();
        this.isAdminSub.unsubscribe();
        this.isRegularSub.unsubscribe();
        this.isModeratorSub.unsubscribe();
    }
}