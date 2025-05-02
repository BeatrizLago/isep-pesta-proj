import React, { useEffect, useState, useContext, useCallback } from "react";
import {
    View,
    TouchableOpacity,
    Image,
    Text,
    Modal,
    StyleSheet,
    Animated,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { onAuthStateChanged } from "firebase/auth";
import { Ionicons } from "@expo/vector-icons";
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
        options: (t, openModal) => ({
            title: t("screens.map.title"),
            headerRight: () => (
                <TouchableOpacity onPress={openModal} style={{ marginRight: 10 }}>
                    <Image
                        source={require("../assets/menu.png")}
                        style={{ width: 24, height: 24 }}
                    />
                </TouchableOpacity>
            ),
        }),
        details: {
            name: "DetalhesMapa",
            component: Details,
            options: (t) => ({ title: t("screens.details.title") }),
        },
    },
    List: {
        name: "Lista",
        component: List,
        options: (t) => ({ title: t("screens.list.title") }),
        details: {
            name: "DetalhesLista",
            component: Details,
            options: (t) => ({ title: t("screens.details.title") }),
        },
    },
    Profile: {
        name: "Perfil",
        component: Profile,
        options: (t) => ({ title: t("screens.profile.title") }),
    },
    Config: {
        name: "Configurações",
        component: Configurations,
        options: (t) => ({ title: t("screens.configuration.title") }),
    },
    Login: {
        name: "Login",
        component: Login,
        options: (t) => ({ title: t("screens.login.title") }),
        details: {
            name: "Registar",
            component: Signup,
            options: (t) => ({ title: t("screens.signup.title") }),
        },
    },
};

function createNavigator(Navigator, screenConfig, t, openModal = () => {}) {
    return (
        <Navigator.Navigator>
            <Navigator.Screen
                name={screenConfig.name}
                options={screenConfig.options(t, openModal)}
            >
                {() => <screenConfig.component t={t} />}
            </Navigator.Screen>
            {screenConfig.details && (
                <Navigator.Screen
                    name={screenConfig.details.name}
                    options={screenConfig.details.options(t)}
                >
                    {() => <screenConfig.details.component t={t} />}
                </Navigator.Screen>
            )}
        </Navigator.Navigator>
    );
}

function MapLayout({ t, openModal }) {
    return createNavigator(InsideMap, screens.Map, t, openModal);
}

function ListLayout({ t }) {
    return createNavigator(InsideList, screens.List, t);
}

function ProfileLayout({ t }) {
    return createNavigator(InsideProfile, screens.Profile, t);
}

function ConfigLayout({ t }) {
    return createNavigator(InsideConfig, screens.Config, t);
}

function LoginLayout({ t }) {
    return createNavigator(LoginStack, screens.Login, t);
}

function TabLayout({ t, user, openModal }) {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === "MapaTab") {
                        iconName = focused ? "map" : "map-outline";
                    } else if (route.name === "ListaTab") {
                        iconName = focused ? "list" : "list-outline";
                    } else if (route.name === "PerfilTab") {
                        iconName = focused ? "person" : "person-outline";
                    } else if (route.name === "ConfiguraçõesTab") {
                        iconName = focused ? "settings" : "settings-outline";
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "blue",
                tabBarInactiveTintColor: "gray",
            })}
        >
            <Tab.Screen
                name="MapaTab"
                options={{ headerShown: false, title: t("screens.map.title") }}
            >
                {() => <MapLayout t={t} openModal={openModal} />}
            </Tab.Screen>
            <Tab.Screen
                name="ListaTab"
                options={{ headerShown: false, title: t("screens.list.title") }}
            >
                {() => <ListLayout t={t} />}
            </Tab.Screen>
            {!user.isAnonymous && (
                <Tab.Screen
                    name="PerfilTab"
                    options={{ headerShown: false, title: t("screens.profile.title") }}
                >
                    {() => <ProfileLayout t={t} />}
                </Tab.Screen>
            )}
            <Tab.Screen
                name="ConfiguraçõesTab"
                options={{ headerShown: false, title: t("screens.configuration.title") }}
            >
                {() => <ConfigLayout t={t} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
}

const Navigation = ({ t }) => {
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [slideAnim] = useState(new Animated.Value(250)); // Inicializa a animação
    const { currentTheme } = useContext(ThemeContext);

    const openModal = () => {
        setModalVisible(true);
        Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
        }).start();
    };

    const closeModal = () => {
        Animated.spring(slideAnim, {
            toValue: 250,
            useNativeDriver: true,
        }).start(() => setModalVisible(false));
    };

    const fetchUserData = useCallback(
        async (user) => {
            try {
                await user.reload();
                if (user.isAnonymous || user.emailVerified) {
                    dispatch(fetchUser());
                    setUser(user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error reloading user:", error);
                setUser(null);
            }
        },
        [dispatch]
    );

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            if (user) {
                fetchUserData(user);
            } else {
                setUser(null);
            }
        });
        return () => unsubscribe();
    }, [fetchUserData]);

    return (
        <>
            <NavigationContainer
                theme={{
                    colors: {
                        background: currentTheme.background,
                        border: currentTheme.background,
                        card: currentTheme.background,
                        text: currentTheme.text,
                    },
                }}
            >
                <Stack.Navigator initialRouteName="Login">
                    {user ? (
                        <Stack.Screen name="App" options={{ headerShown: false }}>
                            {() => <TabLayout t={t} user={user} openModal={openModal} />}
                        </Stack.Screen>
                    ) : (
                        <Stack.Screen name="LoginHome" options={{ headerShown: false }}>
                            {() => <LoginLayout t={t} />}
                        </Stack.Screen>
                    )}
                </Stack.Navigator>
            </NavigationContainer>

            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <Animated.View
                        style={[
                            styles.modalContent,
                            {
                                transform: [{ translateX: slideAnim }], // Aplica a animação no eixo X
                            },
                        ]}
                    >
                        <Text style={styles.modalTitle}>Menu</Text>
                        <TouchableOpacity style={styles.commentButton}>
                            <Text style={styles.buttonText}>Fotografias</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.commentButton}>
                            <Text style={styles.buttonText}>Comentários</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                            <Text style={styles.closeText}>Fechar</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-end",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        backgroundColor: "#fff",
        width: 250,
        height: "100%", // Faz o popup ocupar toda a altura
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        padding: 20,
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 1,
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    commentButton: {
        backgroundColor: "#d1d1d1", // Cor mais suave para os botões
        paddingVertical: 15,
        paddingHorizontal: 25,
        borderRadius: 25, // Bordas arredondadas
        marginBottom: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#000",
        fontSize: 14,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: "#2196F3",
        padding: 10,
        borderRadius: 8,
        alignSelf: "flex-end",
    },
    closeText: {
        color: "#fff",
    },
});

export default Navigation;
