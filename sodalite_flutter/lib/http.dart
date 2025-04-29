import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:html/parser.dart' as html;

class HttpRequestWidget extends StatefulWidget {
  @override
  _HttpRequestWidgetState createState() => _HttpRequestWidgetState();
}

class _HttpRequestWidgetState extends State<HttpRequestWidget> {
  String data = "Press the button to fetch data.";
  TextEditingController urlController = TextEditingController(
      text: 'https://www.riotgames.com/en'); // Default URL

  // Function to make an HTTP GET request and parse the webpage
  Future<void> fetchData() async {
    final url = Uri.parse(urlController.text);
    try {
      final response = await http.get(url);
      if (response.statusCode == 200) {
        final document = html.parse(response.body);
        // Extract the title of the webpage
        final title = document.querySelector('title')?.text ?? 'No title found';
        setState(() {
          data = "Title: $title";
        });
      } else {
        setState(() {
          data = "Error: ${response.statusCode}";
        });
      }
    } catch (e) {
      setState(() {
        data = "Failed to fetch data: $e";
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('HTTP Request Example'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: TextField(
                controller: urlController,
                decoration: InputDecoration(
                  labelText: 'Enter URL',
                  border: OutlineInputBorder(),
                ),
              ),
            ),
            SizedBox(height: 20),
            Text(
              data,
              textAlign: TextAlign.center,
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: fetchData,
              child: Text('Fetch Data'),
            ),
          ],
        ),
      ),
    );
  }
}