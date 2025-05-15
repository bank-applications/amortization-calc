import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {HeaderComponent} from "./header/header.component";
import {BodyComponent} from "./body/body.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, HeaderComponent, BodyComponent],
  providers: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Home loan Amortisation Calculator';
}
