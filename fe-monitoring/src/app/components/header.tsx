import logo from "../../../public/tempdity.png";
import Image from "next/image";

const Header = () => {
  return (
    <header className="bg-white/10 backdrop-blur-md shadow-md py-4 text-center border-b border-white/10">
      {/* <h1 className="text-3xl font-bold tracking-widest text-[#1E90FF] text-shadow-sm text-shadow-[#00bfff80] font-sans">
        AIRIQ
      </h1> */}
      <div className="flex justify-center">
        <Image src={logo} alt="App Name and Logo" className="w-72" />
      </div>

      <p className="text-sm text-gray-300 mt-1">DHT22 Sensor Monitoring</p>
    </header>
  );
};

export default Header;
