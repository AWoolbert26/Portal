import { Stack } from "expo-router";
import { Image } from "react-native";
import { AuthProvider } from "./auth/AuthContext";

export default function Layout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          // headerBackImageSource
          headerTintColor: "black",
          headerStyle: { backgroundColor: "white" },
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
    </AuthProvider>
  );
}
