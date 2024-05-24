import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import {styles} from "./Signup.styles"
import ActivityLoader from "../../components/activityloader/ActivityLoader";
import { useDispatch } from "react-redux";
import { signUp } from "../../state/actions/authAction";
import { updateProfile } from "firebase/auth";
import { createUser } from "../../state/actions/userAction";

const Signup = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const signUpFunc = async () => {
    setLoading(true);
    try {
      dispatch(signUp(email, password));

      const displayName =
        firstName && lastName ? `${firstName} ${lastName}` : email; // If firstName and lastName are undefined or empty, use email

      await updateProfile(auth.currentUser, {
        displayName: displayName,
      });

      dispatch(createUser());

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
    <View style={styles.conatinerCredentials}>
      <KeyboardAvoidingView behavior="padding">
        <TextInput
          style={styles.inputCredentials}
          value={firstName}
          placeholder="First Name"
          autoCapitalize="none"
          onChangeText={(text) => setFirstName(text.trim())}
        ></TextInput>
        <TextInput
          style={styles.inputCredentials}
          value={lastName}
          placeholder="Last Name"
          autoCapitalize="none"
          onChangeText={(text) => setLastName(text.trim())}
        ></TextInput>
        <TextInput
          style={styles.inputCredentials}
          value={email}
          placeholder="Email"
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text.trim())}
        ></TextInput>
        <TextInput
          style={styles.inputCredentials}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize="none"
          onChangeText={(text) => setPassword(text.trim())}
        ></TextInput>
        {loading ? (
          <ActivityLoader />
        ) : (
          <>
            <Button title="Criar Conta" onPress={signUpFunc} />
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default Signup;
