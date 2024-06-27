import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { styles } from "./Login.styles";
import ActivityLoader from "../../components/activityloader/ActivityLoader";
import { useDispatch, useSelector } from "react-redux";
import { signInAnonymous, signIn } from "../../state/actions/authAction";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";
import ChangeLanguage from "../../components/changelanguage/ChangeLanguage";

const Login = ({ navigation }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth.user);
  const error = useSelector((state) => state.auth.error);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signInAnonymousFunc = async () => {
    setLoading(true);
    try {
      dispatch(signInAnonymous());
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const signInFunc = async () => {
    setLoading(true);
    try {
      dispatch(signIn(email, password));
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
  };

  useEffect(() => {
    if (error) {
      alert(error);
      // Optionally, clear error after displaying it
      // dispatch(clearError());
    }
  }, [error]);

  return (
    <View style={styles.conatinerCredentials}>
      <KeyboardAvoidingView behavior="padding">
        <TextInput
          style={styles.inputCredentials}
          value={email}
          placeholder={t("screens.login.email")}
          autoCapitalize="none"
          onChangeText={(text) => setEmail(text.trim())}
        ></TextInput>
        <TextInput
          style={styles.inputCredentials}
          value={password}
          secureTextEntry={true}
          placeholder={t("screens.login.password")}
          autoCapitalize="none"
          onChangeText={(text) => setPassword(text.trim())}
        ></TextInput>
        {loading ? (
          <ActivityLoader />
        ) : (
          <>
            <Button title={t("screens.login.login")} onPress={signInFunc} />
            <Button
              title={t("screens.login.signup")}
              onPress={() => navigation.navigate("Registar")}
            />
            <Button
              title={t("screens.login.anonyLogin")}
              onPress={signInAnonymousFunc}
            />
            <ChangeLanguage t={t} />
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;
