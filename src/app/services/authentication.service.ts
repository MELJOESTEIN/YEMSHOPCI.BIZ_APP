import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    baseUrl = environment.baseUrl;

    constructor(private http: HttpClient) {
    }

    httpOptions = {
        header: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            console.error('An error occured', error.error.message);
        } else {
            console.error('Backend returned code ${error.status}, ' +
                'Body was: ${error.error}');
        }
        return throwError('Something bad happened, Please try again later');
    }

    getData(dataUrl) {
        return this.http.get(this.baseUrl + dataUrl).pipe(retry(2),
            catchError(this.handleError));
    }

    postData(postUrl, listing) {
        return this.http.post(this.baseUrl + postUrl, listing).pipe(retry(2),
            catchError(this.handleError));
    }
}
