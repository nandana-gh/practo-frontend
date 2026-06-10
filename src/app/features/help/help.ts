import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './help.html',
  styleUrls: ['./help.css']
})
export class HelpComponent implements OnInit {
  
  constructor() { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }
}


