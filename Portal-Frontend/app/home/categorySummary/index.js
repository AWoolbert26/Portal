import {React, useEffect, useState} from "react";
import { SafeAreaView, ScrollView, View, Text } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import Footer from "../../../components/footer";
import { getCategorySummary } from "../../../functions/user";
import { Star, X } from "lucide-react-native";

const categorySummary = () => {
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
            <View style={{flex:1, alignItems:'center', justifyContent:'center', marginTop:30}}>
                <View> 
                    <Text style={{fontSize: 30, fontWeight:'400'}}>{categoryName}</Text>
                </View>
                <View style={{flexDirection: 'row', alignItems:'center', marginTop: 20, gap: 8}}>
                    <Text style={{fontSize:20, fontWeight:'bold'}}> 4.3 </Text>
                    <Star size={40} color="#000"/>
                </View>
            </View>
            <View style={{flex:1, alignItems:'center', justifyContent:'center', paddingTop: 40}}>
                <Text style={{flex:1, fontSize: 18, fontWeight:'bold'}}>Summary</Text>
                <Text style={{flex:1, fontSize: 17, maxWidth: 300,fontWeight:'400', textAlign:'center', marginTop: 10}}>{summary}</Text>
                <Text style={{flex:1, fontSize: 18, fontWeight:'bold', marginTop: 20}}>Hard Skills</Text>
                <Text style={{flex:1, fontSize: 17, maxWidth: 300,fontWeight:'400', textAlign:'center', marginTop: 10}}>{hardSkills}</Text>
                <Text style={{flex:1, fontSize: 18, fontWeight:'bold', marginTop: 20}}>Common Traits</Text>
                <Text style={{flex:1, fontSize: 17, maxWidth: 300,fontWeight:'400', textAlign:'center', marginTop: 10}}>{commonTraits}</Text>
                <Text style={{flex:1, fontSize: 18, fontWeight:'bold', marginTop: 20}}>Education</Text>
                <Text style={{flex:1, fontSize: 17, maxWidth: 300,fontWeight:'400', textAlign:'center', marginTop: 10}}>{education}</Text>
                <Text style={{flex:1, fontSize: 18, fontWeight:'bold', marginTop: 20}}>Average Pay</Text>
                <Text style={{flex:1, fontSize: 17, maxWidth: 300,fontWeight:'400', textAlign:'center', marginTop: 10}}>{averagePay}</Text>
                <Text style={{flex:1, fontSize: 18, fontWeight:'bold', marginTop: 20}}>Threat of AI</Text>
                <Text style={{flex:1, fontSize: 17, maxWidth: 300,fontWeight:'400', textAlign:'center', marginTop: 10}}>{threatOfAI}</Text>
            </View>
            </ScrollView>
            <Footer/>
        </SafeAreaView>
    )
}

export default categorySummary