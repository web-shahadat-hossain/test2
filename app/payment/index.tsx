import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import ContentWrapper from "@/components/contentwrapper";
import { verticalScale } from "@/utils/metrices";
import PrimaryButton from "@/components/common/PrimaryButton";
import { router, useLocalSearchParams } from "expo-router";
import Header from "@/components/header";
import usePostQuery from "@/hooks/post-query.hook";
import { apiUrls } from "@/apis/apis";
import Toast from "react-native-toast-message";
import ReferModal from "@/components/referModal";
import TermsModal from "@/components/termsModal";

const PaymentScreen = () => {
  const { courseId } = useLocalSearchParams();
  const { postQuery } = usePostQuery();

  const [referCode, setReferCode] = useState("");
  const [visibleModal, setVisibleModal] = useState(false);
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [coinCheckoutUrl, setCoinCheckoutUrl] = useState(null);

  const handleCloseModal = () => {
    setVisibleModal(false);
  };

  const enrollCourse = () => {
    postQuery({
      url: apiUrls.course.enrollCourse,
      postData: { courseId: courseId, referCode: referCode || "" },
      onSuccess: (res) => {
        console.log("API Response:", res);

        if (res.data.canUseCoins) {
          setCheckoutUrl(res.data.url); // normal checkout
          setCoinCheckoutUrl(res.data.coinUrl); // coin-based checkout
          setShowCoinModal(true);
          return;
        }

        if (res.data.url) {
          router.push({
            pathname: "/blankPage",
            params: {
              checkoutUrl: res.data.url,
              redirectPath: "/(tabs)",
            },
          });
        } else {
          Toast.show({
            type: "success",
            text1: res.message || "Course enrolled Successfully",
          });
        }
      },
      onFail: (err) => {
        console.error("Error enrolling course:", err);
        alert("Course already enrolled!!");
      },
    });
  };

  const handleProceedToPayment = () => {
    setVisibleModal(false);
    enrollCourse();
  };

  return (
    <ContentWrapper>
      <TermsModal />
      <ReferModal
        onSkip={handleProceedToPayment}
        visible={visibleModal}
        onClose={handleCloseModal}
        onSubmit={handleProceedToPayment}
        setReferCode={(value) => setReferCode(value)}
        referCode={referCode}
      />

      <Header heading={"Payment"} showLeft />

      <View style={styles.container}>
        <Text style={styles.header}>Proceed to Enroll in Course</Text>

        <PrimaryButton
          onPress={() => setVisibleModal(true)}
          text={"Proceed to Payment"}
          isOutlined
          style={styles.continueButton}
          renderIcon={() => (
            <Feather name="arrow-right" size={24} color={"white"} />
          )}
        />
      </View>

      {/* Coin Modal */}
      {showCoinModal && (
        <Modal transparent animationType="fade" visible={showCoinModal}>
          <View style={styles.overlay}>
            <View style={styles.coinModalBox}>
              <Text style={styles.coinTitle}>Use Coins?</Text>
              <Text style={{ marginVertical: 10 }}>
                You can use your coins for a discount. Would you like to use
                them?
              </Text>
              <View style={styles.coinButtonGroup}>
                <TouchableOpacity
                  onPress={() => {
                    setShowCoinModal(false);
                    router.push({
                      pathname: "/blankPage",
                      params: {
                        checkoutUrl: coinCheckoutUrl,
                        redirectPath: "/(tabs)",
                      },
                    });
                  }}
                  style={styles.coinButton}
                >
                  <Text style={{ color: "white" }}>Yes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setShowCoinModal(false);
                    router.push({
                      pathname: "/blankPage",
                      params: {
                        checkoutUrl: checkoutUrl,
                        redirectPath: "/(tabs)",
                      },
                    });
                  }}
                  style={[styles.coinButton, { backgroundColor: Colors.gray }]}
                >
                  <Text style={{ color: "white" }}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </ContentWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    marginTop: verticalScale(10),
  },
  continueButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 80,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  coinModalBox: {
    backgroundColor: "white",
    padding: 20,
    width: "80%",
    borderRadius: 10,
    alignItems: "center",
  },
  coinTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  coinButtonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    width: "100%",
    gap: 10,
  },
  coinButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
  },
});

export default PaymentScreen;
