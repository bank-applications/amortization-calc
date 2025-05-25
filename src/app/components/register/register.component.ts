import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { FormsModule, NgForm } from '@angular/forms';
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
  username = '';
  status = '';

  private auth = inject(Auth);
  private router = inject(Router);

  register(form: NgForm) {
    if (!form.valid) return;

    createUserWithEmailAndPassword(this.auth, this.email, this.password)
      .then((res) => {
        this.status = `Registered: ${res.user.email}`;
        this.router.navigate(['/dashboard']); // Navigate after success
      })
      .catch((err) => {
        this.status = `Error: ${err.message}`;
      });
  }
}
