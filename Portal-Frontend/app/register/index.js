import React, { useContext, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

import { Stack } from "expo-router/stack";
import { router } from "expo-router";
import {
  checkUniqueEmail,
  checkUniqueUsername,
  register,
} from "../../functions/user";
import { AuthContext } from "../auth/AuthContext";

const Register = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    values,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
    values,
  });

  const { authUser, setAuthUser } = useContext(AuthContext);

  const onSubmit = async (data) => {
    register(data)
      .then((res) => {
        setAuthUser(res);
        router.replace("/register/userType");
      })
      .catch((err) => {
        console.log(err);
      });
    // router.push("/login");
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
      <Text style={{ fontSize: 50, margin: "2%" }}>Register</Text>
      <Controller
        control={control}
        rules={{
          required: { value: true, message: "Email required" },
          pattern: {
            value: /\S+@\S+\.\S+/,
            message: "Doesn't follow email format",
          },
          validate: checkUniqueEmail,
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
          required: true,
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
        <Text style={{ marginHorizontal: "2%" }}>Password required</Text>
      )}
      <Controller
        control={control}
        rules={{
          required: { value: true, message: "Username required" },
          validate: checkUniqueUsername,
          pattern: {
            value: /^[a-zA-Z0-9._]+$/,
            message:
              "Username can only have numbers, letters, underscores, and periods",
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            autoCapitalize="none"
            placeholder="Username"
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
        name="username"
      />
      {errors.username && (
        <Text style={{ marginHorizontal: "2%" }}>
          {errors.username.message}
        </Text>
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

export default Register;
