/* @jsxImportSource @emotion/react */
import React from 'react';
import { css } from '@emotion/react';
import { Card } from './Card';

export function CustomerDetails() {
  return (
    <div
      css={css`
        --margin-desktop: 1.25rem;

        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;

        background-color: hsla(0, 0%, 100%, 0.65);

        z-index: 1;
      `}
    >
      <Card
        css={css`
          position: absolute;
          top: var(--margin-desktop);
          right: var(--margin-desktop);
          bottom: var(--margin-desktop);
          width: 50%;

          padding: 1.5rem;

          overflow: scroll;

          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            margin: 0;
          }

          input {
            display: flex;
            appearance: none;
            border-style: solid;
            border-width: 1px;
            border-radius: 0.5rem;
            height: 2.25rem;
            padding: 0.25rem 0.5rem;
            outline: none;
          }

          button {
            appearance: none;
            outline: none;
            background: none;

            border-style: solid;
            border-width: 2px;
            border-color: var(--color-primary);
            border-radius: 0.5rem;
            height: 2.25rem;
            padding: 0.25rem 0.5rem;

            background-color: var(--color-primary);
            color: var(--color-on-primary);

            font-weight: bold;

            &.button-outlined {
              color: var(--color-primary);
              background-color: transparent;
            }
          }

          & {
            justify-content: flex-start;
            align-items: stretch;
            gap: 2.75rem;
          }

          .info-group {
            display: grid;
            /* flex-direction: column; */
            gap: 1rem;

            > h5 {
              padding-left: 0.25rem;
              opacity: 0.65;
            }
          }

          .info-group-body {
            display: flex;
            flex-direction: column;

            gap: 1rem;
          }

          .input-group {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;

            > label {
              padding-left: 0.25rem;
              font-weight: bold;
              opacity: 0.85;
            }
          }

          .button-group {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 1.25rem;
          }
        `}
      >
        <div className="head">
          <h3 css={{ opacity: '0.85' }}>#123</h3>
          <h1 css={{ fontSize: '1.5rem', textAlign: 'left' }}>Customer</h1>
        </div>

        <div className="info-group">
          <h5>BASIC INFO</h5>
          <div className="info-group-body">
            <div className="input-group">
              <label css={{ fontSize: '0.75rem' }}>Name</label>
              <input value="hihihi" disabled />
            </div>
          </div>
        </div>
        <div className="info-group">
          <h5>BASIC INFO</h5>
          <div className="info-group-body">
            <div className="input-group">
              <label css={{ fontSize: '0.75rem' }}>Name</label>
              <input value="hihihi" disabled />
            </div>
            <div className="input-group">
              <label css={{ fontSize: '0.75rem' }}>Name</label>
              <input value="hihihi" disabled />
            </div>
            <div className="input-group">
              <label css={{ fontSize: '0.75rem' }}>Name</label>
              <input value="hihihi" disabled />
            </div>
          </div>
        </div>
        <div className="button-group">
          <button className="button-outlined">Discard</button>
          <button>Update</button>
        </div>
      </Card>
    </div>
  );
}

export default CustomerDetails;
