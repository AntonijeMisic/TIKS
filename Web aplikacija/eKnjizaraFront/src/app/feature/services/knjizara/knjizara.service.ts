import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Knjizara } from '../../../shared/Models/Knjizara';
import { url } from '../../../../../environments/environments.prod';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KnjizaraService {

  constructor(private http: HttpClient) { }

  getKnjizare() {
    return this.http.get<Knjizara[]>(`http://localhost:5007/Knjizara/PrikaziSveKnjizare`);
  }
  getKnjizaraById(id: string) {
    return this.http.get<Knjizara>(`${url}/Knjizara/PrikaziKnjizaru/${id}`);
  }

  dodajKnjizaru(userId: string, knjizara: Knjizara) {

    const knjizaraDto = {
      naziv: knjizara.naziv,
      adresa: knjizara.adresa,
      email: knjizara.email,
      telefon: knjizara.telefon,
      knjige: knjizara.knjige,
      slika: knjizara.slika
    }

    return this.http.post<Knjizara>(`${url}/Knjizara/UnesiKnjizaru?korisnikID=${userId}`, knjizaraDto).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      }));
  }
  izmeniKnjizaru(userId: string, knjizara: Knjizara) {
    const knjizaraDto = {
      naziv: knjizara.naziv,
      adresa: knjizara.adresa,
      email: knjizara.email,
      telefon: knjizara.telefon,
      knjige: knjizara.knjige,
      slika: knjizara.slika
    }

    return this.http.put<Knjizara>(`${url}/Knjizara/IzmeniKnjizaru/${knjizara.id}?korisnikID=${userId}`, knjizaraDto).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      }));;
  }
  izbrisiKnjizaru(id: string, korisnikId: string) {
    return this.http.delete<Knjizara>(`${url}/Knjizara/ObrisiKnjizaru/${id}?korisnikID=${korisnikId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      }));
  }
}
