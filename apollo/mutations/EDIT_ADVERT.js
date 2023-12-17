import {gql} from '@apollo/client';

export const EDIT_ADVERT = gql`
  mutation editAdvert($advertId: ID!, $advertInput: AdvertEditInput!) {
    editAdvert(advertId: $advertId, advertInput: $advertInput) {
      payload {
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
    }
  }
`;
