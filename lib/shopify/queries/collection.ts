import {
  collectionFragment,
  imageFragment,
  productFragment,
} from "../fragments";

export const getCollectionsQuery = /* GraphQL */ `
  query getCollections {
    collections(first: 5, sortKey: UPDATED_AT, reverse: true) {
      edges {
        node {
          ...collection
          image {
            ...image
          }
        }
      }
    }
  }
  ${collectionFragment}
  ${imageFragment}
`;

export const getCollectionQuery = /* GraphQL */ `
  query getCollection($handle: String!) {
    collection(handle: $handle) {
      ...collection
    }
  }
  ${collectionFragment}
`;

export const getCollectionProductsQuery = /* GraphQL */ `
  query getCollectionProducts(
    $handle: String!
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collection(handle: $handle) {
      products(first: 100, sortKey: $sortKey, reverse: $reverse) {
        edges {
          node {
            ...product
          }
        }
      }
    }
  }
  ${productFragment}
`;
