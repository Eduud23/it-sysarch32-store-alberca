import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; 
import { db } from "../config/firebase-config";
import "./ProductList.css";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  arrayUnion,
  doc,
  getDoc,
} from "firebase/firestore"; 
import "bootstrap/dist/css/bootstrap.min.css";

function ProductList({ setCartItems }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const productsSnapshot = await getDocs(collection(db, "products"));
      const productsData = productsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      const cartCollectionRef = collection(db, "cart");
      const cartDocRef = doc(cartCollectionRef, "ySrQRpUzgtTfKmSFwqFD");

      const cartDocSnap = await getDoc(cartDocRef);
      if (!cartDocSnap.exists()) {
        await addDoc(cartCollectionRef, { items: [productId] });
      } else {
        await updateDoc(cartDocRef, { items: arrayUnion(productId) });
      }

      console.log("Product added to cart successfully!");

      setCartItems((prevCount) => prevCount + 1);
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  return (
    <div>
    <div className="jerry">
      <h1>Fried Chicken</h1>
    </div>
    <div className="products-container">
      <div className="product-grid">
        <div className="product-list">
          {products.map((product) => (
            <div key={product.id} className="product-card" onClick={() => handleAddToCart(product.id)}>
              <div className="product-image">
                <img src={product.image} alt={product.title} className="rounded-image" />
              </div>
              <div className="product-details">
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <p>PHP{product.price}</p>
                <div className="product-buttons">
                  <Link to="/cart" className="btn btn-primary btn-sm">
                    Add to Cart
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
}

export default ProductList;
