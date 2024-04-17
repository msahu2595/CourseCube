import {gql} from '@apollo/client';

export const BUNDLE_CONTENTS = gql`
  query bundleContents(
    $offset: Int
    $limit: Int
    $search: String
    $bundleId: ID!
    $filter: BundleContentsFilterInput
  ) {
    bundleContents(
      offset: $offset
      limit: $limit
      search: $search
      bundleId: $bundleId
      filter: $filter
    ) {
      code
      success
      message
      token
      offset
      limit
      bundleId
      filter {
        subjectId
        type
        language
        visible
        enable
      }
      payload {
        __typename
        _id
        subjectId
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
            questions
            totalMarks
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
        highlight
        instructors
        language
        index
        description
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
