import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth, signOut, authState } from '@angular/fire/auth';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  private auth = inject(Auth);
  private router = inject(Router);

  user$ = authState(this.auth);

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }
}