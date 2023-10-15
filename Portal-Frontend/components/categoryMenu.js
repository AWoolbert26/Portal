import { Stack } from "expo-router";
import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text } from "react-native";
import { useWindowDimensions } from "react-native";
import { StatusBar, setStatusBarStyle } from "expo-status-bar";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getCategories } from "../functions/user";

const CategoryMenu = ({ close, setCurrentCategory }) => {
  const { height, width } = useWindowDimensions();

  const [categories, setCategories] = useState(null);

  const getUsercategories = async () => {
    try {
      const gotCategories = await getCategories();
      gotCategories.categories.unshift({ id: -1, name: "Home" });
      setCategories(gotCategories);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUsercategories();
  }, []);

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
        {categories != null &&
          categories.categories.map((category) => {
            return (
              <TouchableOpacity
                key={category.name}
                id={category.name}
                onPress={() => selectCurrentCategory(category.name)}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: "white",
                    fontSize: 24,
                    fontWeight: "600",
                  }}
                >
                  {category.name}
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
