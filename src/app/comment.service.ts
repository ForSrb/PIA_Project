import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { Comment } from "./comment.model";

@Injectable({providedIn: 'root'})
export class CommentService{
    private commentListener = new Subject<Comment[]>();
    private commentBookListener = new Subject<Comment[]>();
    private commentUserListener = new Subject<Comment[]>();
    private pickedCommentListener = new Subject<Comment>();

    getCommentListener() {
        return this.commentListener.asObservable();
    }

    getCommentBookListener() {
        return this.commentBookListener.asObservable();
    }

    getCommentUserListener() {
        return this.commentUserListener.asObservable();
    }

    getPickedCommentListener() {
        return this.pickedCommentListener.asObservable();
    }

    constructor(private http: HttpClient) {}

    addComment(user: string, bookId: string, review: number, content: string) {
        this.http.post("http://localhost:3000/api/comment/add",
        {user: user, bookId: bookId, review: review, content: content})
            .subscribe(response => {
                //console.log(response);
                //location.reload();
            }, error => {
                //console.log(error);
            })
    }

    getComments() {
        this.http.get<{comments: Comment[]}>("http://localhost:3000/api/comment/get")
        .subscribe(response => {
            console.log(response.comments);
            this.commentListener.next(response.comments);
        }, error => {
            console.log(error);
        })
    }

    getCommentsForBook(bookId: string) {
        this.http.get<{comments: Comment[]}>("http://localhost:3000/api/comment/get-book/" + bookId)
            .subscribe(response => {
                console.log(response.comments);
                this.commentBookListener.next(response.comments);
            }, error => {
                console.log(error);
            })
    }

    getCommentsForUser(user: string) {
        this.http.get<{comments: Comment[]}>("http://localhost:3000/api/comment/get-user/" + user)
            .subscribe(response => {
                //console.log(response.comments);
                this.commentUserListener.next(response.comments);
            }, error => {
                console.log(error);
            })
    }

    getComment(id: string) {
        this.http.get<{comment: Comment}>("http://localhost:3000/api/comment/get-comment/" + id)
            .subscribe(response => {
                console.log(response.comment);
                this.pickedCommentListener.next(response.comment);
            }, error => {
                console.log(error);
            })
    }

    changeComment(id: string, review: number, content: string) {
        this.http.put("http://localhost:3000/api/comment/change-comment/" + id,
        {review: review, content: content})
            .subscribe(response => {
                //console.log(response);
            }, error => {
                console.log(error);
            })
    }
}