import Image from "next/image"
import Link from "next/link"

export default function Component() {
  return (
    <section className="relative w-full py-8 md:py-12 lg:py-16 overflow-hidden">
      {/* Background split */}
      <div className="absolute inset-0 top-1/2 h-1/2 bg-[#E0E7FF] z-0" />

      {/* Content Grid */}
      <div className="relative container mx-auto px-4 md:px-6 grid lg:grid-cols-2 items-center gap-8 z-10">
        {/* Left Content Box */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 flex flex-col lg:items-start text-center lg:text-left w-full max-w-2xl mx-auto">
          {/* Header with Logo */}
          <div className="flex items-center mb-4 sm:mb-6 w-full justify-center lg:justify-start">
            <Image
              src="/images/download.jpg"
              width={60}
              height={60}
              alt="Tally Cash Flow Logo"
              className="mr-4 rounded-md object-contain"
            />
            <h2 className="text-2xl sm:text-3xl font-bold text-black">Download Now!</h2>
          </div>

          {/* Title */}
          <span className="text-2xl sm:text-4xl font-bold text-[#2563EB] mb-2">
            Tally Cash Flow
          </span>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-gray-600 mb-4">
            Tally Cash Flow is available on
          </p>

          {/* Download Buttons */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-3">
            <Link
              href="#"
              className="flex items-center px-4 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition text-sm"
            >
              <Image
                src="/images/playstore.png"
                alt="Google Play"
                width={24}
                height={24}
                className="mr-2"
              />
              Google Play
            </Link>

            <Link
              href="#"
              className="flex items-center px-4 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition text-sm"
            >
              <Image
                src="/images/appstore.png"
                alt="App Store"
                width={24}
                height={24}
                className="mr-2"
              />
              App Store
            </Link>

            <Link
              href="#"
              className="flex items-center px-4 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition text-sm"
            >
              <Image
                src="/images/web.png"
                alt="Web App"
                width={24}
                height={24}
                className="mr-2"
              />
              Web App
            </Link>
          </div>
        </div>

        {/* Device Image */}
        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl">
            <Image
              src="/images/desktop3.png"
              width={700}
              height={450}
              alt="Desktop app mockup"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
