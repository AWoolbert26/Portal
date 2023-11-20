import React, { useContext, useEffect } from "react";
import {
  Text,
  SafeAreaView,
  TextInput,
  Button,
  TouchableOpacity,
  View
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
import LottieView from "lottie-react-native"
import { ArrowLeft, ArrowRight } from "lucide-react-native";


const logout = () => {
  router.replace("/");
};

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
          headerShown: false,
          headerTitle: "",
          headerBackTitle: "Home",
          headerStyle: { backgroundColor: "white" },
        }}
      />
      <Text style={{ fontSize: 35, margin: "3%", marginTop:30 }}>Register</Text>
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
            placeholderTextColor="darkgray"
            style={{
              width: "96%",
              marginHorizontal: "2%",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "transparent",
              borderRadius: 15,
              backgroundColor: 'whitesmoke',
              fontSize: 18,
              padding: 10,
              marginTop: "2%",
              fontWeight: '400',
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
            placeholderTextColor="darkgray"
            style={{
              width: "96%",
              marginHorizontal: "2%",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "transparent",
              borderRadius: 15,
              backgroundColor: 'whitesmoke',
              fontSize: 18,
              padding: 10,
              marginTop: "2%",
              fontWeight: '400',
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
            placeholderTextColor="darkgray"
            style={{
              width: "96%",
              marginHorizontal: "2%",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "transparent",
              borderRadius: 15,
              backgroundColor: 'whitesmoke',
              fontSize: 18,
              padding: 10,
              marginTop: "2%",
              fontWeight: '400',
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


      <View style={{flex: 1, marginBottom: 100}}>
        <LottieView 
          autoPlay
          loop
          source={require('/Users/victordurojaiye/portal/Portal-Frontend/assets/registrationanimation.json')}
        />
      </View>



      <TouchableOpacity onPress={logout}
          style={{
            justifyContent:'center',
            alignItems:'center',
            height: 50,
            width: 50,
            borderRadius: 100,
            backgroundColor:'lightgray',
            position:'absolute', 
            left: 20, 
            bottom: 40
          }}>
          <ArrowLeft color="black" size={30}/>
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
          position:'absolute', 
          bottom: 30, 
          right: 10
        }}
        onPress={handleSubmit(onSubmit)}
      >
        <View style={{flex: 1, justifyContent: 'center', flexDirection:'row', alignItems:'center'}}>
          <Text style={{ color: "white" }}>NEXT</Text>
          <ArrowRight color="white"/>  
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Register;
