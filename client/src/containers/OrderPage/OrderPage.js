import { useState, useEffect } from "react";
import { CartProductList } from '../../components/CartProductList/CartProductList'

export const OrderPage = () => {
    const [placeOrderStatus, setPlaceOrderStatus] = useState("");
    const [cartProductArr, setCartProductArr] = useState([]);    
    const [cartTotal, setCartTotal] = useState(0); 

    const handleChange = () => {

    }
    const handleSubmitClick = () => {

    }
    
    async function placeOrder() {
        try {
            const response = await fetch('http://localhost:4000/placeOrder', {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                credentials: 'include',   
                method: 'POST'
            });
            const jsonResponse = await response.json();
            //setCartProductArr(jsonResponse.cartProductArr);
            console.log(jsonResponse);
            //setCartTotal(jsonResponse.cartTotal.total);
            //console.log(cartTotal);
        } catch (error) {
            console.log(error);
        }   
    }

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

    return (
        <div>
             <h2>Order Page</h2>
             <CartProductList 
                cartProductArr={cartProductArr}
                cartTotal={cartTotal} />
             <form className='order-form'>
                <h3>Order Details</h3>
                <label className="form-label" for='order-contact-number'>Contact Number:* </label>
                <input 
                    id ='orderContactNumber' 
                    type="number" 
                    name="order-contact-number"
                    minLength="1" 
                    maxLength="20" 
                    onChange={handleChange}
                    required/>
                <p></p>
                <label className="form-label" for='order-address'>Address:* </label>
                <input
                    id='orderAddress'
                    type="text" 
                    name="order-address" 
                    onChange={handleChange}
                    required/>
                <p></p> 
                <label className="form-label" for='order-address-number'>Address Number:* </label>
                <input 
                    id ='orderAddressNumber' 
                    type="number" 
                    name="order-address-number"
                    minLength="1" 
                    maxLength="10" 
                    onChange={handleChange}
                    required/>
                <p></p>
                <label className="form-label" for='order-zip'>ZIP Code:* </label>
                <input 
                    id ='orderZip' 
                    type="text" 
                    name="order-zip" 
                    minLength="1" 
                    maxLength="20" 
                    onChange={handleChange}
                    required/>
                <p></p>
                <label className="form-label" for='order-country'>Country:* </label>
                <input 
                    id='orderCountry' 
                    type="text" 
                    name="order-country" 
                    onChange={handleChange}
                    required/>
                <p></p>
                <label className="form-label" for='order-payment-method'>Payment Method:* </label>
                <input 
                    type="radio" 
                    id="orderCreditCard" 
                    name="order-payment-method" 
                    value="Credit-Card"/>
                <label for="creditCard">Credit Card</label>
                <input 
                    type="radio" 
                    id="orderBankDeposit" 
                    name="order-payment-method" 
                    value="Bank-Deposit"/>
                <label for="ele">Bank Deposit</label>
                <p></p>
                <label className="form-label" for='order-payment-method'>Shipping:* </label>
                <input 
                    type="radio" 
                    id="orderCreditCard" 
                    name="order-payment-method" 
                    value="Credit-Card"/>
                <label for="creditCard">Pickup</label>
                <input 
                    type="radio" 
                    id="orderBankDeposit" 
                    name="order-payment-method" 
                    value="Bank-Deposit"/>
                <label for="ele">SEDEX</label>
                <p></p>
                <input 
                    className='form-submit' 
                    type="submit" 
                    value="Place Order"
                    onClick={handleSubmitClick}  
                ></input>
                <p>{placeOrderStatus}</p>
            </form>
        </div>
    )
   
}