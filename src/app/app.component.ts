import { Component, resource, signal } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>WebSocket</h1>
    <ul>
      @for(message of messages(); let i = $index; track i){
        <li>{{ message }}</li>
      }
    </ul>
    <button (click)="test()">Test</button>
  `
})
export class AppComponent {

  ws:WebSocket;
  messages = signal<unknown[]>([]);

  constructor() {
    this.ws = new WebSocket('ws://localhost:3000/ws');
    this.ws.onopen = () => {
      console.log('connected');
    };
    this.ws.onmessage = (event) => {
      console.log('received: %s', event.data);
    };
    this.ws.onclose = () => {
      console.log('disconnected');
    };
  }

  test(){
    this.ws.send('test');
  }
}
