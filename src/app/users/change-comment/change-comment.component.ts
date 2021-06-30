import { Component, OnInit, OnDestroy } from "@angular/core";
import { Comment } from "../../comment.model";
import { Subscription } from "rxjs";
import { CommentService } from "../../comment.service";
import { RegularService } from "../regular/regular.service";
import { AdminService } from "../admin/admin.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { BookService } from "../../book.service";
import { ModeratorService } from "../moderator/moderator.service";

@Component({
    templateUrl: './change-comment.component.html',
    styleUrls: ['./change-comment.component.css']
})
export class ChangeCommentComponent implements OnInit, OnDestroy {
    commentId: string;
    pickedComment: Comment;
    pickedCommentSub: Subscription;
    isPickedComment: boolean;
    form: FormGroup;
    comments: Comment[] = [];
    commentSub: Subscription;

    constructor(private commentService: CommentService,
    private regularService: RegularService,
    private adminService: AdminService,
    private moderatorService: ModeratorService,
    private bookService: BookService) {}

    ngOnInit() {
        this.commentId = localStorage.getItem("pickedComment");
        this.isPickedComment = false;
        this.pickedCommentSub = this.commentService.getPickedCommentListener()
            .subscribe(comment => {
                this.pickedComment = comment;

                this.form = new FormGroup({
                    review: new FormControl(this.pickedComment.review, {validators: [Validators.required, Validators.min(1), Validators.max(10)]}),
                    content: new FormControl(this.pickedComment.content, {validators: [Validators.maxLength(1000)]})
                })

                this.isPickedComment = true;
                this.commentService.getCommentsForBook(this.pickedComment.bookId);
            })
        this.commentSub = this.commentService.getCommentBookListener()
            .subscribe(comments => {
                this.comments = comments;
            })
        this.commentService.getComment(this.commentId);
        

        if(JSON.parse(localStorage.getItem("loggedInUser")).type == "regular") {
            this.regularService.regularEnteredSite();
        }
        else if(JSON.parse(localStorage.getItem("loggedInUser")).type == "admin") {
            this.adminService.adminEnteredSite();
        }
        else if(JSON.parse(localStorage.getItem("loggedInUser")).type == "moderator") {
            this.moderatorService.moderatorEnteredSite();
        }
    }

    onChange() {
        if(this.form.invalid) {
            return;
        }
        //console.log(this.form.value);

        this.commentService.changeComment(this.commentId, this.form.value.review,
        this.form.value.content);

        let averageReview: number;

        
        let sumOfReview = 0;
        let numOfReview = 0;
        for (let i = 0; i < this.comments.length; i++) {
            const comment = this.comments[i];

            if(this.pickedComment._id != comment._id){
                sumOfReview += comment.review; 
            }
            else{
                sumOfReview += this.form.value.review;
            }
            numOfReview++;
                
        }
        averageReview = sumOfReview / numOfReview
        

        this.bookService.updateReview(this.pickedComment.bookId, averageReview);

    }

    ngOnDestroy() {
        this.pickedCommentSub.unsubscribe();
        this.commentSub.unsubscribe();
        localStorage.removeItem("pickedComment");
    }
}