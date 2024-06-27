import React, { useContext } from "react";
import { View, Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import ChangeLanguage from "../../components/changelanguage/ChangeLanguage";
import { Styles } from "./Configurations.styles";
import { FIREBASE_AUTH } from "../../services/firebase/firebaseConfig";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "../../context/ThemeContext";
import { lightTheme, darkTheme } from "../../utils/themes";

const Configurations = () => {
  const { t } = useTranslation();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  const handleLogout = () => {
    FIREBASE_AUTH.signOut();
  };

  return (
    <View style={[Styles.container, { backgroundColor: currentTheme.background }]}>
      <ChangeLanguage t={t} />
      <Button title="Toggle Theme" onPress={toggleTheme} />
      <TouchableOpacity onPress={handleLogout} style={Styles.logoutButton}>
        <Text style={Styles.logoutButtonText}>
          {t("screens.profile.logoutButton")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Configurations;
