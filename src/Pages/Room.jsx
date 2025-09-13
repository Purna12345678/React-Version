import { useTranslation } from "react-i18next";
import React from "react";

// import react-router-dom
import { Link } from "react-router-dom";

// imports components
import Hero from "../Components/Hero/Hero";
import Banner from "../Components/Banner/Banner";
import RoomContainer from "../Components/RoomsContainer/RoomsContainer";

function Room() {
  const { t } = useTranslation("Pages");

  return (
    <>
      <Hero hero="roomsHero">
        <Banner title="our rooms">
          <Link to="/" className="btn-primary">
            {t("return-home")}
          </Link>
        </Banner>
      </Hero>

      <RoomContainer />
    </>
  );
}

export default Room;
