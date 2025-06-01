import { Component, inject } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';





@Component({
  selector: 'amort-login',
  imports: [
    FormsModule, RouterModule
  ],
  templateUrl: 'login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  private auth = inject(Auth);
  private router = inject(Router);


  email = '';
  password = '';
  status = '';

  loginWithEmail() {
    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then(res => {
        this.status = `Logged in: ${res.user.email}`;
        this.router.navigate(['dashboard']); // 👈 navigate to dashboard
      })
      .catch(err => this.status = `Error: ${err.message}`);
  }

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then(res => {
        this.status = `Google login success: ${res.user.email}`;

        this.router.navigate(['dashboard']); // 👈 navigate to dashboard

      })
      .catch(err => this.status = `Google login error: ${err.message}`);
  }
}
