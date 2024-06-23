import React from "react";
import { View, Text, Image } from "react-native";
import {Styles} from "./MyProfile.styles"
import { capitalizeWords } from "../../services/firebase/utils";

const MyProfile = ({ user, t }) => {
  return (
    <View>
      {user ? (
        <View>
          <View style={Styles.container}>
            <Image source={require("../../assets/defaultImage.png")} style={Styles.profilePicture} />
            <Text style={Styles.profileName}>{capitalizeWords(user.displayName)}</Text>
          </View>
          <View style={Styles.separator} />
          <View style={Styles.infoContainer}>
            <View style={Styles.emailContainer}>
              <Text style={Styles.emailLabelText}>{t("screens.profile.email")}: </Text>
              <Text style={Styles.emailText}>{user.email}</Text>
            </View>
            {user.wheelchair && (
              <View style={Styles.wheelchairContainer}>
                <Image source={require("../../assets/wheelchair.png")} style={Styles.wheelchairPicture} />
                  <View style={Styles.wheelchairInfoContainer}>
                {user.wheelchair.width && (
                  <Text>{t("screens.profile.width")}: {user.wheelchair.width} cm</Text>
                )}
                {user.wheelchair.height && (
                  <Text>{t("screens.profile.height")}: {user.wheelchair.height} cm</Text>
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
