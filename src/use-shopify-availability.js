import get from 'lodash/get'
import useProduct from './use-shopify-product'

export default function useShopifyAvailability(parentId, variantId) {
	const product = useProduct(parentId)
	let isLoading = !product
	let available
	if (!variantId) {
		available = get(product, `availableForSale`)
	}
	else{
		let variants = get(product, `variants`, [])
		for (let i = variants.length; i--;) {
			if (variants[i].id === variantId) {
				available = get(variants[i], `available`)
			}
		}
	}
	return [available, isLoading]
}