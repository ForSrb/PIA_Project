import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({providedIn: 'root'})
export class GuestService {
    private GuestListener = new Subject<boolean>();

    public getGuestListener() {
        return this.GuestListener.asObservable();
    }

    guestEnteredSite() {
        this.GuestListener.next(true);
    }

    guestLeftSite() {
        this.GuestListener.next(false);
    }
}