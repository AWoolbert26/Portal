import React from "react";
import { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { ChevronDown } from "lucide-react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Colors, Hint, Button, Assets, Incubator } from "react-native-ui-lib";

const Header = ({ openCategoryMenu, currentCategory }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [visible, setVisible] = useState(false);

  const onItemSelect = (index) => {
    setSelectedIndex(index);
    setVisible(false);
  };
  
  const renderToggleButton = () => (
    <Button onPress={() => setVisible(true)}>
      TOGGLE MENU
    </Button>
  );

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
          paddingBottom: 15,
        }}
      >
        <Text style={{ fontSize: 30 }}>{currentCategory}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default Header;
