import {gql} from '@apollo/client';

export const REFRESH_VIDEO = gql`
  mutation refreshVideo($videoId: ID!) {
    refreshVideo(videoId: $videoId) {
      code
      success
      message
      token
      payload {
        __typename
        _id
        title
        thumbnail
        link
        time
        urls {
          url
          format
        }
        enable
        createdAt
        updatedAt
      }
    }
  }
`;
