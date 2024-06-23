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
import { styles } from "./Signup.styles";
import ActivityLoader from "../../components/activityloader/ActivityLoader";
import { useDispatch } from "react-redux";
import { signUp } from "../../state/actions/authAction";
import { createUser } from "../../state/actions/userAction";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const Signup = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

  const signUpFunc = async () => {
    setLoading(true);
    try {
      await dispatch(signUp(email, password, firstName, lastName));
      await dispatch(createUser()); 

      alert(t("screens.signup.alert"));
      navigation.navigate("Login");
    } catch (error) {
      console.error(error);
      alert(t("screens.signup.alertError") + error.message);
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
          placeholder={t("screens.signup.firstName")}
          autoCapitalize="none"
          onChangeText={(text) => setFirstName(text.trim())}
        ></TextInput>
        <TextInput
          style={styles.inputCredentials}
          value={lastName}
          placeholder={t("screens.signup.lastName")}
          autoCapitalize="none"
          onChangeText={(text) => setLastName(text.trim())}
        ></TextInput>
        <TextInput
          style={styles.inputCredentials}
          value={email}
          placeholder={t("screens.signup.email")}
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text.trim())}
        ></TextInput>
        <TextInput
          style={styles.inputCredentials}
          value={password}
          secureTextEntry={true}
          placeholder={t("screens.signup.password")}
          autoCapitalize="none"
          onChangeText={(text) => setPassword(text.trim())}
        ></TextInput>
        {loading ? (
          <ActivityLoader />
        ) : (
          <>
            <Button title={t("screens.signup.signup")} onPress={signUpFunc} />
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default Signup;
