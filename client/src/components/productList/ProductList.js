import {Product} from '../product/Product';
import React, {useState, useEffect} from 'react';
import './ProductList.css';

export const ProductList = () => {
    const err = ''
    
    const [products, setProducts] = useState([]);
    
    const getProducts = async () => {
        console.log('Getting products...');
        try {
            const response = await fetch('http://localhost:4000/products');
            if (response.ok) {
                const jsonResponse = await response.json();
                setProducts(jsonResponse);
            }
            throw new Error('Request Failed!');
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(getProducts, []);
    
    return (
        <div>
            <h2>All Products</h2> 
            <button onClick={getProducts}>hello</button>
            <div className='product-list'>
                {products === undefined ? <p>Unable to retrieve products from Database!</p> :
                    products.map(product => {
                    return <Product product={product}/>
                })} 
            </div>
        </div>    
    )
};