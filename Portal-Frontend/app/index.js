import React from "react";
import { SafeAreaView, View, TouchableOpacity, Text } from "react-native";
import { router } from "expo-router";
import { Stack } from "expo-router/stack";
import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "./auth/AuthContext";
import { login } from "../functions/user";

const Home = () => {
  const goToLoginPage = () => {
    router.push("/login");
  };

  const goToRegisterPage = () => {
    router.replace("/register");
  };

  const { authUser, setAuthUser } = useContext(AuthContext);
  useEffect(() => {
    if (authUser) {
      router.replace("/home");
    }
  });

  const goToUserProfile = () => {
    router.replace("/userProfile");
  };

  const developerQuickLogin = () => {
    login("a@gmail.com", "a")
      .then((res) => {
        // console.log(res.data);
        setAuthUser(res);
        router.replace("/home");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1 }} backgroundColor="white">
      <Stack.Screen
        options={{
          headerTitle: "Home",
          headerShown: false,
        }}
      />
      <View style={{ flex: 9, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontWeight: "700", fontSize: 75 }}>P O R T A L</Text>
        <Text style={{ fontSize: 20, color: "grey" }}>
          Discover your future career
        </Text>
      </View>
      {/* login and register */}
      <TouchableOpacity
        style={{
          backgroundColor: "lightgrey",
          marginBottom: 10,
          alignItems: "center",
        }}
        onPress={developerQuickLogin}
      >
        <Text style={{ padding: 10 }}>Developer Quick Login</Text>
      </TouchableOpacity>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          gap: 5,
        }}
      >
        {/* Replace with Pressable */}
        <TouchableOpacity
          onPress={goToLoginPage}
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            height: 50,
            borderColor: "black",
            borderStyle: "solid",
            borderWidth: 1,
            marginLeft: 6,
          }}
        >
          <Text style={{}}>LOG IN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goToRegisterPage}
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            height: 50,
            backgroundColor: "black",
            marginRight: 6,
            borderColor: "black",
            borderStyle: "solid",
            borderWidth: 1,
          }}
        >
          <Text
            style={{
              color: "white",
            }}
          >
            REGISTER
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Home;
