import React, { useState, useEffect } from "react";
import { View, Text, Image, Button, PermissionsAndroid, Platform } from "react-native";
import { Styles } from "./MyProfile.styles";
import { capitalizeWords } from "../../services/firebase/utils";
import * as ImagePicker from 'expo-image-picker';
import { useDispatch } from "react-redux";
import { fetchUser, updateUserPhotoURL, uploadImageToFirebase } from "../../state/actions/userAction";


const MyProfile = ({ user, t }) => {
  const dispatch = useDispatch();
  const [imageUri, setImageUri] = useState(null);


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      const imageUrl = await uploadImageToFirebase(result.assets[0].uri);
      await dispatch(updateUserPhotoURL(imageUrl));
      await dispatch(fetchUser());
    }
  };

  return (
    <View>
      {user ? (
        <View>
          <View style={Styles.container}>
            <Image
              source={{ uri: user.photoURL }}
              style={Styles.profilePicture}
            />
            <Button title="Pick an image from gallery" onPress={pickImage} />
            <Text style={Styles.profileName}>
              {capitalizeWords(user.displayName)}
            </Text>
          </View>
          <View style={Styles.separator} />
          <View style={Styles.infoContainer}>
            <View style={Styles.emailContainer}>
              <Text style={Styles.emailLabelText}>
                {t("screens.profile.email")}:{" "}
              </Text>
              <Text style={Styles.emailText}>{user.email}</Text>
            </View>
            {user.wheelchair && (
              <View style={Styles.wheelchairContainer}>
                <Image
                  source={require("../../assets/wheelchair.png")}
                  style={Styles.wheelchairPicture}
                />
                <View style={Styles.wheelchairInfoContainer}>
                  {user.wheelchair.width && (
                    <Text>
                      {t("screens.profile.width")}: {user.wheelchair.width} cm
                    </Text>
                  )}
                  {user.wheelchair.height && (
                    <Text>
                      {t("screens.profile.height")}: {user.wheelchair.height} cm
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>
        </View>
      ) : (
        <Text>{t("loading")}</Text>
      )}
    </View>
  );
};

export default MyProfile;
