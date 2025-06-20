export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">FlightHub</h3>
            <p className="text-blue-200 text-sm">
              Your trusted partner for affordable flights between UK and Netherlands.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-blue-200">
              <li>
                <a href="#" className="hover:text-white">Help Center</a>
              </li>
              <li>
                <a href="#" className="hover:text-white">Contact Us</a>
              </li>
              <li>
                <a href="#" className="hover:text-white">Manage Booking</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-blue-200">
              <li>
                <a href="#" className="hover:text-white">About Us</a>
              </li>
              <li>
                <a href="#" className="hover:text-white">Careers</a>
              </li>
              <li>
                <a href="#" className="hover:text-white">Press</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-blue-200">
              <li>
                <a href="#" className="hover:text-white">Terms & Conditions</a>
              </li>
              <li>
                <a href="#" className="hover:text-white">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-white">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-blue-800 mt-8 pt-8 text-center text-sm text-blue-200">
          <p>&copy; 2024 FlightHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
