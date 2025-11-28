interface MinMaxCardSectionProps {
  minTemp: number | null;
  maxTemp: number | null;
  minHumi: number | null;
  maxHumi: number | null;
}

const MinMaxCardSection = ({
  minTemp,
  maxTemp,
  minHumi,
  maxHumi,
}: MinMaxCardSectionProps) => {
  return (
    <section
      id="minmax-temp"
      className="max-w-6xl flex flex-col md:flex-row gap-6 mx-auto w-full"
    >
      {/* TEMPERATURE */}
      <div className="mx-auto w-11/12 md:w-full bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_8px_25px_rgba(255,255,255,0.05)] hover:shadow-[0_10px_25px_rgba(249,248,246,0.2)] p-6 my-0.5 hover:scale-[1.02] transition-all duration-300">
        <div className="flex flex-row items-center space-x-2">
          <i className="bi bi-thermometer-half text-2xl text-red-400"></i>
          <p className="text-xl tracking-wider">Temperature</p>
        </div>

        <div className="flex flex-row justify-evenly mt-6">
          <div>
            <p className="text-lg tracking-wide">Minimum</p>
            <p className="text-center text-xl tracking-wider text-red-400 font-bold">
              {minTemp ?? "--"}
            </p>
          </div>

          <div>
            <p className="text-lg tracking-wide">Maximum</p>
            <p className="text-center text-xl tracking-wider text-red-400 font-bold">
              {maxTemp ?? "--"}
            </p>
          </div>
        </div>
      </div>

      {/* HUMIDITY */}
      <div className="mx-auto w-11/12 md:w-full bg-white/10 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_8px_25px_rgba(255,255,255,0.05)] hover:shadow-[0_10px_25px_rgba(249,248,246,0.2)] p-6 my-0.5 hover:scale-[1.02] transition-all duration-300">
        <div className="flex md:flex-row items-center space-x-2">
          <i className="bi bi-droplet text-2xl text-sky-500"></i>
          <p className="text-xl tracking-wider">Humidity</p>
        </div>

        <div className="flex flex-row justify-evenly mt-6">
          <div>
            <p className="text-lg tracking-wide">Minimum</p>
            <p className="text-center text-xl tracking-wider text-sky-500 font-bold">
              {minHumi ?? "--"}
            </p>
          </div>

          <div>
            <p className="text-lg tracking-wide">Maximum</p>
            <p className="text-center text-xl tracking-wider text-sky-500 font-bold">
              {maxHumi ?? "--"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MinMaxCardSection;
