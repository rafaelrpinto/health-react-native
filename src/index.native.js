import React, {Component} from 'react';
import {AppRegistry} from 'react-native';
import SplashScreen from './containers/SplashScreen'

/**
 * Function that sets up the app.
 */
module.exports = () => {
  class HealthApp extends Component {
    render() {
      return <SplashScreen/>;
    }
  }

  AppRegistry.registerComponent('HealthApp', () => HealthApp);
}
