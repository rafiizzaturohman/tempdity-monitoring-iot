"use client";

import { useEffect, useState } from "react";
import SensorCard from "@/app/components/sensorCard";
import ChartCard from "@/app/components/chartCard";

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
        <ChartCard />

        {/* <!-- Footer --> */}
        <footer className="text-center md:absolute md:bottom-0 md:left-1/2 md:-translate-x-1/2 py-3 text-gray-500 text-xs md:text-sm">
          <p>© 2025 AIRIQ | Real-time DHT22 Sensor Data</p>
        </footer>
      </div>
    </div>
  );
};

export default Dht22Page;
