// hostinger backend
export const apiBaseUrl = "https://api.knowledgetemple.in/api/v1";
// export const apiBaseUrl = 'https://back.knowledgetemple.in/api/v1';
// aws backend
// export const apiBaseUrl = 'http://13.233.246.47/api/v1';
// local backend
// export const apiBaseUrl = 'http://192.168.0.111:80/api/v1';

export const apiUrls = {
  signup: {
    getOtp: "/user/getOtp",
    verifyOtp: "/user/verifyOtp",
    createPassword: "/user/createPassword",
  },
  signIn: "/user/signIn",
  user: {
    getProfile: "/user/getProfile",
    updateProfile: "/user/updateProfile",
    deleteAccount: "/user/deleteAccount",
    logout: "/user/logout",
    changePassword: "/user/changePassword",
    forgotPassword: "/user/forgotPassword",
  },
  course: {
    getCourseList: "/user/course/getCourses",
    getCourseDetails: "/user/course/getCourseDetail",
    getCourseTracking: "/user/getCourseTracking",

    enrollCourse: "/user/course/enroll",
  },
  material: {
    getMaterials: "/user/material/getMaterial",
    getCourseMaterials: "/user/material//getCoursesMaterial",
  },
  mentor: "/user/mentors?page=1",
  mentorDetails: (id) => `/user/mentors/${id}`,
  offer: "/user/getOffers?page=1",
  misc: {
    standard: "/user/getStandards",
    board: "/user/getBoards",
    subject: "/user/getSubjects",
    activity: "/user/getActivities",
  },
  quiz: {
    getQuiz: "/user/quiz/getQuiz?page=1",
    enrollQuiz: "/user/quiz/enroll",
    myQuiz: "/user/quiz/myQuiz?page=1",
    startQuiz: "/user/quiz/startQuiz",
    submitQuiz: "/user/quiz/submitQuiz",
  },
  wallet: {
    deposit: "/deposit",
    verifyDeposit: "/verifyDeposit",
    convert: "/user/convertPoints",
    transactions: (id) => `/transactions/${id}`,
  },
  stream: {
    fetchLive: "/user/stream/",
    fetchUpcommingLive: "/user/stream/upcoming-live",
    getChatToken: "/user/stream/get-chat-token",
  },
  certificates: (id) => `user/quiz/get-certificate/${id}`,
};
