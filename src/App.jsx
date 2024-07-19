import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Card from "./components/card/card";
import Cart from "./components/cart/cart";
import { getData } from "./constants/db";

const courses = getData();

const telegram = window.Telegram.WebApp;

const App = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    telegram.ready();
  });

  const onAddItem = (item) => {
    const existItem = cartItems.find((c) => c.id === item.id);
    console.log("EXIST_ITEM", existItem);

    if (existItem) {
      const newData = cartItems.map((c) =>
        c.id === item.id
          ? { ...existItem, quantity: existItem.quantity + 1 }
          : c
      );
      console.log("add_quantity_exist_item", newData);
      setCartItems(newData);
    } else {
      const newData = [...cartItems, { ...item, quantity: 1 }];
      console.log("add_item", newData);
      setCartItems(newData);
    }
  };

  const onRemoveItem = (item) => {
    const existItem = cartItems.find((c) => c.id === item.id);
    console.log("existItem", existItem);

    if (existItem.quantity === 0) {
      const newData = cartItems.filter((c) => c.id === existItem.id);
      console.log("DELETE_ITEM_QUANTITY_0", newData);
      setCartItems(newData);
    } else {
      const newData = cartItems.map((c) =>
        c.id === existItem.id
          ? { ...existItem, quantity: existItem.quantity - 1 }
          : c
      );
      console.log("DELETE_1_ITEM_QUANTITY_0", newData);
      setCartItems(newData);
    }
  };

  const onCheckOut = () => {
    telegram.MainButton.text = "Sotib olish :)"
    telegram.MainButton.show();
  };

  const onSendData = useCallback(() =>{
    telegram.sendData(JSON.stringify(cartItems));
  }, [cartItems]);


  useEffect(() => {
    telegram.onEvent("mainButtonClicked", onSendData);

    return() =>  telegram.offEvent("mainButtonClicked", onSendData);
  }, [onSendData])

  return (
    <>
      <h1 className="heading">EDU.IT kurslari</h1>
      <Cart cartItems={cartItems} onCheckOut={onCheckOut}/>
      <div className="cards__container">
        {courses.map((course) => (
          <Card
            key={course.id}
            course={course}
            onAddItem={onAddItem}
            onRemoveItem={onRemoveItem}
          />
        ))}
      </div>
    </>
  );
};

export default App;
