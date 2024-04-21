import {gql} from '@apollo/client';

export const BUNDLES = gql`
  query bundles(
    $offset: Int
    $limit: Int
    $search: String
    $filter: BundlesFilterInput
  ) {
    bundles(offset: $offset, limit: $limit, search: $search, filter: $filter) {
      code
      success
      message
      token
      offset
      limit
      search
      filter {
        paid
        language
        type
        visible
        enable
      }
      payload {
        __typename
        _id
        categories
        exams
        tags
        subject
        image
        title
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
        liked
        purchases
        purchased
        bookmarked
      }
    }
  }
`;
