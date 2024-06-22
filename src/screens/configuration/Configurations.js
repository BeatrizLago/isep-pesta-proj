import { View, Text, Button, TouchableOpacity } from "react-native";
import React from "react";
import i18n from "../../../i18n";
import { useTranslation } from "react-i18next";

const Configurations = () => {
  const { t } = useTranslation();

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <View>
      <Text>{t("welcome")}</Text>
      <TouchableOpacity onPress={() => changeLang('pt')}>
        <Text>pt</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => changeLang('en')}>
        <Text>en</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Configurations;
