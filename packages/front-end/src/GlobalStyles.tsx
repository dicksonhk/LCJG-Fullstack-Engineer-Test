import React from 'react';
import { Global, css } from '@emotion/react';

import 'modern-normalize';

export const GlobalStyles = () => (
  <Global
    styles={css`
      html,
      body,
      #root {
        height: 100%;
      }

      body {
        font-size: 14px;
      }

      :root {
        --color-primary-h: 187;
        --color-primary-s: 50%;
        --color-primary-l: 50%;
        --color-primary: hsl(var(--color-primary-h), 100%, 42%);

        --color-on-primary: #fff;
      }
    `}
  />
);
