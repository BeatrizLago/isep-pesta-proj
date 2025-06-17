import React, { useEffect, useState, useContext, useCallback } from "react";
import { View, TouchableOpacity, Image, Text, Modal, StyleSheet, Animated } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { onAuthStateChanged } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Login from "../screens/login/Login";
import Signup from "../screens/signup/Signup";
import Home from "../screens/home/Home";
import List from "../screens/list/List";
import Details from "../screens/details/Details";
import Configurations from "../screens/configuration/Configurations";
import Profile from "../screens/profile/Profile";
import { FIREBASE_AUTH } from "../services/firebase/firebaseConfig";
import { useDispatch } from "react-redux";
import { fetchUser } from "../state/actions/userAction";
import { ThemeContext } from "../context/ThemeContext";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const InsideMap = createNativeStackNavigator();
const InsideList = createNativeStackNavigator();
const InsideProfile = createNativeStackNavigator();
const InsideConfig = createNativeStackNavigator();
const LoginStack = createNativeStackNavigator();

const screens = {
    Map: {
        name: "Mapa",
        component: Home,
        options: (t) => ({
            title: t("screens.map.title"),
        }),
        details: {
            name: "DetalhesMapa",
            component: Details,
            options: (t) => ({ title: t("screens.details.title") })
        }
    },
    List: {
        name: "Lista",
        component: List,
        options: (t) => ({ title: t("screens.list.title") }),
        details: {
            name: "DetalhesLista",
            component: Details,
            options: (t) => ({ title: t("screens.details.title") })
        }
    },
    Profile: {
        name: "Perfil",
        component: Profile,
        options: (t) => ({ title: t("screens.profile.title") })
    },
    Config: {
        name: "Configurações",
        component: Configurations,
        options: (t) => ({ title: t("screens.configuration.title") })
    },
    Login: {
        name: "Login",
        component: Login,
        options: (t) => ({ title: t("screens.login.title") }),
        details: {
            name: "Registar",
            component: Signup,
            options: (t) => ({ title: t("screens.signup.title") })
        }
    }
};

function createNavigator(Navigator, screenConfig, t) {
    return (
        <Navigator.Navigator>
            <Navigator.Screen
                name={screenConfig.name}
                options={screenConfig.options(t)}>
                {() => <screenConfig.component t={t} />}
            </Navigator.Screen>
            {screenConfig.details && (
                <Navigator.Screen
                    name={screenConfig.details.name}
                    options={screenConfig.details.options(t)}>
                    {() => <screenConfig.details.component t={t} />}
                </Navigator.Screen>
            )}
        </Navigator.Navigator>
    );
}

function MapLayout({ t }) { return createNavigator(InsideMap, screens.Map, t); }
function ListLayout({ t }) { return createNavigator(InsideList, screens.List, t); }
function ProfileLayout({ t }) { return createNavigator(InsideProfile, screens.Profile, t); }
function ConfigLayout({ t }) { return createNavigator(InsideConfig, screens.Config, t); }

// Definimos o componente LoginLayout diretamente, sem a função de envolvimento `createNavigator` aqui.
// Isto é porque `LoginLayoutComponent` já retorna o `LoginStack.Navigator` completo.
function LoginLayoutComponent({ t }) {
    return (
        <LoginStack.Navigator>
            <LoginStack.Screen
                name={screens.Login.name}
                options={screens.Login.options(t)}
            >
                {() => <screens.Login.component t={t} />}
            </LoginStack.Screen>
            {screens.Login.details && (
                <LoginStack.Screen
                    name={screens.Login.details.name}
                    options={screens.Login.details.options(t)}
                >
                    {() => <screens.Login.details.component t={t} />}
                </LoginStack.Screen>
            )}
        </LoginStack.Navigator>
    );
}


function TabLayout({ t, user }) {
    return (
        <Tab.Navigator screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === "MapaTab") iconName = focused ? "map" : "map-outline";
                else if (route.name === "ListaTab") iconName = focused ? "list" : "list-outline";
                else if (route.name === "PerfilTab") iconName = focused ? "person" : "person-outline";
                else if (route.name === "ConfiguraçõesTab") iconName = focused ? "settings" : "settings-outline";
                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "blue",
            tabBarInactiveTintColor: "gray"
        })}>
            <Tab.Screen name="MapaTab" options={{ headerShown: false, title: t("screens.map.title") }}>
                {() => <MapLayout t={t} />}
            </Tab.Screen>
            <Tab.Screen name="ListaTab" options={{ headerShown: false, title: t("screens.list.title") }}>
                {() => <ListLayout t={t} />}
            </Tab.Screen>
            {!user.isAnonymous && (
                <Tab.Screen name="PerfilTab" options={{ headerShown: false, title: t("screens.profile.title") }}>
                    {() => <ProfileLayout t={t} />}
                </Tab.Screen>
            )}
            <Tab.Screen name="ConfiguraçõesTab" options={{ headerShown: false, title: t("screens.configuration.title") }}>
                {() => <ConfigLayout t={t} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
}

