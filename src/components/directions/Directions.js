import React from "react";
import { View } from "react-native";
import { Overlay, Button } from "@rneui/themed";
import AutoComplete from "../../components/autoCompleteInput/AutoComplete";
import { Picker } from "@react-native-picker/picker";

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
  t,
}) => {
  const profiles = [
    { key: "wheelchair", label: t("components.directions.wheelchair") },
    { key: "driving-car", label: t("components.directions.car") },
    { key: "foot-walking", label: t("components.directions.foot") },
  ];

  return (
    <Overlay isVisible={visible} onBackdropPress={toggleOverlay}>
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
      <View>
        <Picker
          selectedValue={profile}
          onValueChange={(itemValue) => setProfile(itemValue)}
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
      <Button
        title={t("components.directions.start")}
        onPress={() => {
          toggleOverlay();
          handleDirections();
        }}
      />
    </Overlay>
  );
};

export default Directions;
