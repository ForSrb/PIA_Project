import { Injectable } from "@angular/core";
import { UserRequest } from "../../auth/user_requests.model";
import { HttpClient } from "@angular/common/http";
import { User } from "../../auth/user.model";
import { AuthService } from "../../auth/auth.service";
import { Subject } from "rxjs";
import { Genre } from "./genre.model";

@Injectable({providedIn: 'root'})
export class AdminService {
    private AdminListener = new Subject<boolean>();
    private userRequests: UserRequest[] = [];
    private userRequestsUpdated = new Subject<UserRequest[]>();
    private genreListener = new Subject<Genre[]>();
    private messageListener = new Subject<string>();

    constructor(private http: HttpClient) {}

    getUserRequestsUpdated() {
        return this.userRequestsUpdated.asObservable();
    }
        
    getAdminListener() {
        return this.AdminListener.asObservable();
    }

    getGenreListener() {
        return this.genreListener.asObservable();
    }

    getMessageListener() {
        return this.messageListener.asObservable();
    }

    adminEnteredSite() {
        this.AdminListener.next(true);
    }

    adminLeftSite() {
        this.AdminListener.next(false);
    }

    getUserRequests() {
        this.http.get<{ userRequests: UserRequest[] }>("http://localhost:3000/api/user/get-requests")
            .subscribe(response => {
                this.userRequests = response.userRequests;
                this.userRequestsUpdated.next([...this.userRequests]);
            })
    }

    acceptRequest(request: UserRequest){
        let user: User = {
            name: request.name,
            surrname: request.surrname,
            imagePath: request.imagePath,
            username: request.username,
            password: request.password,
            passwordAgain: request.passwordAgain,
            dateOfBirth: request.dateOfBirth,
            city: request.city,
            country: request.country,
            email: request.email,
            type: "regular"
        }
        this.http.put("http://localhost:3000/api/admin/accept/" + request.username, user)
            .subscribe(response => {
                this.getUserRequests();
            }, error => {
                console.log(error);
            })
    }

    declineRequest(request: UserRequest) {
        this.http.delete("http://localhost:3000/api/admin/delete/" + request.username)
            .subscribe(response => {
                console.log(response);
                this.getUserRequests();
            }, error => {
                console.log(error);
            })
    }

    upgradeUser(username: string) {
        this.http.put("http://localhost:3000/api/admin/change-type/" + username,
        {type: "moderator"})
            .subscribe(response => {
                console.log(response);
                location.reload();
            }, error => {
                console.log(error);
            })
    }

    demoteUser(username: string) {
        this.http.put("http://localhost:3000/api/admin/change-type/" + username,
        {type: "regular"})
            .subscribe(response => {
                console.log(response);
                location.reload();
            }, error => {
                console.log(error);
            })
    }

    addGenre(genre: string) {
        this.http.post("http://localhost:3000/api/admin/add-genre",
        {genre: genre})
            .subscribe(response => {
                console.log(response);
                location.reload();
            }, error => {
                this.messageListener.next(error.error.message);                
                console.log(error.error.message);
            })
    }

    getGenres() {
        this.http.get<{genres: Genre[]}>("http://localhost:3000/api/admin/get-genres")
            .subscribe(response => {
                console.log(response);
                this.genreListener.next(response.genres);
            }, error => {
                console.log(error);
            })
    }

    deleteGenre(genre: string) {
        this.http.delete("http://localhost:3000/api/admin/delete-genre/" + genre)
            .subscribe(response => {
                console.log(response);
                location.reload();
            }, error => {
                this.messageListener.next("Postoji knjiga sa ovim zanrom, ne smete obrisati zanr");
                console.log(error);
            })
    }
}