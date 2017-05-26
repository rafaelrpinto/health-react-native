import {StackNavigator} from 'react-navigation';
// project dependencies
import Home from '../containers/Home';
import LocationSearch from '../containers/LocationSearch';
import AddressSearch from '../containers/AddressSearch';

/**
 *
 * Component that sets up the app navigation.
 */
module.exports = StackNavigator({
  Home: {
    screen: Home
  },
  LocationSearch: {
    screen: LocationSearch
  },
  AddressSearch: {
    screen: AddressSearch
  }
}, {
  navigationOptions: {
    header: false,
    gesturesEnabled: false
  }
});
