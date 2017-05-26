import React, {Component} from 'react';
import {StyleSheet, ActivityIndicator, Button, Text} from 'react-native';
import {Grid, Row} from 'react-native-elements';
import PropTypes from 'prop-types';
import MapView from 'react-native-maps';
//project dependencies
import theme from '../styles/theme';
import ApiClient from '../api/ApiClient';
import LocationService from '../service/LocationService';

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
      searchPending: false,
      searchInProgress: false,
      region: LocationService.getDelta(props.latitude, props.longitude, 1500)
    }
  }

  /**
   * Initial data load.
   */
  componentWillMount() {
    this.searchFacilities();
  }

  /**
   * Called when the map region changes.
   */
  onRegionChange = (region) => {
    this.setState({region, searchPending: true});
  }

  /**
   * Searched for facilities in the current coordinates.
   */
  searchFacilities = async() => {
    console.log(`Searching Facilities: Lat ${this.state.region.latitude} Long ${this.state.region.longitude}`);
    this.setState({searchInProgress: true, searchPending: false});

    let facilities = await ApiClient.getNearestFacilities(this.state.region.latitude, this.state.region.longitude);
    console.log(`Retreived ${facilities.length} facilities`);

    //TODO group facilities and create markers...

    this.setState({searchInProgress: false});
  }

  render() {
    return (
      <Grid>
        {this.state.searchPending && <Row style={theme.container.justified} size={1}>
          <Button onPress={this.searchFacilities} title="Search this area" style={styles.button} color={theme.color.dark}/>
        </Row>}

        <Row size={10}>
          <MapView.Animated style={styles.map} onRegionChange={this.onRegionChange} region={this.state.region}></MapView.Animated>
        </Row>

        {this.state.searchInProgress && <Row style={styles.loading} size={1}>
          <ActivityIndicator size="large"/>
          <Text>Loading facilities...</Text>
        </Row>}
      </Grid>
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
  },
  loading: {
    ...theme.container.justified,
    flexDirection: 'row'
  }
});
