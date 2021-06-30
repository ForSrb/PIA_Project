import { Component, OnInit, OnDestroy } from "@angular/core";
import { User } from "../../../auth/user.model";
import { AuthService } from "../../../auth/auth.service";
import { UserRequest } from "../../../auth/user_requests.model";
import { Subscription } from "rxjs";
import { AdminService } from "../admin.service";
import { UserService } from "../../user.service";
import { Book } from "../../../book.model";
import { BookUser } from "../../../book_user.model";
import { BookComment } from "../../../book_comment.model";
import { BookService } from "../../../book.service";
import { CommentService } from "../../../comment.service";
import { Comment } from "../../../comment.model";
import { Router } from "@angular/router";

@Component({
    templateUrl: './main-admin.component.html',
    styleUrls: ['./main-admin.component.css']
})
export class MainAdminComponent implements OnInit, OnDestroy{
    loggedInUser: User;
    userRequests: UserRequest[] = [];
    private userRequestSub: Subscription;
    users: User[] = [];
    regularUsers: User[] = [];
    moderatorUsers: User[] = [];
    private userSub: Subscription;

    isSpinner: boolean;
    loggedInUserSub: Subscription;
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

    constructor(private authService: AuthService,
    private adminService: AdminService,
    private userService: UserService,
    private bookService: BookService,
    private commentService: CommentService,
    private router: Router) {}

    ngOnInit() {
        this.loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        this.loggedInUserSub = this.userService.getUserListener()
        .subscribe(loggedInUser => {
            this.loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
            this.isSpinner = false;
        })

        this.userRequestSub = this.adminService.getUserRequestsUpdated()
            .subscribe((requests: UserRequest[]) => {
                this.userRequests = requests;
            })
        this.userSub = this.userService.getUsersListener()
            .subscribe(users => {
                this.users = users;
                //console.log(this.users);
                for (let i = 0; i < this.users.length; i++) {
                    const user = this.users[i];
                    
                    if(user.type == "regular") {
                        this.regularUsers.push(user);
                    }
                    else if(user.type == "moderator") {
                        this.moderatorUsers.push(user);
                    }
                }
                //console.log(this.regularUsers);
                //console.log(this.moderatorUsers);
            })
            this.bookSub = this.bookService.getBookListener()
            .subscribe(books => {
                this.books = books;
                this.isBooksDone = true;
                this.bookService.getBookUsers(this.loggedInUser.username);
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
                this.commentService.getCommentsForUser(this.loggedInUser.username);
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
        
        this.userService.getUser(this.loggedInUser.username);
        this.bookService.getSearchedBooks("", "", "");
        this.adminService.getUserRequests();
        this.userService.getUsers();
        this.adminService.adminEnteredSite();
    }

    onAccept(request: UserRequest) {
        this.adminService.acceptRequest(request);
    }

    onDecline(request: UserRequest) {
        this.adminService.declineRequest(request);
    }

    onUpgrade(user: User) {
        this.adminService.upgradeUser(user.username);
    }

    onDemote(user: User) {
        this.adminService.demoteUser(user.username);
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
        this.bookService.deleteBookUser(this.loggedInUser.username,
        bookId);
    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
        this.userRequestSub.unsubscribe();
        this.loggedInUserSub.unsubscribe();
        this.bookSub.unsubscribe();
        this.bookUserSub.unsubscribe();
        this.commentSub.unsubscribe();
    }
}