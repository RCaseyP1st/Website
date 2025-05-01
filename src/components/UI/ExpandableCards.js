import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import styles from "../../styles/customscrollbar.module.css";
import { useOutsideClick } from "../../hooks/use-outside-click";

const resources = [
  {
    title: "Pink Parents",
    description: "Gay and Lesbian Parenting Issues.",
    content: `Pink Parents is dedicated to supporting gay and lesbian parents in the UK, providing resources and information on the unique challenges they face. 
        The website addresses concerns such as potential bullying of children, exclusion from activities, and difficult questions about family dynamics. It emphasises the 
        importance of being prepared for these challenges and offering unconditional love and support to children. Pink Parents aims to create a more inclusive environment 
        for same-sex families.`,
    imgSrc: `${process.env.PUBLIC_URL}/images/tileimages/pink-parents.png`,
    link: "https://www.pinkparents.org.uk/",
    gradient:
      "linear-gradient(135deg, rgba(243,17,109,0.9), rgba(243,17,109,0.5), rgba(255,255,255,0.5), rgba(255,255,255,0.9))", // Pink to White
    gradientExpanded:
      "linear-gradient(135deg, rgb(243,17,109), rgb(243,17,109), rgb(255,255,255), rgb(255,255,255))",
  },
  {
    title: "DadPad",
    description:
      "Ask Dadpad: Trans and non-binary parents - Ask Dadpad LGBTQI+ Parents Q&A",
    content: `The article "Ask DadPad: Trans and Non-Binary Parents" offers guidance and support for trans and non-binary parents navigating parenthood. It discusses 
        the importance of creating inclusive environments, addresses common concerns, and provides practical advice on pregnancy, birth, and parenting. The article also 
        highlights the need for open communication with healthcare providers to ensure respectful and appropriate care. It aims to empower trans and non-binary individuals 
        with knowledge and resources to confidently embrace their parenting.`,
    imgSrc: `${process.env.PUBLIC_URL}/images/tileimages/dadpad.png`,
    link: "https://thedadpad.co.uk/lgbtqi-parents/ask-dadpad-trans-and-non-binary-parents/",
    gradient:
      "linear-gradient(135deg, rgba(0,0,0,0.9), rgba(0,0,0,0.5), rgba(252,200,43,0.5), rgba(252,200,43,0.9))", // Yellow to Black
    gradientExpanded:
      "linear-gradient(135deg, rgb(0,0,0), rgb(0,0,0), rgb(252,200,43), rgb(252,200,43))",
  },
  {
    title: "Acacia Family Support",
    description:
      "Support for LGBTQ+ parents facing perinatal mental health issues.",
    content: `The Acacia Family Support's LGBTQ+ Partners page provides a comprehensive guide for LGBTQ+ parents dealing with perinatal mental health issues. 
        This page offers a wealth of resources, including self-help guides, local and national support services, and advice on recognising and managing mental health 
        problems. It emphasises the importance of early intervention, supporting one's partner, and self-care. `,
    imgSrc: `${process.env.PUBLIC_URL}/images/tileimages/acacia-family.png`,
    link: "https://www.acacia.org.uk/dads-partners/lgbtq/",
    gradient:
      "linear-gradient(135deg, rgba(255,0,0,0.9), rgba(255,153,0,0.9), rgba(255,255,0,0.5), rgba(0,255,0,0.5), rgba(0,0,255,0.5), rgba(75,0,130,0.9), rgba(238,130,238,0.9))", // Rainbow
    gradientExpanded:
      "linear-gradient(135deg, rgb(255,0,0), rgb(255,153,0), rgb(255,255,0), rgb(0,255,0), rgb(0,0,255), rgb(75,0,130), rgb(238,130,238))",
  },
  {
    title: "Feed Play Love: A Different Rulebook",
    description: "One Dads choice to parent from a different rulebook.",
    content: `Spotify/Podcast: Sean Szeps shares his story of overcoming the challenges of being a gay man with 
        dreams of becoming a parent. Sean discusses his early struggles, his fascination with diverse mothers, and the obstacles he and his husband Josh faced on their path 
        to parenthood. He also reflects on why he believes he is the best father for his daughter.`,
    imgSrc: `${process.env.PUBLIC_URL}/images/tileimages/different-rule-book.png`,
    link: "https://open.spotify.com/episode/7woJNDoJlAcbkRGte4kBRu?si=-jKiYGadSlC_u1ljgpQ5SA&nd=1&dlsi=dc4d7ce6e1b24ab1",
    gradient:
      "linear-gradient(135deg, rgba(23,111,178,0.9), rgba(23,111,178,0.5), rgba(252,200,43,0.5), rgba(252,200,43,0.9))", // Blue to Yellow
    gradientExpanded:
      "linear-gradient(135deg, rgb(23,111,178), rgb(23,111,178), rgb(252,200,43), rgb(252,200,43))",
  },
  {
    title: "Kim & Andi",
    description:
      "A Journey with Postnatal Anxiety & Depression through the Lesbian Lens.",
    content: `Youtube: In this personal video, Kim and Andi share their journey through postnatal 
        anxiety and depression from a lesbian perspective. They discuss the emotional challenges, the vivid and distressing, and the vital role of community support. It 
        highlights the importance of language and inclusivity in healthcare, while emphasising the societal need for better support for all mothers, especially those 
        facing mental health issues.`,
    imgSrc: `${process.env.PUBLIC_URL}/images/tileimages/kim-andi.png`,
    link: "https://www.youtube.com/watch?v=1t02frctzkY",
    gradient:
      "linear-gradient(135deg, rgba(223, 0, 6, 0.9), rgba(255,255,255,0.5), rgba(255,255,255,0.5), rgba(223, 0, 6, 0.5), rgba(223, 0, 6, 0.9))",
    gradientExpanded:
      "linear-gradient(135deg, rgb(223, 0, 6), rgb(255,255,255), rgb(255,255,255), rgb(223, 0, 6), rgb(223, 0, 6))",
  },
  {
    title: "ManUp!",
    description:
      "Man Up! is a UK-based men's mental health podcast hosted by Andy Richardson and Tommy Danquah. ",
    content: `Spotify/Podcast: The podcast aims to encourage open conversations about 
        mental health among men. Each episode features discussions with various guests, including celebrities and experts, on topics ranging from personal mental health 
        experiences to broader issues in mental health advocacy.`,
    imgSrc: `${process.env.PUBLIC_URL}/images/tileimages/manup.png`,
    link: "https://open.spotify.com/show/2ahFYl1h4tkXrjIYiA6mXZ",
    gradient:
      "linear-gradient(135deg, rgba(94,131,156,0.9), rgba(94,131,156,0.5), rgba(197,184,164,0.5), rgba(197,184,164,0.9))",
    gradientExpanded:
      "linear-gradient(135deg, rgb(94,131,156), rgb(94,131,156), rgb(197,184,164), rgb(197,184,164))",
  },
  {
    title: "Feed Play Love: When Dads get PND",
    description: "When Dads Get PND.",
    content: `Spotify/Podcast: In this 14-minute episode from June 2022, Dave Edwards, a father of two, shares his experience with perinatal depression and 
        anxiety (PND) following the birth of his son. Despite PND affecting one in ten dads, over half do not seek help. Dave hopes that by telling his story, he can 
        encourage other dads to reach out for support.`,
    imgSrc: `${process.env.PUBLIC_URL}/images/tileimages/when-dads-get-pnd.png`,
    link: "https://open.spotify.com/episode/5tUODv7C44U0KJ2wphKbLt",
    gradient:
      "linear-gradient(135deg, rgba(23,111,178,0.9), rgba(23,111,178,0.5), rgba(252,200,43,0.5), rgba(252,200,43,0.9))", // Blue to Yellow
    gradientExpanded:
      "linear-gradient(135deg, rgb(23,111,178), rgb(23,111,178), rgb(252,200,43), rgb(252,200,43))",
  },
];

