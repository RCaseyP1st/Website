import React from "react";
import { Routes, Route, useLocation } from "react-router-dom"; // Only import necessary hooks
import Header from "./components/Formatting/Header";
import NavBar from "./components/Formatting/NavBar";
import Hero from "./components/Formatting/Hero";
import Home from "./components/Pages/Home";
import WellbeingForm from "./components/Pages/WellbeingForm";
import Footer from "./components/Formatting/Footer";
import ScrollToTop from "./components/ScrollToTop";
import InCrisis from "./components/Pages/InCrisis";
import styles from "./styles/formstyle.module.css";
import WhatWeDo from "./components/Pages/WhatWeDo";
import StaffPage from "./components/Pages/StaffPage";
import PeerSupport from "./components/Pages/PeerSupport";
import LGBTQIA from "./components/Pages/LGBTQIA";
import Podcasts from "./components/Pages/Podcasts";
import Youtube from "./components/Pages/Youtube";
import Groups from "./components/Pages/Groups";
import NationalResources from "./components/Pages/NationalResources";
import Dashboard from "./components/Dashboard/Dashboard";
import globalStyles from "./styles/globalstyle.module.css";

import "./App.css";
import "./index.css";
import FeedbackForm from "./components/Pages/FeedbackForm";

const App = () => {
  const location = useLocation();
  const isMinimalRoute = location.pathname.startsWith("/minimal-");
  const isHeroVisible = location.pathname === "/";

  return (
    <div className={`${styles.App} ${isMinimalRoute ? "minimal" : ""}`}>
      <ScrollToTop />
      {!isMinimalRoute && <Header />}
      {!isMinimalRoute && isHeroVisible && <Hero />}
      {!isMinimalRoute && <NavBar />}
      <main>
        <Routes>
          <Route path="/" element={<Home isMinimal={false} />} />
          <Route
            path="/wellbeing-review-form"
            element={<WellbeingForm isMinimal={false} />}
          />
          <Route path="/in-crisis" element={<InCrisis isMinimal={false} />} />
          <Route path="/what-we-do" element={<WhatWeDo isMinimal={false} />} />
          <Route path="/staff" element={<StaffPage isMinimal={false} />} />
          <Route
            path="/what-is-peer-support"
            element={<PeerSupport isMinimal={false} />}
          />
          <Route path="/lgbtqia" element={<LGBTQIA isMinimal={false} />} />
          <Route path="/podcasts" element={<Podcasts isMinimal={false} />} />
          <Route path="/youtube" element={<Youtube isMinimal={false} />} />
          <Route path="/groups" element={<Groups isMinimal={false} />} />
          <Route path="/national-resources" element={<NationalResources isMinimal={false} />} />
          <Route path="/feedback" element={<FeedbackForm isMinimal={false} />} />
          <Route path="/dashboard" element={<Dashboard isMinimal={false} />} />


          {/* Minimal Routes */}
          <Route
            path="/minimal-form"
            element={<WellbeingForm isMinimal={true} />}
          />
          <Route
            path="/minimal-incrisis"
            element={<InCrisis isMinimal={true} />}
          />
          <Route
            path="/minimal-whatwedo"
            element={<WhatWeDo isMinimal={true} />}
          />
          <Route
            path="/minimal-staff"
            element={<StaffPage isMinimal={true} />}
          />
          <Route
            path="/minimal-whatispeersupport"
            element={<PeerSupport isMinimal={true} />}
          />
          <Route
            path="/minimal-lgbtqia"
            element={<LGBTQIA isMinimal={true} />}
          />
          <Route
            path="/minimal-podcasts"
            element={<Podcasts isMinimal={true} />}
          />
          <Route
            path="/minimal-youtube"
            element={<Youtube isMinimal={true} />}
          />
          <Route path="/minimal-groups" element={<Groups isMinimal={true} />} />
          <Route path="/minimal-national-resources" element={<NationalResources isMinimal={true} />} />
          <Route path="/minimal-feedback" element={<FeedbackForm isMinimal={true} />} />
          <Route path="/minimal-dashboard" element={<Dashboard isMinimal={true} />} />


          {/* 404 Fallback */}
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </main>

      {/* Conditionally render Footer */}
      {!isMinimalRoute && <Footer />}
    </div>
  );
};

export default App;
