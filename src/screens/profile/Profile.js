import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
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
import SignLanguageWord from "../../components/signlanguageword/SignLanguageWord";

const Profile = ({ t }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.userInfo);
  const [loading, setLoading] = useState(true);

  const commonWords = [
    { word: "Hello", videoUrl: "https://media.signbsl.com/videos/asl/elementalaslconcepts/mp4/hello.mp4" },
    { word: "Thank you", videoUrl: "https://media.signbsl.com/videos/asl/startasl/mp4/thankyou.mp4" },
    { word: "Please", videoUrl: "https://media.signbsl.com/videos/asl/startasl/mp4/please.mp4" },
    { word: "Sorry", videoUrl: "https://media.signbsl.com/videos/asl/startasl/mp4/sorry.mp4" },
    { word: "Help", videoUrl: "https://media.signbsl.com/videos/asl/startasl/mp4/help.mp4" },
    { word: "Goodbye", videoUrl: "https://media.signbsl.com/videos/asl/startasl/mp4/bye.mp4" },
    { word: "Yes", videoUrl: "https://media.signbsl.com/videos/asl/startasl/mp4/yes.mp4" },
    { word: "No", videoUrl: "https://media.signbsl.com/videos/asl/startasl/mp4/no.mp4" },
    { word: "Excuse Me", videoUrl: "https://media.signbsl.com/videos/asl/startasl/mp4/excuseme.mp4" },
  ];

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

            {user.deficiency === "wheelchair" && (
              <MyWheelChair
                handleWheelchairUpdate={handleWheelchairUpdate}
                user={user}
                t={t}
              />
            )}

            {user.deficiency === "deaf" && (
              <>
                <Text style={Styles.sectionTitle}>Sign Language Dictionary</Text>
                {commonWords.map((item, index) => (
                  <SignLanguageWord key={index} word={item.word} videoUrl={item.videoUrl} />
                ))}
              </>
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default Profile;
