import React, { useEffect, useState } from "react";
import { db } from "../config/firebase-config";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { Link } from "react-router-dom"; 
import "bootstrap/dist/css/bootstrap.min.css";
import "./Cart.css";

function Cart({ setCartItems }) {
  const [cartItems, setLocalCartItems] = useState([]);
  const [timestamp, setTimestamp] = useState("");

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    calculateTotalPrice();
    const now = new Date();
    setTimestamp(now.toLocaleString());
  }, [cartItems]);

  const fetchCartItems = async () => {
    try {
      const cartSnapshot = await getDocs(collection(db, "cart"));
      const cartItemsData = [];

      for (const docRef of cartSnapshot.docs) {
        const cartDocId = docRef.id;
        const itemIds = docRef.data().items;
        const productPromises = itemIds.map(async (productId) => {
          try {
            const productDoc = await getDoc(doc(db, "products", productId));
            if (productDoc.exists()) {
              const productData = productDoc.data();
              cartItemsData.push({ id: productId, cartDocId, ...productData, quantity: 1 }); // Include quantity property with default value
            } else {
              console.error(`Product with ID ${productId} does not exist.`);
            }
          } catch (error) {
            console.error("Error fetching product:", error);
          }
        });

        await Promise.all(productPromises);
      }

      setLocalCartItems(cartItemsData);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const handleRemoveFromCart = async (productId, cartDocId) => {
    try {
      const cartDocRef = doc(db, "cart", cartDocId);
      await updateDoc(cartDocRef, { items: arrayRemove(productId) });
      console.log("Product removed from cart successfully!");
      fetchCartItems();
      setCartItems((prevCount) => prevCount - 1);
    } catch (error) {
      console.error("Error removing product from cart:", error);
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    const updatedCartItems = cartItems.map(item => {
      if (item.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    setLocalCartItems(updatedCartItems);
  };

  const calculateTotalPrice = () => {
    const totalPrice = cartItems.reduce((total, item) => {
      if (typeof item.price === "string") {
        const priceWithoutDollarSign = parseFloat(
          item.price.replace("$", "")
        );
        total += priceWithoutDollarSign * item.quantity; // Multiply by quantity
      } else {
        console.error(`Invalid price data for item with ID ${item.id}`);
      }
      return total;
    }, 0);

    return totalPrice.toFixed(2);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Cart Items</h5>
              <ul className="list-group">
                {cartItems.map((item) => (
                  <li key={item.id} className="list-group-item">
                    <div className="cart-item">
                      <div className="item-image">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="img-fluid"
                        />
                      </div>
                      <div className="item-details">
                        <h6 className="item-title">{item.title}</h6>
                        <p className="item-description">{item.description}</p>
                        <p className="item-price">${item.price}</p>
                        <div className="item-quantity">
                          <label>Quantity:</label>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(item.id, parseInt(e.target.value))
                            }
                          />
                        </div>
                        <button
                          className="btn btn-danger"
                          onClick={() =>
                            handleRemoveFromCart(item.id, item.cartDocId)
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Order Details</h5>
              <p>Total Items: {cartItems.length}</p>
              <p>Total Price: PHP {calculateTotalPrice()}</p>
              <p>Last Updated: {timestamp}</p>
              <Link to="/productlist"> 
                <button className="btn btn-primary btn-block">Continue Shopping</button>
              </Link>
              <button className="btn btn-primary btn-block">Proceed to Checkout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
