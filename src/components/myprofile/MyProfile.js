import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Button,
  PermissionsAndroid,
  Platform,
  Alert,
} from "react-native";
import { Styles } from "./MyProfile.styles";
import { Avatar } from '@rneui/themed';
import * as ImagePicker from "expo-image-picker";
import { capitalizeWords } from "../../utils/utils";

const MyProfile = ({ user, handleUserPhotoUpdate, t }) => {
  const askGalleryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(
      true
    );
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "This app needs access to your gallery to select photos.",
        [{ text: "OK" }]
      );
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await askGalleryPermission();
    if (!hasPermission) {
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      handleUserPhotoUpdate(result.assets[0].uri);
    }
  };

  return (
    <View>
      {user ? (
        <View>
          <View style={Styles.container}>
            <Avatar
              rounded
              showEditButton
              size="xlarge"
              source={{ uri: user.photoURL }}
            >
              <Avatar.Accessory size={50} onPress={pickImage} />
            </Avatar>
            <Text style={Styles.profileName}>{user.displayName}</Text>
          </View>
          <View style={Styles.separator} />
          <View style={Styles.infoContainer}>
            <View style={Styles.emailContainer}>
              <Text style={Styles.emailLabelText}>
                {t("screens.profile.email")}:{" "}
              </Text>
              <Text style={Styles.emailText}>{user.email}</Text>
            </View>
          </View>
        </View>
      ) : (
        <Text>{t("loading")}</Text>
      )}
    </View>
  );
};

export default MyProfile;
