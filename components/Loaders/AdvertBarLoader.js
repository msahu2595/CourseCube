import {tw} from '@lib';
import React, {memo, useMemo} from 'react';
import {useWindowDimensions} from 'react-native';
import ContentLoader, {Rect} from 'react-content-loader/native';

const AdvertBarLoader = memo(({type = 'TINY'}) => {
  const {width} = useWindowDimensions();

  const height = useMemo(() => {
    switch (type) {
      case 'TINY':
        return width / 4;
      case 'SMALL':
        return width / 2.5;
      case 'MEDIUM':
        return width * (9 / 16);
      case 'LARGE':
        return width;
      default:
        return width / 4;
    }
  }, [type, width]);

  return (
    <ContentLoader
      speed={2}
      width={width}
      height={height}
      backgroundColor={tw.color('gray-300')}
      foregroundColor={tw.color('gray-400')}
      viewBox={`0 0 ${width} ${height}`}>
      <Rect x="8" y="4" rx="8" ry="8" height={height - 8} width={width - 16} />
    </ContentLoader>
  );
});

export default AdvertBarLoader;
