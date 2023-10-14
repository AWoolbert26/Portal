    import React from "react";
    import { View, Text, SafeAreaView, ScrollView, Button, TextInput, Modal} from "react-native";
    import { Stack } from "expo-router";
    import { TouchableOpacity } from "react-native-gesture-handler";
    import { useState, useEffect } from "react";
    import { getUserInformation, getInterests, setProfile, getProfile} from "../../functions/user";
    import { useForm, Controller } from "react-hook-form";

    const userProfile = () => {
        const {control, handleSubmit, formState: { errors }, values} = useForm({ defaultValues: {
            name: "",
            location: "",
            occupation: "",
            bio: ""
            },
            values
        });
        const [username, setUsername] = useState(null);
        const [interests, setInterests] = useState(null);
        const [email, setEmail] = useState(null);
        
        const [name, setName] = useState(null);
        const [location, setLocation] = useState(null);
        const [occupation, setOccupation] = useState(null);
        const [bio, setBio] = useState(null);

        useEffect(() => {
            getUserInformation()
            .then((result) => {
                setEmail(result.data.email)
                setUsername(result.data.username);
        })
        .catch((error) => {
            console.error('Error while retrieving username:', error);
        });
        }, []);

        useEffect(() => {
            getInterests()
            .then((result) => {
                if (result && result.categories) {
                const categoryNames = result.categories.map((category) => category.name);
                setInterests(categoryNames.join(', '));
                }
            })
            .catch((error) => {
                console.log('Error while retrieving interests:', error);
            });
        }, []);

        useEffect(() => {
            getProfile()
            .then((result) => {
                setName(result.data.name)
                setLocation(result.data.location)
                setOccupation(result.data.occupation)
                setBio(result.data.bio)
        })
        .catch((error) => {
            console.error('Error while retrieving profile:', error);
        });
        }, []);

        const onSubmit = async (data) => {
            try {
                await setProfile(data)
            } catch (err){
                console.log(err)
            }
        }

        return (
            <SafeAreaView style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center', backgroundColor: '#fff'}}>
                <Stack.Screen
                    options={{
                    title: '',
                    headerTransparent: true,
                    }}
                />
                <ScrollView showsVerticalScrollIndicator={false}>
                <View 
                    style={{
                        flex: 1,
                        paddingTop: 0,
                        flexDirection: 'column',
                        marginHorizontal: 25
                    }}>
                     <Text style={{fontSize: 23}}>{username}</Text>
                     <Text style={{fontSize: 18}}>{email}</Text>
                </View>
                <View
                    style={{
                        flex: 1,
                        paddingTop: 50,
                        alignContent: 'flex-start',
                        flexDirection: 'column',
                        marginHorizontal: 25
                    }}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', paddingVertical: 15 }}>Name:</Text>
                    <Controller
                        control={control}
                        render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={{ fontSize: 15, paddingVertical: 10, borderBottomWidth: 1 }}
                            placeholder="Enter your name"
                            value={value}
                            onChangeText={onChange}
                        />
                        )}
                        name="name"
                    />
                    <Text style={{ fontSize: 15, fontWeight: 'bold', paddingVertical: 15 }}>Location:</Text>
                    <Controller
                        control={control}
                        render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={{ fontSize: 15, paddingVertical: 10, borderBottomWidth: 1 }}
                            placeholder="Enter your location"
                            value={value}
                            onChangeText={onChange}
                        />
                        )}
                        name="location"
                    />
                    <Text style={{ fontSize: 15, fontWeight: 'bold', paddingVertical: 15 }}>Occupation:</Text>
                    <Controller
                        control={control}
                        render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={{ fontSize: 15, paddingVertical: 10, borderBottomWidth: 1 }}
                            placeholder="Enter your occupation"
                            value={value}
                            onChangeText={onChange}
                        />
                        )}
                        name="occupation"
                    />
                    <Text style={{ fontSize: 15, fontWeight: 'bold', paddingVertical: 15 }}>Bio:</Text>
                    <Controller
                        control={control}
                        render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={{ fontSize: 15, paddingVertical: 10, borderBottomWidth: 1 }}
                            placeholder="Write a bio about yourself"
                            value={value}
                            onChangeText={onChange}
                        />
                        )}
                        name="bio"
                    />
                    <Button title="Submit" onPress={handleSubmit(onSubmit)} />
                </View>
                <View
                    style={{
                    flex: 1,
                    paddingTop: 50,
                    alignContent: 'flex-start',
                    flexDirection: 'column',
                    marginHorizontal: 25
                }}>
                    <Text style={{ fontSize: 15, fontWeight:'bold'}}>Name: <Text style={{fontSize: 15, fontWeight:'400'}}>{name}</Text></Text>
                    <Text style={{ fontSize: 15, fontWeight:'bold'}}>Location: <Text style={{fontSize: 15, fontWeight:'400'}}>{location}</Text></Text>
                    <Text style={{ fontSize: 15, fontWeight:'bold'}}>Occupation: <Text style={{fontSize: 15, fontWeight:'400'}}>{occupation}</Text></Text>
                    <Text style={{ fontSize: 15, fontWeight:'bold'}}>Bio: <Text style={{fontSize: 15, fontWeight:'400'}}>{bio}</Text></Text>
                    <Text style={{ fontSize: 15, fontWeight:'bold'}}>Interests: <Text style={{fontSize: 15, fontWeight:'400'}}>{interests}</Text></Text>
                </View>
                </ScrollView>
            </SafeAreaView>
        )
    }

    export default userProfile