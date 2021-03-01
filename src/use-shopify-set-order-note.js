import { useContext } from 'react'
import ShopifyContext from './shopify-context'

export default function useShopifySetOrderNote(){
	const { store: { checkout }, client } = useContext(ShopifyContext)
	async function setOrderNote(note) {
		await client.checkout.updateAttributes(checkout.id, { note })
	}
	return setOrderNote
}