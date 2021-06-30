import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({ providedIn: 'root' })
export class ModeratorService {
    private moderatorListener = new Subject<boolean>();

    getModeratorListener() {
        return this.moderatorListener.asObservable();
    }

    moderatorEnteredSite() {
        this.moderatorListener.next(true);
    }

    moderatorLeftSite() {
        this.moderatorListener.next(false);
    }
}
