import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MainApp from './src/MainApp';
import { Provider } from 'react-redux';
import { configureStore } from './src/redux/configureStore';
const store = configureStore();

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <MainApp />
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
