import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { url } from '../../../../environments/environments.prod';
import { User } from '../Models/User';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private authService: AuthService, private http: HttpClient) { }

  getUserById(id: string)
  {
    return this.http.get<User>(`${url}/Korisnik/PrikaziKorisnika/${id}`);
  }

  checkLogIn(korisnik: User)
  {
    if(korisnik)
    return true;
    else
    return false;
  }

  checkUserAdmin(korisnik: User)
  {
    if(this.checkLogIn(korisnik))
    {
      if(korisnik.tip=="Admin")
        return true;
    }

    return false;
  }

  logOutUser(): void {
    localStorage.clear();
  }
}
