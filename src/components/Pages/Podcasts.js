import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getPodcastEpisodes, getPodcastDetails } from "../../services/spotify";
import globalStyles from "../../styles/globalstyle.module.css";
import styles from "../../styles/customscrollbar.module.css";
import {
  IconArrowBigLeftLinesFilled,
  IconArrowBigRightLinesFilled,
  IconBrandSpotifyFilled,
} from "@tabler/icons-react";

// Podcast data
const dynamicPodcasts = [
  {
    title: "Developing Dads",
    description: "",
    imgSrc: `${process.env.PUBLIC_URL}/images/tileimages/developing-dads.png`,
    showId: "1BI9lY2envJJJlGXUGknqR", // Spotify Show ID
  },
  {
    title: "First Time Dads",
    description: "",
    imgSrc: `${process.env.PUBLIC_URL}/images/tileimages/first-time-dads.png`,
    showId: "5GYBrz9tC8kaoMcmNyLU0j", // Spotify Show ID
  },
  {
    title: "Dad Still Standing",
    description: "",
    imgSrc: `${process.env.PUBLIC_URL}/images/tileimages/dad-still-standing.png`,
    showId: "7F8twoXWLSkI3uSlXS6DKN", // Spotify Show ID
  },
  {
    title: "Dope Black Dads",
    description: "",
    imgSrc: `${process.env.PUBLIC_URL}/images/tileimages/dope-black-dads.png`,
    showId: "3cIh6ejnk3lUUVhqSKzPUS", // Spotify Show ID
  },
  {
    title: "Feed Play Love",
    description: "",
    imgSrc: `${process.env.PUBLIC_URL}/images/tileimages/when-dads-get-pnd.png`,
    showId: "58tt7X46mxU7NE8Ad4RfTz", // Spotify Show ID
  },
  {
    title: "ManUp!",
    description: "",
    imgSrc: `${process.env.PUBLIC_URL}/images/tileimages/manup.png`,
    showId: "2ahFYl1h4tkXrjIYiA6mXZ", // Spotify Show ID
  },
];

const Podcasts = ({ isMinimal }) => {
  const [activePodcast, setActivePodcast] = useState(dynamicPodcasts[0]);
  const [episodes, setEpisodes] = useState([]); // Store fetched episodes

  // Fetch episodes whenever a new podcast is selected
  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const fetchedEpisodes = await getPodcastEpisodes(activePodcast.showId);
        setEpisodes(
          fetchedEpisodes.map((episode) => ({
            title: episode.name,
            description: episode.description,
            date: episode.release_date,
            duration: new Date(episode.duration_ms).toISOString().substr(11, 8), // Format duration
            thumbnail: episode.images?.[0]?.url || "default-thumbnail.jpg", // Default if no thumbnail
            spotifyUrl: episode.external_urls.spotify, // Spotify URL for the episode
          }))
        );
      } catch (error) {
        console.error("Error fetching episodes:", error);
      }
    };

    fetchEpisodes();
  }, [activePodcast]);

  // Select a podcast based on index
  const handlePodcastSelect = (index) => {
    setActivePodcast(dynamicPodcasts[index]);
  };

  return (
    <div
      className={
        isMinimal ? globalStyles["container-minimal"] : globalStyles.container
      }
    >
      <h1 className={isMinimal ? globalStyles["h1-minimal"] : globalStyles.h1}>
        Podcasts
      </h1>

      {/* Podcast Header */}
      <PodcastHeader
        podcasts={dynamicPodcasts}
        onSelect={handlePodcastSelect}
      />

      {/* Podcast Episodes */}
      <PodcastEpisodes episodes={episodes} />
    </div>
  );
};

