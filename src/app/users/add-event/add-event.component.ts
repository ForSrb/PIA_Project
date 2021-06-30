import { Component, OnInit, OnDestroy } from "@angular/core";
import { RegularService } from "../regular/regular.service";
import { ModeratorService } from "../moderator/moderator.service";
import { AdminService } from "../admin/admin.service";
import { User } from "../../auth/user.model";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserService } from "../user.service";
import { MatRadioChange } from "@angular/material/radio";
import { Follow } from "../follow.model";
import { Subscription } from "rxjs";

@Component({
    templateUrl: './add-event.component.html',
    styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit, OnDestroy{
    currentStatus: any;
    loggedInUser: User;
    form: FormGroup;
    follows: Follow[] = [];
    stringFollows: string[] = [];
    followsSub: Subscription;

    constructor(private regularService: RegularService,
    private moderatorService: ModeratorService,
    private adminService: AdminService,
    private userService: UserService) {}

    ngOnInit() {
        this.loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if(this.loggedInUser.type == "regular") {
            this.regularService.regularEnteredSite();
        }
        else if(this.loggedInUser.type == "moderator") {
            this.moderatorService.moderatorEnteredSite();
        }
        else {
            this.adminService.adminEnteredSite();
        }

        this.form = new FormGroup({
            name: new FormControl(null, {validators: [Validators.required]}),
            beginDate: new FormControl(null, {validators: [Validators.required]}),
            endDate: new FormControl(null),
            isActive: new FormControl(null, {validators: [Validators.required]}),
            isPrivate: new FormControl(null, {validators: [Validators.required]}),
            participants: new FormControl(null),
            description: new FormControl(null, {validators: [Validators.required]})
        })

        this.followsSub = this.userService.getFollowsListener()
            .subscribe(follows => {
                this.follows = follows;
                this.follows.forEach(follow => {
                    this.stringFollows.push(follow.followedUser);
                })
            })
        this.userService.getFollows(this.loggedInUser);
    }

    onAdd() {
        if(this.form.invalid) {
            alert("Niste uneli sve podatke");
            return;
        }
        if(this.form.value.endDate && Date.parse(this.form.value.beginDate.toString()) > Date.parse(this.form.value.endDate.toString())) {
            alert("Ne moze kraj dogadjaja da bude pre pocetka");
            return;
        }

        console.log(this.form.value);
        let isActive: boolean;
        
        if(this.form.value.isActive == "Yes") {
            isActive = true;
        }
        else {
            isActive = false;
        }

        let isPrivate: boolean;

        if(this.form.value.isPrivate == "Yes" || this.form.value.isPrivate == null) {
            isPrivate = true;
        }
        else {
            isPrivate = false;
        }

        let participants : string = "";
        if(this.form.value.participants) {
            this.form.value.participants.forEach(participant => {
                participants += participant + " ";
            });
        }

        this.userService.addEvent(this.loggedInUser.username, this.form.value.name,
        this.form.value.beginDate, this.form.value.endDate, isPrivate, isActive, participants, this.form.value.description);
    }

    onChange(event: MatRadioChange) {
        //console.log(event.value);
        this.currentStatus = event.value;
       // console.log(this.currentStatus);
    }

    ngOnDestroy() {
        this.followsSub.unsubscribe();
    }
}