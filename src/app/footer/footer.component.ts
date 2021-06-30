import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { User } from "../auth/user.model";

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {
    private loggedInUser: User = null;
    private loggedInUserSub: Subscription
    isLoggedInUser = false;
    private loggedInSub: Subscription;

    constructor(public authService: AuthService) {}

    ngOnInit() {
        this.isLoggedInUser = JSON.parse(localStorage.getItem("isLoggedInUser"));
        this.loggedInSub = this.authService.getLoggedInListener()
            .subscribe(loggedInStatus => {
                this.isLoggedInUser = loggedInStatus;
            });
    }

    onLogout() {
        this.authService.logout();
    }

    ngOnDestroy() {
        this.loggedInSub.unsubscribe();
    }
}