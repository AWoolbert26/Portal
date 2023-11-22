import React, { useEffect, useState } from "react";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";
import { Stack } from "expo-router/stack";
import LottieView from "lottie-react-native";
import { useLocalSearchParams } from "expo-router/src/hooks";
import { resendVerificationEmail } from "../../../functions/user";
import { router, useNavigation } from "expo-router";
import * as Linking from "expo-linking";

const VerificationMessage = () => {
  //userId
  const { id } = useLocalSearchParams();
  const { waiting, setWaiting } = useState(true);

  const handleResend = () => {
    const createDeepLink = () => {
      //create a deep link to the verification confirmation page
      const appScheme = "acme";

      // Create a URL with the path '/register/verificationConfirmation' and query parameters
      const redirectUrl = Linking.createURL(
        "/register/verificationConfirmation",
        {
          scheme: appScheme,
          // queryParams: {},
        }
      );

      // Perform any other logic you need with the generated URL, like redirecting the user
      // For example, you might use React Navigation to navigate to the generated URL
      // navigation.navigate('VerificationConfirmation', { redirectUrl });
      return redirectUrl;
    };
    const redirectUrl = createDeepLink();
    console.log(parseInt(id));
    resendVerificationEmail(id, redirectUrl)
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    //to get rid of this screen after navigating
    return () => {
      console.log("ere");
      router.replace("/");
    };
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        rowGap: 15,
      }}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <View
        style={{
          flex: 5,
          width: "100%",
        }}
      >
        <LottieView
          autoPlay
          speed={0.5}
          loop
          source={require("../../../assets/MailNotification.json")}
        />
      </View>
      <View style={{ flex: 5, rowGap: 15, alignItems: "center" }}>
        <Text style={{ textAlign: "center", fontWeight: "700", fontSize: 28 }}>
          Please check your email to verify your account. Your token will expire
          in 10 minutes.
        </Text>
        <Text>Didn't get an email?</Text>
        <TouchableOpacity
          style={{ backgroundColor: "black", padding: 10 }}
          onPress={handleResend}
        >
          <Text style={{ color: "white" }}>Resend verification email</Text>
        </TouchableOpacity>
      </View>

      {/* Animation */}
    </SafeAreaView>
  );
};

export default VerificationMessage;
