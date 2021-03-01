import React, { useState, useEffect } from 'react'
import Client from 'shopify-buy'
import Context from './shopify-context'
import initCheckout from './init-checkout'

const pollInterval = 5 * 60 * 1000 // Every 5 minutes

const clientOptions = {
	storefrontAccessToken: process.env.SHOPIFY_ACCESS_TOKEN,
	domain: `${process.env.SHOP_NAME}.myshopify.com`,
}
const client = (Client && Client.buildClient) ? Client.buildClient(clientOptions) : {}

export default function ContextProvider({ children }) {
	let initialStoreState = {
		client,
		checkout: { lineItems: [] },
		products: [],
		shop: {},
	}
	const [store, updateStore] = useState(initialStoreState)
	const [inventory, setInventory] = useState({})
	const [prices, setPrices] = useState({})
	const [priceRanges, setPriceRanges] = useState({})
	const [products, setProducts] = useState({})
	const [loadingProduct, setLoadingProduct] = useState(true)
	const [isAddingToCart, setIsAddingToCart] = useState(false)

	async function fetchProduct(id){
		if(id in products) return
		let product = await client.product.fetch(id)
		let newProducts = {
			[id]: product,
			...products,
		}
		setProducts(newProducts)
	}
	async function fetchProducts() {
		let products = await client.product.fetchAll()
		let newInventory = {}
		let newPrices = {}
		let newPriceRanges = {}
		let newProduct = {}
		for (let product of products) {
			let priceRange
			for (let variant of product.variants) {
				let price = Number(variant.price)
				if (!priceRange){
					priceRange = [price, price]
				}
				else{
					if (price < priceRange[0]) priceRange[0] = price
					if (price > priceRange[1]) priceRange[1] = price
				}
				newInventory[variant.sku] = variant.available
				newPrices[variant.sku] = price
				newProduct[variant.sku] = variant
			}
			for (let variant of product.variants) {
				newPriceRanges[variant.sku] = priceRange
			}
		}
		setInventory(newInventory)
		setPrices(newPrices)
		setPriceRanges(newPriceRanges)
		setProducts(newProduct)
		setLoadingProduct(false)
	}


	useEffect(() => {
		const isBrowser = typeof window !== `undefined`
		if (!isBrowser) return
		initCheckout(client, updateStore)
		let interval = setInterval(fetchProducts, pollInterval)
		return () => clearInterval(interval)
	}, [])

	return (
		<Context.Provider
			value={{
				store,
				inventory,
				prices,
				priceRanges,
				loadingProduct,
				client,
				isAddingToCart,
				fetchProduct,
				products,
				setProducts,
				addToCart: (variantId, quantity) => {
					if (variantId === `` || !variantId) {
						console.error(`variantId is required.`)
						return
					}
					if(typeof quantity != `number`){
						quantity = 1
					}

					setIsAddingToCart(true)
					updateStore(prevState => {
						return { ...prevState }
					})

					const { checkout } = store
					const checkoutId = checkout.id
					const lineItemsToUpdate = Array.isArray(variantId) 
						? variantId.map(({ id, qty }) => ({
							variantId: id, quantity: parseInt(qty, 10),
						}))
						: [{ variantId, quantity: parseInt(quantity, 10) }]
					console.log(`Line Items to add to cart: `, lineItemsToUpdate)
					return client.checkout
						.addLineItems(checkoutId, lineItemsToUpdate)
						.then(checkout => {
							setIsAddingToCart(false)
							updateStore(prevState => {
								return { ...prevState, checkout }
							})
						})
						.catch(err => {
							console.log(`Didn't add to cart`)
							console.error(err)
						})
				},
				updateLineItem: (checkoutID, lineItem) => {
					return client.checkout
						.updateLineItems(checkoutID, [lineItem])
						.then(res => {
							updateStore(prevState => {
								return { ...prevState, checkout: res }
							})
						})
				},
				removeLineItem: (checkoutID, lineItemID) => {
					return client.checkout
						.removeLineItems(checkoutID, [lineItemID])
						.then(res => {
							updateStore(prevState => {
								return { ...prevState, checkout: res }
							})
						})
				},
			}}
		>
			{children}
		</Context.Provider>
	)
}