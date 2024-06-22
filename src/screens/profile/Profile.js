import React, { useEffect, useState, useCallback } from "react";
import { View, Button, TouchableOpacity, Text } from "react-native";
import { Styles } from "./Profile.styles";
import MyWheelChair from "../../components/mywheelchair/MyWheelChair";
import MyProfile from "../../components/myprofile/MyProfile";
import ActivityLoader from "../../components/activityloader/ActivityLoader";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUser,
  updateUserWheelchair,
} from "../../state/actions/userAction";
import { FIREBASE_AUTH } from "../../services/firebase/firebaseConfig";
import { useTranslation } from "react-i18next";


const Profile = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const user = useSelector((state) => state.user.userInfo);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        await dispatch(fetchUser());
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [dispatch, user]);

  const handleWheelchairUpdate = useCallback(
    async (width, height) => {
      setLoading(true);
      try {
        const updatedUser = {
          ...user,
          wheelchair: {
            ...user.wheelchair,
            width,
            height,
          },
        };
        await dispatch(updateUserWheelchair(updatedUser));
        await dispatch(fetchUser());
      } catch (error) {
        console.error("Error updating user data:", error);
      } finally {
        setLoading(false);
      }
    },
    [dispatch, user]
  );

  const handleLogout = () => {
    FIREBASE_AUTH.signOut();
  };
  return (
    <View style={Styles.container}>
      {loading || !user ? (
        <ActivityLoader />
      ) : (
        <>
          <MyProfile user={user} t={t}/>
          <MyWheelChair
            handleWheelchairUpdate={handleWheelchairUpdate}
            user={user}
            t={t}
          />
          <TouchableOpacity onPress={handleLogout} style={Styles.logoutButton}>
            <Text style={Styles.logoutButtonText}> {t("screens.profile.logoutButton")} </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default Profile;
