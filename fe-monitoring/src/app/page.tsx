"use client";

import { useEffect, useState } from "react";
import SensorCard from "@/app/components/sensorCard";

const Dht22Page = () => {
  const [sensor, setSensor] = useState<{
    temperature: number;
    humidity: number;
  } | null>(null);

  const getData = async () => {
    try {
      const res = await fetch("/api/sensor/");
      const data = await res.json();

      setSensor(data);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  useEffect(() => {
    getData();

    const interval = setInterval(getData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-linear-to-br from-gray-800 via-gray-900 to-black h-screen">
      <div className="text-white max-h-screen flex flex-col">
        {/* <!-- Header --> */}
        <header className="bg-white/10 backdrop-blur-md shadow-md py-4 text-center border-b border-white/10">
          <h1 className="text-3xl font-bold tracking-widest text-[#1E90FF] text-shadow-sm text-shadow-[#00bfff80] font-sans">
            AIRIQ
          </h1>

          <p className="text-sm text-gray-300 mt-1">DHT22 Sensor Monitoring</p>
        </header>

        {/* <!-- Card Section --> */}
        <main className="flex-1 flex flex-col md:flex-row gap-6 justify-center items-stretch p-6 max-w-6xl mx-auto w-full">
          {/* <!-- Temperature Card --> */}
          <SensorCard
            title="Temperature"
            value={sensor?.temperature ?? null}
            unit="°C"
            icon="bi-thermometer-half"
            color="text-red-400"
          />

          {/* <!-- Humidity Card --> */}
          <SensorCard
            title="Humidity"
            value={sensor?.humidity ?? null}
            unit="%"
            icon="bi-droplet"
            color="text-sky-400"
          />
        </main>

        {/* <!-- Chart Section --> */}
        <section className="max-w-6xl mx-auto w-11/12 h-auto md:w-full md:h-auto bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_8px_25px_rgba(255,255,255,0.05)] hover:shadow-[0_14px_25px_rgba(249,248,246,0.5)] p-6 mt-4 mb-6 hover:scale-[1.02] transition-all duration-300">
          <h2 className="text-center text-lg font-semibold tracking-wide text-gray-300 mb-4">
            Real-time Sensor Chart
          </h2>

          <canvas id="sensorChart" height="100"></canvas>
        </section>

        {/* <!-- Footer --> */}
        <footer className="text-center md:absolute md:bottom-0 md:left-1/2 md:-translate-x-1/2 py-3 text-gray-500 text-xs md:text-sm">
          <p>© 2025 AIRIQ | Real-time DHT22 Sensor Data</p>
        </footer>
      </div>
    </div>
  );
};

// <div className="p-6">
//   <h1 className="text-xl font-semibold mb-4">Sensor DHT22</h1>

//   {sensor ? (
//     <div className="space-y-2">
//       <p>
//         Temperature: <b>{sensor.temperature}°C</b>
//       </p>
//       <p>
//         Humidity: <b>{sensor.humidity}%</b>
//       </p>
//     </div>
//   ) : (
//     <p>Loading...</p>
//   )}
// </div>
export default Dht22Page;
