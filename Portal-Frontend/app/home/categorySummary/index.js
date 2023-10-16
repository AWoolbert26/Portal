import {React, useEffect, useState} from "react";
import { SafeAreaView, ScrollView, View, Text } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import Footer from "../../../components/footer";
import { getCategorySummary } from "../../../functions/user";

const categorySummary = ({ route }) => {
    const [summary, setSummary] = useState(null);
    const [hardSkills, setHardSkills] = useState(null);
    const [commonTraits, setCommonTraits] = useState(null);
    const [education, setEducation] = useState(null);
    const [averagePay, setAveragePay] = useState(null);
    const [threatOfAI, setThreatOfAi] = useState(null);

    const { categoryName } = useLocalSearchParams();
    useEffect(() => {
        getCategorySummary(categoryName)
            .then((result) => {
                console.log("Result: " + result.summary)
                setSummary(result.summary)
                setHardSkills(result.hardSkills)
                setCommonTraits(result.commonTraits)
                setEducation(result.education)
                setAveragePay(result.averagePay)
                setThreatOfAi(result.threatOfAI)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])
    return(
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent:'flex-start'}}>
            <Stack.Screen options={{ title: '', headerShown: false }}/>
            <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{flex:1, justifyContent:'center', marginTop:30}}>
                <Text style={{flex:1, fontSize: 20, fontWeight:'400'}}>{summary}</Text>
                <Text style={{flex:1, fontSize: 20, fontWeight:'400'}}>{hardSkills}</Text>
                <Text style={{flex:1, fontSize: 20, fontWeight:'400'}}>{commonTraits}</Text>
                <Text style={{flex:1, fontSize: 20, fontWeight:'400'}}>{education}</Text>
                <Text style={{flex:1, fontSize: 20, fontWeight:'400'}}>{averagePay}</Text>
                <Text style={{flex:1, fontSize: 20, fontWeight:'400'}}>{threatOfAI}</Text>

            </View>
            </ScrollView>
            <Footer/>
        </SafeAreaView>
    )
}

export default categorySummary