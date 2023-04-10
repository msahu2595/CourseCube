const {gql} = require('@apollo/client');

export const TESTS = gql`
  query tests(
    $offset: Int
    $limit: Int
    $search: String
    $filter: TestsFilterInput
  ) {
    tests(offset: $offset, limit: $limit, search: $search, filter: $filter) {
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
        instructions
        duration
        totalMarks
        enable
        createdAt
        updatedAt
      }
    }
  }
`;
