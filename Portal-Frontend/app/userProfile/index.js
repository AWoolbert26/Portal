    import React from "react";
    import { View, Text, SafeAreaView, ScrollView, Button} from "react-native";
    import { Stack } from "expo-router";
    import { TouchableOpacity } from "react-native-gesture-handler";
    import { useState, useEffect } from "react";
    import { getUserInformation } from "../functions/user";

    const userProfile = () => {
        const [username, setUsername] = useState(null);
        useEffect(() => {
            getUserInformation()
            .then((result) => {
            setUsername(result.data.username);
        })
        .catch((error) => {
            console.error('Error while retrieving username:', error);
        });
        }, []);
        return (
            <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff'}}>
                <Stack.Screen
                    options={{
                    title: '',
                    headerRight: () => (
                        <Text>Login</Text>
                    ),
                    }}
                />
                <ScrollView showsVerticalScrollIndicator={false}>
                <View 
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingTop: 100
                    }}>
                    {username && <Text style={{fontSize: 20}}> Welcome, {username} </Text>}
                    <Text>Your interests: </Text>
                </View>
                </ScrollView>
            </SafeAreaView>
        )
    }

    export default userProfile