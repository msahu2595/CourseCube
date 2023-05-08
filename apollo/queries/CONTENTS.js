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
        __typename
        _id
        categories
        exams
        tags
        subject
        image
        title
        media {
          ... on Video {
            __typename
            _id
            title
            thumbnail
            #
            time
            #
            enable
            createdAt
            updatedAt
          }
          ... on Test {
            __typename
            _id
            title
            thumbnail
            #
            instructions
            duration
            totalMarks
            questions {
              _id
            }
            #
            enable
            createdAt
            updatedAt
          }
          ... on Document {
            __typename
            _id
            title
            thumbnail
            #
            pages
            #
            enable
            createdAt
            updatedAt
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
        liked
        views
        purchased
        bookmarked
      }
    }
  }
`;
