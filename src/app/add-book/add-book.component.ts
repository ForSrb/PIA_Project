import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AdminService } from "../users/admin/admin.service";
import { BookService } from "../book.service";
import { RegularService } from "../users/regular/regular.service";
import { Genre } from "../users/admin/genre.model";
import { Subscription } from "rxjs";
import { ModeratorService } from "../users/moderator/moderator.service";

@Component({
    templateUrl: './add-book.component.html',
    styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit, OnDestroy{
    genres: Genre[];
    genreSub: Subscription;
    stringGenres: string[] = [];
    form: FormGroup;
    imagePreview: string;

    constructor(private adminService: AdminService,
    private regularService: RegularService,
    private moderatorService: ModeratorService,
    private bookService: BookService) {}
    
    ngOnInit() {
        this.form = new FormGroup(
            {
                image: new FormControl(null),
                name: new FormControl(null, { validators: [Validators.required] }),
                authors: new FormControl(null, { validators: [Validators.required] }),
                publishDate: new FormControl(null, { validators: [Validators.required] }),
                genres: new FormControl(null, { validators: [Validators.required, Validators.maxLength(3)] }),
                description: new FormControl(null, { validators: [Validators.required] }),
            }
        );
        this.genreSub = this.adminService.getGenreListener()
            .subscribe(genres => {
                this.genres = genres;
                this.genres.forEach(genre => {
                    this.stringGenres.push(genre.genre);
                })
            })
        this.adminService.getGenres();        
        if(JSON.parse(localStorage.getItem("loggedInUser")).type == "admin") {
            this.adminService.adminEnteredSite();
        }
        else if(JSON.parse(localStorage.getItem("loggedInUser")).type == "regular") {
            this.regularService.regularEnteredSite();
        }
        else if(JSON.parse(localStorage.getItem("loggedInUser")).type == "moderator") {
            this.moderatorService.moderatorEnteredSite();
        }
    }

    onAddBook() {
        if(this.form.invalid) {
            return;
        }
        //let authors : string[] = [];
        //authors = this.form.value.authors.split(",");
        let genres : string = "";
        this.form.value.genres.forEach(genre => {
            genres += genre + " ";
        });
        this.bookService.addBook(this.form.value.image, this.form.value.name, this.form.value.authors,
        this.form.value.publishDate, genres, this.form.value.description);
        console.log(this.form.value);
        
        this.form.reset();
    }

    onImagePicked(event: Event) {
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({ image: file });
        this.form.get('image').updateValueAndValidity();
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result as string;
        };
        reader.readAsDataURL(file);
    }

    ngOnDestroy() {

    }

}