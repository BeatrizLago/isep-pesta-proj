// ToggleSwitch.js
import React from 'react';
import { Switch, StyleSheet, View } from 'react-native';

const ToggleSwitch = ({ showMap, toggleMap }) => {
  return (
    <View style={styles.toggleContainer}>
      <Switch value={showMap} onValueChange={toggleMap} />
    </View>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
  marginRight:20
  },
});

export default ToggleSwitch;
