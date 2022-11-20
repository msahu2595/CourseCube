import {gql} from '@apollo/client';

export const CORE_ADVERT_FIELDS = gql`
  fragment CoreAdvertFields on Advert {
    __typename
    _id
    image
    type
    link
    route
    params
    enable
    createdAt
    updatedAt
  }
`;
