import { Stack } from "expo-router";
import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text } from "react-native";
import { useWindowDimensions } from "react-native";
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
      console.log(gotCategories);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUsercategories();
  }, []);

  const selectCurrentCategory = (name) => {
    setCurrentCategory(name);
    close();
    console.log(name);
  };
  return (
    <SafeAreaView
      style={{
        flex: 1
      }}
    >
      <View
        style={{ flex: 1, rowGap: 20, justifyContent: "center", alignItems:'center'}}
      >
        {categories != null &&
          categories.categories.map((category) => {
            return (
              <TouchableOpacity
                key={category.id}
                id={category.name}
                onPress={() => selectCurrentCategory(category.name)}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 24,
                    fontWeight: "400",
                  }}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            );
          })}
      </View>
    </SafeAreaView>
  );
};

export default CategoryMenu;
