import { useTranslation } from "react-i18next";
import React, { useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";

// import assets
import defaultBcg from "../assets/img/jpeg/room-1.jpeg";

// import components
import Banner from "../Components/Banner/Banner";
import { RoomContext } from "../Context/Context";
import StyledHero from "../Components/StyledHero/StyledHero";

export default function SingleRoom() {
  const { t } = useTranslation("Pages");

  const { slug } = useParams();
  const { getRoom } = useContext(RoomContext);
  const room = getRoom(slug);
  const [mainBcg] = useState(defaultBcg);

  if (!room) {
    return (
      <div className="error">
        <h3>{t("no-such-room-found")}</h3>
        <Link to="/rooms" className="btn-primary">
          {t("back-to-rooms-1")}
        </Link>
      </div>
    );
  }

  const {
    name,
    description,
    capacity,
    size,
    price,
    extras,
    breakfast,
    pets,
    images,
  } = room;

  const [mainImg, ...defaultImg] = images;

  function renderImages() {
    return defaultImg.map((item, index) => {
      return <img key={index} src={item} alt={name} />;
    });
  }

  function renderExtras() {
    return extras.map((item, index) => {
      return <li key={index}> - {item}</li>;
    });
  }

  return (
    <>
      <StyledHero img={mainImg || mainBcg}>
        <Banner title={`${name} room`}>
          <Link to="/rooms" className="btn-primary">
            {t("back-to-rooms-2")}
          </Link>
        </Banner>
      </StyledHero>

      <section className="single-room">
        <div className="single-room-images">{renderImages()}</div>

        <div className="single-room-info">
          <article className="desc">
            <h3>{t("details-label")}</h3>
            <p>{description}</p>
          </article>

          <article className="info">
            <h3>{t("information-label")}</h3>
            <h6>{t("price-template", { price })}</h6>
            <h6>{t("size-template", { size })}</h6>
            <h6>{t("max-capacity-template", { capacity })}</h6>
            <h6>{pets ? "pets allowed" : "no pets allowed"}</h6>
            <h6>{breakfast && "free breakfast included"}</h6>
          </article>
        </div>
      </section>

      <section className="room-extras">
        <h6>{t("extras-label")}</h6>
        <ul className="extras">{renderExtras()}</ul>
      </section>
    </>
  );
}
