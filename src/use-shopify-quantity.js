import { useContext } from 'react'
import reduce from 'lodash/reduce'
import ShopifyContext from './shopify-context'

export default function useShopifyQuantity(){
	const { store: { checkout } } = useContext(ShopifyContext)
	const items = checkout ? checkout.lineItems : []
	const total = reduce(items, (acc, item) => acc + item.quantity, 0)
	return total
}