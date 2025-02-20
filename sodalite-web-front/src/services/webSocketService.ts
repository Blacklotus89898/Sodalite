export class WebSocketService {
  private socket: WebSocket | null = null;

  constructor(private url: string) {}

//   make the group parameter optional 
// take as arg the group name

  connect(onMessage: (data: unknown) => void) {
    this.socket = new WebSocket(this.url);

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
    }
  }
}