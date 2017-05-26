import React, {Component} from 'react';
import {StyleSheet, View, PixelRatio} from 'react-native';
import PropTypes from 'prop-types';
import {Text, Button} from 'react-native-elements';
//project dependencies
import theme from '../styles/theme'

/**
 * Apps main page.
 */
export default class Home extends Component {

  /**
   * Constructor.
   */
  constructor(props) {
    super(props);
    this.state = {}
  }

  /**
   * Search by address selected.
   */
  onPressByCityState = () => {
    this.props.navigation.navigate('AddressSearch');
  }

  /**
   * Search by GPS location.
   */
  onPressCloseToMe = () => {
    this.props.navigation.navigate('LocationSearch');
  }

  render() {
    return <View style={theme.container.center}>
      <Text h1 style={theme.text.header}>Welcome</Text>

      <View style={styles.messageContainer}>
        <Text style={theme.text.regularCenter}>How would you like to search for health facilities?</Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          raised
          onPress={this.onPressByCityState}
          icon={iconStyles.byAddress}
          buttonStyle={[theme.button.style, theme.button.width.regular]}
          textStyle={theme.button.text}
          title={`By address`}/>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          raised
          onPress={this.onPressCloseToMe}
          icon={iconStyles.byLocation}
          buttonStyle={[theme.button.style, theme.button.width.regular]}
          textStyle={theme.button.text}
          title={`Near you`}/>
      </View>
    </View>;
  }
}

// prop validation
Home.propTypes = {
  navigation: PropTypes.object
};

//styles

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: PixelRatio.getPixelSizeForLayoutSize(14)
  },
  messageContainer: {
    marginTop: PixelRatio.getPixelSizeForLayoutSize(20)
  }
});

const iconStyles = {
  byAddress: {
    ...theme.button.icon,
    type: 'font-awesome',
    name: 'road'
  },
  byLocation: {
    ...theme.button.icon,
    type: 'font-awesome',
    name: 'map-marker'
  }
}
