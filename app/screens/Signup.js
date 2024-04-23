import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import Styles from "../Components/Styles";
import { FIREBASE_AUTH } from "../config/Firebase.config";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateCurrentUser,
  updateProfile,
} from "firebase/auth";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const displayName =
        firstName && lastName ? `${firstName} ${lastName}` : email; // If firstName and lastName are undefined or empty, use email

      await updateProfile(auth.currentUser, {
        displayName: displayName,
      });
      console.log("Login response:", response);
      alert("Verifique o seu email");
    } catch (error) {
      console.error(error);
      alert("Criar a conta falhou: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={Styles.conatinerCredentials}>
      <KeyboardAvoidingView behavior="padding">
        <TextInput
          style={Styles.inputCredentials}
          value={firstName}
          placeholder="First Name"
          autoCapitalize="none"
          onChangeText={(text) => setFirstName(text.trim())}
        ></TextInput>
        <TextInput
          style={Styles.inputCredentials}
          value={lastName}
          placeholder="Last Name"
          autoCapitalize="none"
          onChangeText={(text) => setLastName(text.trim())}
        ></TextInput>
        <TextInput
          style={Styles.inputCredentials}
          value={email}
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text.trim())}
        ></TextInput>
        <TextInput
          style={Styles.inputCredentials}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize="none"
          onChangeText={(text) => setPassword(text.trim())}
        ></TextInput>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <Button title="Criar Conta" onPress={signUp} />
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default Signup;
