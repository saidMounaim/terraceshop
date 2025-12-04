export const imageFragment = /* GraphQL */ `
  fragment image on Image {
    url
    altText
    width
    height
  }
`;

export const priceFragment = /* GraphQL */ `
  fragment price on MoneyV2 {
    amount
    currencyCode
  }
`;

export const seoFragment = /* GraphQL */ `
  fragment seo on SEO {
    description
    title
  }
`;

export const productFragment = /* GraphQL */ `
  fragment product on Product {
    id
    handle
    availableForSale
    title
    description
    descriptionHtml
    options {
      id
      name
      values
    }
    priceRange {
      maxVariantPrice {
        ...price
      }
      minVariantPrice {
        ...price
      }
    }
    variants(first: 250) {
      edges {
        node {
          id
          title
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            ...price
          }
        }
      }
    }
    featuredImage {
      ...image
    }
    images(first: 20) {
      edges {
        node {
          ...image
        }
      }
    }
    seo {
      ...seo
    }
    tags
    updatedAt
    collections(first: 1) {
      edges {
        node {
          title
        }
      }
    }
  }
  ${imageFragment}
  ${priceFragment}
  ${seoFragment}
`;

export const cartFragment = /* GraphQL */ `
  fragment cart on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        ...price
      }
      totalAmount {
        ...price
      }
      totalTaxAmount {
        ...price
      }
    }
    lines(first: 100) {
      edges {
        node {
          id
          quantity
          cost {
            totalAmount {
              ...price
            }
          }
          merchandise {
            ... on ProductVariant {
              id
              title
              selectedOptions {
                name
                value
              }
              product {
                handle
                title
                featuredImage {
                  ...image
                }
              }
              price {
                ...price
              }
            }
          }
        }
      }
    }
  }
  ${imageFragment}
  ${priceFragment}
`;
