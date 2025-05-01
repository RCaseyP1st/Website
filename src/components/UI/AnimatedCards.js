import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import styles from "../../styles/customscrollbar.module.css";
import {
  IconArrowBigLeftLinesFilled,
  IconArrowBigRightLinesFilled,
} from "@tabler/icons-react";

const resources = [
  {
    title: "Pink Parents",
    description: `Pink Parents is dedicated to supporting gay and lesbian parents in the UK, providing resources and information on the unique challenges they face. 
        The website addresses concerns such as potential bullying of children, exclusion from activities, and difficult questions about family dynamics. It emphasises the 
        importance of being prepared for these challenges and offering unconditional love and support to children. Pink Parents aims to create a more inclusive environment 
        for same-sex families.`,
    imgSrc: `${process.env.PUBLIC_URL}/images/tileimages/pink-parents.png`,
    link: "https://www.pinkparents.org.uk/",
  },
  {
    title: "DadPad",
    // eslint-disable-next-line
    description: `The article \"Ask DadPad: Trans and Non-Binary Parents\" offers guidance and support for trans and non-binary parents navigating parenthood. It discusses 
        the importance of creating inclusive environments, addresses common concerns, and provides practical advice on pregnancy, birth, and parenting. The article also 
        highlights the need for open communication with healthcare providers to ensure respectful and appropriate care. It aims to empower trans and non-binary individuals 
        with knowledge and resources to confidently embrace their parenting.`,
    imgSrc: `${process.env.PUBLIC_URL}/images/tileimages/dadpad.png`,
    link: "https://thedadpad.co.uk/lgbtqi-parents/ask-dadpad-trans-and-non-binary-parents/",
  },
  {
    title: "Acacia Family Support",
    description: `The Acacia Family Support's LGBTQ+ Partners page provides a comprehensive guide for LGBTQ+ parents dealing with perinatal mental health issues. 
        This page offers a wealth of resources, including self-help guides, local and national support services, and advice on recognising and managing mental health 
        problems. It emphasises the importance of early intervention, supporting one's partner, and self-care. `,
    imgSrc: `${process.env.PUBLIC_URL}/images/tileimages/acacia-family.png`,
    link: "https://www.acacia.org.uk/dads-partners/lgbtq/",
  },
  {
    title: "Feed Play Love",
    description: `One Dads choice to parent from a different rulebook. Spotify/Podcast. Sean Szeps shares his story of overcoming the challenges of being a gay man with 
        dreams of becoming a parent. Sean discusses his early struggles, his fascination with diverse mothers, and the obstacles he and his husband Josh faced on their path 
        to parenthood. He also reflects on why he believes he is the best father for his daughter.`,
    imgSrc: `${process.env.PUBLIC_URL}/images/tileimages/different-rule-book.png`,
    link: "https://open.spotify.com/episode/7woJNDoJlAcbkRGte4kBRu?si=-jKiYGadSlC_u1ljgpQ5SA&nd=1&dlsi=dc4d7ce6e1b24ab1",
  },
  {
    title: "Kim & Andi",
    description: `A Journey with Postnatal Anxiety & Depression through the Lesbian Lens. In this personal video, Kim and Andi share their journey through postnatal 
        anxiety and depression from a lesbian perspective. They discuss the emotional challenges, the vivid and distressing, and the vital role of community support. It 
        highlights the importance of language and inclusivity in healthcare, while emphasising the societal need for better support for all mothers, especially those 
        facing mental health issues.`,
    imgSrc: `${process.env.PUBLIC_URL}/images/tileimages/kim-andi.png`,
    link: "https://www.youtube.com/watch?v=1t02frctzkY",
  },
  {
    title: "ManUp!",
    description: `Man Up! is a UK-based men's mental health podcast hosted by Andy Richardson and Tommy Danquah. The podcast aims to encourage open conversations about 
        mental health among men. Each episode features discussions with various guests, including celebrities and experts, on topics ranging from personal mental health 
        experiences to broader issues in mental health advocacy.`,
    imgSrc: `${process.env.PUBLIC_URL}/images/tileimages/manup.png`,
    link: "https://open.spotify.com/show/2ahFYl1h4tkXrjIYiA6mXZ",
  },
  {
    title: "Feed Play Love",
    description: `When Dads Get PND. In this 14-minute episode from June 2022, Dave Edwards, a father of two, shares his experience with perinatal depression and 
        anxiety (PND) following the birth of his son. Despite PND affecting one in ten dads, over half do not seek help. Dave hopes that by telling his story, he can 
        encourage other dads to reach out for support.`,
    imgSrc: `${process.env.PUBLIC_URL}/images/tileimages/when-dads-get-pnd.png`,
    link: "https://open.spotify.com/episode/5tUODv7C44U0KJ2wphKbLt",
  },
];

