import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import ContentWrapper from "@/components/contentwrapper";
import SimpleInput from "@/components/simpleInput";
import { AntDesign, EvilIcons, Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { horizontalScale, moderateScale } from "@/utils/metrices";
import { router, useFocusEffect } from "expo-router";

import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import useGetQuery from "@/hooks/get-query.hook";
import { apiUrls } from "@/apis/apis";
import usePostQuery from "@/hooks/post-query.hook";
import Loader from "@/components/loader";
import WebView from "react-native-webview";
import PrimaryButton from "@/components/common/PrimaryButton";

const Quizes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const tabBarHeight = useBottomTabBarHeight();
  const [mentors, setMentors] = useState([]);
  const [quizes, setQuizes] = useState([]);
  const [myQuizes, setMyQuizes] = useState([]);

  const { getQuery, loading } = useGetQuery();

  const fetchMentors = () => {
    getQuery({
      url: apiUrls.mentor,
      onSuccess: (res) => {
        console.log("mentor", res);
        setMentors(res.data.docs);
      },
    });
  };
  const fetchQuizes = () => {
    getQuery({
      url: apiUrls.quiz.getQuiz,
      onSuccess: (res) => {
        console.log("quiz", res);
        setQuizes(res.data.docs);
      },
    });
  };
  const fetchMyQuizes = () => {
    getQuery({
      url: apiUrls.quiz.myQuiz,
      onSuccess: (res) => {
        setMyQuizes(res.data.docs);
      },
    });
  };

  useFocusEffect(
    useCallback(() => {
      fetchMentors();
      fetchQuizes();
      fetchMyQuizes();
    }, [])
  );

  const Mentor = ({ data }) => {
    return (
      <TouchableOpacity
        onPress={() => router.push(`/mentor/${data._id}`)}
        style={{
          width: moderateScale(120),
          height: moderateScale(120),
          borderRadius: 16,
          marginLeft: 15,
          overflow: "hidden",
        }}
      >
        <ImageBackground
          source={{ uri: data?.image }}
          style={styles.offerSection}
          imageStyle={{ borderRadius: 10, overflow: "hidden" }}
        >
          <View style={styles.offerContent}>
            <Text style={styles.offerTittle}>{data?.name}</Text>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    );
  };

  return (
    <ContentWrapper
      mainContainerStyle={{
        paddingBottom: tabBarHeight,
      }}
    >
      <Loader visible={loading} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Quiz</Text>
          </View>
          <SimpleInput
            placeholder="Search here"
            style={styles.searchInput}
            renderLeft={() => (
              <Feather name="search" size={20} color={Colors.placeholder} />
            )}
            value={searchQuery}
            // onChangeText={handleSearch}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={[styles.completeProfileContainer, { margin: 15 }]}>
            <Text style={styles.sectionTitle}>Quizes</Text>
            <Text style={styles.viewAllText}>View all</Text>
          </View>
          {/* Courses */}
          <View style={styles.section}>
            {quizes.length ? (
              quizes.map((quiz) => {
                return (
                  <TouchableOpacity
                    key={quiz?._id}
                    onPress={() =>
                      router.push({
                        pathname: `/quiz`,
                        params: quiz,
                      })
                    }
                    style={styles.courseCard}
                  >
                    {/* <ImageBackground
                    source={{ uri: quiz?.image }}
                    style={styles.courseImage}
                  /> */}
                    <View style={styles.completeProfileContainer}>
                      <Text style={styles.courseTitle}>{quiz?.title}</Text>
                    </View>
                    <Text style={styles.courseDescription}>
                      {quiz?.description}
                    </Text>
                    <Text style={styles.priceText}> ₹ {quiz?.price}</Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View
                style={{
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    color: Colors.placeholder,
                    textAlign: "center",
                  }}
                >
                  No quiz found
                </Text>
              </View>
            )}
          </View>

          <View style={[styles.completeProfileContainer, { margin: 15 }]}>
            <Text style={styles.sectionTitle}>My Quizes</Text>
            <Text style={styles.viewAllText}>View all</Text>
          </View>
          {myQuizes.length > 0 ? (
            myQuizes.map((quiz) => {
              return (
                <View style={styles.section}>
                  <View style={styles.courseCard}>
                    {/* <ImageBackground
                    source={{ uri: quiz?.image }}
                    style={styles.courseImage}
                  /> */}
                    <View style={styles.completeProfileContainer}>
                      <Text style={styles.courseTitle}>{quiz?.quizTitle}</Text>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <View
              style={{
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  color: Colors.placeholder,
                  textAlign: "center",
                }}
              >
                No quiz enrolled
              </Text>
            </View>
          )}

          {/* mentor */}
          <View style={{ margin: 15 }}>
            <View style={styles.completeProfileContainer}>
              <Text style={styles.sectionTitle}>Mentor</Text>
              <Text style={styles.viewAllText}>View all</Text>
            </View>
            <ScrollView
              horizontal
              pagingEnabled
              // scrollEnabled
              showsHorizontalScrollIndicator={false}
              style={styles.mentor}
            >
              {mentors.map((mentor) => {
                return <Mentor data={mentor} key={mentor._id} />;
              })}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </ContentWrapper>
  );
};

export default Quizes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f5f9",
    // padding: 20,
  },
  header: {
    padding: 20,
    paddingBottom: 5,
  },
  welcomeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: moderateScale(20),
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
  },

  searchInput: {
    marginTop: 5,
    marginBottom: 5,
    padding: 5,
    borderRadius: 10,
  },
  categories: {
    flexDirection: "row",
    marginBottom: 10,
    justifyContent: "space-between",
    margin: 15,
  },
  category: {
    backgroundColor: Colors.white,
    padding: 5,
    borderRadius: 10,
    marginRight: 5,
    borderColor: Colors.placeholder,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  categoryActive: {
    backgroundColor: "#1E88E5",
    padding: 10,
    borderRadius: 10,
    marginRight: 5,
  },
  categoryText: {
    color: Colors.placeholder,
    fontSize: 15,
    fontWeight: "600",
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
  courseImage: {
    width: "100%",
    height: 150,
    borderRadius: 20,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: "semibold",
    color: Colors.black,
    marginTop: 10,
  },
  courseDescription: {
    color: Colors.placeholder,
  },
  newCourseBadge: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: Colors.primary,
    padding: 5,
    borderRadius: 10,
  },
  newCourseText: {
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  completeProfileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewAllText: {
    color: Colors.placeholder,
    fontWeight: "bold",
  },
  starIcon: {
    color: "#D97706",
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.black,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  bookmarkContainer: {
    flexDirection: "row",
    marginLeft: horizontalScale(275),
    alignItems: "flex-start",
  },
  offerSection: {
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
    height: "100%",
    flexDirection: "column",
    width: "100%",
  },
  offerContent: {
    padding: 10,
    position: "absolute",
    bottom: 0,
    overflow: "hidden",
    width: "100%",
  },
  offerTittle: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
  mentor: {
    width: "100%",
    marginTop: 15,
  },
});
