export default function initCheckout(client, updateStore){
	const initializeCheckout = async () => {
		// Check for an existing cart.
		const isBrowser = typeof window !== `undefined`
		const existingCheckoutID = isBrowser
			? localStorage.getItem(`shopify_checkout_id`)
			: null

		const setCheckoutInState = checkout => {
			if (isBrowser) {
				localStorage.setItem(`shopify_checkout_id`, checkout.id)
			}

			updateStore(prevState => {
				return { ...prevState, checkout }
			})
		}

		const createNewCheckout = () => client.checkout.create()
		const fetchCheckout = id => client.checkout.fetch(id)

		if (existingCheckoutID) {
			try {
				const checkout = await fetchCheckout(existingCheckoutID)
				// Make sure this cart hasn’t already been purchased.
				if (!checkout.completedAt) {
					setCheckoutInState(checkout)
					return
				}
			} catch (e) {
				localStorage.setItem(`shopify_checkout_id`, null)
			}
		}

		const newCheckout = await createNewCheckout()
		setCheckoutInState(newCheckout)
	}

	initializeCheckout()
}