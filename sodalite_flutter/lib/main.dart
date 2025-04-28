import 'package:flutter/material.dart';
import 'package:sodalite_flutter/home.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    //usually one per app
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurpleAccent),
        useMaterial3: true,
      ),
      home: const MyHomePage(title: 'Flutter Header Bar'),
      // home: const Sandbox(),
    );
  }
}

class Sandbox extends StatelessWidget {
  const Sandbox({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Sandbox'),
      ),
      body: Center( // Center on axis x
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center, // Center on axis y
          crossAxisAlignment: CrossAxisAlignment.center, // Center on axis x
          children: <Widget>[
            Text(
              'This is a stateless widget.',
            ),
            Text("Child of Column"),
            Container(
              color: Colors.red,
              width: 100,
              height: 100,
            ),
          ],
        ),
      ),
    );
  }
}