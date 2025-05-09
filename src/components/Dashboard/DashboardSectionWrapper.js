const DashboardSectionWrapper = ({ children }) => (
  <section className="w-full mb-12 px-0 sm:px-2 lg:px-4">
<div className="w-full px-2 sm:px-4 lg:px-6 text-left">
      <div className="bg-white p-6 shadow-md rounded-xl border mb-4">
        {children}
      </div>
    </div>
  </section>
);

export default DashboardSectionWrapper;
