"use client";

import { useEffect, useState } from "react";
import SensorCard from "@/app/components/sensorCard";
import ChartCard from "@/app/components/chartCard";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import LimitForm from "@/app/components/limitForm";
import MinMaxCardSection from "@/app/components/minMaxTemp";

const Dht22Page = () => {
  const [sensor, setSensor] = useState<{
    temperature: number;
    humidity: number;
    max_temperature?: number;
    min_temperature?: number;
    max_humidity?: number;
    min_humidity?: number;
  } | null>(null);

  // Fetch sensor + limit
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch("/api/sensor/");
        const data = await res.json();

        setSensor(data);
      } catch (e) {
        console.error("Error fetching:", e);
      }
    };

    fetchAll();
    const interval = setInterval(fetchAll, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-linear-to-br from-gray-800 via-gray-900 to-black h-screen">
      <div className="text-white max-h-screen flex flex-col">
        <Header />

        <main className="flex-1 flex flex-col md:flex-row gap-6 justify-center items-stretch p-6 max-w-300 mx-auto w-full">
          {/* Temperature Card */}
          <SensorCard
            title="Temperature"
            value={sensor?.temperature ?? null}
            unit="°C"
            variant="temperature"
            max={sensor?.max_temperature ?? null}
            min={sensor?.min_temperature ?? null}
          />

          {/* Humidity Card */}
          <SensorCard
            title="Humidity"
            value={sensor?.humidity ?? null}
            unit="%"
            variant="humidity"
            max={sensor?.max_humidity ?? null}
            min={sensor?.min_humidity ?? null}
          />
        </main>

        <MinMaxCardSection
          minTemp={sensor?.min_temperature ?? null}
          maxTemp={sensor?.max_temperature ?? null}
          minHumi={sensor?.min_humidity ?? null}
          maxHumi={sensor?.max_humidity ?? null}
        />

        <LimitForm />

        <ChartCard
          temperature={sensor?.temperature ?? null}
          humidity={sensor?.humidity ?? null}
        />

        <Footer />
      </div>
    </div>
  );
};

export default Dht22Page;
