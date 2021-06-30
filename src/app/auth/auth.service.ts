import { Injectable } from "@angular/core";
import { User } from "./user.model";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { loginUser } from "./login.model";
import { Subject } from "rxjs";
import { UserRequest } from "./user_requests.model";
import { AdminService } from "../users/admin/admin.service";

@Injectable({ providedIn: 'root' })
export class AuthService {
    private messageListener = new Subject<string>();
    private loggedInUser: User = null;
    private loggedInUserListener = new Subject<User>();
    private isUserLoggedIn = false;
    private loggedInListener = new Subject<boolean>();
    

    constructor(private http: HttpClient,
        private router: Router,
        private adminService : AdminService
        ) { }

    getMessageListener() {
        return this.messageListener.asObservable();
    }

    getLoggedInUser() {
        return this.loggedInUser;
    }

    getLoggedInUserListener() {
        return this.loggedInUserListener.asObservable();
    }

    getIsUserLoggedIn() {
        return this.isUserLoggedIn;
    }

    getLoggedInListener() {
        return this.loggedInListener.asObservable();
    }

    

    createUser(name: string, surrname: string, image: File, username: string, password: string, passwordAgain: string,
        date: Date, city: string, country: string, email: string) {

        const postData = new FormData();
        postData.append("name", name);
        postData.append("surrname", surrname);
        if(image != null) {
            postData.append("image", image, username);
        }
        postData.append("username", username);
        postData.append("password", password);
        postData.append("passwordAgain", passwordAgain);
        postData.append("dateOfBirth", date.toLocaleDateString());
        postData.append("city", city);
        postData.append("country", country);
        postData.append("email", email);
        postData.append("type", "regular");

        this.http.post("http://localhost:3000/api/user/signup", postData)
            .subscribe(() => {
                this.router.navigate(['/']);
            }, error => {
                this.messageListener.next(error.error.message);
            });
    }

    login(username: string, password: string) {
        const loginUser: loginUser = {
            username: username,
            password: password
        }
        this.http.post<{ user: User }>("http://localhost:3000/api/user/login", loginUser)
            .subscribe(response => {
                if (response.user.type == "admin") {
                    this.loggedInUser = response.user;
                    this.loggedInUserListener.next(response.user);
                    this.isUserLoggedIn = true;
                    this.loggedInListener.next(true);
                    localStorage.setItem("loggedInUser", JSON.stringify(response.user));
                    localStorage.setItem("isLoggedInUser", "true");
                    this.router.navigate(['/admin']);
                }
                else if(response.user.type == "regular") {
                    this.loggedInUser = response.user;
                    this.loggedInUserListener.next(response.user);
                    this.isUserLoggedIn = true;
                    this.loggedInListener.next(true);
                    localStorage.setItem("loggedInUser", JSON.stringify(response.user));
                    localStorage.setItem("isLoggedInUser", "true");
                    this.router.navigate(['/regular']);
                }
                else {
                    this.loggedInUser = response.user;
                    this.loggedInUserListener.next(response.user);
                    this.isUserLoggedIn = true;
                    this.loggedInListener.next(true);
                    localStorage.setItem("loggedInUser", JSON.stringify(response.user));
                    localStorage.setItem("isLoggedInUser", "true");
                    this.router.navigate(['/moderator']);  
                }
            }, error => {
                this.messageListener.next(error.error.message);
            });
    }

    changePassword(username: string, oldPassword: string, newPassword: string, newPasswordAgain: string) {
        this.http.put("http://localhost:3000/api/user/changepassword/" + username,
            { oldPassword: oldPassword, newPassword: newPassword, newPasswordAgain: newPasswordAgain })
            .subscribe(response => {
                this.logout();
            }, error => {
                this.messageListener.next(error.error.message);
            });
    }


    logout() {
        this.loggedInUser = null;
        this.isUserLoggedIn = false;
        this.loggedInListener.next(false);
        localStorage.removeItem("loggedInUser");
        localStorage.removeItem("isLoggedInUser");
        this.adminService.adminLeftSite();
        this.router.navigate(['/']);
    }

    initialize() {
        this.loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        this.loggedInUserListener.next(this.loggedInUser);
        this.isUserLoggedIn = JSON.parse(localStorage.getItem("isLoggedInUser"));
        this.loggedInListener.next(this.isUserLoggedIn);
    }

}