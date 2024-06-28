import React, { useContext } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity, Switch } from "react-native";
import ChangeLanguage from "../../components/changelanguage/ChangeLanguage";
import { Styles } from "./Configurations.styles";
import { FIREBASE_AUTH } from "../../services/firebase/firebaseConfig";
import { ThemeContext } from "../../context/ThemeContext";
import { lightTheme, darkTheme } from "../../utils/themes";



const Configurations = ({t}) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;
  const isDarkTheme = theme === 'dark';

  const handleLogout = () => {
    FIREBASE_AUTH.signOut();
  };

  return (
    <View style={[Styles.container, { backgroundColor: currentTheme.background }]}>
      <ChangeLanguage t={t} />
      <View style={Styles.switchContainer}>
        <Text style={[Styles.switchLabel, { color: currentTheme.text }]}>{t("screens.profile.darkTheme")}</Text>
        <Switch
          value={isDarkTheme}
          onValueChange={toggleTheme}
        />
      </View>
      <TouchableOpacity onPress={handleLogout} style={Styles.logoutButton}>
        <Text style={Styles.logoutButtonText}>
          {t("screens.profile.logoutButton")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Configurations;
