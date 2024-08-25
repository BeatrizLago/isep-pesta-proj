import React, { useState } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Overlay, Button } from "@rneui/themed";
import AutoComplete from "../../components/autoCompleteInput/AutoComplete";
import { Picker } from "@react-native-picker/picker";
import { Styles } from "./Directions.styles";

const Directions = ({
  visible,
  toggleOverlay,
  locations,
  handleSelectLocation,
  setStartLocation,
  setEndLocation,
  handleDirections,
  profile,
  setProfile,
  preference,
  setPreference,
  isStraight,
  setIsStraight,
  t,
}) => {
  const profiles = [
    { key: "wheelchair", label: t("components.directions.wheelchair") },
    { key: "driving-car", label: t("components.directions.car") },
    { key: "foot-walking", label: t("components.directions.foot") },
  ];
  const preferences = [
    { key: "fastest", label: t("components.directions.fastest") },
    { key: "shortest", label: t("components.directions.shortest") },
  ];
  const isStraightOptions = [
    { key: "true", label: t("components.directions.yes") },
    { key: "false", label: t("components.directions.no") },
  ];

  const [showPreferences, setShowPreferences] = useState(false);

  const togglePreferences = () => {
    setShowPreferences(!showPreferences);
  };

  return (
    <Overlay
      isVisible={visible}
      onBackdropPress={toggleOverlay}
      overlayStyle={Styles.overlay}
    >
      <AutoComplete
        data={locations}
        placeholder={t("components.directions.startLoc")}
        onSelect={(name) => handleSelectLocation(name, setStartLocation)}
      />
      <AutoComplete
        data={locations}
        placeholder={t("components.directions.endLoc")}
        onSelect={(name) => handleSelectLocation(name, setEndLocation)}
      />
      <View style={Styles.pickerContainer}>
        <Picker
          selectedValue={profile}
          onValueChange={(itemValue) => setProfile(itemValue)}
          style={Styles.picker}
        >
          <Picker.Item label={t("components.directions.pickMethod")} value="" />
          {profiles.map((profiles) => (
            <Picker.Item
              key={profiles.key}
              label={profiles.label}
              value={profiles.key}
            />
          ))}
        </Picker>
      </View>
      <TouchableOpacity
        onPress={togglePreferences}
        style={Styles.preferenceToggle}
      >
        <Text style={Styles.preferenceToggleText}>
          {showPreferences
            ? t("components.directions.hidePref")
            : t("components.directions.showPref")}
        </Text>
      </TouchableOpacity>

      {showPreferences && (
        <View style={Styles.preferencesContainer}>
          <Text style={Styles.label}>
            {t("components.directions.routeType")}:
          </Text>
          <Picker
            selectedValue={preference}
            onValueChange={(itemValue) => setPreference(itemValue)}
            style={Styles.picker}
          >
            <Picker.Item
              label={t("components.directions.recommended")}
              value="recommended"
            />
            {preferences.map((preferences) => (
              <Picker.Item
                key={preferences.key}
                label={preferences.label}
                value={preferences.key}
              />
            ))}
          </Picker>
          <Text style={Styles.label}>
            {t("components.directions.isStraight")}:
          </Text>
          <Picker
            selectedValue={isStraight}
            onValueChange={(itemValue) => setIsStraight(itemValue)}
            style={Styles.picker}
          >
            <Picker.Item
              label={t("components.directions.recommended")}
              value={false}
            />
            {isStraightOptions.map((isStraight) => (
              <Picker.Item
                key={isStraight.key}
                label={isStraight.label}
                value={isStraight.key}
              />
            ))}
          </Picker>
        </View>
      )}
      <Button
        title={t("components.directions.start")}
        onPress={() => {
          toggleOverlay();
          handleDirections();
        }}
        buttonStyle={Styles.button}
      />
    </Overlay>
  );
};

export default Directions;
