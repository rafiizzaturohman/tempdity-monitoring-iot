"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const ChartCard = ({
  temperature,
  humidity,
}: {
  temperature: number | null;
  humidity: number | null;
}) => {
  const chartRef = useRef<any>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      const ctx = document.getElementById("sensorChart") as HTMLCanvasElement;

      chartRef.current = new Chart(ctx, {
        type: "line",
        data: {
          labels: [],
          datasets: [
            {
              label: "Temperature (°C)",
              borderColor: "rgba(239,68,68,1)",
              backgroundColor: "rgba(239,68,68,0.2)",
              data: [],
              tension: 0.3,
              fill: true,
            },
            {
              label: "Humidity (%)",
              borderColor: "rgba(56,189,248,1)",
              backgroundColor: "rgba(56,189,248,0.2)",
              data: [],
              tension: 0.3,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              ticks: { color: "#9ca3af" },
              grid: { color: "rgba(255,255,255,0.05)" },
            },
            y: {
              ticks: { color: "#9ca3af" },
              grid: { color: "rgba(255,255,255,0.05)" },
            },
          },
          plugins: {
            legend: { labels: { color: "#f3f4f6" } },
          },
        },
      });

      initialized.current = true;
    }
  }, []);

  // ==== UPDATE CHART KETIKA ADA DATA BARU ====
  useEffect(() => {
    if (!chartRef.current || temperature === null || humidity === null) return;

    const chart = chartRef.current;
    const now = new Date().toLocaleTimeString();

    chart.data.labels.push(now);
    chart.data.datasets[0].data.push(temperature);
    chart.data.datasets[1].data.push(humidity);

    // Maksimal 15 data
    if (chart.data.labels.length > 15) {
      chart.data.labels.shift();
      chart.data.datasets.forEach((ds: any) => ds.data.shift());
    }

    chart.update();
  }, [temperature, humidity]);

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
