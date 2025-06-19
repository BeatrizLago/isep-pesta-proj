import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { styles } from "./Login.styles";
import ActivityLoader from "../../components/activityloader/ActivityLoader";
import { useDispatch, useSelector } from "react-redux";
import { signInAnonymous, signIn } from "../../state/actions/authAction";
import ChangeLanguage from "../../components/changelanguage/ChangeLanguage";
import { useNavigation } from "@react-navigation/native";

const Login = ({ t }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const auth = useSelector((state) => state.auth.user);
  const error = useSelector((state) => state.auth.error);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signInAnonymousFunc = async () => {
    setLoading(true);
    try {
      await dispatch(signInAnonymous());
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const signInFunc = async () => {
    setLoading(true);
    try {
      await dispatch(signIn(email, password));
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error) {
      alert(error);
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

                <View style={styles.buttonWrapper}>
                  <TouchableOpacity
                      style={[styles.roundedButton, { backgroundColor: '#2196F3' }]} // Exemplo de azul padrão do Button
                      onPress={signInFunc}
                  >
                    <Text style={styles.buttonText}>{t("screens.login.login")}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.buttonWrapper}>
                  <TouchableOpacity
                      style={[styles.roundedButton, { backgroundColor: '#2196F3' }]} // Exemplo de verde para registar
                      onPress={() => navigation.navigate("Registar")}
                  >
                    <Text style={styles.buttonText}>{t("screens.login.signup")}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.buttonWrapper}>
                  <TouchableOpacity
                      style={[styles.roundedButton, { backgroundColor: '#2196F3' }]}
                      onPress={signInAnonymousFunc}
                  >
                    <Text style={styles.buttonText}>{t("screens.login.anonyLogin")}</Text>
                  </TouchableOpacity>
                </View>

                <ChangeLanguage t={t} />
              </>
          )}
        </KeyboardAvoidingView>
      </View>
  );
};

export default Login;