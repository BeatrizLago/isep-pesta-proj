import React, { useContext } from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import ChangeLanguage from "../../components/changelanguage/ChangeLanguage";
import { Styles } from "./Configurations.styles";
import { FIREBASE_AUTH } from "../../services/firebase/firebaseConfig";
import { useTranslation } from "react-i18next";

const Configurations = () => {
  const { t } = useTranslation();

  const handleLogout = () => {
    FIREBASE_AUTH.signOut();
  };

  return (
    <View>
      <ChangeLanguage t={t} />
      <TouchableOpacity onPress={handleLogout} style={Styles.logoutButton}>
        <Text style={Styles.logoutButtonText}>
          {t("screens.profile.logoutButton")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Configurations;
