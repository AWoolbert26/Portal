import React, { useState, useEffect } from "react";
import { View, TextInput, FlatList, Text, Dimensions } from "react-native";
import { Search } from "lucide-react-native";
import { getUser } from "../functions/user";

const UserSearchDropdown = ({ onUserSelect }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // Simulated user data (replace this with your actual user data)
  const allUsers = [
    { id: 1, username: "user1" },
    { id: 2, username: "user2" },
    { id: 3, username: "anotheruser" },
    // ... add more users as needed
  ];

  useEffect(() => {
    async function search() {
      const user = await getUser(searchQuery);
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
          placeholder="Search"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          onFocus={() => setIsDropdownVisible(true)}
          onBlur={() => setIsDropdownVisible(false)}
          style={{ flex: 1 }}
        />
      </View>

      {isDropdownVisible && (
        <Text
          style={{
            borderBottomWidth: 1,
            borderColor: "#ccc",
            marginLeft: 30,
            marginTop: 40,
            fontSize: 20,
          }}
          onPress={() => handleUserSelect(searchResults)}
        >
          {searchResults}
        </Text>
      )}
    </View>
  );
};

export default UserSearchDropdown;
