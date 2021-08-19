import { useState, useEffect } from "react";

export const PaymentPage = (props) => {
  // const [placeOrderStatus, setPlaceOrderStatus] = useState("");
  
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
      // setCartProductArr(jsonResponse.cartProductArr);
      // console.log(cartProductArr);
    } catch (error) {
        console.log(error);
    }   
  };

  useEffect(getCartProductsArr, []);
  
    return (
      <h1>Payment Page</h1>

    )
}