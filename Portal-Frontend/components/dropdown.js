import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Search } from "lucide-react-native";
import { getUsers } from "../functions/user";
import { router } from "expo-router";

const UserSearchDropdown = ({ onUserSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    async function search() {
      if(searchQuery){
        const user = await getUsers(searchQuery);
        setSearchResults(user.data);
      }
    }
    search();
  }, [searchQuery]);

  const screenWidth = Dimensions.get("window").width;

  return (
    <View 
      style={{ 
        width: screenWidth - 35,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#E4E0E0",
          borderRadius: 20,
          paddingVertical: 15,
          paddingHorizontal: 10,
        }}
      >
        <View style={{ marginHorizontal: 10 }}>
          <Search size={16} color="#333" />
        </View>
        <TextInput
          autoComplete="off"
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Search usernames"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          onFocus={() => setIsDropdownVisible(true)}
          // onBlur={() => setIsDropdownVisible(false)}
          style={{ flex: 1 }}
        />
      </View>
      <Text
        style={{
          marginTop: 10,
          fontWeight: 400
        }}
      >
          Search Results
        </Text>
      {isDropdownVisible && searchResults.length > 0 && (
        <ScrollView
          style={{
            flexDirection: "column",
            columnGap: 10,
            overflow: "hidden",
            marginBottom: 100,
            marginTop: 10,
            borderRadius: 10,
            //backgroundColor: '#CCC'
          }}
        >
          {searchResults &&
            searchResults.map((user, index) => {
              return (
                //TODO: make these into images. Will be better once the db is shared to everyone. 
                <TouchableOpacity
                  key={index}
                  style={{
                    flex: 1,
                    padding: 10,
                  }}
                  onPress={() => router.push(`/user/${user.id}`)}
                >
                  <Text
                    style={{
                      borderBottomWidth: 1,
                      borderColor: "#ccc",
                      fontSize: 20,
                      marginTop: 10,
                      marginBottom: 10,
                      marginHorizontal: 10
                    }}
                  >
                    {user.username}
                  </Text>
                </TouchableOpacity>
              );
            })}
        </ScrollView>
      )}
    </View>
  );
};

export default UserSearchDropdown;