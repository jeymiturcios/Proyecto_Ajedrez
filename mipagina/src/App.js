import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";


import ColorSelectScreen from "./ColorSelectScreen";
import GameScreen from "./GameScreen";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ColorSelect"
        screenOptions={{
          headerStyle: { backgroundColor: "#1C1C1C" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >

        <Stack.Screen
          name="ColorSelect"
          component={ColorSelectScreen}
          options={{ title: "Elige tu color" }}
        />
        <Stack.Screen
          name="GameScreen"
          component={GameScreen}
          options={{ title: "Juego de Ajedrez" }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

