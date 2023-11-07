import {React, useEffect, useState} from "react";
import { SafeAreaView, ScrollView, View, Text, Button } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import Footer from "../../../components/footer";
import { getCategorySummary, getAverageCategoryRating, getUserRating } from "../../../functions/user";
import { Star, X } from "lucide-react-native";
import { rateCategory } from "../../../functions/user";
import { AirbnbRating } from 'react-native-ratings';

const categorySummary = () => {
    const [userRating, setUserRating] = useState(null);
    const [averageRating, setAverageRating] = useState(null);
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
    }, []);

    useEffect(() => {
        const fetchUserRating = async () => {
          const rating = await getUserRating(categoryName);
          setUserRating(rating);
        };
        fetchUserRating();
    }, []);

    const handleRatingSubmit = async (categoryName, userRating) => {
        rateCategory(categoryName, userRating)
        await rateCategory(categoryName, userRating);
        const newAverageRating = await getAverageCategoryRating(categoryName);
        setAverageRating(newAverageRating);
    }

    useEffect(() => {
        const calculateAverageRating = async () => {
          const newAverageRating = await getAverageCategoryRating(categoryName);
          setAverageRating(newAverageRating);
        };
        calculateAverageRating();
      }, [userRating]);
      
    return(
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent:'flex-start'}}>
            <Stack.Screen options={{ title: '', headerShown: false }}/>
            <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{flex:1, alignItems:'center', justifyContent:'center', marginTop:30}}>
                <View> 
                    <Text style={{fontSize: 30, fontWeight:'400'}}>{categoryName}</Text>
                </View>
                <View>
                    <Text>Average Rating: {averageRating !== null ? averageRating : "Loading..."}</Text>
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
            <View>
                <AirbnbRating
                    count={5}
                    reviews={['DONT', 'Bad', 'Mediocre', 'Highly Recommend', 'Dream Job']}
                    defaultRating={userRating}
                    onFinishRating={(rating) => handleRatingSubmit(categoryName, rating)}
                />
            </View>
            </ScrollView>
            <Footer/>
        </SafeAreaView>
    )
}

export default categorySummary