import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { GuestService } from "../guest.service";

@Component({
    templateUrl: './main-guest.component.html',
    styleUrls: ['./main-guest.component.css']
})
export class MainGuestComponent implements OnInit, OnDestroy{

    constructor(private guestService: GuestService) {}

    ngOnInit() {
        this.guestService.guestEnteredSite();
    }

    ngOnDestroy() {}

}