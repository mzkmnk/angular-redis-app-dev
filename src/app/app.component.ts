import { Component, resource, signal, WritableSignal } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-root',
  imports: [MatButtonModule],
  template: `
    <div class="h-screen w-screen flex p-2 gap-2">

      <button mat-raised-button (click)="submit()">test submit</button>

      <div class="border border-gray-300 rounded p-2 w-1/2 overflow-y-auto">
        <h1 class="text-xl font-bold">Messages</h1>
        <p class="text-slate-600">ws/http://localhost:3000/ws</p>

        <div class="overflow-y-auto">
          @for(message of user1Messages();let i = $index; track i){
            <p>{{message}}</p>
          }
        </div>
      </div>

      <div class="border border-gray-300 rounded p-2 w-1/2 overflow-y-auto">
        <h1 class="text-xl font-bold">Messages</h1>
        <p class="text-slate-600">ws/http://localhost:3001/ws</p>

        <div class="overflow-y-auto">
          @for(message of user2Messages();let i = $index; track i){
            <p>{{message}}</p>
          }
        </div>
      </div>
    </div>
  `
})
export class AppComponent {

  wsUser1:WebSocket = new WebSocket('ws://localhost:3000/ws');
  wsUser2:WebSocket = new WebSocket('ws://localhost:3001/ws');

  user1Messages = signal<unknown[]>([]);
  user2Messages = signal<unknown[]>([]);

  ngOnInit(){
    this.fetchWebSocketInitialize(this.wsUser1,this.user1Messages);
    this.fetchWebSocketInitialize(this.wsUser2,this.user2Messages);
  }

  fetchWebSocketInitialize(ws:WebSocket,messages:WritableSignal<unknown[]>){
    // ws = new WebSocket('ws://localhost:3000/ws');
    ws.onopen = () => {
      console.log(`${ws.url} is connected`);
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(`${ws.url} received:`, data);
      messages.update(messages => [...messages, data['message']]);
    };
    ws.onclose = () => {
      console.log('disconnected');
    };
  }

  submit(){
    this.wsUser1.send('submit user1');

    // this.wsUser2.send('submit user2');
  }
}
