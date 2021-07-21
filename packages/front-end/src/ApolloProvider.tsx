import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:8080/graphql',
  cache: new InMemoryCache(),
});

const MyApolloProvider = ({ children }: React.PropsWithChildren<{}>) => (
  <ApolloProvider client={client} {...{ children }} />
);

export { MyApolloProvider as ApolloProvider };
export default MyApolloProvider;
