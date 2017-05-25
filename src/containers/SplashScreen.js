import React, {Component} from 'react';
import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
//project dependencies
import CacheService from '../service/CacheService'

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
  async componentWillMount() {
    try {
      console.log('Loading cache...');
      await CacheService.loadCache();
      this.setState({loadComplete: true});
    } catch (err) {
      console.log(`Error loading cache: ${err}`);
      this.setState({error: true});
    }
  }

  render() {
    // unable to get data from the server
    if (this.state.error) {
      return (
        <View style={styles.container}>
          <Text>Error connecting to the server. Please try again later.</Text>
        </View>
      );
    }

    // loading data rom the server...
    if (!this.state.loadComplete) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large"/>
          <Text>Loading data, please wait...</Text>
        </View>
      );
    }

    // data loaded, moving on...
    return (
      <View style={styles.container}>
        <Text>OK!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
