import { Component, OnInit, OnDestroy } from "@angular/core";
import { User } from "../../auth/user.model";
import { Subscription } from "rxjs";
import { Book } from "../../book.model";
import { BookUser } from "../../book_user.model";
import { BookComment } from "../../book_comment.model";
import { RegularService } from "../regular/regular.service";
import { UserService } from "../user.service";
import { BookService } from "../../book.service";
import { CommentService } from "../../comment.service";
import { Router } from "@angular/router";
import { Comment } from "../../comment.model";
import { ModeratorService } from "./moderator.service";

@Component({
    templateUrl: './moderator.component.html',
    styleUrls: ['./moderator.component.css']
})
export class ModeratorComponent implements OnInit, OnDestroy{
    moderator: User;
    isSpinner: boolean;
    moderatorSub: Subscription;
    books: Book[];
    bookSub: Subscription;
    isBooksDone: boolean;
    bookUsers: BookUser[];
    bookUserSub: Subscription;
    isBookUsersDone: boolean;
    completedBooks: Book[] = [];
    readingBooks: Book[] = [];
    wishlistBooks: Book[] = [];
    comments: Comment[] = [];
    commentSub: Subscription;
    isComments: boolean;
    bookComments: BookComment[] = [];

    constructor(private moderatorService: ModeratorService,
    private userService: UserService,
    private bookService: BookService,
    private commentService: CommentService,
    private router: Router) {}

    ngOnInit() {
        this.isSpinner = true;
        this.isBooksDone = false;
        this.isBookUsersDone = false;
        this.isComments = false;
        this.moderator = JSON.parse(localStorage.getItem("loggedInUser"));
        this.moderatorSub = this.userService.getUserListener()
            .subscribe(loggedInUser => {
                this.moderator = JSON.parse(localStorage.getItem("loggedInUser"));
                this.isSpinner = false;
            })
        this.bookSub = this.bookService.getBookListener()
            .subscribe(books => {
                this.books = books;
                this.isBooksDone = true;
                this.bookService.getBookUsers(this.moderator.username);
                //this.commentService.getCommentsForUser(this.regularUser.username);
                //console.log(this.books);                
            })
        this.bookUserSub = this.bookService.getBookUsersListener()
            .subscribe(bookUsers => {
                this.bookUsers = bookUsers;
                console.log(this.bookUsers);

                if(!this.books) {
                    location.reload();
                }
                
                for (let i = 0; i < this.books.length; i++) {
                    const book = this.books[i];

                    for (let j = 0; j < this.bookUsers.length; j++) {
                        const bookUser = this.bookUsers[j];

                        if(book._id == bookUser.bookId) {
                            if(bookUser.status == "Completed") {
                                this.completedBooks.push(book);
                            }
                            else if(bookUser.status == "Reading") {
                                this.readingBooks.push(book);
                            }
                            else{
                                this.wishlistBooks.push(book);
                            }
                        }
                        
                    }
                    
                }
                this.isBookUsersDone = true;
                this.commentService.getCommentsForUser(this.moderator.username);
            })
        this.commentSub = this.commentService.getCommentUserListener()
            .subscribe(comments => {
                this.comments = comments;
                console.log(this.comments);

                if(!this.books) {
                    location.reload();
                }

                for (let i = 0; i < this.books.length; i++) {
                    const book = this.books[i];
                    
                    for (let j = 0; j < this.comments.length; j++) {
                        const comment = this.comments[j];
                        
                        if(book._id == comment.bookId) {
                            const bookComment : BookComment = {
                                commentId: comment._id,
                                bookId: book._id,
                                name: book.name,
                                authors: book.authors,
                                review: comment.review,
                                content: comment.content
                            };
                            this.bookComments.push(bookComment);
                        }
                    }
                }
                this.isComments = true;
                //console.log(this.bookComments);
            })
        
        this.userService.getUser(this.moderator.username);
        this.bookService.getSearchedBooks("", "", "");
        //this.bookService.getBookUsers(this.regularUser.username);
        //this.commentService.getCommentsForUser(this.regularUser.username);
        this.moderatorService.moderatorEnteredSite();
        
    }

    onPickedBook(id: string) {
        localStorage.setItem("pickedBook", id);
        this.router.navigate(['view-book']);
    }

    onChangeComment(id: string) {
        localStorage.setItem("pickedComment", id);
        this.router.navigate(['change_comment']);
    }

    removeFromWishlist(bookId: string) {
        this.bookService.deleteBookUser(this.moderator.username,
        bookId);
    }

    ngOnDestroy() {
        this.moderatorSub.unsubscribe();
        this.bookSub.unsubscribe();
        this.bookUserSub.unsubscribe();
        this.commentSub.unsubscribe();
    }

}