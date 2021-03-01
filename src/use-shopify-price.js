import get from 'lodash/get'
import useProduct from './use-shopify-product'

export default function useShopifyPrice(parentId, variantId) {
	const product = useProduct(parentId)
	let isLoading = !product
	let price
	if (!variantId) {
		price = get(product, `variants[0].price`)
	}
	else{
		let variants = get(product, `variants`, [])
		for (let i = variants.length; i--;) {
			if (variants[i].id === variantId) {
				price = get(variants[i], `price`)
			}
		}
	}
	return [price, isLoading]
}