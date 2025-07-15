import ContentWrapper from "@/components/contentwrapper";
import SimpleInput from "@/components/simpleInput";
import { Colors } from "@/constants/Colors";
import { horizontalScale, moderateScale } from "@/utils/metrices";
import { Entypo, Feather } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  FlatList,
  RefreshControl,
} from "react-native";
import { Link, router } from "expo-router";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import * as Progress from "react-native-progress";
import PrimaryButton from "@/components/common/PrimaryButton";
import { getItem } from "@/utils/asyncStorage";
import SimilarCourse from "@/components/courseCard"; // Your SimilarCourse component
import useGetQuery from "@/hooks/get-query.hook";
import { apiUrls } from "@/apis/apis";
import { useSelector } from "react-redux";
import moment from "moment";
import { useFocusEffect } from "@react-navigation/native";
import usePostQuery from "@/hooks/post-query.hook";

const HomeScreen = () => {
  const { user } = useSelector((state) => state.user);

  const tabBarHeight = useBottomTabBarHeight();
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileComplete, setIsProfileComplete] = useState(true);
  const { getQuery, loading, data } = useGetQuery();

  // Refs for scrolling
  const scrollViewRef = useRef<ScrollView>(null);
  const recommendedSectionRef = useRef<View>(null);

  // Function to handle search input changes
  const handleSearch = (text) => {
    setSearchQuery(text);
    // When a search term is entered, scroll to the "Recommended for You" section
    if (recommendedSectionRef.current && scrollViewRef.current) {
      // Use setTimeout to allow layout to recalculate after text input changes
      setTimeout(() => {
        recommendedSectionRef.current.measureLayout(
          scrollViewRef.current,
          (x, y, width, height) => {
            scrollViewRef.current?.scrollTo({ y: y, animated: true });
          },
          (error) => {
            console.warn("Failed to measure layout for scrolling:", error);
          }
        );
      }, 100); // Small delay
    }
  };

  // Function to handle the "Your Progress" view cross click
  const handleCrossClick = () => {
    setIsProfileComplete(false);
  };

  const [refreshing, setRefreshing] = React.useState(false);

  // Offer Card API call
  useEffect(() => {
    getQuery({
      url: apiUrls.offer,
    });
  }, []);

  const OfferCard = ({ data }) => {
    return (
      <View style={{ width: 320 }}>
        <ImageBackground
          source={{ uri: data?.image }}
          style={styles.offerSection}
          imageStyle={{ borderRadius: 10 }}
        >
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{data?.offrPer}%</Text>
          </View>
          <View style={styles.offerContent}>
            <Text style={styles.offerTittle}>{data?.title}</Text>
            <Text style={styles.offerText}>{data?.description}</Text>
          </View>
        </ImageBackground>
      </View>
    );
  };

  return (
    <ContentWrapper
      mainContainerStyle={{
        paddingBottom: tabBarHeight,
      }}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>
              Welcome {user?.user?.name || user?.name || "Jhon Doe"}! 👍
            </Text>
            <FontAwesome
              style={styles.bellIcon}
              name="bell"
              size={24}
              color="black"
            />
          </View>
          <SimpleInput
            placeholder="Search here"
            style={styles.searchInput}
            renderLeft={() => (
              <Feather name="search" size={20} color={Colors.placeholder} />
            )}
            value={searchQuery}
            onChangeText={handleSearch} // This will trigger search and scroll
          />
        </View>

        <ScrollView
          ref={scrollViewRef} // Assign ref to the main ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} />}
        >
          {/* Complete Profile conditionally render */}
          {isProfileComplete ? (
            <View style={styles.profileSection}>
              <TouchableOpacity style={styles.cross} onPress={handleCrossClick}>
                <Entypo
                  style={styles.crossIcon}
                  name="cross"
                  size={22}
                  color="white"
                />
              </TouchableOpacity>
              <View style={styles.completeProfileContainer}>
                <Text style={styles.sectionTitle}>Complete Profile</Text>
                <Link href="/profile/profileDetails" style={styles.seeAllText}>
                  See all
                </Link>
              </View>
              <View
                style={[
                  styles.dashDivider,
                  {
                    width: `${100 - 100 / user?.profileCompletion}%`,
                  },
                ]}
              />
              <Text style={styles.profileDescription}>
                Completing your profile allows for a more accurate assessment of
                your studies and education.
              </Text>
            </View>
          ) : (
            // Your Progress View
            <View>
              <Text style={styles.progressTitle}>Your Progress</Text>
              <View style={styles.progressSection}>
                <View style={styles.completeProfileContainer}>
                  <View style={styles.studyContainer}>
                    <AntDesign
                      style={styles.playIcon}
                      name="playcircleo"
                      size={30}
                      color="#387ade"
                    />
                    <View>
                      <Text style={styles.studyTitle}>Study Name</Text>
                      <Text style={styles.detailsText}>Study details</Text>
                    </View>
                  </View>
                  <Text style={styles.minText}>5 min</Text>
                </View>

                <View style={{ marginTop: 10 }}>
                  <Progress.Bar
                    style={{
                      marginTop: 10,
                      backgroundColor: "white",
                      borderRadius: 10,
                    }}
                    borderRadius={10}
                    unfilledColor="white"
                    borderColor="blue"
                    animated={true}
                    animationConfig={{ bounciness: 5 }}
                    progress={0.4}
                    height={10}
                    width={200}
                    animationType="timing"
                  />
                </View>

                <PrimaryButton
                  text="Start"
                  style={styles.continueButton}
                  onPress={() => {}}
                />
              </View>
            </View>
          )}

          {/* Offer Section */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {data?.data?.offers?.map((offer) => {
              return <OfferCard data={offer} key={offer._id} />;
            })}
          </ScrollView>

          {/* Recommended for You Section */}
          <View
            ref={recommendedSectionRef} // Assign ref to this section for scrolling
            style={styles.section}
          >
            <View style={styles.completeProfileContainer}>
              <Text style={styles.sectionTitle}>Recommended for You</Text>
              <Text style={styles.viewAllText}>View all</Text>
            </View>
            {/* Pass the searchQuery to SimilarCourse as the 'keyword' prop */}
            <SimilarCourse
              keyword={searchQuery}
              screenName={"home"} // Keep existing screenName prop
              // Dynamic empty message based on whether a search is active
              emptyMessage={
                searchQuery
                  ? "No courses found for your search."
                  : "No courses available."
              }
            />
          </View>
        </ScrollView>
      </View>
    </ContentWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  header: {
    padding: 20,
    paddingBottom: 5,
  },
  welcomeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: moderateScale(30),
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  bellIcon: {
    backgroundColor: "#EAEAEA",
    padding: 10,
    borderRadius: 50,
  },

  searchInput: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
  },
  cross: {
    top: -10,
    right: 1,
    position: "absolute",
    padding: 1,
    borderRadius: 50,
  },
  crossIcon: {
    backgroundColor: "#cbd5e1",
    borderRadius: 50,
  },
  profileSection: {
    margin: 15,
    padding: 15,
    backgroundColor: Colors.white,
    borderRadius: 10,
  },
  progressSection: {
    margin: 15,
    padding: 15,
    backgroundColor: Colors.primary,
    borderRadius: 10,
  },
  completeProfileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  studyContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  seeAllText: {
    color: Colors.primary,
    textDecorationLine: "underline",
  },
  studyTitle: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  minText: {
    color: Colors.white,
  },
  detailsText: {
    color: Colors.placeholder,
    fontSize: 16,
    fontWeight: "600",
  },
  viewAllText: {
    color: Colors.placeholder,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 15,
  },
  continueButton: {
    marginTop: 20,
    width: "100%",
    backgroundColor: Colors.white,
  },
  playIcon: {
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 50,
  },

  offerTittle: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: "bold",
  },
  profileDescription: {
    color: Colors.placeholder,
  },
  dashDivider: {
    borderTopWidth: 10,
    borderColor: Colors.primary,
    borderStyle: "solid",
    borderRadius: 8,
    marginVertical: 10,
  },
  offerSection: {
    margin: 15,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
    height: 150,
  },

  discountBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 10,
  },
  discountText: {
    fontWeight: "bold",
  },

  offerContent: {
    padding: 10,
    position: "absolute",
    bottom: 0,
  },
  offerText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 10,
  },
  section: {
    margin: 15,
  },
  courseCard: {
    marginTop: 10,
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 10,
  },
});

export default HomeScreen;
