import React, { useContext, useEffect } from "react";
import { SafeAreaView, TouchableOpacity, Text, View } from "react-native";
import * as Linking from "expo-linking";
import { router, useNavigation } from "expo-router";
import { AuthContext } from "../../auth/AuthContext";
import { useLocalSearchParams } from "expo-router";
import { authenticate } from "../../../functions/user";
import { Stack } from "expo-router/stack";
import LottieView from "lottie-react-native";

const VerificationConfirmation = () => {
  const { authUser, setAuthUser } = useContext(AuthContext);

  const { id } = useLocalSearchParams();

  useEffect(() => {
    authenticate(parseInt(id))
      .then((user) => {
        setAuthUser(user);
      })
      .catch((err) => {
        console.log(err);
      });
    //delete deep route on dismount
  }, []);

  const continueToProfileInitialization = () => {
    router.replace("/register/userType");
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 15,
        position: "relative",
      }}
    >
      <Stack.Screen options={{ headerShown: false }} />
      {/* snoop animation */}
      {/* <View
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          alignItems: "center",
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <LottieView
          autoPlay
          style={{ position: "relative", width: "90%", bottom: -14 }}
          loop
          source={require("../../../assets/SnoopAnimation.json")}
        />
      </View> */}

      {/* celebrate animation */}
      <View
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          alignItems: "center",
          flex: 1,
          justifyContent: "flex-start",
        }}
      >
        <LottieView
          autoPlay
          style={{ position: "relative", width: "90%", top: 0 }}
          loop
          source={require("../../../assets/CelebrateAnimation.json")}
        />
      </View>

      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          gap: 15,
          position: "relative",
        }}
      >
        <Text
          style={{
            fontWeight: "700",
            fontSize: 28,
            textAlign: "center",
            marginHorizontal: 40,
          }}
        >
          You've successfully verified your account!
        </Text>
        <TouchableOpacity
          style={{ backgroundColor: "black", padding: 10 }}
          onPress={continueToProfileInitialization}
        >
          <Text style={{ fontSize: 18, color: "white", fontWeight: "300" }}>
            Continue to profile initialization
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    // <Text>Hello World!</Text>
  );
};

export default VerificationConfirmation;
