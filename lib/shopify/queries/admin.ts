export const getOrdersByEmailQuery = /* GraphQL */ `
  query getOrdersByEmail($query: String!) {
    orders(first: 20, query: $query, sortKey: PROCESSED_AT, reverse: true) {
      edges {
        node {
          id
          name
          processedAt
          displayFinancialStatus
          displayFulfillmentStatus
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          lineItems(first: 20) {
            edges {
              node {
                title
                quantity
                image {
                  url
                  altText
                  width
                  height
                }
                variant {
                  image {
                    url
                    altText
                    width
                    height
                  }
                }
              }
            }
          }
          fulfillments(first: 1) {
            trackingInfo(first: 1) {
              number
              company
              url
            }
          }
        }
      }
    }
  }
`;
