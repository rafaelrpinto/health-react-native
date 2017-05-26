import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import MapView from 'react-native-maps';
//project dependencies
import theme from '../styles/theme'

/**
 * Component that displays the map of facilities near specific coordinates.
 */
export default class FacilitiesMap extends Component {

  /**
   * Constructor.
   */
  constructor(props) {
    super(props);
    this.searchScheduled = false;
    this.state = {
      region: {
        latitude: props.latitude,
        longitude: props.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }
    }
  }

  componentWillMount() {
    this.searchFacilities();
  }

  async searchFacilities() {
    console.log(`Searching Facilities: Lat ${this.state.region.latitude} Long ${this.state.region.longitude}`);
  }

  onRegionChange = (region) => {
    this.setState({region});
    if (!this.searchScheduled) {
      this.searchScheduled = true;
      let self = this;
      setTimeout(async() => {
        await self.searchFacilities();
        this.searchScheduled = false;
      }, 1000);
    }
  }

  render() {
    return (
      <View style ={theme.container.justified}>
        <MapView.Animated style={styles.map} onRegionChange={this.onRegionChange} region={this.state.region}></MapView.Animated>
      </View>
    );
  }
}

// prop validation
FacilitiesMap.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject
  }
});
