import 'package:flutter/material.dart';
import 'package:sodalite_flutter/app_prefs.dart';
import 'package:sodalite_flutter/styled_body_text.dart';

class MyHomePage extends StatelessWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: Text(
            title,
            style: TextStyle(
              color: Theme.of(context).colorScheme.onPrimary,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          backgroundColor: Theme.of(context).colorScheme.primary,
          centerTitle: true,
          actions: [
            Padding(
              padding: const EdgeInsets.only(right: 8.0),
              child: Center(
                child: Image.asset(
                  'assets/Blacklotus.jpg', // Replace with your image path
                  height: 40,
                  width: 40,
                  colorBlendMode: BlendMode.multiply,
                ),
              ),
            ),
          ],
        ),
        body: Column(
          // mainAxisAlignment: MainAxisAlignment.center, // Center on axis y
          crossAxisAlignment: CrossAxisAlignment.stretch, // Center on axis y
          children: [
            Container(
              color: Colors.red,
              child: StyledBodyText(text: "Text"),
            ),
            Container(
              color: Colors.blue,
              width: 100,
              // height: 100,
              alignment: Alignment.center,
              child: const AppPrefs(),
            ),
            Expanded(
              child: Image.asset("assets/Blacklotus.jpg",
              fit: BoxFit.fitWidth,
              alignment: Alignment.bottomCenter,
              )
              ),
          ],
        ));
  }
}
