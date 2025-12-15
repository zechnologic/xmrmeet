import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="w-full border-t border-orange-600 bg-[#232323] text-gray-400 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm">
            <span className="text-orange-600 font-semibold">XMR Meet</span> - Peer-to-peer meetups for cash-to-XMR trades
          </div>
          <div className="flex gap-6 text-sm">
            <Link to="/about" className="hover:text-orange-500 transition-colors">
              About
            </Link>
            <Link to="/privacy" className="hover:text-orange-500 transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-orange-500 transition-colors">
              Terms
            </Link>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-orange-900 text-center">
          <p className="text-sm text-gray-500 mb-2">
            Created by <span className="text-orange-600">@zechnologic</span>
          </p>
          <div className="flex gap-4 justify-center text-sm">
            <a
              href="https://x.com/zechnologic"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-500 transition-colors"
            >
              X (Twitter)
            </a>
            <a
              href="https://youtube.com/@zechnologic"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-500 transition-colors"
            >
              YouTube
            </a>
            <a
              href="https://github.com/zechnologic/xmrmeet"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-500 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
