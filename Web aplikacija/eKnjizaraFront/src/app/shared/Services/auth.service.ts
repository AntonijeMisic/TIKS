import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from '../../../../environments/environments.prod';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  loginUser(userData: any)
  {
    return this.http.post<any>(`${url}/Korisnik/Autentikacija`, userData ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }
  registerUser(userData: any)
  {
    return this.http.post<any>(`${url}/Korisnik/Registracija`, userData ).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      }));
  }

  storeID(userId: string)
  {
    localStorage.setItem("id", userId);
  }
  getIDFromLocalStorage()
  {
    return localStorage.getItem("id");
  }
  isLoggedIn(): boolean
  {
    return !!localStorage.getItem("id");
  }
}
