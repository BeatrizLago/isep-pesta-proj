import React, { useEffect, useState } from "react";
import { View, Button } from "react-native";
import Styles from "../Components/Styles";
import { FIREBASE_AUTH } from "../config/Firebase.config";
import MyWheelChair from "../Components/MyWheelChair";
import MyProfile from "../Components/MyProfile";
import {
  fetchUserFromFirestore,
  updateUserWheelchairInFirestore,
} from "../config/Firestore";
import ActivityLoader from "../Components/ActivityLoader";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const currentUser = FIREBASE_AUTH.currentUser;
        if (currentUser) {
          const userData = await fetchUserFromFirestore(currentUser.uid);
          setUser(userData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleWheelchairUpdate = (width, height) => {
    setLoading(true);
    try {
      const updatedUser = {
        ...user,
        wheelchair: {
          ...user.wheelchair,
          width: width,
          height: height,
        },
      };
      updateUserWheelchairInFirestore(user.id, updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error("Error updating user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    FIREBASE_AUTH.signOut();
  };

  return (
    <View style={{ flex: 1 }}>
      {user && !loading ? (
        <>
          <MyProfile user={user} />
          <MyWheelChair
            handleWheelchairUpdate={handleWheelchairUpdate}
            user={user}
          />
          <Button
            title="Logout"
            onPress={() => handleLogout()}
            style={Styles.logoutButton}
          />
        </>
      ) : (
        <ActivityLoader />
      )}
    </View>
  );
};

export default Profile;
