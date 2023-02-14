import React, {memo} from 'react';
import {useWindowDimensions} from 'react-native';
import ContentLoader, {Rect} from 'react-content-loader/native';

const NotificationItemLoader = memo(() => {
  const width = useWindowDimensions().width;

  return (
    <ContentLoader
      speed={2}
      width={width}
      height={108}
      backgroundColor="#f3f3f3"
      foregroundColor="#ecebeb"
      viewBox={`0 0 ${width} 108`}>
      <Rect x="16" y="8" rx="8" ry="8" width="92" height="92" />
      <Rect
        x="116"
        y="18"
        rx="5"
        ry="5"
        height="14"
        width={width - 92 - 32 - 16}
      />
      <Rect
        x="116"
        y="38"
        rx="5"
        ry="5"
        height="14"
        width={width - 92 - 32 - 32}
      />
      <Rect
        x="116"
        y="58"
        rx="5"
        ry="5"
        height="14"
        width={width - 92 - 32 - 16}
      />
      <Rect
        x="116"
        y="78"
        rx="5"
        ry="5"
        height="14"
        width={width - 92 - 32 - 32}
      />
    </ContentLoader>
  );
});

export default NotificationItemLoader;
