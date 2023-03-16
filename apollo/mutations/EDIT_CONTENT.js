import {gql} from '@apollo/client';

export const EDIT_CONTENT = gql`
  mutation EditContent($contentId: ID!, $contentInput: ContentInput!) {
    editContent(contentId: $contentId, contentInput: $contentInput) {
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
