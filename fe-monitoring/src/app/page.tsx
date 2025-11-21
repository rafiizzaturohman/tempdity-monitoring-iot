"use client";

import { useEffect, useState } from "react";
import SensorCard from "@/app/components/sensorCard";
import ChartCard from "@/app/components/chartCard";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";

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
        <Header />

        {/* <!-- Card Section --> */}
        <main className="flex-1 flex flex-col md:flex-row gap-6 justify-center items-stretch p-6 max-w-6xl mx-auto w-full">
          {/* <!-- Temperature Card --> */}
          <SensorCard
            title="Temperature"
            value={sensor?.temperature ?? null}
            unit="°C"
            variant="temperature"
          />

          {/* <!-- Humidity Card --> */}
          <SensorCard
            title="Humidity"
            value={sensor?.humidity ?? null}
            unit="%"
            variant="humidity"
          />
        </main>

        {/* <!-- Chart Section --> */}
        <ChartCard />

        {/* <!-- Footer --> */}
        <Footer />
      </div>
    </div>
  );
};

export default Dht22Page;
