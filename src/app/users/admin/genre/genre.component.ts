import { Component, OnInit, OnDestroy } from "@angular/core";
import { AdminService } from "../admin.service";
import { NgForm } from "@angular/forms";
import { Genre } from "../genre.model";
import { Subscription } from "rxjs";
import { Book } from "../../../book.model";
import { BookService } from "../../../book.service";

@Component({
    templateUrl: './genre.component.html',
    styleUrls: ['./genre.component.css']
})
export class GenreComponent implements OnInit, OnDestroy{
    genres: Genre[];
    genreSub: Subscription;
    stringGenres: string[] = [];
    books: Book[];
    bookSub: Subscription;
    isGenreInBook: boolean;
    message: string = "";
    messageSub: Subscription;

    constructor(private adminService: AdminService,
    private bookService: BookService) {}

    ngOnInit() {
        this.adminService.adminEnteredSite();
        this.genreSub = this.adminService.getGenreListener()
            .subscribe(genres => {
                this.genres = genres;
                this.genres.forEach(genre => {
                    this.stringGenres.push(genre.genre);
                })
            })
        this.bookSub = this.bookService.getBookListener()
            .subscribe(books => {
                this.books = books;
                console.log(this.books);
            })
        this.messageSub = this.adminService.getMessageListener()
            .subscribe(message => {
                this.message = message;
            })
        this.adminService.getGenres();
        this.bookService.getSearchedBooks("", "", "");
    }

    onAddGenre(form: NgForm) {
        if(form.invalid) {
            return;
        }
        this.adminService.addGenre(form.value.genre);
    }

    onDeleteGenre(form: NgForm) {
        if(form.invalid) {
            return;
        }
        this.isGenreInBook = false;
        for (let i = 0; i < this.books.length; i++) {
            const book = this.books[i];
            
            if(book.genres.includes(form.value.genre)) {
                this.isGenreInBook = true;
                break;
            }
        }
        if(this.isGenreInBook) {
            this.message = "Postoji knjiga sa ovim zanrom, ne smete obrisati zanr";
        }
        else {
            this.adminService.deleteGenre(form.value.genre);
        }
    }

    ngOnDestroy() {
        this.genreSub.unsubscribe();
        this.bookSub.unsubscribe();
    }
}