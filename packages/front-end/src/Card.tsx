/* @jsxImportSource @emotion/react */
import React from 'react';
import { Center } from './App';

export const Card = (
  props: React.PropsWithChildren<{ className?: string }>
) => (
  <Center
    css={{
      background: '#fff',
      padding: '2.5rem',
      borderRadius: '1.25rem',
      boxShadow: [
        '0 0px 6px -3px hsla(0, 0%, 0%, .25)',
        '0 4px 16px -6px hsla(0, 0%, 0%, .15)',
      ],
    }}
    {...props}
  />
);
