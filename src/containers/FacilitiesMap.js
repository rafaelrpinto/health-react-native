import React, {Component} from 'react';
import {StyleSheet, ActivityIndicator, Text, View, PixelRatio} from 'react-native';
import {SideMenu, Icon, Button} from 'react-native-elements';
import PropTypes from 'prop-types';
import MapView from 'react-native-maps';
//project dependencies
import theme from '../styles/theme';
import ApiClient from '../api/ApiClient';
import LocationService from '../service/LocationService'
import Marker from '../components/Marker'

/**
 * Component that displays the map of facilities near specific coordinates.
 */
export default class FacilitiesMap extends Component {

  /**
   * Constructor.
   */
  constructor(props) {
    super(props);

    this.lastZoom = 0;
    this.clusters = null;

    this.state = {
      isSideMenuOpen: false,
      searchPending: false,
      searchInProgress: false,
      facilities: [],
      region: LocationService.getRegion(props.latitude, props.longitude)
    }

  }

  /**
   * Side menu change tracker.
   */
  onSideMenuChange = (isSideMenuOpen : boolean) => {
    this.setState({isSideMenuOpen: isSideMenuOpen})
  }

  /**
   * Side menu button pressed.
   */
  toggleSideMenu = () => {
    this.onSideMenuChange(!this.state.isSideMenuOpen);
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
    if (this.lastZoom != LocationService.getZoomLevel(this.state.region)) {
      // zoom changed, the clusters must be recalculated on render
      this.clearClusters();
    }
    this.setState({region, searchPending: true});
  }

  /**
   * Search here button pressed.
   */
  onSearchHerePress = () => {
    console.log('Search here pressed');
    this.searchFacilities();
  }

  /**
   * Searched for facilities in the current coordinates.
   */
  searchFacilities = async() => {
    console.log(`Searching Facilities: Lat ${this.state.region.latitude} Long ${this.state.region.longitude}`);
    this.setState({searchInProgress: true, searchPending: false, lastSearchedRegion: this.state.region});

    //FIXME using settimeout to simulate latency and show loading icons
    let self = this;
    setTimeout(async() => {
      let facilities = await ApiClient.getNearestFacilities(self.state.region.latitude, self.state.region.longitude);
      console.log(`Retreived ${facilities.length} facilities`);

      // clears clusters for recalculation
      this.clearClusters();

      this.setState({searchInProgress: false, facilities});
    }, 2000);
  }

  /**
   * Deleted the calculated clusters
   */
  clearClusters() {
    this.clusterMap = null;
  }

  /**
   * Retreives the facillity clusters.
   * @return {Array} Array of facility clusters.
   */
  getClusterMap() {
    if (!this.clusterMap) {
      console.log(`Calculating cluster. lastZoom=${this.lastZoom} region=${JSON.stringify(this.state.region)}`);
      this.lastZoom = LocationService.getZoomLevel(this.state.region);
      this.clusterMap = LocationService.createClusters(this.state.facilities, this.state.region);
    }
    return this.clusterMap;
  }

  /**
   * Builds the map markers.
   * @return {Array} Of markers.
   */
  buildMarkers() {
    let clusterMap = this.getClusterMap();
    return clusterMap.clusters.map((point, i) => {
      return <Marker point={point} clusterIndex={clusterMap.index} zoomLevel={this.lastZoom} key={i}/>
    });
  }

  render() {

    const MenuComponent = (
      <View style={styles.menuContainer}>
        <Text>Facility type selection here!</Text>
      </View>
    )

    return (
      <SideMenu isOpen={this.state.isSideMenuOpen} onChange={this.onSideMenuChange.bind(this)} menu={MenuComponent}>
        <View style={styles.container}>
          <View style={styles.topBar}>
            <View style={styles.menuIconContainer}>
              <Icon name='reorder' onPress={this.toggleSideMenu}/>
            </View>
            <View style={styles.searchButtonContainer}>
              {!this.state.searchInProgress && this.state.searchPending && <Button
                onPress={this.onSearchHerePress}
                title="Search this area"
                icon={iconStyles.searchIcon}
                buttonStyle={theme.button.style}
                textStyle={theme.button.text}/>}
            </View>
            <View style={styles.loadingIconContainer}>
              {this.state.searchInProgress && <ActivityIndicator size="large"/>}
            </View>
          </View>
          <MapView loadingEnabled style={styles.map} onRegionChange={this.onRegionChange} region={this.state.region}>
            {this.buildMarkers()}

          </MapView>
        </View>
      </SideMenu>
    );
  }
}

// prop validation
FacilitiesMap.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject
  },
  map: {
    flex: 9
  },
  topBar: {
    flex: 0.7,
    flexDirection: 'row'
  },
  menuIconContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: PixelRatio.getPixelSizeForLayoutSize(5)
  },
  searchButtonContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingIconContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: PixelRatio.getPixelSizeForLayoutSize(5)
  },
  menuContainer: {
    flex: 1,
    paddingTop: 50
  }
});

const iconStyles = {
  searchIcon: {
    size: 16,
    type: 'font-awesome',
    name: 'search'
  }
}
