import { Order } from '../order/Order'
import React, {useState, useEffect} from 'react';
// import './ProductList.css';

export const OrderList = () => {   

    const [orders, setOrders] = useState([]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function getPurchaseHistoryArr() {
        try {
            const response = await fetch('http://localhost:4000/getPurchaseHistorytArr', {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                credentials: 'include',   
                method: 'POST'
            });
            const jsonResponse = await response.json();
            console.log(jsonResponse);
            setOrders(jsonResponse);
            console.log(orders);
        } catch (error) {
            console.log(error);
        }   
    };

    useEffect(getPurchaseHistoryArr, []);
    
    return (
        <div>
            <h2>OrderHistory ({orders[0] !== undefined ? orders.length : 0})</h2>
            <div className='order-list'>
                {orders === undefined ? <p>Unable to retrieve orders from Database!</p> :
                orders.map(order => {
                    return <Order order={order}/>
                })}
            </div>
        </div>    
    )
};