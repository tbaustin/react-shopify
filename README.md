# @app/react-shopify

Custom React hooks for working with [Shopify's storefront API](https://www.npmjs.com/package/shopify-buy).

## Usage

```js
import {
   ShopifyProvider,
   useShopify,
   useShopifyPrice,
   useShopifyAvailability,
   useShopifyProduct,
   useShopifySetOrderNote
} from '@app/react-shopify'

const {
   client,  // https://www.npmjs.com/package/shopify-buy
   addToCart,
   isAddingToCart,
} = useShopify()
```

## Hooks

Name | Arguments | Example
--- | --- | ---
`useShopify` | (none) | `const { client, addToCart, isAddingToCart } = useShopify()`
`useShopifyPrice` | Product ID, Variant ID | `const [price, isLoading] = useShopifyPrice("parent_id", "variant_id")`
`useShopifyAvailability` | Product ID, Variant ID | `const [isAvailable, isLoading] = useShopifyAvailability("parent_id", "variant_id")`
`useShopifyProduct` | Product ID | `const shopifyData = useShopifyProduct("shopfy_parent_product_id")`
`useShopifySetOrderNote` | (none) | `const setOrderNote = useShopifySetOrderNote()`
`useShopifyCheckout` | (none) | `const handleCheckout = useShopifyCheckout()`

## Functions from Hooks

Name | Arguments | Example
--- | --- | ---
`addToCart` | SKU, quantity | `addToCart("shopfy_variant_id", 2)`
`setOrderNote` | Note | `setOrderNote("This note will be attached to the order.")`

## Variables from Hooks

- `client` (object): Shopify API client
- `isAddingToCart` (boolean): Whether or not product is being added to the cart

## Required Environment Variables

- `GATSBY_SHOPIFY_ACCESS_TOKEN`
- `GATSBY_SHOPIFY_STORE_NAME`