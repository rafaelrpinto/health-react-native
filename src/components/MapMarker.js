import React from 'react';
import PropTypes from 'prop-types';
import MapView from 'react-native-maps';
import {Icon, Badge} from 'react-native-elements';
// project dependencies
import ClusterCallout from './ClusterCallout';
import FacilityCallout from './FacilityCallout';

export default class MapMarker extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      point: props.point
    }
  }

  getClusterCallout() {
    return <MapView.Marker
      onPress={() => console.log(this.state.point)}
      coordinate={{
      latitude: this.state.point.geometry.coordinates[1],
      longitude: this.state.point.geometry.coordinates[0]
    }}>
      <Badge value={this.state.point.properties.point_count}/>
      <ClusterCallout/>
    </MapView.Marker>
  }

  getSingleFacilityCallout() {
    return <MapView.Marker
      onPress={() => console.log(this.state.point)}
      coordinate={{
      latitude: this.state.point.geometry.coordinates[1],
      longitude: this.state.point.geometry.coordinates[0]
    }}>
      <Icon name='medkit' type='font-awesome'/>
      <FacilityCallout/>
    </MapView.Marker>
  }

  render() {
    if (this.state.point.properties.cluster) {
      return this.getClusterCallout();
    }
    return this.getSingleFacilityCallout();
  }
}

MapMarker.propTypes = {
  point: PropTypes.object.isRequired
};
