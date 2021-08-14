// import './Product.css';
import React, {useState} from 'react';

export const Order = (props) => {
    const {order_id, order_address, order_address_number, order_zip, order_country, order_date, order_payment_method, order_shipping_method, order_status, order_ammount} = props.order;
    // const product = props.product;
    // const name = product.product_name;
    // const description = product.product_description;
    // const price = product.product_price;
    // const stock = product.product_stock;
    // const image = product.product_image;
    // const id = product.product_id;
    // const imageLink = `/media/products/${image}`;

    // const productToAdd = {
    //     product_id: id,
    //     product_name: name,
    //     product_price: price
    // };

    // const [addCartStatus, setAddCartStatus] = useState('');

    // async function addToCart() {
    //     try {
    //         const response = await fetch('http://localhost:4000/addToCart', {
    //             headers: {
    //                 "Accept": "application/json",
    //                 "Content-Type": "application/json"
    //             },
    //             credentials: 'include',   
    //             method: 'POST',
    //             body: JSON.stringify({productToAdd: productToAdd})
    //         });
    //         const jsonResponse = await response.json();
    //         console.log(jsonResponse);
    //         setAddCartStatus(jsonResponse.message);
    //     } catch (error) {
    //         console.log(error);
    //     }   
    // };

    return (
        <div className="order">
            <h4 className='product-name'>{order_id}</h4>
            {/* <p className='product-description'>{order_status}</p>
            <p className='product-price'>{order_ammount}</p>
            <p className='product-stock'>{order_payment_method}</p> */}
          
        </div>
    )
};