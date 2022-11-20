import React from 'react';
import tw from '@lib/tailwind';
import {SafeAreaContainer} from '@components';

const SearchScreen = () => {
  return (
    <SafeAreaContainer
      statusBgColor={tw.color('emerald-600')}
      statusBarStyle="light-content">
      {/* <Text>Hello</Text> */}
    </SafeAreaContainer>
  );
};

export default SearchScreen;
