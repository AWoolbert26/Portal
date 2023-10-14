import React, { useEffect } from "react";
import {
  Text,
  SafeAreaView,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";

import { Stack } from "expo-router/stack";
import { router } from "expo-router";
import { test } from "../../functions/user";
import { login } from "../../functions/user";
import { useForm, Controller } from "react-hook-form";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

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

  const { authUser, setAuthUser } = useContext(AuthContext);

  useEffect(() => {
    if (authUser) {
      router.replace("/home");
    }
  });

  const onSubmit = async ({ email, password }) => {
    login(email, password)
      .then((res) => {
        // console.log(res.data);
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
          headerTitle: "",
          headerBackTitle: "Home",
          headerStyle: { backgroundColor: "white" },
        }}
      />
      <Text style={{ fontSize: 50, margin: "2%" }}>Login</Text>
      <Controller
        control={control}
        rules={{
          required: { value: true, message: "Email required" },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            autoCapitalize="none"
            placeholder="Email"
            autoComplete="email"
            placeholderTextColor="lightgrey"
            style={{
              width: "96%",
              marginHorizontal: "2%",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "black",
              fontSize: 20,
              padding: 10,
              fontWeight: "200",
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
            placeholderTextColor="lightgrey"
            style={{
              width: "96%",
              marginHorizontal: "2%",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "black",
              fontSize: 20,
              padding: 10,
              marginTop: "2%",
              fontWeight: "200",
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

      <TouchableOpacity
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: 50,
          backgroundColor: "black",
          margin: "2%",
        }}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={{ color: "white" }}>NEXT</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Login;
