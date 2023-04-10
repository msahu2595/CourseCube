const deepLinksConf = {
  screens: {
    MainBottomTabNavigator: {
      screens: {
        Home: 'home',
        MyProfile: 'my_profile',
        Community: 'community',
      },
    },
    CourseDetailTopTabNavigator: {
      path: 'detail',
      screens: {
        Info: 'info',
        Syllabus: 'syllabus',
        FAQ: 'faq',
      },
    },
    CreatePostScreen: 'create_post',
  },
};

export default deepLinksConf;
