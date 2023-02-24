import {gql} from '@apollo/client';

export const ADD_VIDEOS = gql`
  mutation AddVideo($videoLink: URL!) {
    addVideo(videoLink: $videoLink) {
      code
      success
      message
      token
      payload {
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
