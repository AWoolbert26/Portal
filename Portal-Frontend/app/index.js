import React from "react";
import { SafeAreaView, View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Stack } from "expo-router/stack";
import { useEffect } from "react";
import { useContext } from "react";
import { AuthContext } from "./auth/AuthContext";
import { login } from "../functions/user";
import Splash from "../components/splashscreen";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
  const goToLoginPage = () => {
    router.push("/login");
  };

  const goToRegisterPage = () => {
    router.replace("/register");
  };

  const { authUser, setAuthUser } = useContext(AuthContext);
  useEffect(() => {
    // this prevents user initialization
    if (authUser) {
      router.replace("/home");
    }
  });

  const goToProfilePicture = () => {
    router.replace("/register/categories");
  };

  return (
    <SafeAreaView style={{ flex: 1 }} backgroundColor="white">
      <Stack.Screen
        options={{
          headerTitle: "Home",
          headerShown: false,
        }}
      />


      <View 
        style={{
        flex: 9, 
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
        }}>

        <Image
          source={require('../images/PortalLogo.png')} 
          style={{width:'100%', height:'90%'}}
          resizeMode="contain" 
        />

        {/* Optional splash effect. I don't really like this */}
        {/* <View 
          style={{
            ...StyleSheet.absoluteFillObject,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          }}>
          <Splash />
        </View> */}

      </View>

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "center",
          gap: 5,
        }}
      >
        {/* Replace with Pressable */}
        <TouchableOpacity
          onPress={goToLoginPage}
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            height: 50,
            borderColor: "black",
            borderStyle: "solid",
            borderWidth: 1,
            marginLeft: 6,
          }}
        >
          <Text style={{}}>LOG IN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goToRegisterPage}
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            height: 50,
            backgroundColor: "black",
            marginRight: 6,
            borderColor: "black",
            borderStyle: "solid",
            borderWidth: 1,
          }}
        >
          <Text
            style={{
              color: "white",
            }}
          >
            REGISTER
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Home;
