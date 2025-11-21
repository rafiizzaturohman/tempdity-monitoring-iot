interface SensorCardProps {
  title: string;
  value: number | null;
  unit: string;
  icon: string;
  color: string;
}

const SensorCard = ({ title, value, unit, icon, color }: SensorCardProps) => (
  <div
    className="w-full md:w-1/2 bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 text-center shadow-[0_8px_25px_rgba(255,255,255,0.05)]
    hover:shadow-[0_14px_25px_rgba(239,68,68,0.25)] hover:scale-[1.02] transition-all duration-300 h-44 md:h-48 flex flex-col justify-center"
  >
    <div className="flex flex-col items-center space-y-2">
      <i className={`bi ${icon} text-4xl ${color}`}></i>

      <h2 className="text-base font-semibold tracking-wide text-gray-300">
        {title}
      </h2>

      <p className={`text-4xl font-extrabold ${color}`}>
        {value !== null ? value : "--"} {unit}
      </p>
    </div>
  </div>
);

export default SensorCard;
