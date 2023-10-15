import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, Dimensions } from 'react-native';
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const UserSearchDropdown = ({ onUserSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // Simulated user data (replace this with your actual user data)
  const allUsers = [
    { id: 1, username: 'user1' },
    { id: 2, username: 'user2' },
    { id: 3, username: 'anotheruser' },
    // ... add more users as needed
  ];

  useEffect(() => {
    // Filter users based on search query
    const filteredUsers = allUsers.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSearchResults(filteredUsers);
  }, [searchQuery]);

  const handleUserSelect = user => {
    setSearchQuery('');
    setIsDropdownVisible(false);
    onUserSelect(user);
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={{ width: screenWidth - 35}}>
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#E4E0E0', borderRadius: 20, paddingVertical: 15, paddingHorizontal: 10 }}>
        <FontAwesomeIcon icon={faSearch} style={{ marginRight: 10 }} size={16} color="#333" />
        <TextInput
          placeholder="Search"
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
          onFocus={() => setIsDropdownVisible(true)}
          onBlur={() => setIsDropdownVisible(false)}
          style={{ flex: 1 }}
        />
      </View>

      {isDropdownVisible && (
        <FlatList
          data={searchResults}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <Text style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }} onPress={() => handleUserSelect(item)}>
              {item.username}
            </Text>
          )}
        />
      )}
    </View>
  );
};

export default UserSearchDropdown;