// PodcastHeader Component (replacing AnimatedCards for Podcasts)
const PodcastHeader = ({ podcasts, onSelect }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // State to hold podcast details
  const [podcastDetails, setPodcastDetails] = useState({
    description: "",
    spotifyUrl: "",
  });

  // Fetch metadata for the active podcast
  useEffect(() => {
    const fetchPodcastDetails = async () => {
      const selectedPodcast = podcasts[activeIndex];
      try {
        const details = await getPodcastDetails(selectedPodcast.showId);
        setPodcastDetails({
          description: details.description, // Dynamically fetched description
          spotifyUrl: details.external_urls.spotify, // Spotify link
        });
      } catch (error) {
        console.error("Error fetching podcast details:", error);
      }
    };

    fetchPodcastDetails();
  }, [activeIndex, podcasts]);

  // Handle navigation buttons
  const handleNext = () =>
    setActiveIndex((prev) => (prev + 1) % podcasts.length);
  const handlePrev = () =>
    setActiveIndex((prev) => (prev - 1 + podcasts.length) % podcasts.length);

  // Trigger the callback when the active podcast changes
  useEffect(() => {
    onSelect(activeIndex);
  }, [activeIndex, onSelect]);

  return (
    /* Dynamic Header Section */
    <div
      className="relative w-full max-w-6xl mx-auto py-6 rounded-3xl shadow-lg"
      style={{
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        backgroundColor: "rgba(17, 25, 40, 0.75)",
        borderRadius: "36px",
        border: "4px solid #0093a4",
        backgroundImage: `url(${podcasts[activeIndex].imgSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
        marginBottom: "1.5rem",
      }}
    >
      {/* Main Container */}
      <div
        className="relative flex justify-center items-center gap-4" // Flex layout for side-by-side alignment
        style={{
          maxWidth: "1200px",
          margin: "0 auto", // Center the container
          position: "relative", // Required for absolute positioning of buttons
        }}
      >
        {/* Image Section */}
        <div
          className="flex items-center justify-center"
          style={{
            width: "15rem", // Adjust the width of the image container
            height: "15rem", // Ensure a square container
          }}
        >
          <AnimatePresence>
            {podcasts.map((podcast, index) => (
              <motion.div
                key={podcast.title}
                className="absolute flex justify-center items-center"
                style={{
                  width: "13.875rem",
                  height: "13.813rem",
                  borderRadius: "36px",
                  zIndex: index === activeIndex ? 999 : index, // Active card is on top
                  transform:
                    index === activeIndex ? "none" : "translateX(-50px)", // Shift inactive card slightly
                }}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  z: -100,
                  rotate: Math.floor(Math.random() * 21) - 10, // Randomized rotation
                }}
                animate={{
                  opacity: index === activeIndex ? 1 : 0.3, // Check if active
                  scale: index === activeIndex ? 1 : 0.95, // Slightly smaller for inactive
                  z: index === activeIndex ? 0 : -10, // Z-index layering
                  rotate:
                    index === activeIndex
                      ? 0
                      : Math.floor(Math.random() * 21) - 10,
                  zIndex: index === activeIndex ? 999 : -index, // Ensure proper stacking
                  y: index === activeIndex ? [0, -20, 0] : 10, // Active card bounces slightly
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  z: 100,
                  rotate: Math.floor(Math.random() * 21) - 10, // Randomized rotation for exit
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
              >
                <img
                  src={podcasts[activeIndex].imgSrc}
                  alt={podcasts[activeIndex].title}
                  style={{
                    width: "100%",
                    height: "100%",
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
        <div className="flex flex-col justify-start items-start">
          <motion.div
            key={activeIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="h-full flex flex-col justify-start"
          >
            {/* Glassmorphism Section */}
            <div
              className="backdrop-blur-lg bg-white/30 border border-white/20 rounded-lg shadow-md relative flex flex-col justify-between"
              style={{
                height: "15rem", // Match the height of the image
                width: "28rem", // Adjustable width for the glassmorphism box
                backdropFilter: "blur(16px) saturate(180%)",
                WebkitBackdropFilter: "blur(16px) saturate(180%)",
                backgroundColor: "rgba(255, 255, 255, 0.63)",
                borderRadius: "12px",
                border: "4px solid #0093a4",
                padding: "1rem", // Padding inside the box
              }}
            >
              {/* Title */}
              <h3
                className="text-3xl font-bold"
                style={{
                  color: "#0093a4",
                  margin: "0",
                  marginBottom: "0.5rem",
                }}
              >
                {podcasts[activeIndex].title}
              </h3>

              {/* Scrollable Description */}
              <div
                className={`overflow-y-auto pr-2 ${styles.customScrollbar}`}
                style={{
                  flex: 1, // Allow the description to take up remaining space
                  maxHeight: "10rem", // Set a max height
                  marginBottom: "1rem", // Add spacing above the button
                }}
              >
                <p className="text-sm" style={{ color: "black" }}>
                  {podcastDetails.description}
                </p>
              </div>

              {/* Visit on Spotify Button */}
              <a
                href={podcastDetails.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brandPink text-white text-sm font-semibold rounded-full px-4 py-2 flex items-center gap-2 hover:bg-brandGreen transition-all duration-300"
                style={{
                  textAlign: "center",
                  width: "fit-content",
                  alignSelf: "center",
                  outline: "2px solid white",
                  textDecoration: "none",
                }}
              >
                <IconBrandSpotifyFilled className="h-5 w-5 text-white" />
                Visit on Spotify
              </a>
            </div>
          </motion.div>
        </div>

        {/* Left Navigation Button */}
        <button
          onClick={handlePrev}
          className="absolute left-0 transform -translate-y-1/2 h-14 w-14 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center"
          style={{
            top: "50%", // Vertically centered
            outline: "3px solid white",
            zIndex: 9999, // Ensure button is on top
            marginLeft: "0.5rem", // Add a small margin from the edge
          }}
        >
          <IconArrowBigLeftLinesFilled className="h-9 w-9 text-white group-hover:rotate-12 transition-transform duration-300" />
        </button>

        {/* Right Navigation Button */}
        <button
          onClick={handleNext}
          className="absolute right-0 transform -translate-y-1/2 h-14 w-14 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center"
          style={{
            top: "50%", // Vertically centered
            outline: "3px solid white",
            zIndex: 9999, // Ensure button is on top
            marginRight: "0.5rem", // Add a small margin from the edge
          }}
        >
          <IconArrowBigRightLinesFilled className="h-9 w-9 text-white group-hover:-rotate-12 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
};

// DYNAMICALLY ADDED ENTRIES SECTION
const PodcastEpisodes = ({ episodes }) => {
  const [activeEpisode, setActiveEpisode] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [episodesPerPage] = useState(10); // Number of episodes per page
  const [sortType, setSortType] = useState("newest"); // Default sorting by newest date
  const [isLoading, setIsLoading] = useState(false); // Track loading state

  const totalPages = Math.ceil(episodes.length / episodesPerPage);

  const handlePageChange = (pageNumber) => {
    setIsLoading(true);
    setTimeout(() => {
      setCurrentPage(pageNumber);
      setActiveEpisode(null); // Collapse all entries on page change
      setIsLoading(false);
    }, 500); // Simulate a short delay
  };

  const handleSortChange = (sort) => {
    setSortType(sort);
    setCurrentPage(1); // Reset to the first page
    setActiveEpisode(null); // Collapse all entries
  };

  const sortEpisodes = () => {
    const sortedEpisodes = [...episodes];
    switch (sortType) {
      case "newest":
        return sortedEpisodes.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
      case "oldest":
        return sortedEpisodes.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
      case "longest":
        return sortedEpisodes.sort((a, b) =>
          b.duration.localeCompare(a.duration)
        );
      case "shortest":
        return sortedEpisodes.sort((a, b) =>
          a.duration.localeCompare(b.duration)
        );
      default:
        return sortedEpisodes;
    }
  };

  const paginatedEpisodes = sortEpisodes().slice(
    (currentPage - 1) * episodesPerPage,
    currentPage * episodesPerPage
  );

  const renderPagination = () => {
    const pages = [];
    const addEllipsis = () =>
      pages.push(<span key={`ellipsis-${pages.length}`}>&hellip;</span>);

    if (currentPage > 1) {
      pages.push(
        <button
          key="prev"
          onClick={() => handlePageChange(currentPage - 1)}
          style={buttonStyle}
        >
          Previous
        </button>
      );
    }

    if (currentPage > 2) {
      pages.push(
        <button
          key="first-hidden-left"
          onClick={() => handlePageChange(Math.max(currentPage - 3, 1))}
          style={buttonStyle}
        >
          &laquo;
        </button>
      );
    }

    if (currentPage > 2) addEllipsis();

    if (currentPage > 1) {
      pages.push(
        <button
          key={currentPage - 1}
          onClick={() => handlePageChange(currentPage - 1)}
          style={buttonStyle}
        >
          {currentPage - 1}
        </button>
      );
    }

    pages.push(
      <span
        key="current"
        style={{
          ...buttonStyle,
          fontWeight: "bold",
          fontSize: "1.2em",
          cursor: "default",
        }}
      >
        {currentPage}
      </span>
    );

    if (currentPage < totalPages) {
      pages.push(
        <button
          key={currentPage + 1}
          onClick={() => handlePageChange(currentPage + 1)}
          style={buttonStyle}
        >
          {currentPage + 1}
        </button>
      );
    }

    if (currentPage < totalPages - 1) addEllipsis();

    if (currentPage < totalPages - 1) {
      pages.push(
        <button
          key="last-hidden-right"
          onClick={() =>
            handlePageChange(Math.min(currentPage + 3, totalPages))
          }
          style={buttonStyle}
        >
          &raquo;
        </button>
      );
    }

    if (currentPage < totalPages) {
      pages.push(
        <button
          key="next"
          onClick={() => handlePageChange(currentPage + 1)}
          style={buttonStyle}
        >
          Next
        </button>
      );
    }

    return pages;
  };

  const buttonStyle = {
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    border: "1px solid #d3d3d3",
    backgroundColor: "#7fbf71",
    color: "#fff",
    margin: "0 0.25rem",
    cursor: "pointer",
  };

  return (
    <div
      className="w-full flex flex-col items-center gap-1 py-4"
      style={{
        backgroundColor: "#001F3F",
        border: "3px solid #000000",
        borderRadius: "36px",
      }}
    >
      {/* Display Loading Indicator */}
      {isLoading && (
        <div style={{ color: "#fff", marginBottom: "1rem" }}>
          Fetching episodes from Spotify...
        </div>
      )}

      {/* Sorting Controls */}
      <div className="sorting-controls" style={{ marginBottom: "1rem" }}>
        <label
          htmlFor="sort-select"
          style={{ marginRight: "0.5rem", color: "#fff", fontWeight: "600" }}
        >
          Sort by:
        </label>
        <select
          id="sort-select"
          onChange={(e) => handleSortChange(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "8px",
            fontWeight: "600",
            border: "1px solid #d3d3d3",
          }}
        >
          <option value="newest">Date (Newest First)</option>
          <option value="oldest">Date (Oldest First)</option>
          <option value="longest">Duration (Longest to Shortest)</option>
          <option value="shortest">Duration (Shortest to Longest)</option>
        </select>
      </div>

      {/* Display Current Episodes */}
      {!isLoading &&
        paginatedEpisodes.map((episode, index) => (
          <React.Fragment key={index}>
            <motion.div
              className={`flex items-center p-4 gap-4 w-[80%] cursor-pointer`}
              style={{
                backgroundColor: "#f4f4f4", // Mellow white card background
                border: "2px solid #d3d3d3", // Light grey border
                borderRadius: "16px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                overflow: "hidden", // Ensure content doesn’t overflow
                position: "relative", // For positioning the button
              }}
              onClick={() =>
                setActiveEpisode(activeEpisode === index ? null : index)
              } // Toggle expansion
            >
              {/* Thumbnail */}
              <img
                src={episode.thumbnail}
                alt={episode.title}
                className="w-20 h-20 object-cover rounded-lg"
                style={{
                  border: "2px solid #d3d3d3",
                  flexShrink: 0, // Prevent shrinking
                }}
              />

              {/* Text Content */}
              <div
                className="flex-1 flex flex-col"
                style={{
                  minWidth: 0,
                  paddingRight: "6rem", // Add padding equal to the width of the button + some buffer
                }}
              >
                <h4
                  className="text-lg font-bold text-black"
                  style={{
                    marginBottom: "0.5rem",
                    marginRight: "6rem",
                    wordWrap: "break-word",
                    overflow: "hidden",
                    whiteSpace: "normal",
                    textOverflow: "ellipsis", // Optional if you want truncation
                  }}
                >
                  {/* Episode Details */}
                  {episode.title}
                </h4>

                {/* Date and Duration */}
                <p className="text-sm text-gray-700">
                  {new Date(episode.date).toLocaleDateString("en-GB")} |{" "}
                  {episode.duration}
                </p>

                {/* Expandable Content */}
                <AnimatePresence>
                  {activeEpisode === index && (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`mt-2 overflow-y-auto ${styles.customScrollbar}`}
                      style={{
                        maxHeight: "8rem", // Add a scrollable area for longer descriptions
                      }}
                    >
                      <p className="text-sm text-gray-700">
                        {episode.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Listen on Spotify Button */}
              <a
                href={episode.spotifyUrl} // Link to the Spotify episode
                target="_blank"
                rel="noopener noreferrer"
                className="bg-brandPink text-white text-sm font-semibold rounded-full px-4 py-2 flex items-center gap-2 hover:bg-brandGreen transition-all duration-300"
                style={{
                  position: "absolute", // Position relative to the parent
                  right: "1rem", // Align to the right
                  top: "1.5rem", // Fixed position near the top of the card
                  textAlign: "center",
                  textDecoration: "none",
                  outline: "2px solid white",
                  zIndex: 10, // Ensure it's above other elements
                }}
              >
                <IconBrandSpotifyFilled className="h-5 w-5 text-white" />
                Listen on Spotify
              </a>
            </motion.div>

            {/* Divider */}
            {index < episodes.length - 1 && (
              <div
                className="w-[80%]"
                style={{
                  borderBottom: "1px solid #d3d3d3",
                  borderTop: "1px solid #d3d3d3",
                  margin: "12px 0", // Spacing between entries
                }}
              />
            )}
          </React.Fragment>
        ))}
      {/* Pagination Controls */}
      <div
        className="pagination"
        style={{
          marginTop: "1rem",
          display: "flex",
          gap: "0.5rem",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {renderPagination()}
      
      </div>
    </div>
  );
};

export default Podcasts;
