/* @jsxImportSource @emotion/react */
import React from 'react';
import { GlobalStyles } from './GlobalStyles';

import { ApolloProvider } from './ApolloProvider';
import CustomerTable from './CustomerTable';
import CustomerDetails from './CustomerDetails';
import { Card } from './Card';

export const Center = ({
  ...rest
}: React.PropsWithChildren<{ className?: string }>) => (
  <div
    css={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    {...rest}
  />
);

export default function App() {
  return (
    <>
      <GlobalStyles />
      <Center
        css={{
          minHeight: '100%',
          background: 'hsl(0, 0%, 97%)',
          color: 'hsl(0, 0%, 15%)',
          gap: '2.25rem',
          padding: '1.25rem',
        }}
      >
        <h1
          css={{
            margin: '0',
            fontSize: '1.5rem',
          }}
        >
          LCJG Fullstack Engineer Test
        </h1>
        <Card
          css={{
            width: '100%',
            position: 'relative',
          }}
        >
          <CustomerTable
            css={{
              width: '100%',
            }}
          />
        </Card>
        <p
          css={{
            height: '1rem',
            lineHeight: '1rem',
            margin: '0',
            color: 'hsl(0, 0%, 70%)',
            fontSize: '0.75rem',
          }}
        >
          © {new Date().getFullYear()}
        </p>
      </Center>
    </>
  );
}
