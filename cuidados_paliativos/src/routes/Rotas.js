import { Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomePage from "../pages/HomePage";
import Busca from "../pages/Busca";
import PerfilProntuario from "../pages/PerfilProntuario";

import SinalVerde from "../pages/SinalVerde";
import SinalAmarelo from "../pages/SinalAmarelo";
import SinalVermelho from "../pages/SinalVermelho";
import Cadastro from "../pages/Cadastro";
import Login from "../pages/Login";
import MenuSintomas from "../pages/MenuSintomas";
import DefinicaoSintomas from "../pages/DefinicaoSintomas";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator(); 

function AbasPrincipais() {
  return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: () => {
            let icon;

            if (route.name === "Home") {
              icon = require("../assets/img/Home.png");
            } else if (route.name === "Busca") {
              icon = require("../assets/img/Question.png");
            } else {
              icon = require("../assets/img/User.png");
            }

            return (
              <Image
                source={icon}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
            );
          },
          tabBarShowLabel: false,
          headerShown: false
        })}
      >
        <Tab.Screen name="Home" component={HomePage} />
        <Tab.Screen name="Busca" component={Busca} />
        <Tab.Screen name="Perfil" component={PerfilProntuario} />
      </Tab.Navigator>
  );
}

// Se nãoq quiser abrir direto no Login.js, comente a primeira function Rotas e descomente a segunda!!!

export default function Rotas() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        {/* Auth */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Cadastro" component={Cadastro} />

        {/* App */}
        <Stack.Screen name="AbasPrincipais" component={AbasPrincipais} />
        <Stack.Screen name="SinalVerde" component={SinalVerde} />
        <Stack.Screen name="SinalAmarelo" component={SinalAmarelo} />
        <Stack.Screen name="SinalVermelho" component={SinalVermelho} />
        <Stack.Screen name="MenuSintomas" component={MenuSintomas} />
        <Stack.Screen name="DefinicaoSintomas" component={DefinicaoSintomas} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
/*
export default function Rotas() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={() => {
          headerShown: false
        }}
      >
        <Stack.Screen
          name="AbasPrincipais"
          component={AbasPrincipais}
          options={{ headerShown: false }}
        />

        <Stack.Screen name="SinalVerde" component={SinalVerde} />
        <Stack.Screen name="SinalAmarelo" component={SinalAmarelo} />
        <Stack.Screen name="SinalVermelho" component={SinalVermelho} />
        <Stack.Screen name="Cadastro" component={Cadastro} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="MenuSintomas" component={MenuSintomas} />
        <Stack.Screen name="DefinicaoSintomas" component={DefinicaoSintomas} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
*/
