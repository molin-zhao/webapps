import 'package:flutter/material.dart';

void main() => runApp(App());

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
        title: 'Mockgram',
        home: Scaffold(
          appBar: AppBar(title: Text('Mockgram')),
          body: Center(
            child: Text('Hello Mockgram'),
          ),
        ));
  }
}
