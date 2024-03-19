import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Knjiga } from '../../../shared/Models/Knjiga';
import { url } from '../../../../../environments/environments.prod';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class KnjigaService {

  constructor(private http: HttpClient) { }

  dodajKnjigu(knjizaraId: string, userId: string, knjiga: Knjiga) {

    const knjigaDto = {
      naslov: knjiga.naslov,
      isbn: knjiga.isbn,
      autor: knjiga.autor,
      izdavac: knjiga.izdavac,
      zanr: knjiga.zanr,
      godinaIzdavanja: knjiga.godinaIzdavanja,
      cena: knjiga.cena,
      slika: knjiga.slika
    }

    return this.http.post<Knjiga>(`${url}/Knjiga/UnesiKnjiu/${knjizaraId}?korisnikID=${userId}`, knjigaDto).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      }));;
  }
  izmeniKnjigu(userId: string, knjiga: Knjiga) {
    const knjigaDto = {
      naslov: knjiga.naslov,
      isbn: knjiga.isbn,
      autor: knjiga.autor,
      izdavac: knjiga.izdavac,
      zanr: knjiga.zanr,
      godinaIzdavanja: knjiga.godinaIzdavanja,
      cena: knjiga.cena,
      slika: knjiga.slika
    }

    return this.http.put<Knjiga>(`${url}/Knjiga/IzmeniKnjigu/${knjiga.id}?korisnikID=${userId}`, knjigaDto).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      }));;
  }
  izbrisiKnjigu(id: string, korisnikId: string) {
    return this.http.delete<Knjiga>(`${url}/Knjiga/ObrisiKnjigu/${id}?korisnikID=${korisnikId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      }));
  }
}
