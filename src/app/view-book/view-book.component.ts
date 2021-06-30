import { Component, OnInit, OnDestroy, ɵSWITCH_COMPILE_INJECTABLE__POST_R3__ } from "@angular/core";
import { Book } from "../book.model";
import { Subscription } from "rxjs";
import { BookService } from "../book.service";
import { GuestService } from "../users/guest/guest.service";
import { RegularService } from "../users/regular/regular.service";
import { AdminService } from "../users/admin/admin.service";
import { NgForm } from "@angular/forms";
import { User } from "../auth/user.model";
import { BookUser } from "../book_user.model";
import { MatRadioChange } from "@angular/material/radio";
import { CommentService } from "../comment.service";
import { Comment } from "../comment.model";
import { Router } from "@angular/router";
import { ModeratorService } from "../users/moderator/moderator.service";

@Component({
    templateUrl: './view-book.component.html',
    styleUrls: ['./view-book.component.css']
})
export class ViewBookComponent implements OnInit, OnDestroy{
    bookId: string;
    pickedBook: Book;
    private pickedBookSub: Subscription;
    isLoggedInUser : boolean;
    loggedInUser : User;
    bookUser: BookUser;
    bookUserSub: Subscription;
    currentStatus: string ;
    isBookUser: boolean;
    isOnWishlist: boolean;
    percentageOfReadBook : number;
    defaultReadPages : number = 0;
    defaultNumberOfPages : number = 100;
    comments: Comment[] = [];
    commentSub: Subscription;
    isComments: boolean;

    constructor(private bookService: BookService,
    private guestService: GuestService,
    private regularService: RegularService,
    private adminService: AdminService,
    private commentService: CommentService,
    private moderatorService: ModeratorService,
    private router: Router) {}

    ngOnInit() {

        this.bookId = localStorage.getItem("pickedBook");
        this.pickedBookSub = this.bookService.getPickedBookListener()
            .subscribe(pickedBook => {
                this.pickedBook = pickedBook;
            })
        this.bookService.getBook(this.bookId);
        this.isLoggedInUser = JSON.parse(localStorage.getItem("isLoggedInUser"));
        this.loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if(!this.isLoggedInUser){
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

        this.isComments = false;
        this.commentSub = this.commentService.getCommentBookListener()
            .subscribe(comments => {
                this.comments = comments;
                this.isComments = true;
            })
        this.commentService.getCommentsForBook(this.bookId);

        this.isBookUser = false;
        if(this.isLoggedInUser) {
        this.bookUserSub = this.bookService.getBookUserListener()
            .subscribe(bookUser => {
                this.bookUser = bookUser;
                if(this.bookUser && this.bookUser.status == "Wishlist") {
                    this.isOnWishlist = true;
                }
                else {
                    this.isOnWishlist = false;
                }
                
                if(!this.bookUser) {
                    this.percentageOfReadBook = 0;
                }
                else if(this.bookUser.readPages == 0) {
                    this.percentageOfReadBook = 0;
                    this.currentStatus = this.bookUser.status;
                    //console.log(this.percentageOfReadBook);
                }
                else {
                    this.percentageOfReadBook = Math.trunc(100 * this.bookUser.readPages / this.bookUser.numberOfPages);
                    this.currentStatus = this.bookUser.status;
                    //console.log(this.percentageOfReadBook);
                }
                this.isBookUser = true;
            })
        this.bookService.getBookUser(this.loggedInUser.username, this.bookId);
        }
    }

    onSaveChanges(form: NgForm) {
        if(form.value.typeOfAction == "") {
            return;
        }


        if(!this.bookUser) {
            if(form.value.typeOfAction != "Reading") {
                this.bookService.addBookUser(this.loggedInUser.username,
                    this.pickedBook._id, form.value.typeOfAction, 0, 0); 
            }
            else if(!form.value.readPages || !form.value.numberOfPages) {
                this.bookService.addBookUser(this.loggedInUser.username,
                    this.pickedBook._id, form.value.typeOfAction, this.defaultReadPages, this.defaultNumberOfPages);
            }
            else{
                this.bookService.addBookUser(this.loggedInUser.username,
                    this.pickedBook._id, form.value.typeOfAction, form.value.readPages, form.value.numberOfPages);
            }
        }
        
        else if(this.bookUser && this.currentStatus != "NotWishlist") {
            if(form.value.typeOfAction != "Reading") {
                this.bookService.updateBookUser(this.loggedInUser.username,
                    this.pickedBook._id, form.value.typeOfAction, 0, 0); 
            }
            else if(!form.value.readPages || !form.value.numberOfPages) {
                this.bookService.updateBookUser(this.loggedInUser.username,
                    this.pickedBook._id, form.value.typeOfAction, this.defaultReadPages, this.defaultNumberOfPages); 
            }
            else {
                this.bookService.updateBookUser(this.loggedInUser.username,
                    this.pickedBook._id, form.value.typeOfAction, form.value.readPages, form.value.numberOfPages);
            }
        }
        
        else {
            this.bookService.deleteBookUser(this.loggedInUser.username,
                this.pickedBook._id);
        }

    }

    onChange(event: MatRadioChange) {
        //console.log(event.value);
        this.currentStatus = event.value;
       // console.log(this.currentStatus);
    }

    onComment(form: NgForm) {
        if(form.invalid) {
            return;
        }
        if(!this.bookUser) {
            alert("Prvo morate da sacuvate izmene");
            return;
        }
        if(form.value.review > 10 || form.value.review < 0) {
            alert("Ocena mora da bude izmedju 0 i 10");
            return;
        }
        console.log(form.value);

        this.commentService.addComment(this.loggedInUser.username, this.bookId,
        form.value.review, form.value.content);

        let averageReview: number;

        if(this.comments.length == 0) {
            averageReview = form.value.review;
        }
        else{
            let sumOfReview = 0;
            let numOfReview = 0;
            for (let i = 0; i < this.comments.length; i++) {
                const comment = this.comments[i];

                sumOfReview += comment.review;
                numOfReview++;
                
            }
            sumOfReview += form.value.review
            numOfReview++;
            averageReview = sumOfReview / numOfReview
        }

        this.bookService.updateReview(this.bookId, averageReview);
    }

    onPickedUser(user: string) {
        localStorage.setItem("pickedUser", user);
        this.router.navigate(["visit-user"]);
    }

    ngOnDestroy() {
        this.pickedBookSub.unsubscribe();
        if(this.isLoggedInUser) {
            this.bookUserSub.unsubscribe(); 
        }
        this.commentSub.unsubscribe();
        localStorage.removeItem("pickedBook");
    }

}