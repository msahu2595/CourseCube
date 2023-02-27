import {gql} from '@apollo/client';

export const VIDEOS = gql`
  query videos(
    $offset: Int
    $limit: Int
    $search: String
    $filter: VideosFilterInput
  ) {
    videos(offset: $offset, limit: $limit, search: $search, filter: $filter) {
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
