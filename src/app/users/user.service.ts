import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { User } from "../auth/user.model";
import { Subject } from "rxjs";
import { Event } from "./event.model";
import { Follow } from "./follow.model";
import { Message } from "./message.model";

@Injectable({ providedIn: 'root' })
export class UserService{
    private userListener = new Subject<User>();
    private usersListener = new Subject<User[]>();
    private events: Event[] = [];
    private eventsListener = new Subject<Event[]>();
    private followListener = new Subject<Follow>();
    private followsListener = new Subject<Follow[]>();
    private messagesListener = new Subject<Message[]>();
    private userMessagesListener = new Subject<Message[]>();

    constructor(private http: HttpClient,
    private router: Router) {}

    getUserListener() {
        return this.userListener.asObservable();
    }

    getUsersListener() {
        return this.usersListener.asObservable();
    }

    getEventsListener() {
        return this.eventsListener.asObservable();
    }

    getFollowListener() {
        return this.followListener.asObservable();
    }

    getFollowsListener() {
        return this.followsListener.asObservable();
    }

    getMessagesListener() {
        return this.messagesListener.asObservable();
    }

    getUserMessagesListener() {
        return this.userMessagesListener.asObservable();
    }

    getUser(username: string) {
        this.http.get<{user: User}>("http://localhost:3000/api/user/get/" + username)
            .subscribe(response => {
                localStorage.setItem("loggedInUser", JSON.stringify(response.user));
                this.userListener.next(response.user);
            })
    }

    getUsers() {
        this.http.get<{users: User[]}>("http://localhost:3000/api/user/get-users")
            .subscribe(response => {
                //console.log(response);
                this.usersListener.next(response.users);
            }, error => {
                console.log(error);
            })
    }

    getPickedUser(username: string) {
        this.http.get<{user: User}>("http://localhost:3000/api/user/get/" + username)
            .subscribe(response => {
                this.userListener.next(response.user);
            })
    }

    changeAttributes(image: File, oldUsername: string, name: string, surrname: string,
    dateOfBirth: any, city: string, country: string, email: string) {

        const postData = new FormData();
        
        if(image != null) {
            postData.append("image", image);
        }
        postData.append("name", name);
        postData.append("surrname", surrname);
        if(typeof dateOfBirth == "string") {
            postData.append("dateOfBirth", dateOfBirth);
        }
        else {
            postData.append("dateOfBirth", dateOfBirth.toLocaleDateString());
        }
        postData.append("city", city);
        postData.append("country", country);
        postData.append("email", email);

        let date : any;
        if(typeof dateOfBirth == "string") {
            date = dateOfBirth;
        }
        else {
            date = dateOfBirth.toLocaleDateString();
        }

        const loggedInUser : User = JSON.parse(localStorage.getItem("loggedInUser"));

        this.http.put("http://localhost:3000/api/user/changeattribute/" + oldUsername, postData)
        //{image: image, name: name, surrname: surrname, dateOfBirth: date, city: city, country: country, email: email})
            .subscribe(response => {
                if(loggedInUser.type == "admin") {
                    loggedInUser.username = oldUsername;
                    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
                    this.router.navigate(['/admin']);
                }
                else if(loggedInUser.type == "regular") {
                    loggedInUser.username = oldUsername;
                    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
                    this.router.navigate(['/regular']);
                }
                else if(loggedInUser.type == "moderator") {
                    loggedInUser.username = oldUsername;
                    localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
                    this.router.navigate(['/moderator']);
                }
            }, error => {
                console.log(error.error.message);
                if(error.error.message == "Zauzeto korisnicko ime") {
                    alert("Zauzeto korisnicko ime");
                }
                else {
                    if(loggedInUser.type == "admin") {
                        this.router.navigate(['/admin']);
                    }
                    else if(loggedInUser.type == "regular") {
                        this.router.navigate(['/regular']);
                    }
                    else{
                        this.router.navigate(['/moderator']);
                    }
                }
            })
    }

    followUser(loggedInUser: User, pickedUser: User) {
        this.http.post("http://localhost:3000/api/user/follow-user", 
        {userFollowing: loggedInUser.username, followedUser: pickedUser.username})
            .subscribe(response => {
                console.log(response);
                location.reload();
            }, error => {
                console.log(error);
            })
    }

