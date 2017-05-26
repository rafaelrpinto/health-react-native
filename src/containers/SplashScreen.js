import React, {Component} from 'react';
import {View, ActivityIndicator, PixelRatio} from 'react-native';
import {Text, Button} from 'react-native-elements';
//project dependencies
import CacheService from '../service/CacheService'
import AppNavigation from '../navigation/AppNavigation';
import theme from '../styles/theme'

/**
 * Spash screen that triggers the data loading.
 */
export default class SplashScreen extends Component {

  /**
   * Constructor.
   */
  constructor(props) {
    super(props);
    this.state = {
      loadComplete: false,
      error: false
    }
  }

  /**
   * Triggers the initial data load.
   */
  componentWillMount() {
    this.connect();
  }

  /**
   * Attempts to connect to the server.
   */
  async connect() {
    try {
      console.log('Loading cache...');
      await CacheService.loadCache();
      this.setState({loadComplete: true});
    } catch (err) {
      console.log(`Error loading cache: ${err}`);
      this.setState({error: true});
    }
  }

  /**
   * Try again button pressed.
   */
  onTryAgainPress = () => {
    console.log('Trying again...');
    this.setState({error: false, loadComplete: false});
    this.connect();
  }

  render() {
    // unable to get data from the server
    if (this.state.error) {
      return (
        <View style={theme.container.justified}>
          <Text h3 style={theme.text.regularCenter}>Error connecting to the server.</Text>
          <Button
            raised
            onPress={this.onTryAgainPress}
            icon={styles.tryAgainIcon}
            buttonStyle={[theme.button.style, styles.tryAgainButton]}
            textStyle={theme.button.text}
            title={`Try Again`}/>
        </View>
      );
    }

    // loading data rom the server...
    if (!this.state.loadComplete) {
      return (
        <View style={theme.container.justified}>
          <ActivityIndicator size="large"/>
          <Text h3 style={theme.text.regularCenter}>Loading data, please wait...</Text>
        </View>
      );
    }

    // data loaded, moving on...
    return (<AppNavigation/>);
  }
}

const styles = {
  tryAgainIcon: {
    ...theme.button.icon,
    type: 'font-awesome',
    name: 'refresh'
  },
  tryAgainButton: {
    marginTop: PixelRatio.getPixelSizeForLayoutSize(10)
  }
}
