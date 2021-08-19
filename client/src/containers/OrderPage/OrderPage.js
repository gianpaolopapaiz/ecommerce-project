import { useState, useEffect } from "react";
import { CartProductList } from '../../components/CartProductList/CartProductList'

export const OrderPage = (props) => {
    const [placeOrderStatus, setPlaceOrderStatus] = useState("");
    const [cartProductArr, setCartProductArr] = useState([]);    
    const [cartTotal, setCartTotal] = useState(0); 
    const [orderForm , setOrderForm] = useState({
        orderContactNumber: "",
        orderAddress: "",
        orderAddressNumber: "",
        orderZip: "",
        orderCountry: "",
        orderMethod: "",
        orderShipping: "",
    });
    const [orderStatus, setOrderStatus] = useState(false);

    const handleChange = (e) => {
        setPlaceOrderStatus("");
        const {id , value} = e.target   
        setOrderForm(prevState => ({
            ...prevState,
            [id] : value
        }))
    };

    const handleChangeOrderMethodCreditCard = (e) => {
        if (document.getElementById("orderMethodCreditCard").value === "Credit-Card") {
            setOrderForm(prevState => ({
            ...prevState,
            orderMethod : 'Credit Card'
        }))   
        }
    };

    const handleChangeOrderMethodBankDeposit = (e) => {
        if (document.getElementById("orderMethodBankDeposit").value === "Bank-Deposit") {
            setOrderForm(prevState => ({
            ...prevState,
            orderMethod : 'Bank Deposit'
        }))   
        }
    };

    const handleChangeOrderShippingPickup = (e) => {
        if (document.getElementById("orderShippingPickup").value === "Pickup") {
            setOrderForm(prevState => ({
                ...prevState,
                orderShipping : 'Pickup'
            }))   
            }
    };

    const handleChangeOrderShippingSedex = (e) => {
        if (document.getElementById("orderShippingSedex").value === "Sedex") {
            setOrderForm(prevState => ({
                ...prevState,
                orderShipping : 'Sedex'
            }))   
            }
    };
//----------------------------------------------------------

    const handleSubmitClick = (e) => {
        e.preventDefault();
        console.log(orderForm);
        //check form input fields
        if (orderForm.orderContactNumber.length <= 3 ){
            setPlaceOrderStatus("Enter a valid Contact Number!");
            return
        }
        if (orderForm.orderAddres === ''){
            setPlaceOrderStatus("Enter a valid Address!");
            return
        };
        if (orderForm.orderAddressNumber.length < 1){
            setPlaceOrderStatus("Enter a valid Address Number!");
            return
        };
        if (orderForm.orderZip.length < 1){
            setPlaceOrderStatus("Enter a valid Zip Code!");
            return
        };
        if (orderForm.orderZip.length < 1){
            setPlaceOrderStatus("Enter a valid Zip Code!");
            return
        };
        if (orderForm.orderCountry === ""){
            setPlaceOrderStatus("Enter a valid Country!");
            return
        };
        if (orderForm.orderMethod === ""){
            setPlaceOrderStatus("Choose a payment method!");
            return
        };
        if (orderForm.orderShipping === ""){
            setPlaceOrderStatus("Choose a shipping type!");
            return
        };
        placeOrder()
    }
    
    async function placeOrder() {
        try {
            const response = await fetch('http://localhost:4000/placeOrder', {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                credentials: 'include',   
                method: 'POST',
                body: JSON.stringify({
                    orderToAdd: orderForm, 
                    orderProductArr: cartProductArr, 
                    orderTotal: cartTotal})
            });
            const jsonResponse = await response.json();
            console.log(jsonResponse);
            setOrderStatus(true);
        } catch (error) {
            console.log(error);
        }   
    }

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


    const redirectToPayment = () => {
        console.log(orderStatus)
        if (orderStatus){
            console.log('Redirecting to payment...')
            props.history.push('/payment');
        }
    }

    useEffect(redirectToPayment, [orderStatus]);

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
                    id="orderMethodCreditCard" 
                    name="order-payment-method" 
                    value="Credit-Card"
                    onChange={handleChangeOrderMethodCreditCard}/> 
                <label for="creditCard">Credit Card</label>
                <input 
                    type="radio" 
                    id="orderMethodBankDeposit" 
                    name="order-payment-method" 
                    value="Bank-Deposit"
                    onChange={handleChangeOrderMethodBankDeposit}/>
                <label for="bank-deposit">Bank Deposit</label>
                <p></p>
                <label className="form-label" for='order-shipping'>Shipping:* </label>
                <input 
                    type="radio" 
                    id="orderShippingPickup" 
                    name="order-shipping" 
                    value="Pickup"
                    onChange={handleChangeOrderShippingPickup}/>
                <label for="creditCard">Pickup</label>
                <input 
                    type="radio" 
                    id="orderShippingSedex" 
                    name="order-shipping" 
                    value="Sedex"
                    onChange={handleChangeOrderShippingSedex}/>
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