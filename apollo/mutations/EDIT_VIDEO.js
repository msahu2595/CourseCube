import {gql} from '@apollo/client';

export const EDIT_VIDEO = gql`
  mutation EditVideo($videoId: ID!, $videoInput: VideoInput!) {
    editVideo(videoId: $videoId, videoInput: $videoInput) {
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
