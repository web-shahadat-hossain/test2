import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import ContentWrapper from "@/components/contentwrapper";
import Header from "@/components/header";
import { apiUrls } from "@/apis/apis";
import useGetQuery from "@/hooks/get-query.hook";
const { width } = Dimensions.get("window");
const scaleFactor = width / 375;
const scale = (size) => size * scaleFactor;

const MentorDetails = () => {
  const { mentorId } = useLocalSearchParams(); // Get mentor ID from URL params
  const { getQuery, loading, data } = useGetQuery();
  const [mentor, setMentor] = useState(null);

  useEffect(() => {
    if (mentorId) {
      getQuery({
        url: apiUrls.mentorDetails(mentorId),
        onSuccess: (res) => {
          console.log("res..............//", res);
          setMentor(res.data.docs);
        },
      });
    }
  }, [mentorId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (!mentor) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>No Mentor Found</Text>
      </View>
    );
  }

  return (
    <ContentWrapper>
      <Header heading={"Mentor Deatils"} showLeft />
      <ScrollView style={styles.container}>
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: mentor?.image }}
              style={styles.profileImage}
            />
          </View>
        </View>

        <View style={styles.nameContainer}>
          <Text style={styles.nameText}>{mentor?.name}</Text>
        </View>

        <View style={styles.expertiseContainer}>
          <Text style={styles.expertiseTitle}>Expertise In</Text>
          <Text style={styles.expertiseText}>
            {mentor?.expertise?.join(", ")}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Experience</Text>
            <Text style={styles.infoValue}>{mentor?.experienceYears}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone Number</Text>
            <Text style={styles.infoValue}>{mentor?.mobile}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{mentor?.email}</Text>
          </View>
        </View>

        <View style={styles.descriptionSection}>
          <View style={styles.descriptionHeader}>
            <Text style={styles.descriptionTitle}>Bio</Text>
          </View>

          <Text style={styles.descriptionText}>{mentor?.bio}</Text>
        </View>
      </ScrollView>
    </ContentWrapper>
  );
};

export default MentorDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
    //   paddingTop: Constant.statusBarHeight,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: scale(16),
    paddingTop: scale(16),
  },
  profileImageContainer: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(40),
    overflow: "hidden",
    alignSelf: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: scale(30),
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  ratingContainer: {
    position: "absolute",
    top: scale(16),
    left: scale(16),
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: scale(14),
    fontWeight: "600",
    marginRight: scale(4),
  },
  ratingIcon: {
    fontSize: scale(14),
  },

  nameContainer: {
    alignItems: "center",
    marginTop: scale(12),
  },
  nameText: {
    fontSize: scale(24),
    fontWeight: "700",
    color: "#0f172a",
  },
  expertiseContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: scale(6),
    flexWrap: "wrap",
  },
  expertiseTitle: {
    fontSize: scale(16),
    color: "#64748b",
    marginRight: scale(4),
  },
  expertiseText: {
    fontSize: scale(14),
    flexDirection: "row", // 🚫 forces children to align in one row
    justifyContent: "center",
    alignItems: "center",
    marginTop: scale(6),
    flexWrap: "wrap",
  },
  divider: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: scale(16),
    marginHorizontal: scale(16),
  },
  infoSection: {
    marginHorizontal: scale(16),
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: scale(12),
  },
  infoLabel: {
    fontSize: scale(16),
    color: "#64748b",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: scale(16),
    color: "#0f172a",
  },
  descriptionSection: {
    marginHorizontal: scale(16),
    marginTop: scale(16),
    marginBottom: scale(24),
  },
  descriptionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: scale(12),
  },
  descriptionTitle: {
    fontSize: scale(16),
    fontWeight: "600",
    color: "#0f172a",
  },
  descriptionText: {
    fontSize: scale(16),
    lineHeight: scale(20),
    color: "#334155",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#666",
  },
});
