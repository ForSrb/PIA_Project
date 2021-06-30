import { Component, OnInit, OnDestroy } from "@angular/core";
import { User } from "../../auth/user.model";
import { RegularService } from "../regular/regular.service";
import { ModeratorService } from "../moderator/moderator.service";
import { AdminService } from "../admin/admin.service";
import { GuestService } from "../guest/guest.service";
import { Event } from "../event.model";
import { Subscription } from "rxjs";
import { UserService } from "../user.service";
import { Router } from "@angular/router";

@Component({
    templateUrl: './view-event.component.html',
    styleUrls: ['./view-event.component.css']
})
export class ViewEventComponent implements OnInit, OnDestroy{
    isLoggedInUser: boolean;
    loggedInUser: User;
    events: Event[] = [];
    eventsSub: Subscription;

    constructor(private regularService: RegularService,
    private moderatorService: ModeratorService,
    private adminService: AdminService,
    private guestService: GuestService,
    private userService: UserService,
    private router: Router) {}

    ngOnInit() {
        this.isLoggedInUser = JSON.parse(localStorage.getItem("isLoggedInUser"));
        this.loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if(!this.isLoggedInUser) {
            this.guestService.guestEnteredSite();
        }
        else if(this.loggedInUser.type == "admin") {
            this.adminService.adminEnteredSite();
        }
        else if(this.loggedInUser.type == "moderator") {
            this.moderatorService.moderatorEnteredSite();
        }
        else {
            this.regularService.regularEnteredSite();
        }
        this.eventsSub = this.userService.getEventsListener()
            .subscribe(events => {
                this.events = events;
                console.log(this.events);
            })
        this.userService.getEvents(this.isLoggedInUser);
    }

    onPickedEvent(event: Event) {
        localStorage.setItem("pickedEvent", JSON.stringify(event));
        this.router.navigate(['/event-page']);
    }

    ngOnDestroy() {
        this.eventsSub.unsubscribe();
    }
}