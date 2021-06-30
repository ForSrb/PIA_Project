import { Component, OnInit, OnDestroy } from "@angular/core";
import { User } from "../../auth/user.model";
import { ModeratorService } from "../moderator/moderator.service";
import { AdminService } from "../admin/admin.service";
import { BookRequest } from "../../book_request.model";
import { Subscription } from "rxjs";
import { BookService } from "../../book.service";

@Component({
    templateUrl: './approve-book.component.html',
    styleUrls: ['./approve-book.component.css']
})
export class ApproveBookComponent implements OnInit, OnDestroy{
    loggedInUser: User;
    bookRequests: BookRequest[];
    bookRequestsSub: Subscription;

    constructor(private moderatorService: ModeratorService,
    private adminService: AdminService,
    private bookService: BookService) {}

    ngOnInit() {
        this.loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if(this.loggedInUser.type == "moderator") {
            this.moderatorService.moderatorEnteredSite();
        }
        else {
            this.adminService.adminEnteredSite();
        }
        this.bookRequestsSub = this.bookService.getBookRequestsListener()
            .subscribe(requests => {
                this.bookRequests = requests;
            })
        this.bookService.getBookRequests();
    }

    onAccept(request: BookRequest) {
        //console.log(request);
        this.bookService.acceptBookRequest(request);
    }

    onDecline(request: BookRequest) {
        //console.log(request);
        this.bookService.declineBookRequest(request._id);
    }

    ngOnDestroy() {
        this.bookRequestsSub.unsubscribe();
    }
}