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
      const user = await getUsers(searchQuery);
      setSearchResults(user.data);
    }
    search();
  }, [searchQuery]);

  const handleUserSelect = (user) => {
    onUserSelect(user);
  };

  const screenWidth = Dimensions.get("window").width;

  return (
    <View style={{ width: screenWidth - 35 }}>
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
          autoCapitalize={false}
          placeholder="Search"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          onFocus={() => setIsDropdownVisible(true)}
          // onBlur={() => setIsDropdownVisible(false)}
          style={{ flex: 1 }}
        />
      </View>
      <ScrollView
        style={{
          flexDirection: "column",
          columnGap: 10,
          overflow: "hidden",
          marginBottom: 100,
        }}
      >
        {isDropdownVisible &&
          searchResults &&
          searchResults.map((user, index) => {
            return (
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
                  }}
                >
                  {user.username}
                </Text>
              </TouchableOpacity>
            );
          })}
      </ScrollView>
    </View>
  );
};

export default UserSearchDropdown;
