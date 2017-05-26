import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Text} from 'react-native-elements';

/**
 * Component that displays the map of facilities near specific coordinates.
 */
export default class FacilitiesMap extends Component {

  /**
   * Constructor.
   */
  constructor(props) {
    super(props);
    this.state = {
      latitude: props.latitude,
      longitude: props.longitude
    }
  }

  render() {
    return <Text>Facilities Map. Lat: {this.state.latitude}
      Long: {this.state.longitude}
    </Text>;
  }
}

// prop validation
FacilitiesMap.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired
};
