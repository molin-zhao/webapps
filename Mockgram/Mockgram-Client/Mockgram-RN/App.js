import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MainApp from './src/MainApp';
import { Provider } from 'react-redux';
import { configureStore } from './src/redux/configureStore';
import { SecureStore } from 'expo';
import SocketIOClient from 'socket.io-client';
import baseUrl from './src/common/baseUrl';
const store = configureStore();

export default class App extends React.Component {
  componentWillMount() {
    console.log('app starts');
    SecureStore.getItemAsync('userinfo').then((userdata) => {
      if (userdata) {
        let userinfo = JSON.parse(userdata);
        global.userinfo = userinfo;
        fetch(`${baseUrl.api}/user/token/verify`, {
          headers: {
            authorization: global.userinfo.token
          },
          method: 'GET'
        }).then(res => res.json()).then(resJson => {
          if (resJson.status !== 200) {
            // token is expired
            console.log('local token expired');
            SecureStore.deleteItemAsync('userinfo').then(() => {
              console.log('removed local userinfo storage');
              global.userinfo = null;
            });
          }
        })
      } else {
        global.userinfo = null;
      }
    })
  }

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
