export default function Footer() {
  return (
    <footer className="bg-muted border-t mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-foreground">Skyfinder</h3>
            <p className="text-muted-foreground text-sm">
              Your trusted partner for affordable flights between UK and Netherlands.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-4 text-foreground">Support</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Help Center</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Contact Us</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Manage Booking</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4 text-foreground">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Careers</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Press</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-4 text-foreground">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Terms & Conditions</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Cookie Policy</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Skyfinder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
