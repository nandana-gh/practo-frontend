import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ChatService } from '../../core/services/chat';
import { AuthService } from '../../core/services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-teleconsult-room',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './teleconsult-room.html',
  styleUrls: ['./teleconsult-room.css']
})
export class TeleconsultRoomComponent implements OnInit, OnDestroy {
  appointmentId: string = '';
  jitsiUrl!: SafeResourceUrl;
  
  activeTab: 'chat' | 'rx' | 'records' = 'chat';
  isDoctor: boolean = false;
  currentUserId: number = 0;
  patientRecords: any[] = [];

  messages$! : import('rxjs').Observable<import('../../core/services/chat').ChatMessage[]>;
  newMessage: string = '';

  prescriptionMedications: string = '';
  prescriptionInstructions: string = '';
  isSubmittingRx: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private chatService: ChatService,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.messages$ = this.chatService.messageThread$;
    this.appointmentId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.appointmentId) {
      this.router.navigate(['/']);
      return;
    }

    const user = this.authService.currentUser();
    if (user) {
      this.isDoctor = user.role === 'Doctor';
      this.currentUserId = user.userId;
    }

    // Build Jitsi iframe URL securely
    // In production, you would generate a JWT token for Jitsi.
    const roomName = `PractoClone_Consultation_${this.appointmentId}`;
    const url = `https://meet.jit.si/${roomName}#userInfo.displayName="${user?.firstName}%20${user?.lastName}"`;
    this.jitsiUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

    this.loadChatHistory();
    this.chatService.createHubConnection(this.appointmentId);

    if (this.isDoctor) {
      this.http.get<any>(`http://localhost:5016/api/Appointment/${this.appointmentId}`).subscribe({
        next: (apt) => {
          this.http.get<any[]>(`http://localhost:5016/api/MedicalRecords/patient/${apt.patientId}`).subscribe({
            next: (records) => {
              this.patientRecords = records;
            },
            error: (err) => console.error('Failed to load patient records', err)
          });
        },
        error: (err) => console.error('Failed to load appointment details', err)
      });
    }
  }

  ngOnDestroy(): void {
    this.chatService.stopHubConnection(this.appointmentId);
  }

  loadChatHistory() {
    this.http.get<any[]>(`http://localhost:5016/api/Teleconsult/${this.appointmentId}/chat-history`).subscribe({
      next: (messages) => {
        this.chatService.setInitialHistory(messages);
      },
      error: (err) => console.error('Failed to load chat history', err)
    });
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.appointmentId, this.newMessage);
      this.newMessage = '';
    }
  }

  submitPrescription() {
    if (!this.prescriptionMedications) return;
    this.isSubmittingRx = true;

    const payload = {
      appointmentId: parseInt(this.appointmentId),
      medications: this.prescriptionMedications,
      instructions: this.prescriptionInstructions
    };

    this.http.post(`http://localhost:5016/api/Teleconsult/prescription`, payload).subscribe({
      next: () => {
        alert('Prescription issued successfully!');
        this.router.navigate(['/doctor/dashboard']);
      },
      error: (err) => {
        console.error('Error issuing prescription', err);
        alert('Failed to issue prescription.');
        this.isSubmittingRx = false;
      }
    });
  }

  endConsultation() {
    const confirm = window.confirm("Are you sure you want to leave the consultation?");
    if (confirm) {
      if (this.isDoctor) {
        this.router.navigate(['/doctor/dashboard']);
      } else {
        this.router.navigate(['/patient/dashboard']);
      }
    }
  }
}
