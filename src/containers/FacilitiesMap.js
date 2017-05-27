import React, {Component} from 'react';
import {StyleSheet, ActivityIndicator, Text, View, PixelRatio} from 'react-native';
import {SideMenu, Icon, Button} from 'react-native-elements';
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
      isOpen: false,
      searchPending: false,
      searchInProgress: false,
      markers: new Map(),
      region: LocationService.getDelta(props.latitude, props.longitude, 1500)
    }

    this.toggleSideMenu = this.toggleSideMenu.bind(this)
  }

  onSideMenuChange(isOpen : boolean) {
    this.setState({isOpen: isOpen})
  }

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

      for (let facility of facilities) {
        if (!self.state.markers.has(facility.id)) {
          self.state.markers.set(facility.id, facility);
        }
      }

      this.setState({searchInProgress: false});
    }, 1000);
  }

  buildMarkers() {
    let markers = [];
    let key = 0;
    for (let [id,
      facility]of this.state.markers) {
      markers.push(<MapView.Marker
        key={key++}
        coordinate={{
        latitude: parseFloat(facility.latitude),
        longitude: parseFloat(facility.longitude)
      }}
        title={id}
        description={'Desc'}/>);
    }
    return markers;
  }

  onSearchHerePress = () => {
    console.log('Search here pressed');
    this.searchFacilities();
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
