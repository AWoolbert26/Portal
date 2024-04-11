import { Stack } from "expo-router";
import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, ScrollView } from "react-native";
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
      <ScrollView vertical={true}>
    {categories != null &&
      categories.categories.map((category) => {
        return (
          <View key={category.id} style={{ width: '80%', alignSelf: 'center' }}>
            <TouchableOpacity
              onPress={() => selectCurrentCategory(category.name)}
              style={{
                width: '100%' // Set the width of TouchableOpacity to 100%
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 24,
                  fontWeight: "400",
                  marginBottom: 20,
                  marginTop: 20
                }}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
  </ScrollView>
    </SafeAreaView>
  );
};

export default CategoryMenu;
