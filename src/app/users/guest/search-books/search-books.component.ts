import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Book } from "../../../book.model";
import { Subscription } from "rxjs";
import { BookService } from "../../../book.service";
import { GuestService } from "../guest.service";
import { Router } from "@angular/router";
import { AdminService } from "../../admin/admin.service";
import { RegularService } from "../../regular/regular.service";
import { User } from "../../../auth/user.model";
import { ModeratorService } from "../../moderator/moderator.service";
import { BookRequest } from "../../../book_request.model";

@Component({
    templateUrl: './search-books.component.html',
    styleUrls: ['./search-books.component.css']
})
export class SearchBooksComponent implements OnInit, OnDestroy{
    genres : string[] = ["Akcija", "Fantazija", "Tragedija", "Komedija", "Kriminalistika", "Horor", "Triler"];
    books: Book[] = [];
    message: string = "";
    searchedForBook: boolean = false;
    isLoggedInUser: boolean;
    loggedInUser: User;
    bookRequests: BookRequest[] = [];
    private searchedForBookSub: Subscription;
    private booksSub : Subscription;
    private messageSub: Subscription;
    private bookRequestsSub: Subscription;

    constructor(private bookService: BookService,
    private guestService: GuestService,
    private regularService: RegularService,
    private adminService: AdminService,
    private moderatorService: ModeratorService,
    private router: Router) {}

    ngOnInit() {
        this.isLoggedInUser = JSON.parse(localStorage.getItem("isLoggedInUser"));
        this.loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        this.booksSub = this.bookService.getBookListener()
            .subscribe(searchedBooks => {
                this.books = searchedBooks;
            })
        this.messageSub = this.bookService.getMessageListener()
            .subscribe(message => {
                this.message = message;
            })
        this.searchedForBookSub = this.bookService.getSearchedForBookListener()
            .subscribe(() => {
                this.searchedForBook = true;
            })
        this.bookRequestsSub = this.bookService.getBookRequestsListener()
            .subscribe(requests => {
                this.bookRequests = requests;
            })
        if(!JSON.parse(localStorage.getItem("isLoggedInUser"))){
            this.guestService.guestEnteredSite();
        }
        else if(JSON.parse(localStorage.getItem("loggedInUser")).type == "regular") {
            this.regularService.regularEnteredSite();
        }
        else if(JSON.parse(localStorage.getItem("loggedInUser")).type == "admin") {
            this.adminService.adminEnteredSite();
        }
        else if(JSON.parse(localStorage.getItem("loggedInUser")).type == "moderator") {
            this.moderatorService.moderatorEnteredSite();
        }

    }

    onSearch(form: NgForm) {
        this.bookService.getSearchedBooks(form.value.author,
        form.value.name, form.value.genre);
        this.bookService.getSeachedBookRequests(form.value.author,
            form.value.name, form.value.genre);
    }

    onPickedBook(id: string) {
        localStorage.setItem("pickedBook", id);
        this.router.navigate(['view-book']);
    }

    onChangeBook(id: string) {
        localStorage.setItem("changeBook", id);
        this.router.navigate(['change-book']);
    }

    ngOnDestroy() {
        this.booksSub.unsubscribe();
        this.messageSub.unsubscribe();
        this.searchedForBookSub.unsubscribe();
        this.bookRequestsSub.unsubscribe();
    }
}