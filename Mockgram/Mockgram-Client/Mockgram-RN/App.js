import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MainApp from './src/MainApp';
import { SecureStore } from 'expo';
import SocketIOClient from 'socket.io-client';
import baseUrl from './src/common/baseUrl';

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
      <MainApp />
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
