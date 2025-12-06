import { imageFragment, priceFragment } from "../fragments";

// get customer details
export const getCustomerQuery = /* GraphQL */ `
  query getCustomer($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      id
      firstName
      lastName
      email
      phone
      defaultAddress {
        id
        address1
        city
        country
        zip
      }
      orders(first: 10) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            totalPrice {
              amount
              currencyCode
            }
            lineItems(first: 5) {
              edges {
                node {
                  title
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const getCustomerOrdersQuery = /* GraphQL */ `
  query getCustomerOrders($customerAccessToken: String!) {
    customer(customerAccessToken: $customerAccessToken) {
      orders(first: 20, sortKey: PROCESSED_AT, reverse: true) {
        edges {
          node {
            id
            orderNumber
            processedAt
            financialStatus
            fulfillmentStatus
            statusUrl
            totalPrice {
              ...price
            }
            lineItems(first: 5) {
              edges {
                node {
                  title
                  quantity
                  variant {
                    image {
                      ...image
                    }
                  }
                }
              }
            }
            successfulFulfillments(first: 1) {
              trackingCompany
              trackingInfo(first: 1) {
                number
                url
              }
            }
          }
        }
      }
    }
  }
  ${priceFragment}
  ${imageFragment}
`;
