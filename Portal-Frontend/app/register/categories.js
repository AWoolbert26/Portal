import React, { useState, useRef, useContext } from "react";
import { Text, View, SafeAreaView, TextInput, Alert } from "react-native";
import { Stack } from "expo-router/stack";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AuthContext } from "../auth/AuthContext";
import { router } from "expo-router";
import { selectCategories } from "../../functions/user";

const categories = () => {
  const { authUser } = useContext(AuthContext);
  if (authUser === null) {
    router.replace("/login");
  }

  const allcategories = {
    1: "Law",
    2: "Computer Science",
    3: "Business",
    4: "Politics",
    5: "Mechanical Engineering",
    6: "Art",
    7: "Retail",
    8: "Agriculture",
    9: "Sales",
    10: "Healthcare",
    11: "Media and Entertainment",
  };

  const [selectedCategories, setSelectedCategories] = useState({});

  const selected = useRef(0);

  const pressed = (key) => {
    if (selectedCategories[key] === undefined) {
      //if not already selected
      selected.current++;
      setSelectedCategories((current) => {
        current[key] = allcategories[key];
        return { ...current };
      });
    } else {
      selected.current--;
      setSelectedCategories((current) => {
        delete current[key];
        return { ...current };
      });
    }
    // console.log(key in selectedCategories);
  };

  const getColor = (key) => {
    //works, but color rerender doesn't work
    if (key in selectedCategories) {
      return "#5481C6";
    }
    return "black";
  };

  const alert = () => {
    Alert.alert("Error", "Couldn't set categories due to server side error", [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
  };
  const submit = async () => {
    // we send {id: name, id: name}

    selectCategories(selectedCategories)
      .then((res) => {
        router.replace("/register/profile");
      })
      .catch((err) => {
        //handle any errors in a better way
        console.log(err);
        alert();
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
        {/* bro hardcoding -- wrap this cuh */}
        {/* will change when we put in more */}
        <Text style={{ fontWeight: "bold", fontSize: 25 }}>
          Select your favorite
        </Text>
        <Text style={{ fontWeight: "bold", fontSize: 25 }}>
          professional and academic
        </Text>
        <Text
          style={{
            fontWeight: "bold",
            fontSize: 25,
          }}
        >
          categories
        </Text>
      </View>
      {/* will add back when working */}
      {/* <TextInput
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
      /> */}
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          alignItems: "center",
          marginTop: 30,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {Object.entries(allcategories).map(([key, value]) => {
          return (
            <TouchableOpacity
              key={key}
              onPress={() => pressed(key)}
              style={{
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
                borderColor: getColor(key),
                borderStyle: "solid",
                borderWidth: 1,
              }}
            >
              <Text
                style={{
                  color: getColor(key),
                }}
              >
                {value}
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
              onPress={submit}
            >
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default categories;
