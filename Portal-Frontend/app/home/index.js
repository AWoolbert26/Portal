import React, { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { Text, View, SafeAreaView, StatusBar } from "react-native";
import { Stack } from "expo-router/stack";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faMagnifyingGlass,
  faCircle,
  faUser,
  faCaretDown,
} from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const { authToken } = useContext(AuthContext);
  // need to protect and change status bar
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      {/* header */}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 50,
        }}
      >
        <View
          style={{
            alignSelf: "center",
            marginBottom: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 30 }}>Home</Text>
          <FontAwesomeIcon icon={faCaretDown} />
        </View>
        <View
          style={{
            borderColor: "black",
            borderWidth: 0.5,
          }}
        />
      </View>
      {/* footer (need to make global) */}
      <View
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 30,
        }}
      >
        <View
          style={{
            borderColor: "black",
            borderWidth: 0.5,
          }}
        />
        <View
          style={{
            alignSelf: "center",
            flexDirection: "row",
            marginTop: 20,
            gap: 90,
          }}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} size={40} />
          <FontAwesomeIcon icon={faCircle} size={40} />
          <FontAwesomeIcon icon={faUser} size={40} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
