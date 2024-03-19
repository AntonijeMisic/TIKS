import { Component, OnInit } from '@angular/core';
import { Knjizara } from '../../../shared/Models/Knjizara';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { loadBookstore, selectBookstore } from '../../../store/knjizara/knjizara.actions';
import { selectAllBookstores } from '../../../store/knjizara/knjizara.selector';
import { KnjizaraService } from '../../services/knjizara/knjizara.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { KnjizaraEffects } from '../../../store/knjizara/knjizara.effects';
import { EffectsModule } from '@ngrx/effects';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from '../../../shared/Models/User';
import { selectCurrentUser } from '../../../store/user/user.selector';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BookDialogComponent } from '../dialogs/book-dialog/book-dialog.component';
import { BookstoreDialogComponent } from '../dialogs/bookstore-dialog/bookstore-dialog.component';

@Component({
  selector: 'app-knjizare',
  standalone: true,
  imports: [CommonModule, RouterModule, MatDialogModule],
  templateUrl: './knjizare.component.html',
  styleUrl: './knjizare.component.scss',
})
export class KnjizareComponent implements OnInit {

  public knjizare$: Observable<Knjizara[]> = of([])
  currentUser: Observable<User | null> = of(null)

  constructor(private store: Store<AppState>, private dialog: MatDialog) { }
  ngOnInit(): void {
    this.store.dispatch(loadBookstore());
    this.knjizare$ = this.store.select(selectAllBookstores);

    if (this.store.select(selectCurrentUser)) {
      this.currentUser = this.store.select(selectCurrentUser)
    }
  }

  clicked(knjizara: Knjizara) {
    //dispacthujem akciju koja mi selektuje knjizaru
    this.store.dispatch(selectBookstore({ knjizaraId: knjizara.id }))
  }


  dodajKnjizaru() {
    if (this.currentUser != null) {
      const dialogRef = this.dialog.open(BookstoreDialogComponent, {
        data: {
          tip: "Dodaj",
          korisnik: this.currentUser
        }
      });
    }
  }


}
