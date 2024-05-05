// App.jsx
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";

function App() {
  const [cartItems, setCartItems] = useState(0); 

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route
            path="/productlist"
            element={<ProductList setCartItems={setCartItems} />}
          />
          <Route
            path="/cart"
            element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;