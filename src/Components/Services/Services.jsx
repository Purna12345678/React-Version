import { useTranslation } from "react-i18next";
import React from "react";

// imports react-icons
import { FaCocktail, FaHiking, FaShuttleVan, FaBeer } from "react-icons/fa";

// imports components
import Title from "../Title/Title";

const services = [
  {
    icon: <FaCocktail />,
    title: "free cocktails",
    info: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores est eaque error provident unde eligendi.",
  },
  {
    icon: <FaHiking />,
    title: "endless hiking",
    info: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores est eaque error provident unde eligendi.",
  },
  {
    icon: <FaShuttleVan />,
    title: "free shuttle",
    info: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores est eaque error provident unde eligendi.",
  },
  {
    icon: <FaBeer />,
    title: "storages beer",
    info: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores est eaque error provident unde eligendi.",
  },
];

function renderService(item, index) {
  return (
    <article key={index} className="services">
      <span>{item.icon}</span>
      <h6>{item.title}</h6>
      <p>{item.info}</p>
    </article>
  );
}

export default function Services() {
  const { t } = useTranslation("Components/Services");

  return (
    <section className="services">
      <Title title={t("services")} />

      <div className="services-center">{services.map(renderService)}</div>
    </section>
  );
}
