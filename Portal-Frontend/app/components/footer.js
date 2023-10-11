import React from "react";
import View from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faMagnifyingGlass,
  faCircle,
  faUser,
} from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 30,
      }}
    >
      <View
        style={{
          borderColor: "black",
          borderWidth: 0.5,
        }}
      />
      <View
        style={{
          alignSelf: "center",
          flexDirection: "row",
          marginTop: 20,
          gap: 90,
        }}
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} size={40} />
        <FontAwesomeIcon icon={faCircle} size={40} />
        <FontAwesomeIcon icon={faUser} size={40} />
      </View>
    </View>
  );
};

export default Footer;
