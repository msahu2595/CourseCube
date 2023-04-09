const {gql} = require('@apollo/client');

export const DELETE_HEADLINE = gql`
  mutation deleteHeadline($headlineId: ID!) {
    deleteHeadline(headlineId: $headlineId) {
      payload {
        _id
        image
        description
        link
        route
        params
        enable
        createdAt
        updatedAt
      }
    }
  }
`;
