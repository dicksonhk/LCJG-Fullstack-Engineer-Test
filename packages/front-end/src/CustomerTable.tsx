/* @jsxImportSource @emotion/react */
import React, { useEffect } from 'react';
import { useState } from 'react';
import { css } from '@emotion/react';
import { gql, useQuery } from '@apollo/client';
import { useTable } from 'react-table';
import { debounce } from 'throttle-debounce';

import { Card } from './Card';

import {
  GetCustomersQuery,
  GetCustomersQueryData,
  GetCustomersQueryVars,
} from './queries';
import { Customer } from './types';
import { useCallback } from 'react';
import { BlockList } from 'net';

type TableHeaderState = {
  sort?: {
    isAsc: boolean;
    isDesc: boolean;
  };
  filter?: {
    isVisible: boolean;
    value: string;
  };
};
type TableHeader = {
  name: string;
  isSortable?: boolean;
  isFilterable?: boolean;
  sortAsc?: boolean;
  sortDesc?: boolean;
  filterVisible?: boolean;
  filterValue?: string;
};

const mergeAddrFields = (customer: Customer) => ({
  ...customer,
  fullAddress: `${customer.addressLine1} ${customer.addressLine2}`,
});

export function ReactTable({ columns, data }: any) {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export function CustomerTable({ ...props }: { className?: string }) {
  const memorizedDebounce = useCallback(
    debounce(500, (fn: () => any) => {
      fn();
    }),
    []
  );

  const thisRef = React.createRef<HTMLTableElement>();
  const [headers, setHeaders] = useState<Record<string, TableHeader>>(() => ({
    customerNumber: {
      name: 'ID',
      accessor: 'customerNumber',
      isFilterable: true,
    },
    customerName: {
      name: 'Name',
      accessor: 'customerName',
      isFilterable: true,
    },
    fullAddress: {
      name: 'Address',
      accessor: 'fullAddress',
    },
    country: {
      name: 'Country',
      accessor: 'country',
    },
    creditLimit: {
      name: 'Credit Limit',
      accessor: 'creditLimit',
      isSortable: true,
    },
  }));

  const [variables, setVariables] = useState<
    GetCustomersQueryVars & { limit: number; skip: number }
  >(() => ({
    customerNumber: null,
    customerName: null,
    contactLastName: null,
    contactFirstName: null,
    orderByCreditLimitAsc: null,
    orderByCreditLimitDesc: null,
    limit: 5,
    skip: 0,
  }));

  const { loading, error, data, refetch } = useQuery<
    GetCustomersQueryData,
    GetCustomersQueryVars
  >(GetCustomersQuery, {
    variables: variables,
  });

  // update query variables
  useEffect(() => {
    const newVariables = {
      ...variables,
      customerNumber:
        (headers?.customerNumber?.filterVisible &&
          parseInt(headers?.customerNumber?.filterValue as any)) ||
        null,
      customerName:
        (headers?.customerName?.filterVisible &&
          headers?.customerName?.filterValue) ||
        null,
      orderByCreditLimitAsc: headers?.creditLimit?.sortAsc || null,
      orderByCreditLimitDesc: headers?.creditLimit?.sortDesc || null,
    };

    // prevent uncessary update
    if (JSON.stringify(variables) !== JSON.stringify(newVariables)) {
      // debounce string filter
      if (newVariables?.customerNumber || newVariables?.customerName) {
        memorizedDebounce(() => setVariables(newVariables));
      } else {
        setVariables(newVariables);
      }
    }
  }, [headers]);

  // refetch on variables update
  // useEffect(
  //   debounce(2000, () => {
  //     refetch(variables);
  //   }),
  //   [variables]
  // );

  useEffect(() => {
    if (headers?.customerNumber?.filterVisible) {
      const el = thisRef.current?.querySelector('input[name=customerNumber]');
      (el as any)?.focus();
    }
  }, [headers?.customerNumber?.filterVisible]);

  useEffect(() => {
    if (headers?.customerName?.filterVisible) {
      const el = thisRef.current?.querySelector('input[name=customerName]');
      (el as any)?.focus();
    }
  }, [headers?.customerName?.filterVisible]);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );

  return (
    <>
      <table
        ref={thisRef}
        role="table"
        css={css`
          &,
          & * {
            /* outline: 1px solid rgba(0, 255, 0, 0.25); */
          }

          --row-height: 3rem;
          --header-row-height: var(--row-height);
          --cell-padding-v: 0.25rem;
          --cell-padding-h: 0.75rem;

          --border-width: 1px;
          --border-color: hsl(0, 0%, 85%);

          --icon-size: 1.125rem;
          --icon-pad: 0.25rem;

          --input-height: 1.5rem;

          &,
          thead,
          tbody,
          tr,
          th,
          td,
          td > :not(span) {
            display: flex;
            align-items: stretch;
            flex-grow: 1;
            flex-shrink: 0;
          }

          &,
          thead,
          tbody {
            flex-direction: column;
          }

          th,
          td {
            align-items: center;
          }

          tr > * {
            flex-grow: 1;
          }

          &,
          th,
          td {
            --spread: calc(var(--border-width) / 2);
            --bs: 0 0 0 var(--spread) var(--border-color);
            box-shadow: var(--bs), inset var(--bs);
          }

          tr {
            height: var(--row-height);
            max-height: var(--row-height);
          }

          thead > tr {
            height: var(--header-row-height);
            max-height: var(--header-row-height);
          }

          th,
          td {
            padding: var(--cell-padding-v) var(--cell-padding-h);

            &:not(:nth-of-type(3)) {
              flex-grow: 0;
            }

            // id
            &:nth-of-type(1) {
              width: 5rem;
            }

            // name
            &:nth-of-type(2) {
              width: 10rem;
            }

            // address
            &:nth-of-type(3) {
              width: 17rem;
            }

            // country
            &:nth-of-type(4) {
              width: 10rem;
            }

            // credit limit
            &:nth-of-type(5) {
              width: 10rem;
            }
          }

          td,
          td > span {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          & {
            width: 100%;
            overflow-x: scroll;
          }

          /* tbody {
            overflow-y: scroll;
          } */

          user-select: none;
        `}
        {...props}
      >
        <thead>
          <tr role="row">
            {Object.entries(headers).map(
              ([
                accessor,
                {
                  name,
                  isSortable,
                  isFilterable,
                  sortAsc,
                  sortDesc,
                  filterVisible,
                  filterValue,
                },
              ]) => {
                const onClick = () => {
                  if (isFilterable) {
                    setHeaders({
                      ...headers,
                      [accessor]: {
                        ...headers[accessor],
                        filterVisible: true,
                      },
                    });
                  }
                  if (isSortable) {
                    setHeaders({
                      ...headers,
                      [accessor]: {
                        ...headers[accessor],
                        sortDesc: !sortAsc && !sortDesc,
                        sortAsc: !sortAsc && sortDesc,
                      },
                    });
                  }
                };
                return (
                  <th colSpan={1} role="columnheader" onClick={onClick}>
                    {!filterVisible && <div>{name}</div>}
                    {filterVisible && (
                      <div
                        css={{
                          // display: 'flex',
                          // flexDirection: 'column',
                          // alignItems: 'start',
                          position: 'relative',
                          '& *': {
                            display: 'block',
                          },
                        }}
                      >
                        {/* <label
                          css={{
                            position: 'absolute',
                            fontSize: '.5rem',
                            lineHeight: 1,
                            bottom: '100%',
                            // transform: 'translateY(-50%)'
                          }}
                        >
                          {name}
                        </label> */}
                        <input
                          name={accessor}
                          css={{
                            '--ph': '0.25rem',
                            display: 'flex',
                            height: 'var(--input-height)',
                            width: '100%',
                            padding: '0 var(--ph)',
                            margin: '0 calc(-1 * var(--ph))',
                            marginRight:
                              'calc(-1 * (var(--ph) + var(--icon-size)))',
                            border: 'none',
                            appearance: 'none',
                            '&::placeholder': {
                              fontWeight: 'bold',
                            },
                            outline: '1px solid var(--border-color)',
                            '&:focus': {
                              outlineColor: 'var(--color-primary)',
                            },
                          }}
                          placeholder={name}
                          value={filterValue || ''}
                          onChange={(event) => {
                            setHeaders({
                              ...headers,
                              [accessor]: {
                                ...headers[accessor],
                                filterValue: event.target.value,
                              },
                            });
                          }}
                          onBlur={() => {
                            if (!filterValue) {
                              setHeaders({
                                ...headers,
                                [accessor]: {
                                  ...headers[accessor],
                                  filterVisible: false,
                                },
                              });
                            }
                          }}
                        />
                        {/* <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 0 24 24"
                          width="24px"
                          css={{
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            left: 'var(--icon-pad)',
                            width: 'var(--icon-size)',
                            margin: 'auto',
                            opacity: '0.5',
                          }}
                        >
                          <path d="M15.5 14h-.79l-.28-.27c1.2-1.4 1.82-3.31 1.48-5.34-.47-2.78-2.79-5-5.59-5.34-4.23-.52-7.79 3.04-7.27 7.27.34 2.8 2.56 5.12 5.34 5.59 2.03.34 3.94-.28 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                        </svg> */}
                      </div>
                    )}
                    {isFilterable && !filterVisible && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        css={{
                          marginLeft: 'auto',
                          width: 'var(--icon-size)',
                          height: 'var(--icon-size)',
                          opacity: '0.25',
                        }}
                      >
                        <path d="M11 18h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM3 7c0 .55.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1zm4 6h10c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1z" />{' '}
                      </svg>
                    )}
                    {isSortable && !sortAsc && !sortDesc && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        css={{
                          marginLeft: 'auto',
                          width: 'var(--icon-size)',
                          opacity: '0.25',
                        }}
                      >
                        <path d="M16 17.01V11c0-.55-.45-1-1-1s-1 .45-1 1v6.01h-1.79c-.45 0-.67.54-.35.85l2.79 2.78c.2.19.51.19.71 0l2.79-2.78c.32-.31.09-.85-.35-.85H16zM8.65 3.35L5.86 6.14c-.32.31-.1.85.35.85H8V13c0 .55.45 1 1 1s1-.45 1-1V6.99h1.79c.45 0 .67-.54.35-.85L9.35 3.35c-.19-.19-.51-.19-.7 0z" />
                      </svg>
                    )}
                    {isSortable && (sortDesc || sortAsc) && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 0 24 24"
                        width="24px"
                        css={{
                          marginLeft: 'auto',
                          width: 'var(--icon-size)',
                          opacity: '0.65',
                          transform: `rotate(${90 + (sortAsc ? 180 : 0)}deg)`,
                          // ...(sortAsc && { transform: 'rotate(180deg)' }),
                        }}
                      >
                        <path d="M16.01 11H5c-.55 0-1 .45-1 1s.45 1 1 1h11.01v1.79c0 .45.54.67.85.35l2.78-2.79c.19-.2.19-.51 0-.71l-2.78-2.79c-.31-.32-.85-.09-.85.35V11z" />
                      </svg>
                    )}
                  </th>
                );
              }
            )}
          </tr>
        </thead>
        <tbody role="rowgroup">
          {(data?.customers || []).map(mergeAddrFields).map((customer) => (
            <tr
              role="row"
              onClick={() => {
                setSelectedCustomer(customer);
              }}
            >
              {Object.keys(headers).map((accessor) => (
                <td role="cell">
                  {accessor in customer ? (
                    <span>{customer[accessor as keyof typeof customer]}</span>
                  ) : (
                    <></>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => {
          setVariables({
            ...variables,
            skip: variables.skip + variables.limit,
          });
        }}
      >
        Next page
      </button>
      {selectedCustomer && (
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
          <div
            css={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            onClick={() => {
              setSelectedCustomer(null);
            }}
          />
          <Card
            css={css`
              position: absolute;
              top: var(--margin-desktop);
              right: var(--margin-desktop);
              bottom: var(--margin-desktop);
              min-width: 15rem;
              width: 50%;
              max-width: 30rem;

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
                  font-size: 0.75rem;
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
              <h3 css={{ opacity: '0.85' }}>
                #{selectedCustomer.customerNumber}
              </h3>
              <h1 css={{ fontSize: '1.5rem', textAlign: 'left' }}>Customer</h1>
            </div>

            <div className="info-group">
              <h5>BASIC INFO</h5>
              <div className="info-group-body">
                <div className="input-group">
                  <label>Name</label>
                  <input
                    value={selectedCustomer.customerName}
                    onChange={(e) => {
                      setSelectedCustomer({
                        ...selectedCustomer,
                        customerName: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="input-group">
                  <label>Credit Limit</label>
                  <input value={selectedCustomer.creditLimit} disabled />
                </div>
              </div>
            </div>
            <div className="info-group">
              <h5>CONTACT INFO</h5>
              <div className="info-group-body">
                <div className="input-group">
                  <label>Contact First Name</label>
                  <input value={selectedCustomer.contactFirstName} disabled />
                </div>
                <div className="input-group">
                  <label>Contact Last Name</label>
                  <input value={selectedCustomer.contactLastName} disabled />
                </div>
                <div className="input-group">
                  <label>Phone</label>
                  <input value={selectedCustomer.phone} disabled />
                </div>
              </div>
            </div>
            <div className="info-group">
              <h5>ADDRESS</h5>
              <div className="info-group-body">
                <div className="input-group">
                  <label>Address Line 1</label>
                  <input value={selectedCustomer.addressLine1} disabled />
                </div>
                <div className="input-group">
                  <label>Address Line 2</label>
                  <input value={selectedCustomer.addressLine2} disabled />
                </div>
                <div className="input-group">
                  <label>City</label>
                  <input value={selectedCustomer.city} disabled />
                </div>
                <div className="input-group">
                  <label>State</label>
                  <input value={selectedCustomer.state} disabled />
                </div>
                <div className="input-group">
                  <label>Postal Code</label>
                  <input value={selectedCustomer.postalCode} disabled />
                </div>
                <div className="input-group">
                  <label>Country</label>
                  <input value={selectedCustomer.country} disabled />
                </div>
              </div>
            </div>
            <div className="info-group">
              <h5>MISC</h5>
              <div className="info-group-body">
                <div className="input-group">
                  <label>Sales Rep Employee Number</label>
                  <input
                    value={selectedCustomer.salesRepEmployeeNumber}
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="button-group">
              <button
                className="button-outlined"
                onClick={() => {
                  setSelectedCustomer(null);
                }}
              >
                Discard
              </button>
              <button
                onClick={() => {
                  setSelectedCustomer(null);
                }}
              >
                Update
              </button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

export default CustomerTable;
