import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native'
import MapView from 'react-native-maps';
import {Icon, Badge} from 'react-native-elements';
import PropTypes from 'prop-types';
import {titleCase} from 'change-case';
//project dependencies
import LocationService from '../service/LocationService';
import theme from '../styles/theme'

/**
 * Map marker.
 */
export default class Marker extends Component {

  /**
   * Constructor.
   */
  constructor(props) {
    super(props);
  }

  updateProps = () => {
    if (this.props.point.properties.cluster) {
      this.icon = <Badge value={this.props.point.properties.point_count}/>;
      this.onPressMarker = this.onPressClusterMarker;
      this.getCallout = this.getClusterCallout;
    } else {
      this.icon = <Icon name='add-location'/>;
      this.onPressMarker = this.onPressFacilityMarker;
      this.getCallout = this.getFacilityCallout;
    }
  }

  getClusterCallout = () => {

    let facilities = LocationService.getClusterFacilities(this.props.point, this.props.clusterIndex, this.props.zoomLevel);

    return <MapView.Callout style={styles.calloutView}>
      <View style={styles.calloutContainer}>
        <Text style={styles.caloutTitle}>{`${facilities.length} facilities in this area`}</Text>
        <Text style={styles.caloutSubtitle}>{`(Tap for details)`}</Text>
      </View>
    </MapView.Callout>
  }

  getFacilityCallout = () => {

    let facility = this.getFacility();

    return <MapView.Callout style={styles.calloutView}>
      <View style={styles.calloutContainer}>
        <Text style={styles.caloutTitle}>{titleCase(facility.businessName)}</Text>
        <Text style={styles.caloutSubtitle}>{`(Tap for details)`}</Text>
      </View>
    </MapView.Callout>
  }

  getFacility() {
    return this.props.point.properties.facility;
  }

  onPressClusterMarker = () => {
    console.log(LocationService.getClusterFacilities(this.props.point, this.props.clusterIndex, this.props.zoomLevel));
  }

  onPressFacilityMarker = () => {
    console.log(this.props.point);
  }

  render() {
    this.updateProps();

    return <MapView.Marker
      onPress={this.onPressMarker}
      coordinate={{
      latitude: this.props.point.geometry.coordinates[1],
      longitude: this.props.point.geometry.coordinates[0]
    }}>
      {this.icon}
      {this.getCallout()}
    </MapView.Marker>

  }
}

Marker.propTypes = {
  point: PropTypes.object.isRequired,
  clusterIndex: PropTypes.object.isRequired,
  zoomLevel: PropTypes.number.isRequired
};

const styles = StyleSheet.create({
  calloutView: {
    width: 150
  },
  calloutContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    flexWrap: 'wrap'
  },
  caloutTitle: {
    ...theme.font.bold,
    color: theme.color.dark,
    textAlign: 'center',
    fontSize: 18
  },
  caloutSubtitle: {
    ...theme.font.regular,
    color: theme.color.regular,
    textAlign: 'center',
    fontSize: 14
  }
});
