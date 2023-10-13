import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const Header = ({ openCategoryMenu, currentCategory }) => {
  return (
    <TouchableOpacity style={{}} onPress={openCategoryMenu}>
      <View
        style={{
          alignSelf: "center",
          marginBottom: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Text style={{ fontSize: 30 }}>{currentCategory}</Text>
        <FontAwesomeIcon icon={faCaretDown} />
      </View>
    </TouchableOpacity>
  );
};

export default Header;
