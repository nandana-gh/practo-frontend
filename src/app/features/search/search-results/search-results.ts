import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchService, DoctorSearchDto } from '../../../core/services/search.service';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './search-results.html',
  styleUrls: ['./search-results.css']
})
export class SearchResultsComponent implements OnInit {
  private searchService = inject(SearchService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  doctors: DoctorSearchDto[] = [];
  loading = false;
  
  city = '';
  specialtySlug = '';
  query = '';
  
  // Filters
  sortBy = 'relevance';
  maxFee: number | null = null;
  consultType = '';

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.city = params['city'] || '';
      this.specialtySlug = params['specialtySlug'] || '';
      this.query = params['query'] || '';
      
      this.fetchResults();
    });
  }

  fetchResults() {
    this.loading = true;
    const params = {
      city: this.city,
      specialtySlug: this.specialtySlug,
      query: this.query,
      sortBy: this.sortBy,
      maxFee: this.maxFee,
      consultType: this.consultType
    };

    this.searchService.searchDoctors(params).subscribe({
      next: (res) => {
        this.doctors = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(type: string, value: any) {
    if (type === 'sortBy') this.sortBy = value;
    if (type === 'maxFee') this.maxFee = value;
    if (type === 'consultType') this.consultType = value;
    
    this.fetchResults();
  }
}


