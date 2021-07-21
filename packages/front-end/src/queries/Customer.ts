import { gql } from '@apollo/client';
import { Customer } from '../types';
import { Maybe } from '../types/Maybe';

export type GetCustomersQueryData = {
  customers: Customer[];
};

export type GetCustomersQueryVars = {
  customerNumber?: Maybe<number>;
  customerName?: Maybe<String>;
  contactLastName?: Maybe<String>;
  contactFirstName?: Maybe<String>;
  orderByCreditLimitAsc?: Maybe<Boolean>;
  orderByCreditLimitDesc?: Maybe<Boolean>;
  limit?: Maybe<number>;
  skip?: Maybe<number>;
};

export const GetCustomersQuery = gql`
  query GetCustomers(
    $customerNumber: Int
    $customerName: String
    $limit: Int
    $skip: Int
    $orderByCreditLimitAsc: Boolean
    $orderByCreditLimitDesc: Boolean
  ) {
    customers(
      customerNumber: $customerNumber
      customerName: $customerName
      limit: $limit
      skip: $skip
      orderByCreditLimitAsc: $orderByCreditLimitAsc
      orderByCreditLimitDesc: $orderByCreditLimitDesc
    ) {
      id
      customerNumber
      customerName
      contactLastName
      contactFirstName
      phone
      addressLine1
      addressLine2
      city
      state
      postalCode
      country
      salesRepEmployeeNumber
      creditLimit
    }
  }
`;

export default GetCustomersQuery;
