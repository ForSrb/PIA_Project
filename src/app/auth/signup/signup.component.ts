import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm, FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Subscription } from "rxjs";

import { mimeType } from './7.1 mime-type.validator.ts';
import { GuestService } from "../../users/guest/guest.service";


@Component({
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
    private messageSub: Subscription;
    message: string;
    form: FormGroup;
    imagePreview: string;
    siteKey: string = "6LdmhMYZAAAAAL-WdvUf23zR0D468Njzr8C-v1nV";

    constructor(private authService: AuthService,
        private guestService: GuestService) { }

    ngOnInit() {
        this.messageSub = this.authService.getMessageListener()
            .subscribe(messageStatus => {
                this.message = messageStatus;
            });

        this.form = new FormGroup(
            {
                name: new FormControl(null, { validators: [Validators.required] }),
                surrname: new FormControl(null, { validators: [Validators.required] }),
                image: new FormControl(null),
                username: new FormControl(null, { validators: [Validators.required] }),
                password: new FormControl(null, { validators: [Validators.required] }),
                passwordAgain: new FormControl(null, { validators: [Validators.required] }),
                dateOfBirth: new FormControl(null, { validators: [Validators.required] }),
                city: new FormControl(null, { validators: [Validators.required] }),
                country: new FormControl(null, { validators: [Validators.required] }),
                email: new FormControl(null, { validators: [Validators.required, Validators.email] }),
                recaptcha: new FormControl(null, { validators: [Validators.required] })
            }
        );
        this.guestService.guestLeftSite();
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

    onSignUp() {
        if (this.form.invalid) {
            return;
        }
        //console.log(this.form.value);
        this.authService.createUser(this.form.value.name, this.form.value.surrname, this.form.value.image,
            this.form.value.username, this.form.value.password, this.form.value.passwordAgain, this.form.value.dateOfBirth,
            this.form.value.city, this.form.value.country, this.form.value.email);
            

    }

    ngOnDestroy() {
        this.messageSub.unsubscribe();
    }
}