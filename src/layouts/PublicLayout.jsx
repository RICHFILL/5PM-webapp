import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';

function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to={ROUTES.HOME} className="flex items-center py-2 gap-2">
            <img src="/assets/newlogo.png" alt="Logo" className="h-16 w-auto" />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to={ROUTES.ABOUT} className="text-sm text-gray-600 hover:text-neon-tangerine transition-colors">About</Link>
            <Link to={ROUTES.INVESTMENT_OPPORTUNITIES} className="text-sm text-gray-600 hover:text-neon-tangerine transition-colors">Investments</Link>
            <Link to={ROUTES.HOW_IT_WORKS} className="text-sm text-gray-600 hover:text-neon-tangerine transition-colors">How It Works</Link>
            <Link to={ROUTES.HELP} className="text-sm text-gray-600 hover:text-neon-tangerine transition-colors">Help</Link>
            <Link to={ROUTES.FAQ} className="text-sm text-gray-600 hover:text-neon-tangerine transition-colors">FAQ</Link>
            <Link to={ROUTES.CONTACT} className="text-sm text-gray-600 hover:text-neon-tangerine transition-colors">Contact</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link to={ROUTES.LOGIN} className="text-sm font-semibold text-gray-700 hover:text-neon-tangerine transition-colors">Sign In</Link>
            <Link to={ROUTES.REGISTER} className="text-sm font-semibold text-white bg-neon-tangerine hover:bg-neon-tangerine/80 px-4 py-2 rounded-xl transition-colors">Get Started</Link>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <img src="/assets/newlogo.png" alt="Logo" className="h-20 mb-2 object-contain" style={{ filter: 'grayscale(1) brightness(200%)' }} />
              <p className="text-sm text-gray-400">Premium digital wealth and investment platform.</p>
              <div className="flex flex-col gap-2 mt-6">
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <img src="/assets/svgs/google-playstore-badge.svg" alt="Get it on Google Play" className="h-12 w-auto" />
                </a>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <img src="/assets/svgs/app-store-badge.svg" alt="Download on the App Store" className="h-12 w-auto" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <Link to={ROUTES.ABOUT} className="block hover:text-white">About Us</Link>
                <Link to={ROUTES.HELP} className="block hover:text-white">Help Centre</Link>
                <Link to={ROUTES.INVESTMENT_OPPORTUNITIES} className="block hover:text-white">Investments</Link>
                <Link to={ROUTES.HOW_IT_WORKS} className="block hover:text-white">How It Works</Link>
                <Link to={ROUTES.CONTACT} className="block hover:text-white">Contact</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <Link to={ROUTES.FAQ} className="block hover:text-white">FAQ</Link>
                <Link to={ROUTES.TERMS} className="block hover:text-white">Terms & Conditions</Link>
                <Link to={ROUTES.PRIVACY} className="block hover:text-white">Privacy Policy</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-gray-400">
                <p>info@5pmnexus.com</p>
                <p><a href="tel:+2347033417802" className="hover:text-white">+2347033417802</a>, <a href="tel:+2347080897994" className="hover:text-white">+2347080897994</a></p>
                <p>No. 52, Raymond Njoku St, Ikoyi, Lagos State, Nigeria.</p>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} 5PM Nexus Invest. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout;
