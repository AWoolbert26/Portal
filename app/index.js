import React from "react";
import { SafeAreaView, View, TouchableOpacity, Text } from "react-native";
import { router } from "expo-router";

const Home = () => {
  const goToLoginPage = () => {
    router.push("/login");
  };

  const goToRegisterPage = () => {
    router.push("/register");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 9, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontWeight: "700", fontSize: 75 }}>P O R N</Text>
        <Text style={{ fontSize: 20, color: "grey" }}>
          Discover naked oil twerk
        </Text>
      </View>
      {/* login and register */}
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
            width: 180,
            height: 50,
            borderColor: "black",
            borderStyle: "solid",
            borderWidth: 1,
          }}
        >
          <Text style={{}}>LOG IN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goToRegisterPage}
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: 180,
            height: 50,
            backgroundColor: "black",
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
