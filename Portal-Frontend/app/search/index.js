import React, { useState } from "react";
import {
  Platform,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { Stack } from "expo-router";

import Footer from "../../components/footer";
import UserSearchDropdown from "../../components/dropdown";

const categories = {
  1: "Law",
  2: "Computer Science",
  3: "Business",
  4: "Politics",
  5: "Mechanical Engineering",
  6: "Art",
  7: "Retail",
  8: "Agriculture",
  9: "Sales",
  10: "Healthcare",
  11: "Media and Entertainment",
};



const SearchPage = () => {
  const pressed = (id) => {
    //TODO
  };

  return (
    <SafeAreaView
      style={{ flex: 1, alignItems: "flex-start", justifyContent: "center" }}
    >
      <Stack.Screen
        options={{
          title: "",
          headerShown: false,
        }}
      />
      <View
        style={{
          justifyContent: "flex-start",
          paddingTop: 20,
          paddingHorizontal: 20,
        }}
      >
        <UserSearchDropdown
          onUserSelect={(user) => console.log("Selected user:", user)}
        />
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 20
        }}
      >
        <ScrollView>
          {categories &&
            Object.entries(categories).map(([id, name]) => {
              return (
                <View
                  key={id}
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                    marginTop: 10,
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize:20
                    }}
                  >
                    {name}
                  </Text>
                  <ScrollView
                    horizontal={true}
                  >
                    <TouchableOpacity
                      key={id}
                      onPress={() => pressed(id)}
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 10,
                        borderColor: 'black',
                        borderStyle: "solid",
                        borderWidth: 0,
                        //backgroundColor: '#CCCCCC',
                        margin: 3,
                        borderRadius: 4
                      }}
                    >
                      <Text
                        style={{

                        }}
                      >
                        {/*{name}*/}
                      </Text>
                    </TouchableOpacity>


                  </ScrollView>
                </View>
              );
            })

          }
        </ScrollView>
      </View>
      <Footer />
    </SafeAreaView>
  );
};

export default SearchPage;