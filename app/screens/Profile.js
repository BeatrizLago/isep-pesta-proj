import React, { useEffect, useState } from "react";
import { View, Button, Text } from "react-native";
import Styles from "../Components/Styles";
import { FIREBASE_AUTH } from "../config/Firebase.config";
import MyWheelChair from "../Components/MyWheelChair";
import MyProfile from "../Components/MyProfile";
import {
  fetchUserFromFirestore,
  updateUserWheelchairInFirestore,
} from "../config/Firestore";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = FIREBASE_AUTH.currentUser;
      if (currentUser) {
        const userData = await fetchUserFromFirestore(currentUser.uid);
        setUser(userData);
      }
    };
    fetchUserData();
  }, []);

  const handleWheelchairUpdate = (width, height) => {
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
  };

  const handleLogout = () => {
    FIREBASE_AUTH.signOut();
  };

  return (
    <View>
      {user ? (
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
        <Text>Loading</Text>
      )}
    </View>
  );
};

export default Profile;
