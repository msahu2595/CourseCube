import {gql} from '@apollo/client';

export const ADD_VIDEO = gql`
  mutation addVideo($videoLink: URL!) {
    addVideo(videoLink: $videoLink) {
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
