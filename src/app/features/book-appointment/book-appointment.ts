import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';

declare var Razorpay: any;

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './book-appointment.html',
  styleUrls: ['./book-appointment.css']
})
export class BookAppointmentComponent implements OnInit {
  step: 'slot-selection' | 'patient-details' | 'success' = 'slot-selection';
  
  doctorId!: number;
  doctorProfile: any = null;
  availabilitySlots: any[] = [];
  
  selectedDate: any = null;
  selectedTime: string = '';
  selectedConsultType: 'InClinic' | 'Video' = 'InClinic';
  selectedClinicId: number | null = null;

  patientForm!: FormGroup;
  isSubmitting = false;
  submitError = '';
  
  confirmedAppointmentId: number | null = null;
  confirmedFee: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder,
    private location: Location,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('doctorId');
      if (id) {
        this.doctorId = parseInt(id, 10);
        this.fetchDoctorProfile();
      }
    });

    this.route.queryParamMap.subscribe(params => {
      this.selectedTime = params.get('time') || '';
      const dateParam = params.get('date');
      if (dateParam) {
        this.selectedDate = { date: dateParam };
      }
      this.selectedConsultType = (params.get('type') as 'InClinic' | 'Video') || 'InClinic';
      const clinicId = params.get('clinicId');
      if (clinicId) {
        this.selectedClinicId = parseInt(clinicId, 10);
      }
      
      if (this.selectedTime && this.selectedDate) {
        this.step = 'patient-details';
      }
    });

    this.patientForm = this.fb.group({
      isForFamilyMember: [false],
      patientName: ['', Validators.required],
      patientAge: ['', Validators.required],
      patientGender: ['Male', Validators.required],
      reasonForVisit: ['', Validators.required]
    });
  }

  fetchDoctorProfile(): void {
    this.http.get(`/api/doctor/${this.doctorId}`).subscribe({
      next: (res: any) => {
        this.doctorProfile = res;
        // If not passed in query params, fallback to first clinic
        if (!this.selectedClinicId && res.clinics && res.clinics.length > 0) {
          this.selectedClinicId = res.clinics[0].id;
        }
        this.fetchAvailability(); // Need to fetch slots too!
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load doctor profile', err);
        this.cdr.detectChanges();
      }
    });
  }

  fetchAvailability(): void {
    const today = new Date().toISOString().split('T')[0];
    this.http.get(`/api/doctor/${this.doctorId}/availability?startDate=${today}&days=7`).subscribe({
      next: (res: any) => {
        this.availabilitySlots = res;
        if (res.length > 0 && !this.selectedDate) {
          this.selectedDate = res[0];
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load availability', err);
        this.cdr.detectChanges();
      }
    });
  }

  selectDate(dateSlot: any): void {
    this.selectedDate = dateSlot;
    this.selectedTime = '';
    this.cdr.detectChanges();
  }

  selectTime(time: string): void {
    this.selectedTime = time;
    this.cdr.detectChanges();
  }

  setConsultType(type: 'InClinic' | 'Video'): void {
    this.selectedConsultType = type;
    this.selectedTime = '';
    this.cdr.detectChanges();
  }

  goToPatientDetails(): void {
    if (!this.selectedTime) return;
    this.step = 'patient-details';
    this.cdr.detectChanges();
  }

  goBack(): void {
    if (this.step === 'patient-details' && this.doctorId) {
      this.router.navigate(['/profile', this.doctorId]);
    } else {
      this.location.back();
    }
  }

  onSubmit(): void {
    if (this.patientForm.invalid || !this.selectedTime || !this.selectedDate) return;

    this.isSubmitting = true;
    this.submitError = '';
    this.cdr.detectChanges();

    // Construct AppointmentDateTime
    const dateStr = this.selectedDate.date.split('T')[0]; // "2026-06-07"
    const appointmentDateTime = `${dateStr}T${this.selectedTime}:00Z`;

    const payload = {
      doctorId: this.doctorId,
      clinicId: this.selectedConsultType === 'InClinic' ? this.selectedClinicId : null,
      appointmentDateTime: appointmentDateTime,
      type: this.selectedConsultType === 'InClinic' ? 0 : 1, // 0 = InClinic, 1 = Video based on Enum
      reasonForVisit: this.patientForm.value.reasonForVisit,
      isForFamilyMember: this.patientForm.value.isForFamilyMember,
      patientName: this.patientForm.value.patientName,
      patientAge: this.patientForm.value.patientAge,
      patientGender: this.patientForm.value.patientGender
    };

    // Use AuthService to check authentication
    if (!this.authService.isAuthenticated()) {
      this.submitError = 'You must be logged in to book an appointment.';
      this.isSubmitting = false;
      this.cdr.detectChanges();
      return;
    }

    // HTTP Interceptor automatically attaches the token
    this.http.post('/api/appointment/book', payload).subscribe({
      next: (res: any) => {
        if (res.razorpayOrderId) {
          const options = {
            key: res.razorpayKeyId, // Dynamically use the KeyId configured on the backend
            amount: res.fee * 100, // in paise
            currency: 'INR',
            name: 'Practo Clone',
            description: 'Consultation Fee',
            order_id: res.razorpayOrderId,
            handler: (response: any) => {
              this.verifyPayment(res.razorpayOrderId, response.razorpay_payment_id, response.razorpay_signature, res.appointmentId, res.fee);
            },
            prefill: {
              name: this.patientForm.value.patientName,
              email: 'test@practo.com',
              contact: '9999999999'
            },
            theme: {
              color: '#00a6e2'
            }
          };
          const rzp = new Razorpay(options);
          
          rzp.on('payment.failed', (response: any) => {
            this.isSubmitting = false;
            this.submitError = 'Payment failed: ' + response.error.description;
            this.cdr.detectChanges();
          });
          
          rzp.open();
        } else {
          // Free appointment
          this.isSubmitting = false;
          this.confirmedAppointmentId = res.appointmentId;
          this.confirmedFee = res.fee;
          this.step = 'success';
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitError = err.error?.message || 'Failed to book appointment. Please try again.';
        this.cdr.detectChanges();
      }
    });
  }

  verifyPayment(orderId: string, paymentId: string, signature: string, appointmentId: number, fee: number) {
    const payload = {
      razorpayOrderId: orderId,
      razorpayPaymentId: paymentId,
      razorpaySignature: signature,
      type: 'Appointment',
      referenceId: appointmentId
    };

    this.http.post('/api/payment/verify', payload).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        this.confirmedAppointmentId = appointmentId;
        this.confirmedFee = fee;
        this.step = 'success';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitError = 'Payment verification failed.';
        this.cdr.detectChanges();
      }
    });
  }
}


