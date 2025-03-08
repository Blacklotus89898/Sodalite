export class WebSocketService {
  private socket: WebSocket | null = null;
  private isConnected: boolean = false;
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  connect(onMessage: (data: unknown) => void) {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      this.isConnected = true;
      console.log('WebSocket connected');
    };

    this.socket.onmessage = async (event) => {
      try {
        const text = await event.data.text();
        const data = JSON.parse(text);
        onMessage(data);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = () => {
      this.isConnected = false;
      console.log('WebSocket connection closed');
    };
  }

  send(data: unknown) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  close() {
    if (this.socket) {
      this.socket.close();
      this.isConnected = false;
    }
  }

  reconnect(onMessage: (data: unknown) => void) {
    this.close();
    this.connect(onMessage);
  }

  getConnectionStatus(): boolean {
    return this.isConnected;
  }
}