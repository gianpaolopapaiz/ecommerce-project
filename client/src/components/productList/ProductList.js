import React, {useState, useEffect} from 'react';


export const ProductList = () => {
    
    const [products, setProducts] = useState(false);
    
    const getProducts = () => {
        fetch('http://localhost:4000/products').then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Request Failed!');
        }, networkError => console.log(networkError.message)
        ).then(jsonResponse => {
            console.log(jsonResponse)
        });
    }
    
    return (
        <div>
            <button onClick={getProducts}>Products</button>
            <p>(List of Products)</p>
                
        </div>
    )
}