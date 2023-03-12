import {gql} from '@apollo/client';

export const DELETE_VIDEO = gql`
  mutation DeleteVideo($videoId: ID!) {
    deleteVideo(videoId: $videoId) {
      payload {
        _id
        title
        time
        link
        enable
        createdAt
        updatedAt
      }
    }
  }
`;
