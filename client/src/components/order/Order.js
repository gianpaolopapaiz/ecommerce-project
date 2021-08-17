// import './Product.css';
import React, {useState} from 'react';

export const Order = (props) => {
    const { order_id, order_address, order_address_number, order_zip, order_country, order_date, order_payment_method, order_shipping_method, order_status, order_ammount } = props.order;

    return (
        <tr className="order">
            <td className='order-id'>{order_id}</td>
            <td className='order-date'>{order_date.toString().substring(0,10).replaceAll('-', '/')}</td>
            <td className='order-ammount'>{order_ammount}</td>
            <td className='order-country'>{order_country}</td>
            <td className='order-shipping_method'>{order_shipping_method}</td>
            <td className='order-payment-method'>{order_payment_method}</td>
            <td className='order-status'>{order_status}</td>
        </tr>
    )
};