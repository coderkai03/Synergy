import SynergyLogo from './synergy-logo';


export default function Loading() {
    const { getLogoSize } = SynergyLogo();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#111119]">
      <div className="animate-pulse">
        {getLogoSize('lg')}
      </div>
      <p className="mt-4 text-gray-400">Loading...</p>
    </div>
  );
}
