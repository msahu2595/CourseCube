import {gql} from '@apollo/client';

export const CORE_HEADLINE_FIELDS = gql`
  fragment CoreHeadlineFields on Headline {
    __typename
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
`;
