import {Product} from '../product/Product';
import React, {useState, useEffect} from 'react';
import './ProductList.css';

export const ProductList = () => {
    const err = ''
    
    const [products, setProducts] = useState([]);
    
    const getProducts = () => {
        console.log('Getting products...');
        fetch('http://localhost:4000/products').then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Request Failed!');
        }, networkError => console.log(networkError.message)
        ).then(jsonResponse => {
            setProducts(jsonResponse);
        });
    };

    useEffect(getProducts,[]);
    
    return (
        <div>
            <h2>All Products</h2> 
            <div className='product-list'>
                {products === undefined ? <p>Unable to retrieve products from Database!</p> :
                    products.map(product => {
                    return <Product product={product}/>
                })} 
            </div>
        </div>    
    )
};