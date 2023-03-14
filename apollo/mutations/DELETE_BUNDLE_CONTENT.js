const {gql} = require('@apollo/client');

export const DELETE_BUNDLE_CONTENTS = gql`
  mutation deleteBundleContent($bundleContentId: ID!) {
    deleteBundleContent(bundleContentId: $bundleContentId) {
      payload {
        _id
        subjectId
        subject
        image
        title
        media {
          ... on Video {
            _id
            title
            thumbnail
            time
            link
            enable
            createdAt
            updatedAt
          }
          ... on Test {
            _id
            title
            thumbnail
            instructions
            duration
            questions {
              _id
              question
              image
              passage
              options
              answerIndex
              mark
              negativeMark
            }
            totalMarks
            enable
            createdAt
            updatedAt
          }
          ... on Document {
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
        purchased
      }
    }
  }
`;
