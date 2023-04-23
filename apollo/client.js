import {from, ApolloClient, createHttpLink, ApolloLink} from '@apollo/client';
import {REACT_APP_DEV_MODE, REACT_APP_PROD_MODE} from '@env';
import {InMemoryCache, makeVar, gql} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {onError} from '@apollo/client/link/error';
import {MMKV} from 'react-native-mmkv';

export const storage = new MMKV();

export const typeDefs = gql`
  extend type Query {
    me: User
    cartItems: [ID!]!
  }
`;

// Initializes logged in user
const user = storage.getString('user');
export const loggedUserVar = makeVar(user ? JSON.parse(user) : null);

// Initializes to an empty array
export const cartItemsVar = makeVar([]);

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        videos: {
          keyArgs: false,
          merge(existing = {payload: []}, incoming) {
            return {
              ...existing,
              ...incoming,
              payload: [...existing.payload, ...incoming.payload],
            };
          },
        },
        tests: {
          keyArgs: false,
          merge(existing = {payload: []}, incoming) {
            return {
              ...existing,
              ...incoming,
              payload: [...existing.payload, ...incoming.payload],
            };
          },
        },
        documents: {
          keyArgs: false,
          merge(existing = {payload: []}, incoming) {
            return {
              ...existing,
              ...incoming,
              payload: [...existing.payload, ...incoming.payload],
            };
          },
        },
        articles: {
          keyArgs: false,
          merge(existing = {payload: []}, incoming) {
            return {
              ...existing,
              ...incoming,
              payload: [...existing.payload, ...incoming.payload],
            };
          },
        },
        websites: {
          keyArgs: false,
          merge(existing = {payload: []}, incoming) {
            return {
              ...existing,
              ...incoming,
              payload: [...existing.payload, ...incoming.payload],
            };
          },
        },
        me: {
          read() {
            return loggedUserVar();
          },
        },
        cartItems: {
          read() {
            return cartItemsVar();
          },
        },
      },
    },
  },
});

const authLink = setContext((_, {headers}) => {
  if (storage.getString('token')) {
    return {
      headers: {
        ...headers,
        authorization: `Bearer ${storage.getString('token')}`,
        'refresh-token': storage.getString('refresh'),
      },
    };
  }
  return {headers};
});

export const errorLink = onError(error => {
  console.log({error});
  const {graphQLErrors, networkError, operation} = error;
  if (graphQLErrors) {
    const message =
      graphQLErrors.length > 0
        ? graphQLErrors[0].message
        : 'Something Went Wrong';
    console.log({message});
    if (
      message === 'Refresh token is revoked/expired, please log in again.' ||
      message === 'Refresh token is null, please log in again.' ||
      message === 'Unexpected error, please log in again.'
    ) {
      storage.clearAll();
      loggedUserVar(null);
      console.log(`Logout as ${message}.`);
    }
    return;
  }
  if (networkError) {
    if (networkError?.result) {
      const unAuthenticate = networkError?.result?.errors.find(
        er => er.extensions.code === 'UNAUTHENTICATED',
      );
      if (unAuthenticate) {
        console.log('unAuthenticate', unAuthenticate);
      }
      return;
    } else if (networkError?.message === 'Failed to fetch') {
      if (operation?.operationName === 'googleLogIn') {
        console.log(
          'No Internet Connection',
          'Please check your internet connectivity.',
        );
      }
    } else {
      console.log('Network Error', 'Please check your internet connectivity.');
      return;
    }
  }
});

console.log({__DEV__});
console.log(REACT_APP_DEV_MODE);
console.log(REACT_APP_PROD_MODE);

const httpLink = createHttpLink({
  uri: __DEV__ ? REACT_APP_DEV_MODE : REACT_APP_PROD_MODE,
});

const setTokenLink = new ApolloLink((operation, forward) => {
  return forward(operation).map(response => {
    console.log(`====${operation.operationName}=====`);
    if (response?.data && response?.data[operation.operationName]?.token) {
      if (
        response?.data[operation.operationName]?.token &&
        response?.data[operation.operationName]?.token !==
          storage.getString('token')
      ) {
        console.log(
          'Got new token ==> ',
          response?.data[operation.operationName]?.token,
        );
        storage.set('token', response?.data[operation.operationName]?.token);
      }
      if (
        response?.data[operation.operationName]?.refresh &&
        response?.data[operation.operationName]?.refresh !==
          storage.getString('refresh')
      ) {
        console.log(
          'Got new refresh ==> ',
          response?.data[operation.operationName]?.refresh,
        );
        storage.set(
          'refresh',
          response?.data[operation.operationName]?.refresh,
        );
      }
    }
    console.log(`====${operation.operationName}=====`);
    return response;
  });
});

// Initialize Apollo Client
const client = new ApolloClient({
  link: from([authLink, errorLink, setTokenLink.concat(httpLink)]),
  typeDefs: typeDefs,
  cache: cache,
});

export default client;
