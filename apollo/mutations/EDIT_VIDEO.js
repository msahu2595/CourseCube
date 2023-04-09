import {gql} from '@apollo/client';

export const EDIT_VIDEO = gql`
  mutation editVideo($videoId: ID!, $videoInput: VideoInput!) {
    editVideo(videoId: $videoId, videoInput: $videoInput) {
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
