import React, {Component} from 'react';
import MapView from 'react-native-maps';
import {Icon, Badge} from 'react-native-elements';
import PropTypes from 'prop-types';
//project dependencies
import LocationService from '../service/LocationService';

/**
 * Map marker.
 */
export default class Marker extends Component {

  /**
   * Constructor.
   */
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    if (this.props.point.properties.cluster) {
      return <MapView.Marker
        onPress={() => console.log(LocationService.getClusterFacilities(this.props.point, this.props.clusterIndex, this.props.zoomLevel))}
        coordinate={{
        latitude: this.props.point.geometry.coordinates[1],
        longitude: this.props.point.geometry.coordinates[0]
      }}>
        <Badge value={this.props.point.properties.point_count}/>
      </MapView.Marker>
    }
    return <MapView.Marker
      onPress={() => console.log(this.props.point)}
      coordinate={{
      latitude: this.props.point.geometry.coordinates[1],
      longitude: this.props.point.geometry.coordinates[0]
    }}>
      <Icon name='medkit' type='font-awesome'/>
    </MapView.Marker>

  }
}

Marker.propTypes = {
  point: PropTypes.object.isRequired,
  clusterIndex: PropTypes.object.isRequired,
  zoomLevel: PropTypes.number.isRequired
};