    unFollowUser(loggedInUser: User, pickedUser: User) {
        let parameters = "";
        parameters += loggedInUser.username;
        parameters += ",";
        parameters += pickedUser.username;
        this.http.delete("http://localhost:3000/api/user/unfollow-user/" + parameters)
            .subscribe(response => {
                console.log(response);
                location.reload();
            }, error => {
                console.log(error);
            })    
    }

    getFollow(loggedInUser: User, pickedUser: User) {
        let parameters = "";
        parameters += loggedInUser.username;
        parameters += ",";
        parameters += pickedUser.username;

        let array = parameters.split(",")
        //console.log(array[0]);
        //console.log(array[1]);
        this.http.get<{follow: Follow}>("http://localhost:3000/api/user/get-follow/" + parameters)
            .subscribe(response => {
                //console.log(response.follow);
                this.followListener.next(response.follow);
            }, error => {
                console.log(error);
            })
    }

    getFollows(loggedInUser: User) {
        this.http.get<{follows: Follow[]}>("http://localhost:3000/api/user/get-follows/" + loggedInUser.username)
            .subscribe(response => {
                console.log(response.follows);
                this.followsListener.next(response.follows);
            }, error => {
                console.log(error);
            })
    }

    addEvent(creator: string, name: string, beginDate: Date,
    endDate: Date, isPrivate: boolean, isActive: boolean, participants: string, description: string) {
        
        //const postData = new FormData();
        //postData.append("creator", creator);
        //postData.append("name", name);
        //postData.append("beginDate", beginDate.toLocaleDateString());
        //postData.append("endDate", endDate.toLocaleDateString());
        //postData.append("description", description);

        this.http.post("http://localhost:3000/api/user/add-event", 
        {creator: creator, name: name, beginDate: beginDate, endDate: endDate, isPrivate: isPrivate, isActive: isActive, participants: participants, description: description})
            .subscribe(response => {
                console.log(response);
                location.reload();
            }, error => {
                console.log(error);
            })
    }

    getEvents(isLoggedInUser: boolean) {
        this.http.get<{events: Event[]}>("http://localhost:3000/api/user/get-events")
            .subscribe(response => {
                //console.log(response.events);
                this.events = response.events;
                if(!isLoggedInUser) {
                    let guestEvents: Event[] = [];
                    
                    for (let i = 0; i < this.events.length; i++) {
                        const event = this.events[i];
                        
                        if(event.isActive && !event.isPrivate && Date.parse(event.beginDate.toString()) > Date.now()) {
                             guestEvents.push(event);
                        }
                    }
                    this.eventsListener.next(guestEvents);
                }
                else {
                    this.eventsListener.next(response.events);   
                }
            }, error => {
                console.log(error);
            })
    }

    updateParticipants(pickedEvent: Event) {
        this.http.put("http://localhost:3000/api/user/update-participants/" + pickedEvent._id, 
        { participants: pickedEvent.participants })
            .subscribe(response => {
                console.log(response);
                localStorage.setItem("pickedEvent", JSON.stringify(pickedEvent));
                location.reload();
            }, error => {
                console.log(error);
            })
    }

    updateActiveness(pickedEvent: Event) {
        this.http.put("http://localhost:3000/api/user/update-activeness/" + pickedEvent._id, 
        { isActive: pickedEvent.isActive})
            .subscribe(response => {
                console.log(response);
                localStorage.setItem("pickedEvent", JSON.stringify(pickedEvent));
                location.reload();
            }, error => {
                console.log(error);
            })
    }

    postMessage(eventId: string, user: string, message: string) {
        this.http.post("http://localhost:3000/api/user/post-message",
        { eventId: eventId, user: user, message: message})
            .subscribe(response => {
                console.log(response);
                location.reload();
            }, error => {
                console.log(error);
            })
    }

    getMessages(eventId: string) {
        this.http.get<{messages: Message[]}>("http://localhost:3000/api/user/get-messages/" + eventId)
            .subscribe(response => {
                console.log(response.messages);
                this.messagesListener.next(response.messages);
            }, error => {
                console.log(error);
            })
    }

    getUserMessages(eventId: string, user: string) {
        let parameters = "";
        parameters += eventId;
        parameters += ",";
        parameters += user;
        this.http.get<{messages: Message[]}>("http://localhost:3000/api/user/get-user-messages/" + parameters)
            .subscribe(response => {
                console.log(response.messages);
                this.userMessagesListener.next(response.messages);
            }, error => {
                console.log(error);
            })
    }
}