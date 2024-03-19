import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { AuthService } from '../../../shared/Services/auth.service';
import { loadUser } from '../../../store/user/user.actions';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  
  constructor(private store: Store<AppState>, private authService: AuthService) { }

  ngOnInit(): void {
    let id: string | null = this.authService.getIDFromLocalStorage();
    if (id) {
      this.store.dispatch(loadUser({ id: id }))
    }
  }

}
