import React, { useState, useEffect } from "react";
import { View, Button, Text, TouchableOpacity } from "react-native";
import Slider from "@react-native-community/slider";
import { Styles } from "./MyWheelChair.styles";


const MyWheelChair = ({ handleWheelchairUpdate, user, t }) => {
  
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [width, setWidth] = useState(user.wheelchair.width);
  const [height, setHeight] = useState(user.wheelchair.height);

  useEffect(() => {
    setWidth(user.wheelchair.width);
    setHeight(user.wheelchair.height);
  }, [user]);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const handleUpdate = () => {
    handleWheelchairUpdate(width, height);
    toggleDropdown();
  };

  return (
    <View style={Styles.container}>
      <TouchableOpacity onPress={toggleDropdown} style={Styles.wheelchairButton}>
        <Text style={Styles.wheelchairButtonText}>{t("screens.profile.myWheelchairButton")}</Text>
      </TouchableOpacity>
      {isDropdownVisible && (
        <View style={Styles.dropdown}>
          <Slider
            style={Styles.slider}
            value={width}
            minimumValue={50}
            maximumValue={150}
            step={1}
            onValueChange={(value) => setWidth(value)}
          />
          <Text style={Styles.text}>{t("screens.profile.width")}: {width} cm</Text>
          <Slider
            style={Styles.slider}
            value={height}
            minimumValue={40}
            maximumValue={100}
            step={1}
            onValueChange={(value) => setHeight(value)}
          />
          <Text style={Styles.text}>{t("screens.profile.height")}: {height} cm</Text>
          <TouchableOpacity style={Styles.button} onPress={handleUpdate}>
            <Text style={Styles.buttonText}>{t("screens.profile.myWheelchairUpdateButton")}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default MyWheelChair;
