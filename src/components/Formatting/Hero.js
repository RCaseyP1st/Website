import React, { useEffect } from "react";
import globalStyles from "../../styles/globalstyle.module.css";
import styles from "../../styles/herostyle.module.css";

function Hero() {
  useEffect(() => {
    const heroText = document.getElementById("hero-text");
    if (heroText) {
      heroText.classList.add(styles.fadeIn);
    }
  }, []);

  return (
    <div className={styles.heroSection}>
      {/* Hero Background Image */}
      <img
        src={`${process.env.PUBLIC_URL}/images/Hero/Hero1.png`}
        alt="Background scene"
        className={styles.heroImage}
      />

      {/* Hero Logo */}
      <img
        src={`${process.env.PUBLIC_URL}/images/P1Logos/P1Logo25.png`}
        alt="The Other-Half Hub logo"
        className={styles.heroLogo}
      />

      {/* Hero Text */}
      <div className={styles.heroText} id="hero-text">
        Welcome to <br />
        The Other-Half Hub
      </div>
    </div>
  );
}

export default Hero;
