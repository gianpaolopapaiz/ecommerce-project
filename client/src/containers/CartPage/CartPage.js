import { useState, useEffect } from "react";

export const CartPage = () => {

    const [cartProductArr, setCartProductArr] = useState([]);    
    const [cartTotal, setCartTotal] = useState(0); 

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
    
   /* if(cartProductArr.length < 1 ){
        return (
            <div> 
                <h2>Shopping Cart</h2>
                <p>Cart is empty!</p>
            </div>
        )
    }*/

    return (
        <div> 
            <h2>Shopping Cart</h2>
            <table >
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                </tr>
                {cartProductArr.map(cartProduct => {
                    return (
                        <tr>
                            <td>{cartProduct.product_name}</td>
                            <td>{cartProduct.product_price}</td>
                            <td>{cartProduct.quantity}</td>
                            <td>{cartProduct.total}</td>
                        </tr>
                    )     
                })}
            </table>
            <h3>TOTAL: {cartTotal}</h3>
        </div>
    )  
}