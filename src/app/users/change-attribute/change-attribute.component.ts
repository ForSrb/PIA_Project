import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";
import { User } from "../../auth/user.model";
import { UserService } from "../user.service";
import { AdminService } from "../admin/admin.service";
import { RegularService } from "../regular/regular.service";
import { ModeratorService } from "../moderator/moderator.service";

@Component({
    templateUrl: './change-attribute.component.html',
    styleUrls: ['./change-attribute.component.css']
})
export class ChangeAttributeComponent implements OnInit, OnDestroy {
    private loggedInUser : User;
    form : FormGroup;
    imagePreview: string;

    constructor(private userService: UserService,
    private adminService: AdminService,
    private regularService: RegularService,
    private moderatorService: ModeratorService) {}

    ngOnInit() {
        this.loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

        this.form = new FormGroup(
            {   
                image: new FormControl(null),
                name: new FormControl(this.loggedInUser.name, { validators: [Validators.required] }),
                surrname: new FormControl(this.loggedInUser.surrname, { validators: [Validators.required] }),
                dateOfBirth: new FormControl(this.loggedInUser.dateOfBirth, { validators: [Validators.required] }),
                city: new FormControl(this.loggedInUser.city, { validators: [Validators.required] }),
                country: new FormControl(this.loggedInUser.country, { validators: [Validators.required] }),
                email: new FormControl(this.loggedInUser.email, { validators: [Validators.required, Validators.email] }),
            }
        );
        if(this.loggedInUser.type == "admin") {
            this.adminService.adminEnteredSite();
        }
        else if(this.loggedInUser.type == "regular") {
            this.regularService.regularEnteredSite();
        }
        else if(this.loggedInUser.type == "moderator") {
            this.moderatorService.moderatorEnteredSite();
        }
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

    onChange() {
        if(this.form.invalid) {
            return
        }
        console.log(this.form.value.image);
        //console.log(this.form.value);
        //console.log(typeof this.form.value.dateOfBirth + " = " + this.form.value.dateOfBirth);
        this.userService.changeAttributes(this.form.value.image, this.loggedInUser.username, this.form.value.name, this.form.value.surrname,
        this.form.value.dateOfBirth, this.form.value.city, this.form.value.country,
        this.form.value.email);
    }

    ngOnDestroy() {

    }
}