import React, { useContext, useRef, useState } from "react";
import { AuthContext } from "../auth/AuthContext";
import { Text, View, SafeAreaView, StatusBar, Touchable } from "react-native";
import { Stack } from "expo-router/stack";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faMagnifyingGlass,
  faCircle,
  faUser,
  faCaretDown,
  faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import { getInterests, deleteAuthToken } from "../functions/user";
import { TouchableOpacity } from "react-native-gesture-handler";
import { router } from "expo-router";

const Home = () => {
  const { authToken, setAuthToken } = useContext(AuthContext);
  if (authToken === null) {
    router.replace("/");
  }

  const logout = () => {
    deleteAuthToken();
    setAuthToken(null);
  };

  const goToHome = () => {
    router.replace("/home");
  };

  const [interests, setInterests] = useState({});

  const getUserInterests = async () => {
    try {
      setInterests(await getInterests());
    } catch (err) {
      console.log(err);
    }
  };

  // need to change status bar
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      {/* header */}
      <TouchableOpacity style={{}}>
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
      </TouchableOpacity>
      {/* page */}
      <View style={{ flexDirection: "row", alignSelf: "center" }}>
        {interests.categories != null &&
          interests.categories.map((category) => {
            return (
              <View key={category.id}>
                <Text style={{ fontSize: 20 }}>{category.name}</Text>
              </View>
            );
          })}
      </View>
      {/* footer (need to make global) */}
      {/* <Footer/> */}
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
            gap: 50,
          }}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} size={25} />
          <TouchableOpacity onPress={goToHome}>
            <FontAwesomeIcon icon={faCircle} size={25} />
          </TouchableOpacity>
          <FontAwesomeIcon icon={faUser} size={25} />
          <TouchableOpacity onPress={logout}>
            <FontAwesomeIcon icon={faSignOut} size={25} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
