    import React from "react";
    import { View, Text, SafeAreaView, ScrollView, Button, TextInput, Modal, Dimensions} from "react-native";
    import { Stack } from "expo-router";
    import { TouchableOpacity } from "react-native-gesture-handler";
    import { useState, useEffect } from "react";
    import { getUserInformation, getInterests, setProfile, getProfile} from "../../functions/user";
    import { useForm, Controller } from "react-hook-form";

    const ScreenWidth = Dimensions.get("window").width;

    const userProfile = () => {
        const {control, handleSubmit, formState: { errors }, setValue, values} = useForm({ defaultValues: {
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
        const [editScreenVisible, setEditScreenVisible] = useState(false);
        const show = () => setEditScreenVisible(true);

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
                setValue('name', result.data.name);
                setValue('location', result.data.location);
                setValue('occupation', result.data.occupation);
                setValue('bio', result.data.bio);
        })
        .catch((error) => {
            console.error('Error while retrieving profile:', error);
        });
        }, [editScreenVisible]);

        const onSubmit = async (data) => {
            try {
                await setProfile(data)
                setEditScreenVisible(!editScreenVisible)
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
                    <Text style={{ fontSize: 15, fontWeight:'bold'}}>Name: <Text style={{fontSize: 15, fontWeight:'400'}}>{name}</Text></Text>
                    <Text style={{ fontSize: 15, fontWeight:'bold'}}>Location: <Text style={{fontSize: 15, fontWeight:'400'}}>{location}</Text></Text>
                    <Text style={{ fontSize: 15, fontWeight:'bold'}}>Occupation: <Text style={{fontSize: 15, fontWeight:'400'}}>{occupation}</Text></Text>
                    <Text style={{ fontSize: 15, fontWeight:'bold'}}>Bio: <Text style={{fontSize: 15, fontWeight:'400'}}>{bio}</Text></Text>
                    <Text style={{ fontSize: 15, fontWeight:'bold'}}>Interests: <Text style={{fontSize: 15, fontWeight:'400'}}>{interests}</Text></Text>
                    <TouchableOpacity style={{ justifyContent: "center", alignItems: "center", flex: 1, height: 33, width: 100, backgroundColor: "black", marginRight: 6, borderColor: "black", borderStyle: "solid", borderWidth: 1, marginTop: 15}} onPress={show}><Text style={{color:'white'}}>Edit Profile</Text></TouchableOpacity>
                    <Modal animationType="fade" visible={editScreenVisible} transparent={false}>
                        <View style={{ flex: 1, flexDirection:'column', justifyContent:'flex-end', alignItems: 'center', marginTop: 60}}>
                            <View style={{ margin: 20, borderRadius: 20, padding: 35, alignItems: 'center', elevation: 5}}>
                                <Text style={{fontSize: 30}}>Edit your profile</Text>
                                <View style={{flex:1, justifyContent:'flex-start', paddingTop: 50}}>
                                    <Text style={{ fontSize: 15, fontWeight: 'bold', paddingVertical: 15 }}>Name:</Text>
                                    <Controller
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            style={{marginVertical: 1, borderBottomWidth: 1}}
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
                                            style={{marginVertical: 1, borderBottomWidth: 1}}
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
                                            style={{marginVertical: 1, borderBottomWidth: 1}}
                                            value={value}
                                            onChangeText={onChange}
                                        />
                                        )}
                                        name="occupation"
                                    />
                                    <Text style={{fontSize: 15, fontWeight: 'bold', marginVertical: 15 }}>Bio:</Text>
                                    <Controller
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                        <TextInput
                                            style={{marginVertical: 1, borderBottomWidth: 1}}
                                            value={value}
                                            onChangeText={onChange}
                                        />
                                        )}
                                        name="bio"
                                    />
                                    <View style={{marginTop: 60}}>
                                        <Button title="Done" color="black" onPress={handleSubmit(onSubmit)}></Button>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </View>
                <View style={{flex:1, borderWidth: .5, marginTop: 30, width: ScreenWidth}}/>
                </ScrollView>
            </SafeAreaView>
        )
    }

    export default userProfile