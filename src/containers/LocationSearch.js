import React, {Component} from 'react';
import {View, ActivityIndicator, PixelRatio} from 'react-native';
import {Text, Button} from 'react-native-elements';
//project dependencies
import theme from '../styles/theme';
import LocationService from '../service/LocationService';
import FacilitiesMap from './FacilitiesMap'

/**
 * Component that loads the device's location and displays the facilities map
 */
export default class LocationSearch extends Component {

  /**
   * Constructor.
   */
  constructor(props) {
    super(props);
    this.state = {
      location: null,
      error: false
    }
  }

  componentWillMount() {
    this.getCoordinates();
  }

  /**
   * Loads the device's coordinates.
   * @return {Promise} [description]
   */
  async getCoordinates() {
    try {
      let location = await LocationService.getDeviceLocation();
      this.setState({location});
    } catch (err) {
      console.log(`Error retreiving coordinates ${err}`);
      this.setState({error: true});
    }
  }

  /**
   * Try again button pressed.
   */
  onTryAgainPress = () => {
    console.log('Trying again...');
    this.setState({error: false, location: null});
    this.getCoordinates();
  }

  render() {
    // unable to get data from the server
    if (this.state.error) {
      return (
        <View style={theme.container.justified}>
          <Text h3 style={theme.text.regularCenter}>Error localizing your device.</Text>
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

    // retrieving gps coordinates...
    if (!this.state.location) {
      return (
        <View style={theme.container.justified}>
          <ActivityIndicator size="large"/>
          <Text h3 style={theme.text.regularCenter}>Locating your device, please wait...</Text>
        </View>
      );
    }

    // device located, load the map...
    return (
      <Text><FacilitiesMap latitude={this.state.location.latitude} longitude={this.state.location.longitude}/></Text>
    );
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
