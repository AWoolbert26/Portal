import React from "react";
import {
  Text,
  SafeAreaView,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";

import { Stack } from "expo-router/stack";
import { router } from "expo-router";

const Register = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "grey",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Button title="Back" onPress={() => router.back()}></Button>
      <Text style={{ fontSize: 50, margin: "2%" }}>Register</Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor="lightgrey"
        style={{
          width: "96%",
          marginHorizontal: "2%",
          height: "1",
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "black",
          fontSize: 20,
          padding: 10,
          marginVertical: "2%",
          fontWeight: "200",
        }}
      ></TextInput>
      <TextInput
        placeholder="Password"
        placeholderTextColor="lightgrey"
        style={{
          width: "96%",
          marginHorizontal: "2%",
          height: "1",
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "black",
          fontSize: 20,
          padding: 10,
          fontWeight: "200",
        }}
      ></TextInput>
      <TouchableOpacity
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: 50,
          backgroundColor: "black",
          margin: "2%",
        }}
      >
        <Text style={{ color: "white" }}>NEXT</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Register;
