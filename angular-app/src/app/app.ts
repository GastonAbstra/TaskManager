import { Component, OnInit, signal, inject } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, RouterOutlet],
  templateUrl: './app.html'
})
export class App{
  
}
