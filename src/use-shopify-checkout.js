import get from 'lodash/get'
import useShopify from './use-shopify'

export default function useShopifyCheckout() {
	const shopify = useShopify()
	function checkout(e) {
		if(e && e.preventDefault) e.preventDefault()
		const webUrl = get(shopify, `store.checkout.webUrl`)
		const activeEnv = process.env.ACTIVE_ENV || process.env.NODE_ENV || `development`
		let href = webUrl
		if (activeEnv === `development` && process.env.SHOPIFY_THEME_ID) {
			href = `${href}?fts=0&preview_theme_id=${process.env.SHOPIFY_THEME_ID}`
		}
		window.location.href = href
	}
	return checkout
}