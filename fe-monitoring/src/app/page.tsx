"use client";

import { useEffect, useState } from "react";

const Dht22Page = () => {
  const [sensor, setSensor] = useState<{
    temperature: number;
    humidity: number;
  } | null>(null);

  const fetchData = async () => {
    try {
      // Panggil route yang sudah dibuat via fetch
      const res = await fetch("/api/sensor/");
      const data = await res.json();

      setSensor(data);
    } catch (error) {
      console.error("Error fetching:", error);
    }
  };

  useEffect(() => {
    fetchData();

    // auto refresh setiap 3 detik
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Sensor DHT22</h1>

      {sensor ? (
        <div className="space-y-2">
          <p>
            Temperature: <b>{sensor.temperature}°C</b>
          </p>
          <p>
            Humidity: <b>{sensor.humidity}%</b>
          </p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dht22Page;
