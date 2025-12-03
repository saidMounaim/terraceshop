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
