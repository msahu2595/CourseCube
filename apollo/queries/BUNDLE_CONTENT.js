import {gql} from '@apollo/client';

export const BUNDLE_CONTENT = gql`
  query bundleContent($bundleContentId: ID!) {
    bundleContent(bundleContentId: $bundleContentId) {
      code
      success
      message
      token
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
