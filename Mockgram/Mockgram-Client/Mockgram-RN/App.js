import React from 'react';
import { Provider } from 'react-redux';

import MainApp from './src/MainApp';
import store from './src/redux';
// import clearLocalStorage from './src/utils/clearSecureStore';

export default class App extends React.Component {
  componentDidMount() {
    // clearLocalStorage(['login_creds', 'userinfo', 'test']);
  }

  render() {
    return (
      <Provider store={store}>
        <MainApp />
      </Provider>
    );
  }
}
