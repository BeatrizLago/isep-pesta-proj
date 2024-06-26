import React from "react";
import { View, Text, Image } from "react-native";
import {Styles} from "./MyProfile.styles"
import { capitalizeWords } from "../../utils/utils";

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
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={Styles.infoText}>{t("screens.profile.width")}:</Text>
                      <Text style= {{fontSize: 16}}> {user.wheelchair.width} cm</Text>
                    </View>
                  )}
                  {user.wheelchair.height && (
                    <View style={{ flexDirection: 'row' }}>
                      <Text style={Styles.infoText}>{t("screens.profile.height")}:</Text>
                      <Text style= {{fontSize: 16}}> {user.wheelchair.height} cm</Text>
                    </View>
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
