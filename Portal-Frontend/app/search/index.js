import React, { useState } from "react";
import { View, TextInput, Button, SafeAreaView } from "react-native";
import { Stack } from "expo-router";
import Footer from "../../components/footer";
import UserSearchDropdown from "../../components/dropdown";

const SearchPage = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "flex-start", justifyContent: "center" }}
    >
      <Stack.Screen
        options={{
          title: "",
          headerShown: false,
        }}
      />
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          paddingTop: 60,
          paddingHorizontal: 20,
        }}
      >
        <UserSearchDropdown
          onUserSelect={(user) => console.log("Selected user:", user)}
        />
      </View>
      <Footer />
    </SafeAreaView>
  );
};

export default SearchPage;
