import React, { useEffect, useRef, useState } from "react";
import {
  View,
  SafeAreaView,
  Text,
  Image,
  ActivityIndicator,
} from "react-native";
import { Stack } from "expo-router/stack";
import { Info } from "lucide-react-native";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { Link, router } from "expo-router";
import Footer from "../../components/footer";
import Header from "../../components/header";
import CategoryMenu from "../../components/categoryMenu";
import { getPosts, getTopUsers } from "../../functions/user";
import SinglePost from "../../components/singlePost";
import { Dimensions, Modal, TouchableWithoutFeedback } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { Center } from "@gluestack-ui/config/build/theme";

const Home = () => {
  const ScreenHeight = Dimensions.get("window").height;
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("Home");
  const [posts, setPosts] = useState({});
  const [topUsers, setTopUsers] = useState({});
  const [isVisible, setIsVisible] = useState("true");
  const [loading, setLoading] = useState(true);

  const goToDescription = () => {
    router.push("/home/categorySummary");
  };

  const openCategoryMenu = () => {
    setCategoryMenuOpen(true);
  };

  const close = () => {
    setCategoryMenuOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      // Fetch posts and top users
      const fetchedPosts = await getPosts(currentCategory);
      const fetchedTopUsers = await getTopUsers();
      setTimeout(() => {
        setPosts(fetchedPosts);
        setTopUsers(fetchedTopUsers);
        setLoading(false);
      }, 1000);
    };
    fetchData();
  }, [currentCategory]);

  const postRefs = useRef([]);
  const onViewableItemsChanged = useRef(({ changed }) => {
    changed.forEach((element) => {
      const cell = postRefs.current[element.item.id];
      if (cell) {
        if (element.isViewable) {
          cell.play();
        } else {
          cell.stop();
        }
      }
    });
  });

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <LottieView
            autoPlay
            loop
            source={require("../../assets/loadinganimation.json")}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white"}}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      {/* header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1, alignSelf: "center"}}>
          <Header
            openCategoryMenu={openCategoryMenu}
            currentCategory={currentCategory}
          />
        </View>

        <Modal
          visible={categoryMenuOpen}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setCategoryMenuOpen(false)}
        >
          <TouchableWithoutFeedback onPress={close}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableWithoutFeedback>
                <View
                  style={{
                    width: "80%",
                    height: "60%",
                    backgroundColor: "white",
                    borderRadius: 10,
                    borderWidth: 1,
                  }}
                >
                  <CategoryMenu
                    close={close}
                    setCurrentCategory={setCurrentCategory}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Category Information */}
        {currentCategory != "Home" && (
          <View style={{marginRight:10, marginBottom:12}}>
            <Link
              href={{
                pathname: "/home/categorySummary",
                params: { categoryName: currentCategory },
              }}
              asChild
            >
              <TouchableOpacity>
                <Info size={30} color="#000" />
              </TouchableOpacity>
            </Link>
          </View>
        )}
      </View>
      {/* page */}
      {/* <View style={{ flexDirection: "row", alignSelf: "center" }}>
        will need to print these out under the header
        {categories.categories != null &&
          categories.categories.map((category) => {
            return (
              <View key={category.id}>
                <Text style={{ fontSize: 20 }}>{category.name}</Text>
              </View>
            );
          })}
      </View> */}
      {/* posts */}
      {!categoryMenuOpen && posts && posts.length > 0 ? (
        <FlatList
          style={{ marginBottom: 55 }}
          data={posts}
          renderItem={({ item }) => (
            <SinglePost
              ref={(postRef) => (postRefs.current[item.id] = postRef)}
              post={item}
            />
          )}
          keyExtractor={(item) => item.id}
          pagingEnabled
          onViewableItemsChanged={onViewableItemsChanged.current}
          windowSize={3}
          removeClippedSubviews
          viewabilityConfig={{ itemVisiblePercentThreshold: 75 }}
        />
      ) : (
        <View
          style={{justifyContent: "center", alignItems: "center" }}
        >
           <LottieView
            autoPlay
            loop
            source={require("../../assets/novideosanimation.json")}
            />
          {topUsers.length > 0 && (
            <View style={{ marginTop: 500}}>
            <View
                style={{
                  flexDirection: "column",
                  marginTop: 10,
                  justifyContent: "space-between",
                }}
              >
                {topUsers.map((user) => (
                  <TouchableOpacity
                    key={user.id}
                    style={{
                      flexDirection: "row",
                      justifyContent:'center',
                      alignItems: "center",
                      // backgroundColor: "black",
                    }}
                    onPress={() => router.push(`/user/${user.id}`)}
                  >
                    <Image
                      source={{
                        uri: user.profilePicture,
                      }}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        borderWidth: 1,
                        borderColor: "black",
                      }}
                    />
                    <Text style={{ marginLeft: 10, fontSize: 25 }}>
                      {user.username}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                style={{
                  marginVertical: 20,
                  padding: 10,
                  backgroundColor: "black",
                  borderRadius: 5,
              }}
              >
              <Text style={{ color: "white" }}>Follow more users to see videos.</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      {/* footer */}
      <Footer />
    </SafeAreaView>
  );
};

export default Home;
