import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { AuthService } from '../../../shared/Services/auth.service';
import { CommonModule } from '@angular/common';
import ValidateForm from '../../../shared/Helpers/ValidateForms';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  public username = "";
  public password = "";
  loginForm!: FormGroup

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<AppState>,
    private snackBar: MatSnackBar) { }


  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });


  }

  onLogin() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value)
      this.authService.loginUser(this.loginForm.value).subscribe({ //Nece lepo da radi kada ukucam nesto random 
        next: async (res) => {
          console.log(res);
          this.authService.storeID(res.id);
          this.loginForm.reset();
          this.router.navigateByUrl('/home', { skipLocationChange: false }).then(() => { this.router.navigate(['/home']); });
        },
        error: (err) => {
          console.log(err.error)
          this.snackBar.open(err.error, 'Error', {
            duration: 5000, //mat-mdc-simple-snack-bar
            horizontalPosition: 'center',
            verticalPosition: 'top',
          });
          this.loginForm.reset();
        }
      })
    }
    else {
      ValidateForm.validateAllFormFields(this.loginForm)
    }
  }

}
