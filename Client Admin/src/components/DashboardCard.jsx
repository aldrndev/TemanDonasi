const DashboardCard = ({ title, count }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow flex flex-col items-center justify-center text-center">
      <p className="text-lg font-semibold text-gray-600">{title}</p>
      <p className="text-3xl font-bold text-cyan-700">{count}</p>
    </div>
  );
};

export default DashboardCard;
