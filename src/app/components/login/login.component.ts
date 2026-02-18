import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';
import { FireBaseService } from '../../services/fire-base.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  
  private auth = inject(Auth);
  private router = inject(Router);
  private firebaseService = inject(FireBaseService);

  async loginWithEmail() {
    try {
      await signInWithEmailAndPassword(this.auth, this.email, this.password);
      await this.firebaseService.loadCurrentUser();
      await this.firebaseService.loadUserLoanDetails();
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(this.auth, provider);
      await this.firebaseService.loadCurrentUser();
      await this.firebaseService.loadUserLoanDetails();
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }
}