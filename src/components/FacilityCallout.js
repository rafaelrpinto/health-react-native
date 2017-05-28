import React from 'react';
import {Text} from 'react-native';
import MapView from 'react-native-maps';

export default class FacilityCallout extends React.Component {
  render() {
    return (
      <MapView.Callout>
        <Text>Facility Cluster</Text>
      </MapView.Callout>
    );
  }
}
