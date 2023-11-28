import React, { useEffect } from "react";
import {
  Text,
  SafeAreaView,
  TextInput,
  Button,
  TouchableOpacity,
  View,
} from "react-native";

import { Stack } from "expo-router/stack";
import { router } from "expo-router";
import { test } from "../../functions/user";
import { login } from "../../functions/user";
import { useForm, Controller } from "react-hook-form";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { ArrowRight } from "lucide-react-native";
import { ArrowLeft } from "lucide-react-native";
import LottieView from "lottie-react-native";

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const logout = () => {
    router.replace("/");
  };

  const { authUser, setAuthUser } = useContext(AuthContext);

  useEffect(() => {
    if (authUser) {
      router.replace("/home");
    }
  });

  const onSubmit = async ({ email, password }) => {
    login(email, password)
      .then((res) => {
        //res is user
        // console.log(res.data);
        if (!res.verified) {
          router.replace(`/register/verificationMessage/${res.id}`);
          console.log("user not verified");
          return;
        }
        setAuthUser(res);
        router.replace("/home");
      })
      .catch((err) => {
        setError("root", {
          type: 500,
          message: "Invalid login credentials",
        });
      });
  };

  return (
    <SafeAreaView style={{ flex: 1 }} backgroundColor="white">
      <Stack.Screen
        options={{
          headerShown: false,
          headerTitle: "",
          headerBackTitle: "Home",
          headerStyle: { backgroundColor: "white" },
        }}
      />

      <Text style={{ fontSize: 40, margin: "3%", marginTop: 30 }}>Login</Text>
      <View style={{ marginTop: 10 }}>
        <Controller
          control={control}
          rules={{
            required: { value: true, message: "Email required" },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              autoCapitalize="none"
              placeholder="name@example.com"
              autoComplete="email"
              placeholderTextColor="darkgray"
              style={{
                width: "96%",
                marginHorizontal: "2%",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "transparent",
                borderRadius: 15,
                backgroundColor: "whitesmoke",
                fontSize: 18,
                borderRadius: 20,
                padding: 10,
                fontWeight: "400",
              }}
              value={value}
              onChangeText={(value) => onChange(value)}
            />
          )}
          name="email"
        />
        {errors.email && (
          <Text style={{ marginHorizontal: "2%" }}>{errors.email.message}</Text>
        )}

        <Controller
          control={control}
          rules={{
            required: { value: true, message: "Password required" },
            password: true,
            // validate password too based on length
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              autoComplete="new-password"
              secureTextEntry={true}
              placeholder="Password"
              placeholderTextColor="darkgray"
              style={{
                width: "96%",
                marginHorizontal: "2%",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "transparent",
                borderRadius: 15,
                backgroundColor: "whitesmoke",
                fontSize: 18,
                padding: 10,
                marginTop: "2%",
                fontWeight: "400",
              }}
              value={value}
              onChangeText={(value) => onChange(value)}
            />
          )}
          name="password"
        />
        {errors.password && (
          <Text style={{ marginHorizontal: "2%" }}>
            {errors.password.message}
          </Text>
        )}

        {errors.root && (
          <Text style={{ marginHorizontal: "2%" }}>{errors.root.message}</Text>
        )}
      </View>

      <View style={{ flex: 1, marginBottom: 100 }}>
        <LottieView
          autoPlay
          loop
          source={require("../../assets/loginanimation.json")}
        />
      </View>

      <View
        style={{
          justifyContent: "center",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={logout}
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: 50,
            width: 50,
            borderRadius: 100,
            backgroundColor: "lightgray",
            position: "absolute",
            left: 20,
            bottom: 20,
          }}
        >
          <ArrowLeft color="black" size={30} />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: 40,
            width: 100,
            backgroundColor: "black",
            margin: "2%",
            borderRadius: 100,
            position: "absolute",
            bottom: 10,
            right: 10,
          }}
          onPress={handleSubmit(onSubmit)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white" }}>NEXT</Text>
            <ArrowRight color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Login;
