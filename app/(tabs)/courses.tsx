import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ContentWrapper from "@/components/contentwrapper";
import SimpleInput from "@/components/simpleInput";
import { AntDesign, Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { horizontalScale, moderateScale } from "@/utils/metrices";
import { Link, router } from "expo-router";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import SimilarCourse from "@/components/courseCard";
import { apiUrls } from "@/apis/apis";
import useGetQuery from "@/hooks/get-query.hook";

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const tabBarHeight = useBottomTabBarHeight();
  const { getQuery, loading, data } = useGetQuery();

  useEffect(() => {
    getQuery({
      url: apiUrls.mentor,
    });
  }, []);

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
          imageStyle={{ borderRadius: 10 }}
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
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcomeText}>Courses</Text>
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

        {/* Categories 
        <View style={styles.categories}>
          <TouchableOpacity style={styles.categoryActive}>
            <Text style={styles.categoryText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.category}>
            <Text style={styles.categoryText}>JEE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.category}>
            <Text style={styles.categoryText}>NEET</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.category}>
            <Text style={styles.categoryText}>GUJCET</Text>
          </TouchableOpacity>
        </View>
      */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Courses */}
          {/* <View style={styles.section}>
            <TouchableOpacity
              onPress={() => router.push("/selectCourse")}
              style={styles.courseCard}
            >
              <ImageBackground
                source={require("../../assets/images/course.jpg")}
                style={styles.courseImage}
              />
              <View style={styles.newCourseBadge}>
                <Text style={styles.newCourseText}>New Course</Text>
              </View>
              <View style={styles.completeProfileContainer}>
                <Text style={styles.courseTitle}>UI/UX Design Course</Text>
                <View style={styles.ratingContainer}>
                  <Text style={styles.viewAllText}>4.8</Text>
                  <AntDesign style={styles.starIcon} name="star" size={24} />
                </View>
              </View>
              <Text style={styles.courseDescription}>
                Discover the essential principles of UI/UX design and learn how
                to create intuitive products.
              </Text>
              <Text style={styles.priceText}>$ 150.00</Text>
            </TouchableOpacity>
          </View> */}
          {/* Recommended screen */}
          <View style={styles.section}>
            <View style={styles.completeProfileContainer}>
              <Text style={styles.sectionTitle}>Recommended for You</Text>
              <Text style={styles.viewAllText}>View all</Text>
            </View>
            <SimilarCourse
              screenName="courses"
              emptyMessage="No courses found"
            />
          </View>

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
              {data?.data?.docs.map((mentor) => {
                return <Mentor data={mentor} key={mentor._id} />;
              })}
            </ScrollView>
          </View>

          {/* Recommended for You */}
          {/* <View style={styles.section}>
            <View style={styles.completeProfileContainer}>
              <Text style={styles.sectionTitle}>Recommended for You</Text>
              <Text style={styles.viewAllText}>View all</Text>
            </View>
            <SimilarCourse
              screenName="courses"
              emptyMessage="No courses found"
            />
          </View> */}
        </ScrollView>
      </View>
    </ContentWrapper>
  );
};

export default Courses;

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
