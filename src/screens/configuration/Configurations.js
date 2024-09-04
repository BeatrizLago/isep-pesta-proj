import React, { useContext, useState } from "react";
import { View, Text, TextInput, Switch, TouchableOpacity } from "react-native";
import ChangeLanguage from "../../components/changelanguage/ChangeLanguage";
import { Styles } from "./Configurations.styles";
import { FIREBASE_AUTH } from "../../services/firebase/firebaseConfig";
import { ThemeContext } from "../../context/ThemeContext";
import { lightTheme, darkTheme } from "../../utils/themes";
import * as Speech from 'expo-speech';  // Importing Expo Speech
import { Ionicons } from 'react-native-vector-icons';
import { Picker } from '@react-native-picker/picker'; // Correct import for Picker

const Configurations = ({ t }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;
  const isDarkTheme = theme === 'dark';
  const [text, setText] = useState('');  // State to hold the input text
  const [language, setLanguage] = useState('en');  // State to hold the selected language

  // Handle logout
  const handleLogout = () => {
    FIREBASE_AUTH.signOut();
  };

  // Handle Text-to-Speech
  const handleTextToSpeech = () => {
    if (text) {
      Speech.speak(text, {
        language: 'en',  // Use selected language
        pitch: 1.0,
        rate: 0.75,
      });
    } else {
      alert('Please enter some text to speak.');
    }
  };

  return (
    <View style={[Styles.container, { backgroundColor: currentTheme.background }]}>
      <ChangeLanguage t={t} />
      
      {/* Theme Switch */}
      <View style={Styles.switchContainer}>
        <Text style={[Styles.switchLabel, { color: currentTheme.text }]}>
          {t("screens.profile.darkTheme")}
        </Text>
        <Switch
          value={isDarkTheme}
          onValueChange={toggleTheme}
        />
      </View>

      <Text style={[Styles.switchLabel, { color: currentTheme.text }]}>
        {t("screens.configuration.textToSpeech")}
      </Text>

      <TextInput
        style={[Styles.inputStyle, { borderColor: currentTheme.text, color: currentTheme.text }]}
        placeholder={t("screens.configuration.placeholder")}
        placeholderTextColor={currentTheme.text}
        onChangeText={setText}
        value={text}
      />

      <TouchableOpacity
        onPress={handleTextToSpeech}
        style={[Styles.speakButton, { backgroundColor: currentTheme.buttonBackground }]}
      >
        <View style={Styles.buttonContent}>
          <Text style={[Styles.speakButtonText, { color: currentTheme.text }]}>
            {t("screens.configuration.speak")}
          </Text>
          <Ionicons name="mic" size={20} color={currentTheme.text} style={Styles.icon} />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleLogout} style={Styles.logoutButton}>
        <Text style={Styles.logoutButtonText}>
          {t("screens.profile.logoutButton")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Configurations;
