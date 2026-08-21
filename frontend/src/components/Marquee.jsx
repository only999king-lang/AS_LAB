const items = [
  "OLED Displays",
  "Tempered Glass",
  "Micro-Soldering",
  "ANC Earbuds",
  "Back Panels",
  "Rugged Covers",
  "Bluetooth Speakers",
  "Water Damage Recovery",
  "Battery Swap",
  "Studio Headphones",
];

export const Marquee = () => {
  const doubled = [...items, ...items];
  return (
    <div className="relative border-y border-[#282C3D] bg-[#12141C] py-5 overflow-hidden" data-testid="editorial-marquee">
      <div className="marquee-track flex whitespace-nowrap w-max">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="font-heading font-bold uppercase text-lg sm:text-xl tracking-wide text-[#F4F5F7]/90 px-6">
              {item}
            </span>
            <span className="w-2 h-2 rotate-45 bg-[#FFB800]" />
          </span>
        ))}
      </div>
    </div>
  );
};