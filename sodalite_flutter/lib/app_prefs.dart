import 'package:flutter/material.dart';
import 'package:sodalite_flutter/styled_body_text.dart';
import 'package:sodalite_flutter/styled_button.dart';

class AppPrefs extends StatefulWidget {
  const AppPrefs({super.key});

  @override
  State<AppPrefs> createState() => _AppPrefsState();
}

class _AppPrefsState extends State<AppPrefs> {
  void onPressed() {
    // Handle button press
    setState(() {
      appName = appName == "Sodalite2" ? "Sodalite1" : "Sodalite2";
    });
  }

  void addCount() {
    setState(() {
      count++;
    });
  }

  int count = 0;
  String appName = "Sodalite";

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          // mainAxisAlignment: MainAxisAlignment.center,
          // crossAxisAlignment: CrossAxisAlignment.center,
          children: [
          StyledBodyText(text: "Text"),
          ],
        ),
        Row(
          // mainAxisAlignment: MainAxisAlignment.center,
          // crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Text(
              'This is a stateless widget.',
            ),
            Text("Child of Column"),
            const Expanded(child: SizedBox()),
            FilledButton(
              style: FilledButton.styleFrom(
                backgroundColor: Colors.red,
                foregroundColor: Colors.white,
              ),
              onPressed: onPressed,
              child: Text("52"),
            ),
            StyledButton(
              onPressed: addCount,
              child: Text("+"),
            ),
            Text("AppName$appName"),
            Text("Count value$count"),
          ],
        )
      ],
    );
  }
}
