export default function Footer() {
  return (
    <div>
        <footer className="py-5 bg-[#111119]">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            &copy; 2024 Synergy. All rights reserved.
          </p>
          <div className="mt-4 space-x-4">
            {/* TODO: Add Terms of Service */}
            {/* <a href="#" className="text-gray-600 hover:underline">
              Terms of Service
            </a> */}
            <a href="/legal" className="text-gray-600 hover:underline">
              Privacy Policy
            </a>
            <a href="/contact-us" className="text-gray-600 hover:underline">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
