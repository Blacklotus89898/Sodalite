import 'package:flutter/material.dart';
import 'dart:io'; // Import for WebSocket

class WebSocketChatWidget extends StatefulWidget {
  @override
  _WebSocketChatWidgetState createState() => _WebSocketChatWidgetState();
}

class _WebSocketChatWidgetState extends State<WebSocketChatWidget> {
  TextEditingController urlController = TextEditingController(
      text: 'ws://echo.websocket.events'); // Default WebSocket URL
  TextEditingController messageController = TextEditingController();
  WebSocket? _webSocket;
  List<String> messages = [];
  bool isConnected = false;

  // Connect to WebSocket
  Future<void> connectWebSocket() async {
    final url = urlController.text;
    try {
      _webSocket = await WebSocket.connect(url);
      setState(() {
        isConnected = true;
        messages.add("Connected to $url");
      });

      // Listen for incoming messages
      _webSocket!.listen((message) {
        setState(() {
          messages.add("Received: $message");
        });
      }, onDone: () {
        setState(() {
          isConnected = false;
          messages.add("Disconnected from $url");
        });
      }, onError: (error) {
        setState(() {
          isConnected = false;
          messages.add("Error: $error");
        });
      });
    } catch (e) {
      setState(() {
        messages.add("Failed to connect: $e");
      });
    }
  }

  // Send a message
  void sendMessage() {
    if (_webSocket != null && isConnected) {
      final message = messageController.text;
      _webSocket!.add(message);
      setState(() {
        messages.add("Sent: $message");
        messageController.clear();
      });
    }
  }

  // Disconnect WebSocket
  void disconnectWebSocket() {
    if (_webSocket != null) {
      _webSocket!.close();
      setState(() {
        isConnected = false;
        messages.add("Disconnected");
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('WebSocket Chat App'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // WebSocket URL Input
            TextField(
              controller: urlController,
              decoration: InputDecoration(
                labelText: 'WebSocket URL',
                border: OutlineInputBorder(),
              ),
              enabled: !isConnected,
            ),
            SizedBox(height: 10),

            // Connect/Disconnect Button
            Row(
              children: [
                ElevatedButton(
                  onPressed: isConnected ? null : connectWebSocket,
                  child: Text('Connect'),
                ),
                SizedBox(width: 10),
                ElevatedButton(
                  onPressed: isConnected ? disconnectWebSocket : null,
                  child: Text('Disconnect'),
                ),
              ],
            ),
            SizedBox(height: 10),

            // Message Input
            TextField(
              controller: messageController,
              decoration: InputDecoration(
                labelText: 'Enter Message',
                border: OutlineInputBorder(),
              ),
              enabled: isConnected,
            ),
            SizedBox(height: 10),

            // Send Button
            ElevatedButton(
              onPressed: isConnected ? sendMessage : null,
              child: Text('Send Message'),
            ),
            SizedBox(height: 10),

            // Messages Display
            Expanded(
              child: ListView.builder(
                itemCount: messages.length,
                itemBuilder: (context, index) {
                  return ListTile(
                    title: Text(messages[index]),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  @override
  void dispose() {
    disconnectWebSocket();
    super.dispose();
  }
}