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
        //bad approach to check if it is a binary file
        console.log('Received JSON data...');
        const text = await event.data.text();
        const data = JSON.parse(text);
        
        if (data.group) {

          onMessage(data);
        } else {

          
          
          // Handle binary data (e.g., PDF, images)
          console.log('Received binary data...');
          const fileData = await event.data.arrayBuffer();
          const contentType = event.data.type;
          onMessage({ content: fileData, type: contentType });
          // Handle JSON messages
        }
        
      } catch (error) {
        console.error('Error processing message:', error);
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
      if (data instanceof ArrayBuffer) {
        // If it's binary data (file), send as Blob
        console.log('Sending binary data...', data);
        this.socket.send(data);
      } else {
        // Otherwise send as JSON
        console.log('Sending JSON data...', data);
        this.socket.send(JSON.stringify(data));
      }
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

  onConnectionStatusChange(onStatusChange: (status: boolean) => void) {
    this.socket?.addEventListener('open', () => {
      this.isConnected = true;
      onStatusChange(this.isConnected);
    });

    this.socket?.addEventListener('close', () => {
      this.isConnected = false;
      onStatusChange(this.isConnected);
    });
  }
}
