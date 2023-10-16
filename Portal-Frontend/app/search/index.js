import React, { useState } from "react";
import { View, TextInput, Button, SafeAreaView } from "react-native";
import { Stack } from "expo-router";
import Footer from "../../components/footer";
import UserSearchDropdown from "../../components/dropdown";

const SearchPage = ({ onSearch, isVisible, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    // Perform search or send searchQuery to parent component
    onSearch(searchQuery);
  };

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center'}}>
                <Stack.Screen
                    options={{
                    title: '',
                    headerShown: false
                    }}
                />
      <View style={{ flex: 1, justifyContent: 'flex-start', paddingTop: 60, paddingHorizontal: 20 }}>
          <UserSearchDropdown onUserSelect={(user) => console.log('Selected user:', user)} />
          
        </View>
      
        {/* <Button title="Search" onPress={handleSearch} />
        <Button title="Close" onPress={onClose} /> */}
        
      <Footer></Footer>
    </SafeAreaView>
  );
};

export default SearchPage;
