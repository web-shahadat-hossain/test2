import { Colors } from "@/constants/Colors";
// import { horizontalScale, moderateScale } from '@/utils/metrices';
import { Entypo, Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  FlatList,
  ActivityIndicator,
} from "react-native";
import usePostQuery from "@/hooks/post-query.hook";
import { apiUrls } from "@/apis/apis";
import { router } from "expo-router";
import { useSelector } from "react-redux";

const SimilarCourse = ({
  screenName = "home",
  showRecommended = false,
  showSimiller = false,
  courseId = "",
  subjectId = "",
  keyword = "",
  emptyMessage = "Empty list",
}: any) => {
  const [courses, setCourses] = useState<any[]>([]);
  const { postQuery, loading } = usePostQuery();
  const [refreshing, setRefreshing] = useState(false);
  const user = useSelector((state) => state.user.user);

  const fetchCourses = async () => {
    setRefreshing(true); // Start refreshing
    postQuery({
      url: apiUrls.course.getCourseList,
      onSuccess: (res: any) => {
        console.log("Fetched Courses:", res.data);
        setCourses(res.data || []);
        setRefreshing(false);
      },
      onFail: (err: any) => {
        console.error("Error fetching courses:", err);
        setRefreshing(false); // Hide refresh indicator even on failure
      },
      postData: {
        page: 1,
        search: keyword,
        subjectId: subjectId || "", // optional - filter
        standardId: user?.stdId || "", // optional - filter
        type: showRecommended ? "R" : showSimiller ? "S" : "", // 'R' for recomended and 'S' for similar course
        courseId: showSimiller ? courseId : "", // courseId mandedary for similar course
      }, // No token, no extra data needed
    });
  };

  useEffect(() => {
    fetchCourses();
  }, [keyword]);

  const handlePress = (id) => {
    if (screenName == "home") {
      router.push(`/courses`);
    } else if (screenName == "courses") {
      router.push({ pathname: `/selectCourse`, params: { id: id } });
    }
  };

  const renderCourseItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={styles.courseCard}
        onPress={() => handlePress(item._id)}
      >
        <ImageBackground
          source={{ uri: item.thumbnail || "https://via.placeholder.com/300" }}
          style={styles.courseImage}
        />
        <View style={styles.newCourseBadge}>
          <Text style={styles.newCourseText}>New Course</Text>
        </View>
        <View
          style={{
            padding: 10,
          }}
        >
          <View style={styles.completeProfileContainer}>
            <Text style={styles.courseTitle}>
              {item.title || "Course Title"}
            </Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.viewAllText}>{item.rating || "4.5"}</Text>
              <AntDesign style={styles.starIcon} name="star" size={18} />
            </View>
          </View>
          <Text style={styles.courseDescription}>
            {item.description || "No description available."}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                // justifyContent: 'space-between',
                columnGap: 10,
                alignItems: "center",
              }}
            >
              <Entypo name="back-in-time" size={24} color="black" />
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "500",
                  color: Colors.placeholder,
                }}
              >
                &bull; {item?.duration}
              </Text>
            </View>
            <View style={styles.bookmarkContainer}>
              <EvilIcons name="sc-telegram" size={28} color="black" />
              <Feather name="bookmark" size={24} color="black" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" color={Colors.primary} />}
      <FlatList
        data={courses?.docs}
        renderItem={renderCourseItem}
        keyExtractor={(item) => item._id.toString()}
        ItemSeparatorComponent={() => (
          <View
            style={{
              marginRight: 20,
            }}
          />
        )}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshing={refreshing} // Pull-to-refresh state
        onRefresh={fetchCourses} // Triggers fetch when pulled down
        horizontal
        ListEmptyComponent={() => (
          <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>{emptyMessage}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  errorText: { color: "red", textAlign: "center", marginTop: 20 },
  starIcon: { color: "#D97706" },
  completeProfileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  viewAllText: { color: Colors.placeholder, fontWeight: "bold" },
  newCourseBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: Colors.primary,
    padding: 5,
    borderRadius: 10,
  },
  newCourseText: { fontWeight: "bold" },
  ratingContainer: { flexDirection: "row", alignItems: "center", gap: 5 },
  bookmarkContainer: {
    flexDirection: "row",
    // justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 5,
  },
  courseCard: {
    width: 320,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
    // padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  courseImage: { width: "100%", height: 150, borderRadius: 20 },
  courseTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.black,
    marginTop: 5,
  },
  courseDescription: { color: Colors.placeholder },
  emptyListContainer: {
    minWidth: 340,
    justifyContent: "center",
  },
  emptyListText: {
    color: Colors.placeholder,
    fontSize: 16,
    textAlign: "center",
  },
});

export default SimilarCourse;
