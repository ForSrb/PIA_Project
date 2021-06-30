import { Component, OnInit, OnDestroy } from "@angular/core";
import { RegularService } from "../regular/regular.service";
import { AdminService } from "../admin/admin.service";
import { User } from "../../auth/user.model";
import { Subscription } from "rxjs";
import { UserService } from "../user.service";
import { Book } from "../../book.model";
import { BookUser } from "../../book_user.model";
import { BookService } from "../../book.service";
import { Comment } from "../../comment.model";
import { BookComment } from "../../book_comment.model";
import { CommentService } from "../../comment.service";
import { ModeratorService } from "../moderator/moderator.service";
import { Follow } from "../follow.model";

@Component({
    templateUrl: './visit-user.component.html',
    styleUrls: ['./visit-user.component.css']
})
export class VisitUserComponent implements OnInit, OnDestroy{
    pickedUsername: string;
    pickedUser: User;
    pickedUserSub: Subscription;
    isPickedUser: boolean;
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
    follow: Follow;
    followSub: Subscription;
    followDone: boolean;

    constructor(private regularService: RegularService,
    private adminService: AdminService,
    private userService: UserService,
    private bookService: BookService,
    private moderatorService: ModeratorService,
    private commentService: CommentService) {}

    ngOnInit() {
        this.isPickedUser = false;
        this.isBooksDone = false;
        this.isBookUsersDone = false;
        this.isComments = false;
        this.followDone = false;
        this.pickedUsername = localStorage.getItem("pickedUser");
        this.pickedUserSub = this.userService.getUserListener()
            .subscribe(user => {
                this.pickedUser = user;
                this.isPickedUser = true;
                this.userService.getFollow(JSON.parse(localStorage.getItem("loggedInUser")), this.pickedUser);
                //console.log(this.pickedUser);
            })

        this.bookSub = this.bookService.getBookListener()
            .subscribe(books => {
                this.books = books;
                this.isBooksDone = true;
                this.bookService.getBookUsers(this.pickedUsername);
                this.commentService.getCommentsForUser(this.pickedUsername);
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
                //this.commentService.getCommentsForUser(this.regularUser.username);
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
        this.followSub = this.userService.getFollowListener()
            .subscribe(follow => {
                this.follow = follow;
                this.followDone = true;
            })
        
        if(JSON.parse(localStorage.getItem("loggedInUser")).type == "regular") {
            this.regularService.regularEnteredSite();
        }
        else if(JSON.parse(localStorage.getItem("loggedInUser")).type == "admin") {
            this.adminService.adminEnteredSite();
        }
        else if(JSON.parse(localStorage.getItem("loggedInUser")).type == "moderator") {
            this.moderatorService.moderatorEnteredSite();
        }
        this.userService.getPickedUser(this.pickedUsername);
        this.bookService.getSearchedBooks("", "", "");
    }

    onFollow() {
        this.userService.followUser(JSON.parse(localStorage.getItem("loggedInUser")), this.pickedUser);
    }

    onUnfollow() {
        this.userService.unFollowUser(JSON.parse(localStorage.getItem("loggedInUser")), this.pickedUser);
    }

    ngOnDestroy() {
        localStorage.removeItem("pickedUser");
        this.pickedUserSub.unsubscribe();
        this.bookSub.unsubscribe();
        this.bookUserSub.unsubscribe();
        this.commentSub.unsubscribe();
        this.followSub.unsubscribe();
    }
}