import { Component, OnInit, OnDestroy } from "@angular/core";
import { Event } from "../event.model";
import { User } from "../../auth/user.model";
import { RegularService } from "../regular/regular.service";
import { ModeratorService } from "../moderator/moderator.service";
import { AdminService } from "../admin/admin.service";
import { UserService } from "../user.service";
import { NgForm } from "@angular/forms";
import { Message } from "../message.model";
import { Subscription } from "rxjs";

@Component({
    templateUrl: './event-page.component.html',
    styleUrls: ['./event-page.component.css']
})
export class EventPageComponent implements OnInit, OnDestroy{
    pickedEvent: Event;
    loggedInUser: User;
    isCreator: boolean;
    isParticipating: boolean;
    isActive: boolean
    
    messages: Message[] = [];
    messagesSub: Subscription;

    userMessages: Message[] = [];
    userMessagesSub: Subscription;

    constructor(private regularService: RegularService,
    private moderatorService: ModeratorService,
    private adminService: AdminService,
    private userService: UserService) {}

    ngOnInit() {
        this.pickedEvent = JSON.parse(localStorage.getItem("pickedEvent"));
        this.loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        //console.log(this.pickedEvent.participants);
        
        let participants = this.pickedEvent.participants.split(" ");
        participants.pop();
        console.log(participants);

        this.isCreator = false;
        this.isParticipating = false;
        this.isActive = false;
        
        if(this.pickedEvent.creator == this.loggedInUser.username) {
            this.isCreator = true;
            this.isParticipating = true;
        }
        for (let i = 0; i < participants.length; i++) {
            const participant = participants[i];
            
            if(this.loggedInUser.username == participant) {
                this.isParticipating = true;
            }
        }

        if(this.pickedEvent.isActive && Date.parse(this.pickedEvent.beginDate.toString()) < Date.now()){
            this.isActive = true;
        }

        console.log(this.isCreator);
        console.log(this.isParticipating);

        if(this.loggedInUser.type == "regular") {
            this.regularService.regularEnteredSite();
        }
        else if(this.loggedInUser.type == "moderator") {
            this.moderatorService.moderatorEnteredSite();
        }
        else {
            this.adminService.adminEnteredSite();
        }

        this.messagesSub = this.userService.getMessagesListener()
            .subscribe(messages => {
                this.messages = messages;
            })
        this.userService.getMessages(this.pickedEvent._id);

        this.userMessagesSub = this.userService.getUserMessagesListener()
            .subscribe(messages => {
                this.userMessages = messages;
            })
        this.userService.getUserMessages(this.pickedEvent._id, this.loggedInUser.username)
    }

    onJoinEvent() {
        if(!this.pickedEvent.isPrivate) {
            this.pickedEvent.participants += (this.loggedInUser.username + " ");
            console.log(this.pickedEvent.participants);

            this.userService.updateParticipants(this.pickedEvent);
        }
    }

    onOpenEvent() {
        this.pickedEvent.isActive = true;
        this.userService.updateActiveness(this.pickedEvent);
    }

    onCloseEvent() {
        this.pickedEvent.isActive = false;
        this.userService.updateActiveness(this.pickedEvent);
    }

    onMessage(form: NgForm) {
        if(form.invalid) {
            return;
        }
        this.userService.postMessage(this.pickedEvent._id,
        this.loggedInUser.username, form.value.message);
    }

    ngOnDestroy() {
        localStorage.removeItem("pickedEvent");
        this.messagesSub.unsubscribe();
        this.userMessagesSub.unsubscribe();
    }
}