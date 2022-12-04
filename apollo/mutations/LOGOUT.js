import {gql} from '@apollo/client';

export const LOGOUT = gql`
  mutation logout {
    logout {
      code
      message
      success
    }
  }
`;
