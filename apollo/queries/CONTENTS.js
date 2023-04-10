import {gql} from '@apollo/client';

export const CONTENTS = gql`
  query contents(
    $offset: Int
    $limit: Int
    $search: String
    $filter: ContentsFilterInput
  ) {
    contents(offset: $offset, limit: $limit, search: $search, filter: $filter) {
      code
      success
      message
      token
      offset
      limit
      search
      filter {
        paid
        type
        language
        visible
        enable
      }
      payload {
        _id
        categories
        exams
        tags
        subject
        image
        title
        media {
          ... on Video {
            _id
          }
          ... on Test {
            _id
          }
          ... on Document {
            _id
          }
        }
        type
        paid
        price
        offer
        offerType
        highlight
        instructors
        language
        index
        description
        validity
        visible
        enable
        createdAt
        updatedAt
        likes
        purchases
        purchased
      }
    }
  }
`;
