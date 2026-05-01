import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export function createInterviewSocket(interviewId, onMessage) {
  const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
  const token = localStorage.getItem('smarthire_token');
  const client = new Client({
    webSocketFactory: () => new SockJS(`${base}/ws`),
    connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    reconnectDelay: 3000,
    onConnect: () => {
      client.subscribe(`/topic/interviews/${interviewId}`, (message) => onMessage(JSON.parse(message.body)));
    },
  });
  client.activate();
  return client;
}
