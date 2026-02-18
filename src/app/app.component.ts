import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import {HeaderComponent} from "./components/header/header.component";
import {BodyComponent} from "./components/body/body.component";
import { Auth, onAuthStateChanged } from '@angular/fire/auth';
import { FireBaseService } from './services/fire-base.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, HeaderComponent],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Home loan Amortisation Calculator';
  private auth = inject(Auth);
  private firebaseService = inject(FireBaseService);

  ngOnInit(): void {
    onAuthStateChanged(this.auth, async (user) => {
      if (user) {
        await this.firebaseService.loadCurrentUser();
        await this.firebaseService.loadUserLoanDetails();
      }
    });
  }
}
