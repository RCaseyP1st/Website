const DashboardSectionWrapper = ({ children }) => (
  <section className="mb-12 w-full">
    <div className="w-full text-center">
      {/* Title should be in the component, but alignment is enforced here */}
    </div>
    {children}
  </section>
);

export default DashboardSectionWrapper;
