import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class RegularService {
    private RegularListener = new Subject<boolean>();

    getRegularListener() {
        return this.RegularListener.asObservable();
    }

    regularEnteredSite() {
        this.RegularListener.next(true);
    }

    regularLeftSite() {
        this.RegularListener.next(false);
    }
}