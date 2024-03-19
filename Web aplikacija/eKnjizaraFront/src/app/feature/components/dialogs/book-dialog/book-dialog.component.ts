import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
import { Knjizara } from '../../../../shared/Models/Knjizara';
import { User } from '../../../../shared/Models/User';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import { editBookstore, addNewBookstore, addBookToStore, updateBookInStore } from '../../../../store/knjizara/knjizara.actions';
import { Knjiga } from '../../../../shared/Models/Knjiga';
import { KnjigaService } from '../../../services/knjiga/knjiga.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-book-dialog',
  standalone: true,
  imports: [MatDialogModule, CommonModule],
  templateUrl: './book-dialog.component.html',
  styleUrl: './book-dialog.component.scss'
})
export class BookDialogComponent implements OnInit {
  public tip!: string;
  public book!: Knjiga
  public bookstore!: Knjizara
  public currUser!: User
  public naslovInput!: HTMLInputElement;
  public isbnInput!: HTMLInputElement;
  public autorInput!: HTMLInputElement;
  public izdavacInput!: HTMLInputElement;
  public zanrInput!: HTMLInputElement;
  public godinaInput!: HTMLInputElement;
  public cenaInput!: HTMLInputElement;

  public btnEnabled: boolean = false;
  putanjaDoSlike!: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private store: Store<AppState>, private service: KnjigaService, private snackBar: MatSnackBar) { }
  ngOnInit(): void {
    console.log(this.data.book);
    console.log(this.data.bookstore);
    console.log(this.data.korisnik);
    this.book = this.data.book;
    this.bookstore = this.data.bookstore;
    this.currUser = this.data.korisnik;
    this.tip = this.data.tip;

    this.naslovInput = document.getElementById('naslovInput') as HTMLInputElement;
    this.isbnInput = document.getElementById('isbnInput') as HTMLInputElement;
    this.autorInput = document.getElementById('autorInput') as HTMLInputElement;
    this.izdavacInput = document.getElementById('izdavacInput') as HTMLInputElement;
    this.zanrInput = document.getElementById('zanrInput') as HTMLInputElement;
    this.godinaInput = document.getElementById('godinaInput') as HTMLInputElement;
    this.cenaInput = document.getElementById('cenaInput') as HTMLInputElement;

    if (this.tip == "Izmeni") {
      this.fillInputs();
    }
  }

  fillInputs() {
    this.naslovInput.value = this.book.naslov;
    this.isbnInput.value = this.book.isbn;
    this.autorInput.value = this.book.autor;
    this.izdavacInput.value = this.book.izdavac;
    this.zanrInput.value = this.book.zanr;
    this.godinaInput.value = this.book.godinaIzdavanja.toString();
    this.cenaInput.value = this.book.cena.toString();
  }

  izmeniKnjigu(naslov: string, isbn: string, autor: string, izdavac: string, zanr: string, godina: string, cena: string) {
    if (this.book != null) {
      if (naslov != "" && naslov != null && isbn != "" && isbn != null && autor != "" && autor != null && izdavac != "" && izdavac != null
        && zanr != "" && zanr != null && godina != "" && godina != null && cena != "" && cena != null) {

        if (this.putanjaDoSlike) {
          const k: Knjiga = {
            id: this.book.id,
            naslov: naslov,
            isbn: isbn,
            autor: autor,
            izdavac: izdavac,
            zanr: zanr,
            godinaIzdavanja: Number(godina),
            cena: Number(cena),
            slika: this.putanjaDoSlike
          }

          console.log(k);
          if (this.currUser) {

            //PAZI SAD TI OVDE DISPACUJES AKCIJU KOJA TI DODAJE KNJIGU U BAZU A ONDA ZOVES DRUGU AKCIJU KOJA TI KNJIGU DODAJE U POSTOJECU KNJIZARU TJ TAJ STATE

            this.service.izmeniKnjigu(this.currUser.id.toString(), k).subscribe((res) => {
              this.store.dispatch(updateBookInStore(
                {
                  bookId: k.id,
                  book: k,
                  bookstoreId: this.bookstore.id
                }
              ))
            })
          }
        }
        else {
          const b: Knjiga = {
            id: this.book.id,
            naslov: naslov,
            isbn: isbn,
            autor: autor,
            izdavac: izdavac,
            zanr: zanr,
            godinaIzdavanja: Number(godina),
            cena: Number(cena),
            slika: this.book.slika
          }
          console.log(b);
          if (this.currUser) {
            this.service.izmeniKnjigu(this.currUser.id.toString(), b).subscribe((res) => {
              this.store.dispatch(updateBookInStore(
                {
                  bookId: b.id,
                  book: b,
                  bookstoreId: this.bookstore.id
                }
              ))
            })
          }
        }
      } else {
        this.snackBar.open("Molimo vas popunite sva polja", 'Error', {
          duration: 5000, //mat-mdc-simple-snack-bar
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      }
    }
    else {
      this.snackBar.open("Knjiga je nema!", 'Error', {
        duration: 5000, //mat-mdc-simple-snack-bar
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }
  dodajKnjigu(naslov: string, isbn: string, autor: string, izdavac: string, zanr: string, godina: string, cena: string) {

    //e sad ovde ja treba da dispachujem akciju koja ce da pozove efekat za dodavanje u bazi i vratice mi success i tada se update store tako da se svugde doda nova knjizara
    if (naslov != "" && naslov != null && isbn != "" && isbn != null && autor != "" && autor != null && izdavac != "" && izdavac != null
      && zanr != "" && zanr != null && godina != "" && godina != null && cena != "" && cena != null) {
      if (this.putanjaDoSlike) {
        const k: Knjiga = {
          id: 0,
          naslov: naslov,
          isbn: isbn,
          autor: autor,
          izdavac: izdavac,
          zanr: zanr,
          godinaIzdavanja: Number(godina),
          cena: Number(cena),
          slika: this.putanjaDoSlike
        }
        console.log(k);

        if (this.currUser) {
          console.log(this.currUser)
          console.log(this.bookstore);
          this.service.dodajKnjigu(this.bookstore.id.toString(), this.currUser.id.toString(), k).subscribe((res) => {
            if (res) {
              console.log(res);
              //dispacujem akciju gde dodajem knjigu u bookstore
              this.store.dispatch(addBookToStore(
                {
                  bookstoreId: this.bookstore.id,
                  book: k
                }
              ))
            }
          })
        }
      }
      else {
        const b: Knjiga = {
          id: 0,
          naslov: naslov,
          isbn: isbn,
          autor: autor,
          izdavac: izdavac,
          zanr: zanr,
          godinaIzdavanja: Number(godina),
          cena: Number(cena),
          slika: "../../../../assets/images/knjige/punpun.jpg"
        }

        console.log(b);
        if (this.currUser) {

          this.service.dodajKnjigu(this.bookstore.id.toString(), this.currUser.id.toString(), b).subscribe((res) => {
            if (res) {
              console.log(res);
              //dispacujem akciju gde dodajem knjigu u bookstore
              this.store.dispatch(addBookToStore(
                {
                  bookstoreId: this.bookstore.id,
                  book: b
                }
              ))
            }
          })
        }
      }
    }
    else {
      this.snackBar.open("Molimo vas popunite sva polja", 'Error', {
        duration: 5000, //mat-mdc-simple-snack-bar
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    }
  }

  checkInputFields() {
    if (this.naslovInput && this.isbnInput && this.autorInput && this.izdavacInput && this.zanrInput && this.godinaInput && this.cenaInput) {
      this.btnEnabled = true;
    }
    else {
      this.btnEnabled = false;
    }
  }

  handleFileInput(event: any) {
    const putanja = "../assets/images/knjige/"
    const file = event.target.files[0];
    if (this.isImageFile(file)) {
      this.putanjaDoSlike = putanja + file.name;
    }

  }

  isImageFile(file: File) {
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

    const fileExtension = this.getFileExtension(file.name);
    const fileType = file.type;


    if (allowedExtensions.includes(fileExtension.toLowerCase())) {
      return true;
    }
    if (allowedMimeTypes.includes(fileType)) {
      return true;
    }

    return false;
  }

  getFileExtension(filename: string) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
  }


}
