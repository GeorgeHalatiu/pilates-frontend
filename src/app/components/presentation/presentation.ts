import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-presentation',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './presentation.html',
  styleUrls: ['./presentation.css'],
  
})
export class Presentation { currentUser: string = localStorage.getItem('username') || 'Unknown';}