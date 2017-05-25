import React, {Component} from 'react';
import {StyleSheet, View, Button} from 'react-native';
//project dependencies

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

  onPressByCityState() {
    console.log(this.state);
  }

  onPressCloseToMe() {
    console.log(this.state);
  }

  render() {
    return <View style={styles.container}>
      <View>
        <Button style={styles.button} onPress={this.onPressByCityState.bind(this)} title="Find facilities by address"/>
      </View>
      <View style={styles.buttonContainer}>
        <Button onPress={this.onPressCloseToMe.bind(this)} title="Find facilities close to me"/>
      </View>
    </View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonContainer: {
    marginTop: 50
  }
});
