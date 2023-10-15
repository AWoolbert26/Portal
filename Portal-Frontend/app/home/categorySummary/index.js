import React from "react";
import { SafeAreaView, ScrollView, View, Text } from "react-native";
import { Stack } from "expo-router";
import Footer from "../../../components/footer";

const categorySummary = () => {
    return(
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent:'flex-start'}}>
            <Stack.Screen options={{ title: '', headerShown: false }}/>
            <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{flex:1, justifyContent:'center', marginTop:30}}>
                <Text style={{flex:1, fontSize: 30, fontWeight:'400'}}>Job Summary</Text>
            </View>
            </ScrollView>
            <Footer/>
        </SafeAreaView>
    )
}

export default categorySummary