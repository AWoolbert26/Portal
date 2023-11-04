import React, { useContext, useState } from "react";
import { Text, View, TextInput, Button, Alert, SafeAreaView, Dimensions, TouchableOpacity, ScrollView, KeyboardAvoidingView} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { Stack } from "expo-router/stack";
import { AuthContext } from "../auth/AuthContext";
import { router } from "expo-router";
import { setProfile } from "../../functions/user";

const ScreenWidth = Dimensions.get("window").width;

const createProfile = () => {
    // const { authUser, setAuthUser } = useContext(AuthContext);
    // if (authUser === null) {
    //   router.replace("/login");
    // }
    const [autofillValue, setAutoFillValue] = useState('')
    const { control, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
          name: '',
          location: '',
          occupation: '',
          bio: ''
        }
      });
      const onSubmit = async (data) => {
        setProfile(data)
            .then((res) => {
                router.replace("/home");
            })
            .catch((err) => {
                console.log(err);
                alert();
          });
      }

    return (
        <SafeAreaView style={{ flex: 1, alignItems: "flex-start", justifyContent: "start", flexDirection:'column' }}>
            <Stack.Screen
            options={{ headerShown: false}}
            />
            <KeyboardAvoidingView behavior="padding">
            <ScrollView keyboardShouldPersistTaps={'handled'} >
            <Text style={{fontSize: 30, marginHorizontal: 25, fontWeight:'bold', marginTop: 30}} keyboardShouldPersistTaps={'handled'}>Create a Public Profile</Text>
            <View style={{marginHorizontal: 25, marginTop:30}} keyboardShouldPersistTaps={'handled'}>
               
            <Text style={{fontSize: 25 }}>What's your name?</Text>
                <Text style={{fontSize: 15, marginTop: 5}}>This can be anything you like. Keep in mind that is what everyone will see you as!</Text>
                <Controller
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            placeholder="First and Last"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            style={{
                                borderWidth: 1,
                                marginTop: 20,
                                borderStyle: "solid",
                                borderColor: "black",
                                fontSize: 20,
                                padding: 10,
                                fontWeight: "200",
                                borderRadius: 5
                            }}
                        />
                    )}
                    name="name"
                />
                {errors.name && <Text>This is required.</Text>}

                <Text style={{fontSize: 25, marginTop: 30}}>Where are you located?</Text>
                <Text style={{fontSize: 15, marginTop: 5}}>This allows you to connect with who's nearby!</Text>
                <Controller
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            placeholder="Hello :)"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            style={{
                                borderWidth: 1,
                                marginTop: 20,
                                borderStyle: "solid",
                                borderColor: "black",
                                fontSize: 20,
                                padding: 10,
                                fontWeight: "200",
                                borderRadius: 5
                            }}
                        />
                    )}
                    name="location"
                />
                {errors.location && <Text>This is required.</Text>}
            
                <Text style={{fontSize: 25, marginTop: 30, }}>What's your current occupation?</Text>
                <Text style={{fontSize: 15, marginTop: 5}}>Tell people what you're doing!</Text>
                <Controller
                    keyboardVerticalOffset={300}
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            placeholder="Student, for example"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            style={{
                                borderWidth: 1,
                                marginTop: 20,
                                borderStyle: "solid",
                                borderColor: "black",
                                fontSize: 20,
                                padding: 10,
                                fontWeight: "200",
                                borderRadius: 5
                            }}
                        />
                    )}
                    name="occupation"
                />
                {errors.occupation && <Text>This is required.</Text>}

                <Text style={{fontSize: 25, marginTop: 30}}>Write a short bio!</Text>
                <Text style={{fontSize: 15, marginTop: 5}}>See this as an opportunity to introduce yourself!</Text>
                <Controller
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            placeholder="Hello :)"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            style={{
                                borderWidth: 1,
                                marginTop: 20,
                                borderStyle: "solid",
                                borderColor: "black",
                                fontSize: 20,
                                padding: 10,
                                fontWeight: "200",
                                borderRadius: 5,
                            }}
                        />
                    )}
                    name="bio"
                />
                {errors.bio && <Text>This is required.</Text>}

                <TouchableOpacity
                    style={{
                        borderColor: "black",
                        borderStyle: "solid",
                        borderRadius: 10,
                        borderWidth: 2,
                        marginTop: 50,
                        padding: 5,
                        paddingHorizontal: 15,
                    }}
                    onPress={handleSubmit(onSubmit)}
                    >
                    <Text style={{ fontWeight: "bold", fontSize: 20 }}>Let's go!</Text>
                </TouchableOpacity>
                </View>
            </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default createProfile