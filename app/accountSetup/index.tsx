import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ContentWrapper from "@/components/contentwrapper";
import Header from "@/components/header";
import { moderateScale, verticalScale } from "@/utils/metrices";
import ImagePickerExample from "@/components/imageUpload";
import SimpleInput from "@/components/simpleInput";
import DateInput from "@/components/dateInput";
import PrimaryButton from "@/components/common/PrimaryButton";
import { router, useLocalSearchParams } from "expo-router";
import DropdownPicker from "@/components/dropDown";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Toast from "react-native-toast-message";
import { apiUrls } from "@/apis/apis";
import usePutQuery from "@/hooks/put-query.hook";
import useGetQuery from "@/hooks/get-query.hook";
import Loader from "@/components/loader";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "@/redux/slices/userSlice";

const flowOneSchema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email().required("Email is required"),
  dob: yup.date(),
});
const flowTwoSchema = yup.object({
  schoolName: yup.string().required("School name is required"),
  gender: yup.string().required("Gender is required"),
  stdId: yup.string().required("Standard is required"),
  boardId: yup.string().required("Board is required"),
  learningGoal: yup.string().optional(),
  subject: yup
    .array()
    .of(yup.string())
    .required("Subject is required")
    .min(1, "Subject is required"),
  activity: yup
    .array()
    .of(yup.string())
    .required("Activity is required")
    .min(1, "Activity is required"),
});

const genderOptions = [
  { label: "Male", value: "m" },
  { label: "Female", value: "f" },
];

