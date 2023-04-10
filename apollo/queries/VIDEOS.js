import {gql} from '@apollo/client';

export const VIDEOS = gql`
  query videos(
    $offset: Int
    $limit: Int
    $search: String
    $filter: VideosFilterInput
  ) {
    videos(offset: $offset, limit: $limit, search: $search, filter: $filter) {
      code
      success
      message
      token
      offset
      limit
      search
      filter {
        enable
      }
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
