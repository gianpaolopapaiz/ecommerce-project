import './Product.css';
import React, {useState} from 'react';

export const Product = (props) => {
    const product = props.product;
    const name = product.product_name;
    const description = product.product_description;
    const price = product.product_price;
    const stock = product.product_stock;
    const image = product.product_image;
    const id = product.product_id;
    const imageLink = `/media/products/${image}`;

    const productToAdd = {
        product_id: id,
        product_name: name,
        product_price: price
    };

    const [addCartStatus, setAddCartStatus] = useState('');

    async function addToCart() {
        try {
            const response = await fetch('http://localhost:4000/addToCart', {
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                credentials: 'include',   
                method: 'POST',
                body: JSON.stringify({productToAdd: productToAdd})
            });
            const jsonResponse = await response.json();
            console.log(jsonResponse);
            setAddCartStatus(jsonResponse.message);
        } catch (error) {
            console.log(error);
        }   
    };


    return (
        <div className="product">
            <img className='product-image' src={imageLink} width='200' />
            <h4 className='product-name'>{name}</h4>
            <p className='product-description'>{description}</p>
            <p className='product-price'>{price}</p>
            <p className='product-stock'>Stock: {stock} un.</p>
            <button onClick={addToCart}><a>Add to Cart</a></button>
            <p>{addCartStatus}</p>
        </div>
    )
};