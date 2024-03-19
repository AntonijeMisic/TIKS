import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/Services/auth.service';
import { CommonModule } from '@angular/common';
import ValidateForm from '../../../shared/Helpers/ValidateForms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  
  public ime = "";
  public prezime = "";
  public username = "";
  public email = "";
  public password = "";
  public repPassword = "";
  registerForm!: FormGroup

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      ime: ['', Validators.required],
      prezime: ['', Validators.required],
      email: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      repPassword: ['', Validators.required]
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      if (this.password === this.repPassword) {

        const userDto = {
          ime: this.ime,
          prezime: this.prezime,
          email: this.email,
          password: this.password,
          tip: "Korisnik",
          username: this.username
        }
        this.authService.registerUser(userDto).subscribe({
          next: (res) => {
            console.log(res)
            this.registerForm.reset();
            this.router.navigateByUrl('/login')
          },
          error: (err) => {
            console.log(err.error)
            this.snackBar.open(err.error, 'Error', {
              duration: 5000, //mat-mdc-simple-snack-bar
              horizontalPosition: 'center',
              verticalPosition: 'top',
            });
            this.registerForm.reset();
          }
        })
      }
      else{
        this.snackBar.open("Lozinke nisu iste!", 'Error', {
          duration: 5000, //mat-mdc-simple-snack-bar
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
        this.registerForm.reset();
      }
    }
    else {
      ValidateForm.validateAllFormFields(this.registerForm)
    }
  }
}
