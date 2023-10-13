import { Stack } from "expo-router";
import React from "react";
import { SafeAreaView, View, Text } from "react-native";
import { useWindowDimensions } from "react-native";
import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import { TouchableOpacity } from "react-native-gesture-handler";

const CategoryMenu = ({ close, setCurrentCategory }) => {
  const { height, width } = useWindowDimensions();

  const categories = ["Home", "Law", "Computer Science", "Business"];

  const selectCurrentCategory = (name) => {
    setCurrentCategory(name);
    console.log(name);
  };

  setStatusBarStyle("light");
  return (
    <SafeAreaView
      style={{
        flex: 1,
        height: height,
        width: width,
        justifyContent: "flex-start",
      }}
    >
      <View
        style={{ flex: 9, gap: 10, marginTop: 10, justifyContent: "center" }}
      >
        {categories.map((name) => {
          return (
            <TouchableOpacity
              id={name}
              onPress={() => selectCurrentCategory(name)}
            >
              <Text
                style={{
                  textAlign: "center",
                  color: "white",
                  fontSize: 24,
                  fontWeight: "600",
                }}
              >
                {name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <TouchableOpacity onPress={close} style={{ marginTop: "auto" }}>
        <Text
          style={{
            fontSize: 48,
            fontWeight: "700",
            color: "white",
            textAlign: "center",
          }}
        >
          Confirm
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CategoryMenu;
