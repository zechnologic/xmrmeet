import { Link } from "react-router";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation('common');

  return (
    <footer className="w-full border-t border-orange-600 bg-[#232323] text-gray-400 py-6 mt-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm">
            <span className="text-orange-600 font-semibold">{t('footer.brand')}</span> - {t('footer.tagline')}
          </div>
          <div className="flex gap-6 text-sm">
            <Link to="/about" className="hover:text-orange-500 transition-colors">
              {t('footer.about')}
            </Link>
            <Link to="/privacy" className="hover:text-orange-500 transition-colors">
              {t('footer.privacy')}
            </Link>
            <Link to="/terms" className="hover:text-orange-500 transition-colors">
              {t('footer.terms')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
