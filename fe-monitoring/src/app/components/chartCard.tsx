const ChartCard = () => {
  return (
    <section className="max-w-6xl mx-auto w-11/12 h-auto md:w-full md:h-auto bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_8px_25px_rgba(255,255,255,0.05)] hover:shadow-[0_10px_25px_rgba(249,248,246,0.5)] p-6 mt-4 mb-6 hover:scale-[1.02] transition-all duration-300">
      <h2 className="text-center text-lg font-semibold tracking-wide text-gray-300 mb-4">
        Real-time Sensor Chart
      </h2>

      <canvas id="sensorChart" height="100"></canvas>
    </section>
  );
};

export default ChartCard;
