import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

interface Faq {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-data-security',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './data-security.html',
  styleUrls: ['./data-security.css']
})
export class DataSecurityComponent implements OnInit {
  faqs: Faq[] = [
    { question: "Where is data stored and is my data safe?", answer: "Practo is built on a very secure infrastructure. Your data is stored in highly secure AWS data centers that are ISO 27001 certified." },
    { question: "Is Practo Health Records secure?", answer: "Yes, we employ 256-bit encryption for all health records. Your records are only accessible to you and the doctors you consult." },
    { question: "Can doctors/clinics on Practo see my health records?", answer: "No, they can only see the health records that you explicitly share with them during a consultation." },
    { question: "If I book an appointment on Practo for myself, does the doctor/clinic know my phone number and email id?", answer: "We share only the necessary information required for the appointment with the specific doctor/clinic." },
    { question: "How do you protect data of patients and practitioners from hacking, tampering and unauthorized access?", answer: "We conduct regular vulnerability scanning, penetration testing, and employ 24x7 monitoring to thwart unauthorized access." },
    { question: "Is my payment information secure when buying medicine/booking appointments on the app/web?", answer: "All transactions are processed through strictly PCI-DSS compliant payment gateways. We do not store your credit card details." },
    { question: "Can anyone else see my medical data?", answer: "No. Your medical data is strictly confidential and encrypted at rest." },
    { question: "Why is an OTP required for login?", answer: "OTP ensures that even if someone gets your password, they cannot access your health records without your phone." },
    { question: "Who will have access to the personal records of the patients?", answer: "Only the patient and the healthcare providers they authorize." },
    { question: "What is the procedure when the data centers face an issue?", answer: "We have automated real-time backups across multiple availability zones to ensure zero data loss." }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.fetchFaqs();
  }

  fetchFaqs(): void {
    this.http.get<Faq[]>('/api/security/faqs').subscribe({
      next: (data) => {
        this.faqs = data;
      },
      error: (err) => {
        console.error('Failed to fetch FAQs', err);
      }
    });
  }
}


