const HomesContent = ({
  stats,
}: {
  stats: { apartments: number; matches: number };
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        Apartments: {stats.apartments}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md">
        Matches: {stats.matches}
      </div>
    </div>
  );
};

export default HomesContent;
