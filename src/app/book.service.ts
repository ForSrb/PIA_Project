import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Book } from "./book.model";
import { Subject } from "rxjs";
import { map } from 'rxjs/operators';
import { BookUser } from "./book_user.model";
import { BookRequest } from "./book_request.model";

@Injectable({providedIn: 'root'})
export class BookService{
    private books : Book[] = [];
    private bookListener = new Subject<Book[]>();
    private messageListener = new Subject<string>();
    private pickedBook : Book;
    private pickedBookListener = new Subject<Book>();
    private searchedForBookListener = new Subject<boolean>();
    private bookUserListener = new Subject<BookUser>();
    private bookUsersListener = new Subject<BookUser[]>();
    private bookRequests : BookRequest[] = [];
    private bookRequestsListener = new Subject<BookRequest[]>();

    constructor(private http: HttpClient) {}

    getBookListener() {
        return this.bookListener.asObservable();
    }

    getPickedBookListener() {
        return this.pickedBookListener.asObservable();
    }

    getMessageListener() {
        return this.messageListener.asObservable();
    }

    getSearchedForBookListener() {
        return this.searchedForBookListener.asObservable();
    }

    getBookUserListener() {
        return this.bookUserListener.asObservable();
    }

    getBookUsersListener() {
        return this.bookUsersListener.asObservable();
    }

    getBookRequestsListener() {
        return this.bookRequestsListener.asObservable();
    }

    addBook(image: File, name: string, authors: string, publishDate: Date,
    genres: string, description: string) {

        const postData = new FormData();
        if(image != null) {
            postData.append("image", image, name);
        }
        postData.append("name", name);
        postData.append("authors", authors);
        postData.append("publishDate", publishDate.toLocaleDateString());
        postData.append("genres", genres);
        postData.append("description", description);
        postData.append("status", "pending");
        
        this.http.post("http://localhost:3000/api/book/add-request", postData)
            .subscribe(response => {
                console.log(response);
            })

    }

    getBookRequests() {
        this.http.get<{requests: BookRequest[]}>("http://localhost:3000/api/book/get-requests")
            .subscribe(response => {
                console.log(response.requests);
                this.bookRequestsListener.next(response.requests);
            }, error => {
                console.log(error);
            })
    }

    getDeclinedBookRequests() {
        this.http.get<{requests: BookRequest[]}>("http://localhost:3000/api/book/get-declined-requests")
            .subscribe(response => {
                console.log(response.requests);
                this.bookRequestsListener.next(response.requests);
            }, error => {
                console.log(error);
            })
    }

    acceptBookRequest(request: BookRequest) {
        let book: Book = {
            _id: null,
            imagePath: request.imagePath,
            name: request.name,
            authors: request.authors,
            publishDate: request.publishDate,
            genres: request.genres,
            description: request.description,
            averageReview: request.averageReview
        }

        this.http.post("http://localhost:3000/api/book/accept-request/" + request._id, book)
            .subscribe(response => {
                console.log(response);
                location.reload();
            }, error => {
                console.log(error);
            })
    }

    declineBookRequest(id: string) {
        this.http.put("http://localhost:3000/api/book/decline-request/" + id,
        {status: "declined"})
            .subscribe(response => {
                console.log(response);
                location.reload();
            }, error => {
                console.log(error);
            })
    }

    updateBook(id: string, name: string, authors: string, publishDate: Date,
    genres: string, description: string) {

        this.http.put("http://localhost:3000/api/book/update-book/" + id,
        {name: name, authors: authors, publishDate: publishDate, genres: genres, description: description})   
            .subscribe(response => {
                console.log(response);
                location.reload();
            }, error => {
                console.log(error);
            })
    }

    getSearchedBooks(author: string, name: string, genre: string) {
        //console.log(author);
        //console.log(name);
        //console.log(genre);
        this.http.get<{books: Book[]}>("http://localhost:3000/api/book/get")
            .subscribe(response => {
                this.books = response.books;
                let books : Book[] = [];
                //console.log(books);
                if(genre == undefined) {
                    genre = "";
                }
                for (let i = 0; i < this.books.length; i++) {
                    const book = this.books[i];

                    if(book.authors.includes(author) && book.name.includes(name) &&
                    book.genres.includes(genre)) {
                        books.push(book);
                    }
                    
                    //console.log(book.authors.includes(author));
                    //console.log(book.name.includes(name));
                    //console.log(book.genres.includes(genre));
                }
                this.bookListener.next(books); 
                this.searchedForBookListener.next(true);
                if(books.length == 0) {
                    this.messageListener.next("Nema knjige");
                }
            }, error => {
                this.messageListener.next(error.error.message);
            })
    }

    getSeachedBookRequests(author: string, name: string, genre: string) {
        this.http.get<{requests: BookRequest[]}>("http://localhost:3000/api/book/get-declined-requests")
            .subscribe(response => {
                this.bookRequests = response.requests;
                let requests: BookRequest[] = [];

                if(genre == undefined) {
                    genre = "";
                }
                for (let i = 0; i < this.bookRequests.length; i++) {
                    const bookRequest = this.bookRequests[i];
                    
                    if(bookRequest.authors.includes(author) && bookRequest.name.includes(name) &&
                    bookRequest.genres.includes(genre)) {
                        requests.push(bookRequest);
                    }
                }
                this.bookRequestsListener.next(requests);
            }, error => {
                console.log(error);
            })
    }

    getBook(id: string) {
        this.http.get<{book: Book}>("http://localhost:3000/api/book/get/" + id)
            .subscribe(response => {
                this.pickedBook = response.book;
                this.pickedBookListener.next(this.pickedBook);
            })
    }

    addBookUser(user: string, bookId: string, status: string,
        readPages: number, numberOfPages: number) {

        this.http.post("http://localhost:3000/api/book/add-book-user",
        {user: user, bookId: bookId, status: status, readPages: readPages, numberOfPages: numberOfPages})
            .subscribe(response => {
                //console.log(response);
                location.reload();
            })
    }

    updateBookUser(user: string, bookId: string, status: string,
        readPages: number, numberOfPages: number) {

        this.http.put("http://localhost:3000/api/book/update-book-user",
        {user: user, bookId: bookId, status: status, readPages: readPages, numberOfPages: numberOfPages })
            .subscribe(response => {
                //console.log(response);
                location.reload();
            })
    }

    getBookUser(user: string, bookId: string) {
        let parameters = "";
        parameters += user;
        parameters += ",";
        parameters += bookId;
        this.http.get<{bookUser: BookUser}>("http://localhost:3000/api/book/get-book-user/" + parameters )
            .subscribe(response => {
                console.log(response.bookUser);
                this.bookUserListener.next(response.bookUser);
            })
    }

    deleteBookUser(user: string, bookId: string) {
        let parameters = "";
        parameters += user;
        parameters += ",";
        parameters += bookId;
        this.http.delete("http://localhost:3000/api/book/delete-book-user/" + parameters)
            .subscribe(response => {
                //console.log(response);
                location.reload();
            })
    }

    getBookUsers(user: string) {
        this.http.get<{bookUsers: BookUser[]}>("http://localhost:3000/api/book/get-book-users/" + user)
            .subscribe(response => {
                //console.log(response.bookUsers);
                this.bookUsersListener.next(response.bookUsers);
            })
    }

    updateReview(bookId: string, averageReview: number) {
        this.http.put("http://localhost:3000/api/book/update-review",
        { bookId: bookId, averageReview: averageReview})
            .subscribe(response => {
                console.log(response);
                location.reload();
            }, error => {
                console.log(error);
            })
    }

}