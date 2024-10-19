// GSAP Timeline for Hero Section Transition
const tl = gsap.timeline({ repeat: -1, repeatDelay: 3 });

// Array of hero images to cycle through
const images = ["../Images/Hero1.png", "../Images/Hero2.png", "../Images/Hero3.png"];
let currentImage = 0;

// Transition effect using the sliding papers
tl.to(".left-paper", { duration: 1, x: "0%", ease: "power2.inOut" }, 0)
  .to(".right-paper", { duration: 1, x: "0%", ease: "power2.inOut" }, 0)
  .add(() => {
    // Change the hero image once the papers cover the screen
    currentImage = (currentImage + 1) % images.length;
    document.querySelector(".hero-image").src = images[currentImage];
  })
  .to(".left-paper", { duration: 1, x: "-100%", ease: "power2.inOut" }, "+=0.5")
  .to(".right-paper", { duration: 1, x: "100%", ease: "power2.inOut" }, "-=1");
