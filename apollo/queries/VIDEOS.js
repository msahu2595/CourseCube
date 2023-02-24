import {gql} from '@apollo/client';

export const VIDEOS = gql`
  query Videos {
    videos {
      payload {
        _id
        createdAt
        enable
        link
        thumbnail
        time
        title
        updatedAt
        urls {
          format
          url
        }
      }
    }
  }
`;
