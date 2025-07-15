import React, { useEffect, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { boolean, string } from "yup";

const { width, height } = Dimensions.get("window");

type ReferModalProps = {
  visible: boolean;
  onClose: () => void;
  onSkip: () => void;
  onSubmit: () => void;
  setReferCode: (code: string) => void;
  referCode: string;
};

const ReferModal = ({
  visible = false,
  onClose,
  onSubmit,
  setReferCode,
  onSkip,
  referCode = "",
}: ReferModalProps) => {
  const [inputValue, setInputValue] = useState(referCode);

  useEffect(() => {
    setReferCode(inputValue);
  }, [inputValue]);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
            <Text style={styles.skip}>Skip</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Enter Refer Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Optional"
            value={inputValue}
            onChangeText={setInputValue}
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              columnGap: 20,
            }}
          >
            <TouchableOpacity style={styles.button} onPress={onSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: width * 0.8,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    marginTop: height * 0.7,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  skip: {
    fontSize: 18,
    color: "black",
    fontWeight: "bold",
  },
  skipButton: {
    position: "absolute",
    top: 1,
    right: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default ReferModal;