export const AnimatedCards = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrollable, setIsScrollable] = useState(false);
  const scrollContainer = useRef(null);

  const handleNext = () =>
    setActiveIndex((prev) => (prev + 1) % resources.length);
  const handlePrev = () =>
    setActiveIndex((prev) => (prev - 1 + resources.length) % resources.length);

  useEffect(() => {
    const checkScrollable = () => {
      const container = scrollContainer.current;
      if (container) {
        setIsScrollable(container.scrollHeight > container.clientHeight);
      }
    };
    checkScrollable();
  }, [activeIndex]);

  const isActive = (index) => index === activeIndex;

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  return (
    <div
      className="relative w-full mx-auto py-6 rounded-3xl shadow-lg"
      style={{
        maxWidth: "800px", // Set a maximum width
        margin: "0 auto", // Center align
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        backgroundColor: "rgba(17, 25, 40, 0.75)",
        borderRadius: "36px",
        border: "4px solid #0093a4",
        backgroundImage: `url(${resources[activeIndex].imgSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
        marginBottom: "0.5rem",
      }}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-x-0 items-start"
        style={{ paddingTop: "1rem" }}
      >
        {/* Image Section */}
        <div className="relative flex items-center justify-center h-full">
          <AnimatePresence>
            {resources.map((resource, index) => (
              <motion.div
                key={resource.title}
                className="absolute inset-0 origin-center flex justify-center items-center"
                style={{ overflow: "hidden" }}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  z: -100,
                  rotate: randomRotateY(),
                }}
                animate={{
                  opacity: isActive(index) ? 1 : 0.3,
                  scale: isActive(index) ? 1 : 0.95,
                  z: isActive(index) ? 0 : -10,
                  rotate: isActive(index) ? 0 : randomRotateY(),
                  zIndex: isActive(index) ? 999 : -index,
                  y: isActive(index) ? [0, -20, 0] : 10,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  z: 100,
                  rotate: randomRotateY(),
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
              >
                <img
                  src={resource.imgSrc}
                  alt={resource.title}
                  style={{
                    width: "222px",
                    height: "221px",
                    borderRadius: "24px",
                    objectFit: "cover",
                    boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
                    border: "4px solid #0093a4",
                  }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Text Section */}
        <div
          className="flex flex-col justify-center items-start h-full md:pl-4 lg:pl-0"
          style={{ marginRight: "4rem" }}
        >
          <motion.div
            key={activeIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="h-full flex flex-col justify-between"
          >
            {/* Glassmorphism White */}
            <div
              className="backdrop-blur-lg bg-white/30 border border-white/20 rounded-lg p-4 shadow-md relative h-full"
              style={{
                height: "260px",
                backdropFilter: "blur(16px) saturate(180%)",
                WebkitBackdropFilter: "blur(16px) saturate(180%)",
                backgroundColor: "rgba(255, 255, 255, 0.63)",
                borderRadius: "12px",
                border: "4px solid #0093a4",
                display: "flex", // Enable flex layout
                flexDirection: "column", // Stack children vertically
                padding: "1rem", // Adjust padding
              }}
            >
              {/* Title */}
              <h3
                className="text-3xl font-bold"
                style={{
                  margin: "0", // Remove unnecessary margin
                  marginBottom: "0.5rem", // Adjust gap below the title
                  color: "#0093a4",
                }}
              >
                {resources[activeIndex].title}
              </h3>

              {/* Scrollable Description */}
              <div
                className={`overflow-y-auto ${styles.customScrollbar}`}
                ref={scrollContainer}
                style={{
                  flexGrow: 1, // Make the description take up remaining space
                  maxHeight: "100%", // Allow dynamic height adjustment
                  scrollbarWidth: "thin", // Optional: For Firefox thin scrollbar
                  WebkitOverflowScrolling: "touch", // Smooth scrolling for touch devices
                  marginBottom: "1rem", // Add spacing below the description
                }}
              >
                <p className="text-sm" style={{ color: "black" }}>
                  {resources[activeIndex].description}
                </p>
              </div>

              {/* Visit Website Button */}
              <a
                href={resources[activeIndex].link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-sm font-semibold rounded-full px-4 py-2 transition-all duration-300"
                style={{
                  backgroundColor: "#0093a4", // Brand Blue
                  border: "2px solid rgb(255, 255, 255)",
                  textDecoration: "none", // Remove underline
                  alignSelf: "center", // Center the button horizontally
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#7fbf71")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#0093a4")
                }
              >
                Visit Website
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div
        className="flex justify-center gap-40 pt-8 md:pt-2"
        style={{ marginTop: "1rem" }}
      >
        <button
          onClick={handlePrev}
          className="h-9 w-9 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center"
          style={{
            outline: "2px solid #7fbf71", // Brand Green
            outlineOffset: "4px",
          }}
        >
          <IconArrowBigLeftLinesFilled className="h-7 w-7 text-white group-hover:rotate-12 transition-transform duration-300" />
        </button>
        <button
          onClick={handleNext}
          className="h-9 w-9 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center"
          style={{
            outline: "2px solid #7fbf71", // Brand Green
            outlineOffset: "4px",
          }}
        >
          <IconArrowBigRightLinesFilled className="h-7 w-7 text-white group-hover:-rotate-12 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};