const Navigation = ({ t }) => {
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);

    const [photoModalVisible, setPhotoModalVisible] = useState(false);
    const [commentModalVisible, setCommentModalVisible] = useState(false);

    const [slidePhotoAnim] = useState(new Animated.Value(250));
    const [slideCommentAnim] = useState(new Animated.Value(250));
    const [fadePhoto] = useState(new Animated.Value(0));
    const [fadeComment] = useState(new Animated.Value(0));

    const { currentTheme } = useContext(ThemeContext);

    const openPhotoModal = () => {
        setPhotoModalVisible(true);
        Animated.parallel([
            Animated.spring(slidePhotoAnim, { toValue: 0, useNativeDriver: true }),
            Animated.timing(fadePhoto, { toValue: 1, duration: 200, useNativeDriver: true })
        ]).start();
    };
    const closePhotoModal = () => {
        Animated.parallel([
            Animated.spring(slidePhotoAnim, { toValue: 250, useNativeDriver: true }),
            Animated.timing(fadePhoto, { toValue: 0, duration: 200, useNativeDriver: true })
        ]).start(() => setPhotoModalVisible(false));
    };

    const openCommentModal = () => {
        setCommentModalVisible(true);
        Animated.parallel([
            Animated.spring(slideCommentAnim, { toValue: 0, useNativeDriver: true }),
            Animated.timing(fadeComment, { toValue: 1, duration: 200, useNativeDriver: true })
        ]).start();
    };
    const closeCommentModal = () => {
        Animated.parallel([
            Animated.spring(slideCommentAnim, { toValue: 250, useNativeDriver: true }),
            Animated.timing(fadeComment, { toValue: 0, duration: 200, useNativeDriver: true })
        ]).start(() => setCommentModalVisible(false));
    };

    const fetchUserData = useCallback(async (u) => {
        try {
            await u.reload();
            if (u.isAnonymous || u.emailVerified) { dispatch(fetchUser()); setUser(u); } else setUser(null);
        } catch { setUser(null); }
    }, [dispatch]);

    useEffect(() => {
        const unsub = onAuthStateChanged(FIREBASE_AUTH, (u) => { if (u) fetchUserData(u); else setUser(null); });
        return () => unsub();
    }, [fetchUserData]);

    return (
        <>
            <NavigationContainer theme={{ colors: { background: currentTheme.background, border: currentTheme.background, card: currentTheme.background, text: currentTheme.text } }}>
                <Stack.Navigator initialRouteName="Login">
                    {user ? (
                        <Stack.Screen name="App" options={{ headerShown: false }}>
                            {() => <TabLayout t={t} user={user} />}
                        </Stack.Screen>
                    ) : (
                        // Correção para o warning: Usar a render prop (children)
                        <Stack.Screen name="LoginHome" options={{ headerShown: false }}>
                            {() => <LoginLayoutComponent t={t} />}
                        </Stack.Screen>
                    )}
                </Stack.Navigator>
            </NavigationContainer>

            <Modal animationType="none" transparent visible={photoModalVisible} onRequestClose={closePhotoModal}>
                <Animated.View style={[styles.modalOverlay, { opacity: fadePhoto }]}>
                    <Animated.View style={[styles.modalContent, { transform: [{ translateX: slidePhotoAnim }] }]}>
                        <Text style={styles.modalTitle}>Fotografias</Text>
                        <TouchableOpacity onPress={closePhotoModal} style={styles.closeButton}><Text style={styles.closeText}>Voltar</Text></TouchableOpacity>
                    </Animated.View>
                </Animated.View>
            </Modal>

            <Modal animationType="none" transparent visible={commentModalVisible} onRequestClose={closeCommentModal}>
                <Animated.View style={[styles.modalOverlay, { opacity: fadeComment }]}>
                    <Animated.View style={[styles.modalContent, { transform: [{ translateX: slideCommentAnim }] }]}>
                        <Text style={styles.modalTitle}>Comentários</Text>
                        <TouchableOpacity onPress={closeCommentModal} style={styles.closeButton}><Text style={styles.closeText}>Voltar</Text></TouchableOpacity>
                    </Animated.View>
                </Animated.View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    modalOverlay: { flex: 1, justifyContent: "center", alignItems: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" },
    modalContent: { backgroundColor: "#fff", width: 250, height: "100%", borderTopLeftRadius: 10, borderBottomLeftRadius: 10, padding: 20, position: "absolute", right: 0, top: 0, bottom: 0 },
    modalTitle: { fontSize: 18, marginBottom: 10 },
    closeButton: { marginTop: 20, backgroundColor: "#2196F3", padding: 10, borderRadius: 8, alignSelf: "flex-end" },
    closeText: { color: "#fff" }
});

export default Navigation;