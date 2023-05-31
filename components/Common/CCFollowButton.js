import {tw} from '@lib';
import React, {memo, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {gql, useMutation, useQuery} from '@apollo/client';

const FOLLOWING = gql`
  query following($userId: ID!) {
    following(userId: $userId) {
      code
      success
      message
      token
      payload
    }
  }
`;

const FOLLOW = gql`
  mutation follow($followingId: ID!) {
    follow(followingId: $followingId) {
      code
      success
      message
      token
      payload
    }
  }
`;

const UN_FOLLOW = gql`
  mutation unFollow($followingId: ID!) {
    unFollow(followingId: $followingId) {
      code
      success
      message
      token
      payload
    }
  }
`;

export const CCFollowButton = memo(({refId, style, children}) => {
  const [followed, setFollowed] = useState(false);

  const {loading} = useQuery(FOLLOWING, {
    variables: {userId: refId},
    onCompleted: data => {
      console.log('data?.following', data?.following);
      setFollowed(data?.following?.payload);
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
    },
  });

  const [follow] = useMutation(FOLLOW, {
    variables: {followingId: refId},
    onCompleted: data => {
      if (!data?.follow?.payload) {
        setFollowed(false);
      }
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
      setFollowed(false);
    },
  });

  const [unFollow] = useMutation(UN_FOLLOW, {
    variables: {followingId: refId},
    onCompleted: data => {
      if (!data?.unFollow?.payload) {
        setFollowed(true);
      }
    },
    onError: err => {
      showMessage({
        message: err?.message || 'Some unknown error occurred. Try again!!',
        type: 'danger',
      });
      setFollowed(true);
    },
  });

  const onPress = () => {
    if (followed) {
      unFollow();
      setFollowed(false);
    } else {
      follow();
      setFollowed(true);
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!refId || loading}
      style={[style, tw`opacity-${refId ? 100 : 50}`]}>
      {children({loading, followed})}
    </TouchableOpacity>
  );
});
