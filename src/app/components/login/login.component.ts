import { Component, inject } from '@angular/core';
import { Auth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, onAuthStateChanged, User } from '@angular/fire/auth';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FireBaseService } from '../../services/fire-base.service';


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
  private firebaseService = inject(FireBaseService);

  email = '';
  password = '';
  status = '';

  constructor() {
    onAuthStateChanged(this.auth, async (user: User | null) => {
      if (user) {
        // User is signed in (could be SSO auto-login)
        this.status = `Auto-login: ${user.email}`;
        await this.firebaseService.loadCurrentUser();
        await this.firebaseService.loadUserLoanDetails();
        this.router.navigate(['dashboard']);
      }
    });
  }

  loginWithEmail() {
    signInWithEmailAndPassword(this.auth, this.email, this.password)
      .then(async res => {
        this.status = `Logged in: ${res.user.email}`;
        await this.firebaseService.loadCurrentUser();
        await this.firebaseService.loadUserLoanDetails(); 
        this.router.navigate(['dashboard']); // 👈 navigate to dashboard
      })
      .catch(err => this.status = `Error: ${err.message}`);
  }

  loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.auth, provider)
      .then(async res => {
        this.status = `Google login success: ${res.user.email}`;
        await this.firebaseService.loadCurrentUser();
        await this.firebaseService.loadUserLoanDetails(); 
        this.router.navigate(['dashboard']); // 👈 navigate to dashboard

      })
      .catch(err => this.status = `Google login error: ${err.message}`);
  }
}
