import {gql} from '@apollo/client';

export const ADD_VIDEO = gql`
  mutation AddVideo($videoLink: URL!) {
    addVideo(videoLink: $videoLink) {
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
