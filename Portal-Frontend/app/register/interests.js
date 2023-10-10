import React, { useState, useRef } from "react";
import { Text, View, SafeAreaView, TextInput } from "react-native";
import { Stack } from "expo-router/stack";
import { TouchableOpacity } from "react-native-gesture-handler";

const interests = () => {
  const [interests, setInterests] = useState({
    Law: false,
    "Computer Science": false,
    Business: false,
  });

  const selected = useRef(0);

  const pressed = (interest, value) => {
    if (value) {
      selected.current++;
    } else {
      selected.current--;
    }
    setInterests({
      ...interests,
      [interest]: value,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={{ alignItems: "center", marginTop: 30 }}>
        <Text style={{ fontWeight: "bold", fontSize: 25 }}>
          Select at least five of your
        </Text>
        <Text style={{ fontWeight: "bold", fontSize: 25 }}>
          professional and academic
        </Text>
        <Text style={{ fontWeight: "bold", fontSize: 25 }}>interests</Text>
      </View>
      <TextInput
        autoCapitalize="none"
        placeholder="Search..."
        placeholderTextColor="black"
        style={{
          width: "90%",
          alignSelf: "center",
          marginTop: 30,
          backgroundColor: "lightgrey",
          borderRadius: 50,
          fontSize: 20,
          padding: 10,
          fontWeight: "200",
        }}
      />
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          alignSelf: "center",
          marginTop: 20,
        }}
      >
        {Object.entries(interests).map(([key, value]) => {
          return (
            <TouchableOpacity
              key={key}
              onPress={() => pressed(key, !value)}
              style={{
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
                borderColor: value == false ? "black" : "blue",
                borderStyle: "solid",
                borderWidth: 1,
              }}
            >
              <Text style={{ color: value == false ? "black" : "blue" }}>
                {key}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {selected.current > 0 && (
        <View style={{ marginTop: "auto", marginBottom: 10 }}>
          <View
            style={{
              marginBottom: 30,
              borderColor: "black",
              borderWidth: 0.5,
            }}
          />
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text
              style={{
                marginLeft: 30,
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              {selected.current} {selected.current == 1 ? "option" : "options"}{" "}
              selected
            </Text>
            <TouchableOpacity
              style={{
                borderColor: "black",
                borderStyle: "solid",
                borderRadius: 10,
                borderWidth: 2,
                marginLeft: 45,
                padding: 5,
                paddingHorizontal: 15,
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default interests;
