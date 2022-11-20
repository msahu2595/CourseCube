import {gql} from '@apollo/client';

export const FETCH_DOWNLOAD_URL = gql`
  query fetchDownloadURL($videoId: ID!) {
    fetchDownloadURL(videoId: $videoId) {
      code
      success
      message
      token
      payload {
        url
        format
      }
    }
  }
`;
