import React, { useContext } from "react";

// import context
import { RoomContext } from "../../Context/Context";

// import components
import Loading from "../Loading/Loading";
import Room from "../Room/Room";
import Title from "../Title/Title";

export default function FeaturedRooms() {
  const { loading, featuredRooms: rooms } = useContext(RoomContext);

  const roomList = rooms.map((room) => {
    return <Room key={room.id} room={room} />;
  });

  return (
    <section className="featured-rooms">
      <Title title="featured rooms" />

      <div className="featured-rooms-center">{loading ? <Loading /> : roomList}</div>
    </section>
  );
}
