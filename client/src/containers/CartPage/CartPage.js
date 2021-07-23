import { useState, useEffect } from "react";
import { CartProductList } from "../../components/CartProductList/CartProductList";

export const CartPage = () => {

    const [cartProductArr, setCartProductArr] = useState([]);    
    const [cartTotal, setCartTotal] = useState(0); 

    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function getCartProductsArr() {
        try {
            const response = await fetch('http://localhost:4000/getCartProductArr', {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                credentials: 'include',   
                method: 'POST'
            });
            const jsonResponse = await response.json();
            setCartProductArr(jsonResponse.cartProductArr);
            console.log(cartProductArr);
            setCartTotal(jsonResponse.cartTotal.total);
            console.log(cartTotal);
        } catch (error) {
            console.log(error);
        }   
    };

    useEffect(getCartProductsArr, []);
    
    if (cartTotal == 0) {
        console.log(cartProductArr)
        return <p>Cart is empty</p>
    }

    return (
        <div>
            <h2>Shopping Cart</h2>
            <CartProductList 
                cartProductArr={cartProductArr}
                cartTotal={cartTotal} />
            <button><a href='/order'>Continue to order</a></button>
        </div>
    )  
}