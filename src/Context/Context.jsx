import React, { useState, useEffect, createContext } from "react";

// import data
import items from "../Data/data";

// react context-api
const RoomContext = createContext();

const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [sortedRooms, setSortedRooms] = useState([]);
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("all");
  const [capacity, setCapacity] = useState(1);
  const [price, setPrice] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [minSize, setMinSize] = useState(0);
  const [maxSize, setMaxSize] = useState(0);
  const [breakfast, setBreakfast] = useState(false);
  const [pets, setPets] = useState(false);

  useEffect(() => {
    let rooms = formatData(items);
    let featuredRooms = rooms.filter((room) => room.featured === true);

    let maxPrice = Math.max(...rooms.map((item) => item.price));
    let maxSize = Math.max(...rooms.map((item) => item.size));

    setRooms(rooms);
    setFeaturedRooms(featuredRooms);
    setSortedRooms(rooms);
    setLoading(false);
    setPrice(maxPrice);
    setMaxPrice(maxPrice);
    setMaxSize(maxSize);
  }, []);

  const formatData = (items) => {
    let tempItems = items.map((item) => {
      let id = item.sys.id;
      let images = item.fields.images.map((image) => image.fields.file.url);

      let room = { ...item.fields, images, id };
      return room;
    });
    return tempItems;
  };

  const getRoom = (slug) => {
    let tempRooms = [...rooms];
    const room = tempRooms.find((room) => room.slug === slug);
    return room;
  };

  const handleChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = event.target.name;

    switch (name) {
      case "type":
        setType(value);
        break;
      case "capacity":
        setCapacity(value);
        break;
      case "price":
        setPrice(value);
        break;
      case "minSize":
        setMinSize(value);
        break;
      case "maxSize":
        setMaxSize(value);
        break;
      case "breakfast":
        setBreakfast(value);
        break;
      case "pets":
        setPets(value);
        break;
      default:
        break;
    }
    filterRooms({
      type: name === "type" ? value : type,
      capacity: name === "capacity" ? value : capacity,
      price: name === "price" ? value : price,
      minSize: name === "minSize" ? value : minSize,
      maxSize: name === "maxSize" ? value : maxSize,
      breakfast: name === "breakfast" ? value : breakfast,
      pets: name === "pets" ? value : pets,
    });
  };

  const filterRooms = ({
    type,
    capacity,
    price,
    minSize,
    maxSize,
    breakfast,
    pets,
  }) => {
    let tempRooms = [...rooms];

    capacity = parseInt(capacity);
    price = parseInt(price);

    if (type !== "all") {
      tempRooms = tempRooms.filter((room) => room.type === type);
    }

    if (capacity !== 1) {
      tempRooms = tempRooms.filter((room) => room.capacity >= capacity);
    }

    tempRooms = tempRooms.filter((room) => room.price <= price);

    tempRooms = tempRooms.filter(
      (room) => room.size >= minSize && room.size <= maxSize
    );

    if (breakfast) {
      tempRooms = tempRooms.filter((room) => room.breakfast === true);
    }

    if (pets) {
      tempRooms = tempRooms.filter((room) => room.pets === true);
    }

    setSortedRooms(tempRooms);
  };

  return (
    <RoomContext.Provider
      value={{
        rooms,
        sortedRooms,
        featuredRooms,
        loading,
        type,
        capacity,
        price,
        minPrice,
        maxPrice,
        minSize,
        maxSize,
        breakfast,
        pets,
        getRoom,
        handleChange,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};

const RoomConsumer = RoomContext.Consumer;

export function withRoomConsumer(Component) {
  return function ConsumerWrapper(props) {
    return (
      <RoomConsumer>
        {(value) => <Component {...props} context={value} />}
      </RoomConsumer>
    );
  };
}

export { RoomProvider, RoomConsumer, RoomContext };
