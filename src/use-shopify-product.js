import { useContext, useEffect } from 'react'
import ShopifyContext from './shopify-context'

export default function useShopifyProduct(id) {
	const { client, products, setProducts } = useContext(ShopifyContext)

	useEffect(() => {
		if(typeof window === `undefined`) return
		async function fetchProduct(id) {
			if (!id || id in products || products[id] === false) return
			setProducts({
				...products,
				[id]: false,
			})
			let product = await client.product.fetch(id)
			let newProducts = {
				[id]: product,
				...products,
			}
			setProducts(newProducts)
		}
		fetchProduct(id)
	}, [id, client, products, setProducts])

	return products[id]
}