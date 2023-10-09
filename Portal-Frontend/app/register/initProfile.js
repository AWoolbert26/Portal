import React, { useContext } from "react";
import { Text, View, SafeAreaView } from "react-native";
import { Stack } from "expo-router/stack";
import { AuthContext } from "../auth/AuthContext";
import { router } from "expo-router";

const initProfile = () => {
  const { authToken } = useContext(AuthContext);
  if (authToken === null) {
    router.replace("/login");
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTransparent: true,
        }}
      />
      <Text>Hi</Text>
    </SafeAreaView>
  );
};

export default initProfile;
