import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { Knjizara } from '../../../../shared/Models/Knjizara';
import { User } from '../../../../shared/Models/User';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../app.state';
import { addNewBookstore, editBookstore } from '../../../../store/knjizara/knjizara.actions';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-bookstore-dialog',
  standalone: true,
  imports: [MatDialogModule, CommonModule],
  templateUrl: './bookstore-dialog.component.html',
  styleUrl: './bookstore-dialog.component.scss'
})
export class BookstoreDialogComponent implements OnInit {
  public tip!: string;
  public bookstore!: Knjizara
  public currUser!: User
  public nazivInput!: HTMLInputElement;
  public emailInput!: HTMLInputElement;
  public telefonInput!: HTMLInputElement;
  public adresaInput!: HTMLInputElement;
  public btnEnabled: boolean = false;
  putanjaDoSlike!: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private store: Store<AppState>, private snackBar: MatSnackBar) { }
  ngOnInit(): void {
    if (this.data.bookstore) {
      console.log(this.data.bookstore);
      this.bookstore = this.data.bookstore;
    }
    this.data.korisnik.subscribe((u: User) => {
      console.log(u);
      this.currUser = u;
    });
    this.tip = this.data.tip;

    this.nazivInput = document.getElementById('nazivInput') as HTMLInputElement;
    this.adresaInput = document.getElementById('adresaInput') as HTMLInputElement;
    this.emailInput = document.getElementById('emailInput') as HTMLInputElement;
    this.telefonInput = document.getElementById('telefonInput') as HTMLInputElement;

    if (this.tip == "Izmeni") {
      this.fillInputs();
    }
  }

  fillInputs() {
    this.nazivInput.value = this.bookstore.naziv;
    this.adresaInput.value = this.bookstore.adresa;
    this.emailInput.value = this.bookstore.email;
    this.telefonInput.value = this.bookstore.telefon;

  }

  izmeniKnjizaru(naziv: string, adresa: string, telefon: string, email: string) {
    if (this.bookstore != null) {
      if (naziv != "" && naziv != null && adresa != "" && adresa != null && telefon != "" && telefon != null && email != "" && email != null) {

        if (this.putanjaDoSlike) {
          const k: Knjizara = {
            id: this.bookstore.id,
            naziv: naziv,
            adresa: adresa,
            email: email,
            telefon: telefon,
            knjige: this.bookstore.knjige,
            slika: this.putanjaDoSlike
          }

          console.log(k);
          if (this.currUser) {

            //dispacujem akciju za editovanje
            this.store.dispatch(editBookstore(
              {
                id: this.bookstore.id.toString(),
                userId: this.currUser.id.toString(),
                knjizara: k
              }))
          }
        }
        else {
          const b: Knjizara = {
            id: this.bookstore.id,
            naziv: naziv,
            adresa: adresa,
            email: email,
            telefon: telefon,
            knjige: this.bookstore.knjige,
            slika: this.bookstore.slika
          }
          console.log(b);
          if (this.currUser) {

            //dispacujem akciju za edit
            this.store.dispatch(editBookstore(
              {
                id: this.bookstore.id.toString(),
                userId: this.currUser.id.toString(),
                knjizara: b
              }))
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
  }
  dodajKnjizaru(naziv: string, adresa: string, telefon: string, email: string) {

    //e sad ovde ja treba da dispachujem akciju koja ce da pozove efekat za dodavanje u bazi i vratice mi success i tada se update store tako da se svugde doda nova knjizara
    if (naziv != "" && naziv != null && adresa != "" && adresa != null && telefon != "" && telefon != null && email != "" && email != null) {

      if (this.putanjaDoSlike) {
        const k: Knjizara = {
          id: 0,
          naziv: naziv,
          adresa: adresa,
          email: email,
          telefon: telefon,
          knjige: [],
          slika: this.putanjaDoSlike
        }


        if (this.currUser) {
          console.log(this.currUser)
          //dispacujem akciju za dodavanje
          this.store.dispatch(addNewBookstore(
            {
              userId: this.currUser.id.toString(),
              knjizara: k
            }))
        }
      }
      else {
        const b: Knjizara = {
          id: 0,
          naziv: naziv,
          adresa: adresa,
          email: email,
          telefon: telefon,
          knjige: [],
          slika: "../../../../assets/images/knjizare/laguna_delta.jpg"
        }

        if (this.currUser) {

          //dispacujem akciju za dodavanje
          this.store.dispatch(addNewBookstore(
            {
              userId: this.currUser.id.toString(),
              knjizara: b
            }))
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

  checkInputFields() {
    if (this.nazivInput && this.adresaInput && this.emailInput && this.telefonInput) {
      this.btnEnabled = true;
    }
    else {
      this.btnEnabled = false;
    }
  }

  handleFileInput(event: any) {
    const putanja = "../assets/images/knjizare/"
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
