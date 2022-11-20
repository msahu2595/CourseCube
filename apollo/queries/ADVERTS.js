import {gql} from '@apollo/client';
import {CORE_ADVERT_FIELDS} from '../fragments';

export const ADVERTS = gql`
  ${CORE_ADVERT_FIELDS}
  query adverts($offset: Int, $limit: Int, $filter: AdvertsFilterInput) {
    adverts(offset: $offset, limit: $limit, filter: $filter) {
      code
      success
      message
      token
      offset
      limit
      payload {
        ...CoreAdvertFields
      }
    }
  }
`;
