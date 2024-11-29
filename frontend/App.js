import React from "react";
import "react-native-gesture-handler";
import "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import Login from "./src/components/Login";
import UserProfile from "./src/components/UserProfile";
import Account from "./src/components/Account";
import AccountUpdate from "./src/components/AccountUpdate";
import History from "./src/components/History";
import Main from "./src/components/Main";
import TermsAndConditions from "./src/components/TermsAndConditions";
import PrivacyPolicy from "./src/components/PrivacyPolicy";
import Map from "./src/components/Map";
import HomeScreen from "./src/components/HomeScreen";
import RegisterHospital from "./src/components/RegisterHospital";
import Policies from "./src/components/Policies";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />

        <Stack.Screen name="HomeScreen" component={HomeScreen} />

        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="Map" component={Map} />
        <Stack.Screen
          name="UserProfile"
          component={UserProfile}
          options={{ title: "Profile" }}
        />
        <Stack.Screen
          name="Account"
          component={Account}
          options={{ title: "Account" }}
        />
        <Stack.Screen
          name="TermsAndConditions"
          component={TermsAndConditions}
          options={{ title: "Terms & Conditions" }}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{ title: "Privacy Policy" }}
        />
        <Stack.Screen name="AccountUpdate" component={AccountUpdate} />
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="Policies" component={Policies} />
        <Stack.Screen name="RegisterHospital" component={RegisterHospital} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
