interface SensorCardProps {
  title: string;
  value: number | null;
  unit: string;
  variant: "temperature" | "humidity";
  max?: number | null;
  min?: number | null;
}

const styles = {
  temperature: {
    shadow: "shadow-[0_8px_25px_rgba(255,255,255,0.05)]",
    shadowHover: "hover:shadow-[0_14px_25px_rgba(239,68,68,0.25)]",
    color: "text-red-400",
    icon: "bi-thermometer-half",
  },
  humidity: {
    shadow: "shadow-[0_8px_25px_rgba(255,255,255,0.05)]",
    shadowHover: "hover:shadow-[0_14px_25px_rgba(56,189,248,0.25)]",
    color: "text-sky-400",
    icon: "bi-droplet",
  },
};

// Mapping warna untuk Tailwind (hindari class dinamis)
const colorMap = {
  red: {
    text: "text-red-300",
    bg: "bg-red-900/40",
    border: "border-red-700/40",
  },
  blue: {
    text: "text-blue-300",
    bg: "bg-blue-900/40",
    border: "border-blue-700/40",
  },
  green: {
    text: "text-green-300",
    bg: "bg-green-900/40",
    border: "border-green-700/40",
  },
  gray: {
    text: "text-gray-300",
    bg: "bg-gray-900/40",
    border: "border-gray-700/40",
  },
} as const;

const SensorCard = ({
  title,
  value,
  unit,
  variant,
  max,
  min,
}: SensorCardProps) => {
  const style = styles[variant];

  // ==== LOGIC NOTIFIKASI ====
  let notifText = "";
  // notifColorKey is the key for colorMap
  let notifColorKey: keyof typeof colorMap = "gray";

  // Narrow value safely
  if (value === null || typeof value !== "number") {
    notifText = "Menunggu data...";
    notifColorKey = "gray";
  } else {
    // value is definitely a number here
    const val = value;

    // If max/min are provided, use them. Otherwise fall back to static thresholds
    if (typeof max === "number" && val > max) {
      notifText =
        variant === "temperature"
          ? "⚠️ Suhu di atas batas!"
          : "⚠️ Kelembapan di atas batas!";
      notifColorKey = "red";
    } else if (typeof min === "number" && val < min) {
      notifText =
        variant === "temperature"
          ? "❄️ Suhu di bawah batas!"
          : "⚠️ Kelembapan di bawah batas!";
      notifColorKey = "blue";
    } else {
      // Jika max/min tidak diberikan, gunakan threshold statis (sesuai request sebelumnya)
      if (variant === "temperature") {
        if (val >= 30) {
          notifText = "⚠️ Suhu udara terlalu panas";
          notifColorKey = "red";
        } else if (val <= 21) {
          notifText = "❄️ Suhu udara terlalu dingin";
          notifColorKey = "blue";
        } else {
          notifText = "😊 Suhu dalam batas normal";
          notifColorKey = "green";
        }
      } else {
        // humidity
        if (val >= 65) {
          notifText = "⚠️ Kelembapan diatas batas normal";
          notifColorKey = "red";
        } else if (val <= 30) {
          notifText = "⚠️ Kelembapan dibawah batas normal";
          notifColorKey = "blue";
        } else {
          notifText = "😊 Kelembapan normal";
          notifColorKey = "green";
        }
      }
    }
  }

  const selectedColor = colorMap[notifColorKey];

  return (
    <div
      className={`w-full md:w-1/2 bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 text-center ${style.shadow} ${style.shadowHover} hover:scale-[1.02] transition-all duration-300 h-44 md:h-48 flex flex-col justify-between`}
    >
      <div className="flex flex-col items-center space-y-2">
        <i className={`bi ${style.icon} text-4xl ${style.color}`}></i>

        <h2 className="text-base font-semibold tracking-wide text-gray-300">
          {title}
        </h2>

        <p className={`text-4xl font-extrabold ${style.color}`}>
          {value !== null ? value : "--"} {unit}
        </p>
      </div>

      {/* NOTIFIKASI - gunakan class dari mapping (bukan dynamic template) */}
      <p
        className={`mt-3 text-xs sm:text-sm md:text-base font-medium ${selectedColor.text} ${selectedColor.bg} ${selectedColor.border} px-3 sm:px-4 py-1 sm:py-2 rounded-lg shadow-md transition-all duration-300 text-center`}
      >
        {notifText}
      </p>
    </div>
  );
};

export default SensorCard;