export const ExpandableCards = () => {
  const [activeCard, setActiveCard] = useState(null);
  const isMinimalRoute = window.location.pathname.includes("/minimal");
  const scrollContainer = useRef(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const cardRef = useRef(null);

  // Close on outside click
  useOutsideClick(cardRef, () => setActiveCard(null));

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setActiveCard(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const checkScrollable = () => {
      const container = scrollContainer.current;
      if (container) {
        setIsScrollable(container.scrollHeight > container.clientHeight);
      }
    };

    checkScrollable(); // Check on mount
    window.addEventListener("resize", checkScrollable); // Recheck on resize
    return () => window.removeEventListener("resize", checkScrollable);
  }, []);

  // Scroll Lock for Expanded Card
  useEffect(() => {
    if (activeCard) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden"; // Prevent scrolling
      document.body.style.paddingRight = `${scrollbarWidth}px`; // Maintain scrollbar width
    } else {
      document.body.style.overflow = ""; // Restore scrolling
      document.body.style.paddingRight = ""; // Reset padding
    }

    return () => {
      document.body.style.overflow = ""; // Cleanup
      document.body.style.paddingRight = ""; // Cleanup
    };
  }, [activeCard]);

  return (
    <div
      className="relative"
      style={{
        width: "100%", // Ensure the component takes full width
        margin: "0 auto",
      }}
    >
      {/* Backdrop */}
      <AnimatePresence>
        {activeCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={() => setActiveCard(null)}
          />
        )}
      </AnimatePresence>

      {/* Cards */}
      <div className="grid gap-6 mt-8 relative z-20">
        {resources.map((resource) => (
          <motion.div
            key={resource.title}
            layoutId={`card-${resource.title}`}
            onClick={() => setActiveCard(resource)}
            className={`cursor-pointer flex items-center p-4 gap-4`}
            style={{
              borderRadius: "24px",
              border: "3px solid rgba(58, 58, 58, 1)",
              boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
              background: resource.gradient,
              maxHeight: "6rem", // Set the maximum height for collapsed cards
            }}
            transition={{
              duration: 0.3, // Reduce duration for quicker transitions
              ease: "linear",
            }}
          >
            <motion.img
              layoutId={`image-${resource.title}`}
              src={resource.imgSrc}
              alt={resource.title}
              className="w-16 h-16 rounded-lg object-cover"
              style={{
                border: "2px solid #f0f0f0",
                borderRadius: "14px",
              }}
            />
            <div className="flex-1">
              <motion.h3
                layoutId={`title-${resource.title}`}
                className="text-lg font-bold text-gray-900 dark:text-white"
              >
                {resource.title}
              </motion.h3>
              <motion.p
                layoutId={`description-${resource.description}`}
                className="text-sm font-bold text-gray-900"
              >
                {resource.description}
              </motion.p>
            </div>

            {/* Encapsulate the Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.1 }}
              className="flex-shrink-0"
            >
              <a
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-sm font-semibold rounded-full px-4 py-2 transition-all duration-300"
                style={{
                  backgroundColor: "#0093a4",
                  border: "2px solid #fff",
                  textDecoration: "none",
                  alignSelf: "center", // if needed
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
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {activeCard && (
          <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              overflow: isMinimalRoute ? "hidden" : "auto",
              marginTop: "5rem", // Added margin-top
            }}
            transition={{
              duration: 0.1, // Reduce duration for quicker transitions
              ease: "linear",
              top: "10vh", // Adds space from the top
              paddingTop: "20px", // Optional additional spacing
            }}
          >
            <motion.div
              ref={cardRef}
              layoutId={`card-${activeCard.title}`}
              className="p-6 max-w-lg w-full relative"
              style={{
                maxWidth: isMinimalRoute ? "67.5vw" : "50vw", // Adjust width dynamically
                width: "90%", // Ensure responsiveness for smaller screens
                maxHeight: "75vh", // Increased height to fit content and buttons
                borderRadius: "36px",
                border: "4px solid rgb(255, 255, 255)",
                boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
                background: activeCard.gradientExpanded,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between", // Ensures proper spacing between elements
                padding: "1rem",
              }}
            >
              {/* Expanded Image */}
              <motion.img
                layoutId={`image-${activeCard.title}`}
                src={activeCard.imgSrc}
                alt={activeCard.title}
                className="w-full h-72 rounded-lg object-cover"
                style={{
                  border: "2px solid rgb(58, 58, 58)",
                  borderRadius: "36px",
                  marginBottom: "1rem",
                }}
              />

              {/* Glassmorphism Container */}
              <div
                className="backdrop-blur-lg bg-white/30 border border-white/20 rounded-lg p-4 shadow-md relative"
                style={{
                  backdropFilter: "blur(16px) saturate(180%)",
                  WebkitBackdropFilter: "blur(16px) saturate(180%)",
                  backgroundColor: "rgba(255, 255, 255, 0.83)",
                  borderRadius: "24px",
                  border: "2px solid rgb(58, 58, 58)",
                  padding: "1rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  maxHeight: "30vh", // Adjusted to fit more content
                  overflowY: "auto", // Allow scrolling for overflowing content
                  paddingRight: "8px",
                }}
              >
                {/* Title */}
                <motion.h3
                  layoutId={`title-${activeCard.title}`}
                  className="text-xl font-bold text-gray-900 dark:text-black"
                  style={{
                    margin: 0,
                  }}
                >
                  {activeCard.title}
                </motion.h3>
                <motion.p
                  layoutId={`description-${activeCard.description}`}
                  className="text-sm font-bold text-gray-700 dark:text-darkgray-400"
                  style={{
                    margin: 0,
                  }}
                >
                  {activeCard.description}
                </motion.p>
                <div
                  className={`overflow-y-auto h-[200px] pr-4 relative ${styles.customScrollbar}`}
                  ref={scrollContainer}
                  style={{
                    maxHeight: "150px",
                    paddingRight: "8px",
                  }}
                >
                  <p className="text-sm" style={{ color: "black" }}>
                    {activeCard.content}
                  </p>
                </div>
              </div>

              {/* Buttons Container */}
              <div className="mt-4 flex justify-between w-full">
                {/* Visit Website Button */}
                <motion.a
                  href={activeCard.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-sm font-semibold rounded-full px-4 py-2 transition-all duration-300"
                  style={{
                    backgroundColor: "#0093a4", // Brand Blue
                    width: "calc(50% - 1rem)",
                    textAlign: "center",
                    border: "2px solid #fff",
                    whiteSpace: "nowrap",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#7fbf71")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#0093a4")
                  }
                >
                  Visit Website
                </motion.a>

                {/* Close Button */}
                <motion.button
                  onClick={() => setActiveCard(null)}
                  className="text-white text-sm font-semibold rounded-full px-4 py-2 transition-all duration-300"
                  style={{
                    backgroundColor: "#d60b52", // Brand Pink
                    width: "calc(50% - 1rem)",
                    textAlign: "center",
                    border: "2px solid #fff",
                    whiteSpace: "nowrap",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#7fbf71")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#d60b52")
                  }
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
