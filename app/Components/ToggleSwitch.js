// ToggleSwitch.js
import React from "react";
import { Switch, StyleSheet, View } from "react-native";
import Styles from "./Styles";

const ToggleSwitch = ({ showMap, toggleMap }) => {
  return (
    <View style={Styles.toggleContainer}>
      <Switch value={showMap} onValueChange={toggleMap} />
    </View>
  );
};

export default ToggleSwitch;
