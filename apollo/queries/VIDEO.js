import {gql} from '@apollo/client';

export const VIDEO = gql`
  query video($videoId: ID!) {
    video(videoId: $videoId) {
      code
      success
      message
      token
      payload {
        _id
        title
        thumbnail
        time
        link
        enable
        createdAt
        updatedAt
      }
    }
  }
`;
