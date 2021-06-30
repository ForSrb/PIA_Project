import { Component, OnInit, OnDestroy } from "@angular/core";
import { AdminService } from "../users/admin/admin.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Book } from "../book.model";
import { Subscription } from "rxjs";
import { BookService } from "../book.service";
import { Genre } from "../users/admin/genre.model";

@Component({
    templateUrl: './change-book.component.html',
    styleUrls: ['./change-book.component.css']
})
export class ChangeBookComponent implements OnInit, OnDestroy{
    genres: Genre[] = [];
    genresSub: Subscription;
    stringGenres: string[] = [];
    form: FormGroup;
    changeBook: Book;
    changeBookSub: Subscription;

    constructor(private adminService: AdminService,
    private bookService: BookService) {}

    ngOnInit() {
        this.adminService.adminEnteredSite();
        this.changeBookSub = this.bookService.getPickedBookListener()
            .subscribe(book => {
                this.changeBook = book;
                console.log(this.changeBook);
                this.form = new FormGroup(
                    {
                        //image: new FormControl(null),
                        name: new FormControl(this.changeBook.name, { validators: [Validators.required] }),
                        authors: new FormControl(this.changeBook.authors, { validators: [Validators.required] }),
                        publishDate: new FormControl(this.changeBook.publishDate, { validators: [Validators.required] }),
                        genres: new FormControl(null, { validators: [Validators.required, Validators.maxLength(3)] }),
                        description: new FormControl(this.changeBook.description, { validators: [Validators.required] }),
                    }
                );
            })
            this.genresSub = this.adminService.getGenreListener()
            .subscribe(genres => {
                this.genres = genres;
                this.genres.forEach(genre => {
                    this.stringGenres.push(genre.genre);
                })
            })
        this.adminService.getGenres();
        this.bookService.getBook(localStorage.getItem("changeBook"));
    }

    onChangeBook() {
        if(this.form.invalid) {
            return;
        }

        let genres : string = "";
        this.form.value.genres.forEach(genre => {
            genres += genre + " ";
        });

        console.log(this.form.value);
        this.bookService.updateBook(this.changeBook._id, this.form.value.name,
        this.form.value.authors, this.form.value.publishDate, genres,
        this.form.value.description);
    }

    ngOnDestroy() {
        this.changeBookSub.unsubscribe();
        this.genresSub.unsubscribe();
        localStorage.removeItem("changeBook");
    }
}