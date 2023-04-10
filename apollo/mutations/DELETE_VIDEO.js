import {gql} from '@apollo/client';

export const DELETE_VIDEO = gql`
  mutation deleteVideo($videoId: ID!) {
    deleteVideo(videoId: $videoId) {
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
