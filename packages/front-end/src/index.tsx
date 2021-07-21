import { render } from 'react-dom';

import ApolloProvider from './ApolloProvider';
import App from './App';

const rootElement = document.getElementById('root');
render(
  <ApolloProvider>
    <App />
  </ApolloProvider>,
  rootElement
);
