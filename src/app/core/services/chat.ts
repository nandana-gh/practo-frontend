import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from './auth.service';

export interface ChatMessage {
  id?: number;
  senderId: number;
  message: string;
  sentAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private hubConnection: signalR.HubConnection | undefined;
  private messageThreadSource = new BehaviorSubject<ChatMessage[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();
  
  private currentUserId: number = 0;

  constructor(private authService: AuthService) {
    const user = this.authService.currentUser();
    if (user) {
      this.currentUserId = user.userId;
    }
  }

  async createHubConnection(appointmentId: string) {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://4.187.152.228:5000/chathub')
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().then(() => {
      console.log('SignalR connected for appointment: ', appointmentId);
      this.hubConnection?.invoke('JoinConsultationRoom', appointmentId);
    }).catch(error => console.log('Error connecting to SignalR: ', error));

    this.hubConnection.on('ReceiveMessage', (id: number, senderId: number, message: string, sentAt: string) => {
      const newMessage: ChatMessage = {
        id,
        senderId,
        message,
        sentAt: new Date(sentAt)
      };
      
      const currentMessages = this.messageThreadSource.value;
      this.messageThreadSource.next([...currentMessages, newMessage]);
    });
  }

  stopHubConnection(appointmentId: string) {
    if (this.hubConnection) {
      this.hubConnection.invoke('LeaveConsultationRoom', appointmentId)
        .then(() => this.hubConnection?.stop())
        .catch(error => console.log('Error stopping connection: ', error));
    }
  }

  async sendMessage(appointmentId: string, message: string) {
    if (this.hubConnection && this.currentUserId) {
      return this.hubConnection.invoke('SendMessage', appointmentId, this.currentUserId, message)
        .catch(error => console.log('Error sending message: ', error));
    }
  }

  setInitialHistory(messages: ChatMessage[]) {
    this.messageThreadSource.next(messages);
  }
}

