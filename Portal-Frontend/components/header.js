import React from "react";
import { View, Text } from "react-native";
import { ChevronDown } from "lucide-react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const Header = ({ openCategoryMenu, currentCategory }) => {
  return (
    <TouchableOpacity onPress={openCategoryMenu}
      style={{
        zIndex: 1,
        justifyContent: 'flex-end',
        right: 30,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View style={{marginTop: 5, marginHorizontal: 10}}>
          <ChevronDown color="black" size={30}/>
        </View>
        <Text style={{ fontSize: 30 }}>{currentCategory}</Text>
        
      </View>
    </TouchableOpacity>
  );
};

export default Header;
