const {gql} = require('@apollo/client');

export const TESTS = gql`
  query tests(
    $offset: Int
    $limit: Int
    $search: String
    $filter: TestsFilterInput
  ) {
    tests(offset: $offset, limit: $limit, search: $search, filter: $filter) {
      payload {
        _id
        title
        thumbnail
        instructions
        questions {
          _id
          question
          image
          passage
          options
          mark
          answerIndex
          enable
        }
        duration
        totalMarks
        negativeMark
        enable
        createdAt
        updatedAt
      }
    }
  }
`;
