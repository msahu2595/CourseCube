import {gql} from '@apollo/client';

export const BUNDLE_CONTENTS = gql`
  query bundleContents(
    $offset: Int
    $limit: Int
    $bundleId: ID!
    $filter: BundleContentsFilterInput
  ) {
    bundleContents(
      offset: $offset
      limit: $limit
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
          ... on Test {
            __typename
            _id
            title
            thumbnail
            instructions
            duration
            totalMarks
            negativeMark
            enable
            createdAt
            updatedAt
          }
          ... on Document {
            __typename
            _id
            title
            thumbnail
            url
            pages
            enable
            createdAt
            updatedAt
          }
        }
        type
        language
        description
        visible
        enable
        createdAt
        updatedAt
        bundle {
          _id
        }
        purchased
      }
    }
  }
`;
