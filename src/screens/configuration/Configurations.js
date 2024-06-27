import React, { useContext } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import ChangeLanguage from "../../components/changelanguage/ChangeLanguage";
import { ThemeContext } from "../../context/ThemeContext";
import { lightTheme, darkTheme } from "../../utils/themes";
import {Styles} from './Configurations.styles'

const Configurations = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <View style={[Styles.container, { backgroundColor: currentTheme.background }]}>
      <ChangeLanguage />
      <Text style={{ color: currentTheme.text }}>Configurations Screen</Text>
      <Button title="Toggle Theme" onPress={toggleTheme} />
    </View>
  );
};

export default Configurations;
