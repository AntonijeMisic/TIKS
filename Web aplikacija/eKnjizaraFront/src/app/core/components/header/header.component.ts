import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { AppState } from '../../../app.state';
import { User } from '../../../shared/Models/User';
import { UserService } from '../../../shared/Services/user.service';
import { selectCurrentUser } from '../../../store/user/user.selector';
import { logoutUser } from '../../../store/user/user.actions';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  currentUser: Observable<User | null> = of(null) 

  constructor(private userService: UserService, private router: Router, private store: Store<AppState>){}

  ngOnInit(): void {
    if(this.store.select(selectCurrentUser))
    {
      this.currentUser = this.store.select(selectCurrentUser)
    }
  }

  odjaviKorisnika()
  {
    this.userService.logOutUser()
    this.store.dispatch(logoutUser())
    this.router.navigateByUrl('/home', {skipLocationChange:false}).then(()=>{this.router.navigate(['/home'])});
  }

}
