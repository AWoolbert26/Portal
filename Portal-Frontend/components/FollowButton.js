import React, { useState } from "react";
import { TouchableOpacity, Text } from "react-native";
import { toggleFollow } from "../functions/user";

const FollowButton = ({ id, follows }) => {
  const [following, setFollowing] = useState(follows);

  const toggle = async () => {
    toggleFollow(id)
      .then((res) => {
        setFollowing(!following);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <TouchableOpacity
      style={{
        borderRadius: 5,
        backgroundColor: following ? "#007FFF" : "transparent",
        borderColor: "#007FFF",
        padding: 10,
      }}
      onPress={toggle}
    >
      <Text style={{ color: following ? "white" : "#007FFF", fontWeight: 700 }}>
        {following ? "Unfollow" : "Follow"}
      </Text>
    </TouchableOpacity>
  );
};

export default FollowButton;
