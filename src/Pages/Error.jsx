import { useTranslation } from "react-i18next";
import React from "react";

// import react-router-dom
import { Link } from "react-router-dom";

// imports components
import Hero from "../Components/Hero/Hero";
import Banner from "../Components/Banner/Banner";

function Error() {
  const { t } = useTranslation("Pages");

  return (
    <Hero>
      <Banner title="404" subtitle="page not found">
        <Link to="/" className="btn-primary">
          {t("return-home")}
        </Link>
      </Banner>
    </Hero>
  );
}

export default Error;
