import React, {Component} from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
  PixelRatio,
  Dimensions
} from 'react-native';
import {SideMenu, Icon, Button, Badge} from 'react-native-elements';
import PropTypes from 'prop-types';
import MapView from 'react-native-maps';
import supercluster from 'supercluster';
//project dependencies
import theme from '../styles/theme';
import ApiClient from '../api/ApiClient';

/**
 * Component that displays the map of facilities near specific coordinates.
 */
export default class FacilitiesMap extends Component {

  /**
   * Constructor.
   */
  constructor(props) {
    super(props);

    const {width, height} = Dimensions.get('window');
    const ASPECT_RATIO = width / height;
    const LATITUDE_DELTA = 0.0922;

    this.state = {
      isOpen: false,
      searchPending: false,
      searchInProgress: false,
      facilities: [],
      region: {
        latitude: props.latitude,
        longitude: props.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LATITUDE_DELTA * ASPECT_RATIO
      }
    }

    this.toggleSideMenu = this.toggleSideMenu.bind(this)
  }

  /**
   * Side menu change tracker.
   */
  onSideMenuChange(isOpen : boolean) {
    this.setState({isOpen: isOpen})
  }

  /**
   * Side menu button pressed.
   */
  toggleSideMenu() {
    this.setState({
      isOpen: !this.state.isOpen
    })
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

      //convert to geojson
      facilities = facilities.map((facility) => {
        return {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [
              parseFloat(facility.longitude),
              parseFloat(facility.latitude)
            ]
          },
          "properties": {
            "facilityId": facility.id
          }
        };
      });

      this.setState({searchInProgress: false, facilities});
    }, 2000);
  }

  /**
   * Determined the icon to be used for each marker.
   * @param  {Object} point A point in the map.
   * @param  {Integer} i      Merket index.
   * @return {Object}        A marker.
   */
  getMarkerIcon(point, i) {
    if (point.properties.cluster) {
      return <MapView.Marker
        key={i}
        onPress={() => console.log(point)}
        coordinate={{
        latitude: point.geometry.coordinates[1],
        longitude: point.geometry.coordinates[0]
      }}>
        <Badge value={point.properties.point_count}/>
      </MapView.Marker>
    } else {
      return <MapView.Marker
        key={i}
        onPress={() => console.log(point)}
        coordinate={{
        latitude: point.geometry.coordinates[1],
        longitude: point.geometry.coordinates[0]
      }}>
        <Icon name='medkit' type='font-awesome'/>
      </MapView.Marker>
    }
  }

  /**
   * Builds the map markers.
   * @return {Array} Of markers.
   */
  buildMarkers() {
    var cluster = supercluster({radius: 50, maxZoom: 20});
    cluster.load(this.state.facilities);
    let region = this.state.region;
    const padding = 0;
    let clusters = cluster.getClusters([
      region.longitude - (region.longitudeDelta * (0.5 + padding)),
      region.latitude - (region.latitudeDelta * (0.5 + padding)),
      region.longitude + (region.longitudeDelta * (0.5 + padding)),
      region.latitude + (region.latitudeDelta * (0.5 + padding))
    ], this.getZoomLevel());
    return clusters.map(this.getMarkerIcon);
  }

  /**
   * Zoom level for clustering.
   */
  getZoomLevel() {
    // http://stackoverflow.com/a/6055653
    const angle = this.state.region.longitudeDelta;
    // 0.95 for finetuning zoomlevel grouping
    return Math.round(Math.log(360 / angle) / Math.LN2);
  }

  render() {

    const MenuComponent = (
      <View style={styles.menuContainer}>
        <Text>Facility type selection here!</Text>
      </View>
    )

    return (
      <SideMenu isOpen={this.state.isOpen} onChange={this.onSideMenuChange.bind(this)} menu={MenuComponent}>
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
          <MapView showUserLocation={true} style={styles.map} onRegionChange={this.onRegionChange} region={this.state.region}>
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
