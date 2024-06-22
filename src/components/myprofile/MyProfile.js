import React from "react";
import { View, Text } from "react-native";

const MyProfile = ({ user, t }) => {
  return (
    <View>
      {user ? (
        <View>
          <Text>{t("screens.profile.name")}: {user.displayName}</Text>
          <Text>{t("screens.profile.email")}: {user.email}</Text>
          {user.wheelchair && (
            <>
              {user.wheelchair.width && (
                <Text>{t("screens.profile.width")}: {user.wheelchair.width} cm</Text>
              )}
              {user.wheelchair.height && (
                <Text>{t("screens.profile.height")}: {user.wheelchair.height} cm</Text>
              )}
            </>
          )}
        </View>
      ) : (
        <Text>{t("loading")}</Text>
      )}
    </View>
  );
};

export default MyProfile;
