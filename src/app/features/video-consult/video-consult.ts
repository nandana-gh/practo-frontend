import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header';
import { FooterComponent } from '../../shared/components/footer/footer';
import { VideoConsultService, VideoConsultLandingDto } from '../../core/services/video-consult';

@Component({
  selector: 'app-video-consult',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './video-consult.html',
  styleUrl: './video-consult.css'
})
export class VideoConsultComponent implements OnInit {
  landingData: VideoConsultLandingDto | null = null;
  loading = true;

  constructor(private videoConsultService: VideoConsultService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.videoConsultService.getLandingPageData().subscribe({
      next: (data) => {
        this.landingData = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load video consult landing data', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}


