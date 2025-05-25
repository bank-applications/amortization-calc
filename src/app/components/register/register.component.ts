import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';



@Component({
  selector: 'amort-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  email = '';
  password = '';
  confirmPassword = '';
  status = '';

  private auth = inject(Auth);
  private router = inject(Router);

  register() {
    if (this.password !== this.confirmPassword) {
      this.status = 'Passwords do not match';
      return;
    }
    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then(res => {
        this.status = `Registered successfully: ${res.user.email}`;
        this.router.navigate(['/login']);
      })
      .catch(err => {
        this.status = `Error: ${err.message}`;
      });
  }

}
