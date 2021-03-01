import { useContext } from 'react'
import ShopifyContext from './shopify-context'

export default function useShopify(){
	const context = useContext(ShopifyContext)
	return context
}