import React, { useEffect, useState, useCallback } from "react";
import { View, Button, TouchableOpacity, Text, ScrollView } from "react-native";
import { Styles } from "./Profile.styles";
import MyWheelChair from "../../components/mywheelchair/MyWheelChair";
import MyProfile from "../../components/myprofile/MyProfile";
import ActivityLoader from "../../components/activityloader/ActivityLoader";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUser,
  updateUserWheelchair,
  updateUserPhotoURL,
  uploadImageToFirebase,
} from "../../state/actions/userAction";
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

  const handleUserPhotoUpdate = async (url) => {
    setLoading(true);
    try {
      const imageUrl = await uploadImageToFirebase(url);
      await dispatch(updateUserPhotoURL(imageUrl));
      await dispatch(fetchUser());
    } catch (e) {
      console.error("Error updating user photo:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={Styles.container}>
      {loading || !user ? (
        <ActivityLoader />
      ) : (
        <>
          <ScrollView>
            <MyProfile
              user={user}
              handleUserPhotoUpdate={handleUserPhotoUpdate}
              t={t}
            />
            <MyWheelChair
              handleWheelchairUpdate={handleWheelchairUpdate}
              user={user}
              t={t}
            />
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default Profile;
