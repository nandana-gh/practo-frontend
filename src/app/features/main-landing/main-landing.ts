import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './main-landing.html',
  styleUrls: ['./main-landing.css']
})
export class MainLandingComponent {
  services = [
    {
      title: 'Instant Video Consult',
      subtitle: 'Connect within 60 secs',
      image: 'https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_instant_video_consulation.png',
      route: '/video-consult',
      bgClass: 'bg-video-consult'
    },
    {
      title: 'Find Doctors Near You',
      subtitle: 'Confirmed appointments',
      image: 'https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_find_doctors.png',
      route: '/find-doctors',
      bgClass: 'bg-find-doctors'
    },
    {
      title: 'Surgeries',
      subtitle: 'Safe and trusted surgery centers',
      image: 'https://www.practostatic.com/consumer-home/desktop/images/1597423628/dweb_surgeries.png',
      route: '/surgeries',
      bgClass: 'bg-surgeries'
    }
  ];
}


