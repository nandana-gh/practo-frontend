import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

interface Testimonial {
  quote: string;
  authorName: string;
  authorTitle: string;
  avatarUrl: string;
}

@Component({
  selector: 'app-about-practo',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './about-practo.html',
  styleUrls: ['./about-practo.css']
})
export class AboutPractoComponent implements OnInit {
  testimonials: Testimonial[] = [
    {
      quote: "For any new doctor, the most important thing is to let people know that you have started a clinic and Practice. And the best medium for that is Practo! It has been an amazing journey since I connected with Practo.",
      authorName: "Dr. Manan Vora",
      authorTitle: "Orthopedist, Mumbai",
      avatarUrl: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
    }
  ];

  activeTestimonialIndex = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.fetchTestimonials();
  }

  fetchTestimonials(): void {
    this.http.get<Testimonial[]>('http://4.187.152.228:5000/api/about/testimonials').subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.testimonials = data;
        }
      },
      error: (err) => {
        console.error('Failed to fetch Testimonials', err);
      }
    });
  }

  nextTestimonial(): void {
    this.activeTestimonialIndex = (this.activeTestimonialIndex + 1) % this.testimonials.length;
  }

  prevTestimonial(): void {
    this.activeTestimonialIndex = (this.activeTestimonialIndex - 1 + this.testimonials.length) % this.testimonials.length;
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      // Offset for sticky headers
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }
}

