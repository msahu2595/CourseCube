import {gql} from '@apollo/client';

export const FETCH_URL = gql`
  query fetchURL($videoLink: URL!) {
    fetchURL(videoLink: $videoLink) {
      code
      success
      message
      token
      payload {
        title
        thumbnail
        time
      }
    }
  }
`;
