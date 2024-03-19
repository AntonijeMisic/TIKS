import { Component, OnInit } from '@angular/core';
import { Knjizara } from '../../../shared/Models/Knjizara';
import { Observable, of } from 'rxjs';
import { AppState } from '../../../app.state';
import { Store } from '@ngrx/store';
import { selectBookstore } from '../../../store/knjizara/knjizara.selector';
import { CommonModule } from '@angular/common';
import { User } from '../../../shared/Models/User';
import { selectCurrentUser } from '../../../store/user/user.selector';
import { Knjiga } from '../../../shared/Models/Knjiga';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookstoreDialogComponent } from '../dialogs/bookstore-dialog/bookstore-dialog.component';
import { PotvrdaDialogComponent } from '../dialogs/potvrda-dialog/potvrda-dialog.component';
import { deleteBookFromStore, deleteBookstore } from '../../../store/knjizara/knjizara.actions';
import { Router, RouterModule } from '@angular/router';
import { BookDialogComponent } from '../dialogs/book-dialog/book-dialog.component';
import { KnjigaService } from '../../services/knjiga/knjiga.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-knjizara',
  standalone: true,
  imports: [CommonModule, MatDialogModule, RouterModule],
  templateUrl: './knjizara.component.html',
  styleUrl: './knjizara.component.scss'
})
export class KnjizaraComponent implements OnInit {

  public knjizara$: Observable<Knjizara | null> = of(null);
  public knjizara!: Knjizara;
  currentUser: Observable<User | null> = of(null)
  public currUser!: User
  public showAddBook = false


  constructor(private store: Store<AppState>, private dialog: MatDialog, private router: Router, private service: KnjigaService) { }
  ngOnInit(): void {
    this.knjizara$ = this.store.select(selectBookstore)
    if (this.store.select(selectCurrentUser)) {
      this.currentUser = this.store.select(selectCurrentUser)
    }
    this.currentUser.subscribe((k) => {
      if (k)
        this.currUser = k
    });
    this.knjizara$.subscribe((k) => {
      if (k)
        this.knjizara = k
    });

  }

  izmeniKnjizaru() {
    if (this.currentUser !== null && this.knjizara$ !== null) {
      const responseDialogRef = this.dialog.open(BookstoreDialogComponent, {
        data: {
          tip: "Izmeni",
          korisnik: this.currentUser,
          bookstore: this.knjizara
        }
      });
    }
  }
  izbrisiKnjizaru(knjizara: Knjizara) {
    if (this.currentUser !== null && this.knjizara$ !== null) {
      const dialogRef = this.dialog.open(PotvrdaDialogComponent, {
        data: {
          tip: "Knjizara"
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        //console.log(`Dialog result: ${result}`);
        if (result == "Knjizara") {
          console.log(result);
          //zovemo akciju za brisanje knjizare!!
          this.store.dispatch(deleteBookstore(
            {
              knjizaraid: knjizara.id.toString(),
              userId: this.currUser.id.toString()
            }))
          this.router.navigateByUrl('/knjizare', { skipLocationChange: false }).then(() => { this.router.navigate(['/knjizare']) });
        }
      });
    }
  }
  izmeniKnjigu(knjiga: Knjiga) {
    if (this.currentUser !== null && knjiga !== null) {
      const responseDialogRef = this.dialog.open(BookDialogComponent, {
        data: {
          tip: "Izmeni",
          bookstore: this.knjizara,
          korisnik: this.currUser,
          book: knjiga
        }
      });
    }

  }
  izbrisiKnjigu(knjiga: Knjiga) {
    if (this.currentUser !== null && knjiga !== null) {
      const dialogRef = this.dialog.open(PotvrdaDialogComponent, {
        data: {
          tip: "Knjiga"
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        //console.log(`Dialog result: ${result}`);
        if (result == "Knjiga") {
          console.log(result);
          //zovemo akciju za brisanje knjizare!!
          if (this.currUser) {

            this.service.izbrisiKnjigu(knjiga.id.toString(), this.currUser.id.toString()).subscribe((res) => {
              this.store.dispatch(deleteBookFromStore(
                {
                  bookId: knjiga.id.toString(),
                  bookstoreId: this.knjizara.id.toString()
                }))
            })
          }
        }
      });
    }
  }
  DodajKnjigu() {
    if (this.currUser) {
      const dialogRef = this.dialog.open(BookDialogComponent, {
        data: {
          tip: "Dodaj",
          bookstore: this.knjizara,
          korisnik: this.currUser
        }
      });
    }
  }

}
