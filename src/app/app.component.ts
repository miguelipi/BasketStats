import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainPageComponent } from './pages/main/main-page.component';

@Component({
  selector: 'app-root',
  standalone: true,

  imports: [
    RouterOutlet, 
    CommonModule,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'proyecto';
}
