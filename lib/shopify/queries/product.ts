import { productFragment } from "../fragments";

export const getProductQuery = /* GraphQL */ `
  query getProduct($handle: String!) {
    product(handle: $handle) {
      ...product
    }
  }
  ${productFragment}
`;

export const getProductsQuery = /* GraphQL */ `
  query getProducts(
    $sortKey: ProductSortKeys
    $reverse: Boolean
    $query: String
    $first: Int = 100
  ) {
    products(
      sortKey: $sortKey
      reverse: $reverse
      query: $query
      first: $first
    ) {
      edges {
        node {
          ...product
        }
      }
    }
  }
  ${productFragment}
`;

// Get Related Products (Shopify's Recommendation Engine)
export const getProductRecommendationsQuery = /* GraphQL */ `
  query getProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...product
    }
  }
  ${productFragment}
`;
