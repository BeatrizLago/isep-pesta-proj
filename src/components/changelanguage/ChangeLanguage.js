import { View, Text, Button, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Styles } from "./ChangeLanguage.styles";
import i18n from "../../../i18n";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChangeLanguage = () => {
  const { t } = useTranslation();

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    saveData(lang);
  };

  const saveData = async (selectedLanguage) => {
    try {
      await AsyncStorage.setItem('LANGUAGE', selectedLanguage);
      console.log('saved');
    } catch {
      console.log('err in saving data');
    }
  };

  return (
    <View style={Styles.container}>
      <Text style={Styles.text}>{t("components.changeLanguage.text")}:</Text>
      <View style={Styles.flagsContainer}>
        <TouchableOpacity onPress={() => changeLang("pt")}>
          <Image
            style={Styles.image}
            source={require("../../assets/portugal.jpg")}
          ></Image>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeLang("en")}>
          <Image
            style={Styles.image}
            source={require("../../assets/uk.jpg")}
          ></Image>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangeLanguage;