const AccountSetup = () => {
  const [active, setActive] = useState(0);
  const { putQuery, loading } = usePutQuery();
  const [standardOptions, setStandardOptions] = useState([]);
  const [boardOptions, setBoardOptions] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [activityOptions, setActivityOptions] = useState([]);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const handleUpdateProfile = (data: any) => {
    const formatData = {
      ...data,
      stdId: data?.stdId?._id,
      boardId: data?.boardId?._id,
      subject: data?.subject?.map((item) => item?._id),
      activity: data?.activity?.map((item) => item?._id),
    };
    dispatch(updateUser(formatData));
  };

  const params = useLocalSearchParams();

  const { getQuery, loading: getLoading } = useGetQuery();

  const getStandards = () => {
    getQuery({
      url: apiUrls.misc.standard,
      onSuccess: (res: any) => {
        setStandardOptions(res.data);
      },
    });
  };

  const getBoards = () => {
    getQuery({
      url: apiUrls.misc.board,
      onSuccess: (res: any) => {
        setBoardOptions(res.data);
      },
    });
  };

  const getSubjects = () => {
    getQuery({
      url: apiUrls.misc.subject,
      onSuccess: (res: any) => {
        setSubjectOptions(res.data);
      },
    });
  };
  const getActivites = () => {
    getQuery({
      url: apiUrls.misc.activity,
      onSuccess: (res: any) => {
        setActivityOptions(res.data);
      },
    });
  };

  useEffect(() => {
    getStandards();
    getBoards();
    getSubjects();
    getActivites();
  }, []);

  const FlowOne = () => {
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(flowOneSchema),
      defaultValues: {
        firstName: user?.name?.split(" ")?.[0],
        lastName: user?.name?.split(" ")?.[1],
        email: user?.email,
      },
    });

    const onSubmit = (data: any) => {
      let postData = {};
      if (params?.heading) {
        postData = {
          name: data.firstName + " " + data.lastName,
          email: data.email,
        };
      } else {
        postData = {
          name: data.firstName + " " + data.lastName,
          email: data.email,
          dob: data.dob,
        };
      }

      putQuery({
        url: apiUrls.user.updateProfile,
        onSuccess: (res: any) => {
          handleUpdateProfile(res.data);
          setActive(1);
        },
        onFail: (err: any) => {
          Toast.show({
            type: "error",
            text1: err?.message || "Something went wrong!",
          });
          console.log(err);
        },
        putData: postData,
      });
    };
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
        }}
      >
        <View>
          <View style={styles.imageUploadContainer}>
            <ImagePickerExample />
          </View>
          <View style={styles.formContainer}>
            <View
              style={{
                flex: 1,
              }}
            >
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <SimpleInput
                    label="First name*"
                    placeholder="john"
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.firstName && errors.firstName.message}
                  />
                )}
                name="firstName"
              />
            </View>
            <View
              style={{
                flex: 1,
              }}
            >
              <Controller
                control={control}
                render={({ field: { onChange, value } }) => (
                  <SimpleInput
                    label="Last name*"
                    placeholder="Deo"
                    onChangeText={onChange}
                    value={value}
                    errorMessage={errors.lastName && errors.lastName.message}
                  />
                )}
                name="lastName"
              />
            </View>
          </View>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <SimpleInput
                label="Email address*"
                placeholder="johndeo123@gmail.com"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email && errors.email.message}
              />
            )}
            name="email"
          />

          {!params?.heading && (
            <Controller
              control={control}
              rules={{
                required: "Date of birth is required",
              }}
              render={({ field: { onChange, value } }) => (
                <DateInput
                  label="Date of Birth"
                  dateValue={value}
                  onChange={onChange}
                  error={errors.dob && errors.dob.message}
                />
              )}
              name="dob"
            />
          )}
        </View>
        <PrimaryButton
          style={{ marginTop: moderateScale(20) }}
          onPress={handleSubmit(onSubmit)}
          text={"Continue"}
          isOutlined
        />
      </View>
    );
  };

  const FlowTwo = () => {
    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm({
      resolver: yupResolver(flowTwoSchema),
      defaultValues: {
        schoolName: user?.schoolName || "",
        gender: user?.gender || "m",
        stdId: user?.stdId,
        boardId: user?.boardId,
        learningGoal: user?.learningGoal,
        subject: user?.subject,
        activity: user?.activity,
      },
    });

    const onFlowTwoSubmit = (data: any) => {
      putQuery({
        url: apiUrls.user.updateProfile,
        onSuccess: (res: any) => {
          handleUpdateProfile(res.data);
          router.push("/(tabs)");
          Toast.show({
            type: "success",
            text1: "Profile updated successfully!",
          });
        },
        onFail: (err: any) => {
          Toast.show({
            type: "error",
            text1: err.message || "Something went wrong!",
          });
          console.log(err);
        },
        putData: data,
      });
    };
    return (
      <View
        style={{
          flex: 1,
          paddingTop: moderateScale(20),
          justifyContent: "space-between",
        }}
      >
        <View>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <SimpleInput
                label="School Name *"
                placeholder="School Name"
                onChangeText={onChange}
                value={value}
                errorMessage={errors.schoolName && errors.schoolName.message}
              />
            )}
            name="schoolName"
          />
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <>
                <DropdownPicker
                  options={genderOptions.map((gender) => ({
                    label: gender?.label,
                    value: gender?.value,
                  }))}
                  label="Gender *"
                  onValueChange={onChange}
                  selectedValue={value}
                />

                <Text
                  style={{
                    fontSize: 12,
                    color: "red",
                  }}
                >
                  {errors.gender && errors.gender.message}
                </Text>
              </>
            )}
            name="gender"
          />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              columnGap: moderateScale(16),
            }}
          >
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <View style={{ flex: 1, flexDirection: "column" }}>
                  <DropdownPicker
                    options={standardOptions.map((standard) => ({
                      label: standard?.std,
                      value: standard?._id,
                    }))}
                    label="Standard *"
                    onValueChange={onChange}
                    selectedValue={value}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      color: "red",
                      marginTop: 5,
                    }}
                  >
                    {errors.stdId && errors.stdId.message}
                  </Text>
                </View>
              )}
              name="stdId"
            />

            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <View View style={{ flex: 1, flexDirection: "column" }}>
                  <DropdownPicker
                    options={boardOptions.map((board) => ({
                      label: board?.boardname,
                      value: board?._id,
                    }))}
                    label="Board of *"
                    onValueChange={onChange}
                    selectedValue={value}
                  />

                  <Text
                    style={{
                      fontSize: 12,
                      color: "red",
                      marginTop: 5,
                    }}
                  >
                    {errors.boardId && errors.boardId.message}
                  </Text>
                </View>
              )}
              name="boardId"
            />
          </View>
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <SimpleInput
                label="Learning goal (optional)*"
                placeholder="Type your goal"
                onChangeText={onChange}
                value={value}
                errorMessage={
                  errors.learningGoal && errors.learningGoal.message
                }
              />
            )}
            name="learningGoal"
          />
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <>
                <DropdownPicker
                  options={subjectOptions.map((subject) => ({
                    label: subject?.subject,
                    value: subject?._id,
                  }))}
                  label="Subject of Interest"
                  onValueChange={onChange}
                  itemsValue={value}
                  multi
                />

                <Text
                  style={{
                    fontSize: 12,
                    color: "red",
                  }}
                >
                  {errors.subject && errors.subject.message}
                </Text>
              </>
            )}
            name="subject"
          />
          <Controller
            control={control}
            render={({ field: { onChange, value } }) => (
              <>
                <DropdownPicker
                  options={activityOptions.map((activity) => ({
                    label: activity?.activityname,
                    value: activity?._id,
                  }))}
                  label="Other Activites"
                  onValueChange={onChange}
                  itemsValue={value}
                  multi
                />

                <Text
                  style={{
                    fontSize: 12,
                    color: "red",
                  }}
                >
                  {errors.activity && errors.activity.message}
                </Text>
              </>
            )}
            name="activity"
          />
        </View>
        <PrimaryButton
          onPress={handleSubmit(onFlowTwoSubmit)}
          text={"Continue"}
          isOutlined
        />
      </View>
    );
  };

  return (
    <ContentWrapper>
      <Loader visible={loading || getLoading} />
      <Header
        heading={params?.heading || "Account Setup"}
        showLeft
        renderRight={() => (
          <Text
            onPress={
              active === 0 ? () => setActive(1) : () => router.push("/(tabs)")
            }
          >
            Skip
          </Text>
        )}
        style={{
          marginTop: moderateScale(24),
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.barContainer}>
            <TouchableOpacity style={styles.barOne} />
            <TouchableOpacity
              style={active === 0 ? styles.barTwo : styles.barTwoActive}
            />
          </View>
          {active === 0 && <FlowOne />}
          {active === 1 && <FlowTwo />}
        </View>
      </ScrollView>
    </ContentWrapper>
  );
};

export default AccountSetup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: moderateScale(24),
    justifyContent: "space-between",
    paddingBottom: verticalScale(20),
  },
  barContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    columnGap: moderateScale(4),
  },
  barOne: {
    flex: 1,
    height: 4,
    backgroundColor: "#387ADE",
    borderRadius: moderateScale(12),
  },
  barTwo: {
    flex: 1,
    height: 4,
    backgroundColor: "#E2E8F0",
    borderRadius: moderateScale(12),
  },
  barTwoActive: {
    flex: 1,
    height: 4,
    backgroundColor: "#387ADE",
    borderRadius: moderateScale(12),
  },
  imageUploadContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: verticalScale(20),
  },
  formContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: moderateScale(16),
    marginTop: verticalScale(44),
  },
});
