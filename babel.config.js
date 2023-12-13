module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@navigation_groups': './navigation_groups',
          '@navigators': './navigators',
          '@components': './components',
          '@screens': './screens',
          '@queries': './apollo/queries',
          '@mutations': './apollo/mutations',
          '@fragments': './apollo/fragments',
          '@styles': './styles',
          '@images': './assets/images',
          '@fonts': './assets/fonts',
          '@lib': './lib',
          '@utils': './utils',
          '@cache': 'apollo/cache',
          '@typeDefs': 'apollo/typeDefs',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
