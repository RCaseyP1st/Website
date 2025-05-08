const DashboardSectionWrapper = ({ children }) => (
  <section className="w-full mb-12 px-0 sm:px-2 lg:px-4">
    {/* Centered title area (only affects direct titles in children) */}
    <div className="text-center mb-6">
      {/* This is where your <h1> or section titles should go if centered */}
    </div>

    {/* Left-aligned content */}
    <div className="w-full max-w-7xl mx-auto text-left">
      {children}
    </div>
  </section>
);

export default DashboardSectionWrapper;
