import React from 'react';
import {Text} from 'react-native';
import MapView from 'react-native-maps';

export default class ClusterCallout extends React.Component {
  render() {
    return (
      <MapView.Callout>
        <Text>Callout Cluster</Text>
      </MapView.Callout>
    );
  }
}
