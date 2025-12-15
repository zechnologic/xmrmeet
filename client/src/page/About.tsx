import Layout from "../components/Layout";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";

function About() {
  const { t } = useTranslation('pages');

  return (
    <Layout>
      <div className="min-h-screen pt-40 px-4 pb-12 bg-[#232323] text-gray-300">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-bold text-4xl uppercase text-orange-600 mb-6">
            {t('about.title')}
          </h1>

          {/* Mission Statement */}
          <section className="mb-12">
            <p className="text-xl text-gray-300 leading-relaxed">
              {t('about.mission')}
            </p>
          </section>

          {/* Why Section */}
          <section className="mb-12 border-t border-orange-900 pt-8">
            <h2 className="text-3xl font-bold text-orange-500 mb-6">{t('about.why.title')}</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {t('about.why.makingReal.title')}
                </h3>
                <p className="leading-relaxed">
                  {t('about.why.makingReal.text')}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {t('about.why.fightingDelistings.title')}
                </h3>
                <p className="leading-relaxed">
                  {t('about.why.fightingDelistings.text')}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {t('about.why.buildingAdoption.title')}
                </h3>
                <p className="leading-relaxed">
                  {t('about.why.buildingAdoption.text')}
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {t('about.why.community.title')}
                </h3>
                <p className="leading-relaxed">
                  {t('about.why.community.text')}
                </p>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="mb-12 border-t border-orange-900 pt-8">
            <h2 className="text-3xl font-bold text-orange-500 mb-6">{t('about.howItWorks.title')}</h2>
            <div className="space-y-4">
              <p>
                {t('about.howItWorks.p1')}
              </p>
              <p>
                {t('about.howItWorks.p2')}
              </p>
              <p>
                {t('about.howItWorks.p3')}
              </p>
              <p className="text-sm text-gray-500">
                {t('about.howItWorks.p4prefix')}{" "}
                <Link to="/how-it-works" className="text-orange-500 hover:underline">
                  {t('about.howItWorks.p4link')}
                </Link>{" "}
                {t('about.howItWorks.p4suffix')}
              </p>
            </div>
          </section>

          {/* Open Source */}
          <section className="mb-12 border-t border-orange-900 pt-8">
            <h2 className="text-3xl font-bold text-orange-500 mb-6">
              {t('about.openSource.title')}
            </h2>
            <div className="space-y-4">
              <p>
                {t('about.openSource.p1')}
              </p>
              <p>
                {t('about.openSource.p2')}
              </p>
            </div>
          </section>

          {/* Privacy */}
          <section className="mb-12 border-t border-orange-900 pt-8">
            <h2 className="text-3xl font-bold text-orange-500 mb-6">{t('about.privacy.title')}</h2>
            <div className="space-y-4">
              <p>
                {t('about.privacy.p1')}
              </p>
              <p>
                {t('about.privacy.p2')}
              </p>
              <p className="text-sm text-gray-500">
                {t('about.privacy.p3prefix')}{" "}
                <Link to="/privacy" className="text-orange-500 hover:underline">
                  {t('about.privacy.p3link')}
                </Link>{" "}
                {t('about.privacy.p3suffix')}
              </p>
            </div>
          </section>

          {/* Call to Action */}
          <section className="border-t border-orange-900 pt-8">
            <div className="bg-[#2a2a2a] border border-orange-600 p-8 text-center">
              <h2 className="text-2xl font-bold text-orange-500 mb-4">
                {t('about.cta.title')}
              </h2>
              <p className="mb-6 text-gray-300">
                {t('about.cta.subtitle')}
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  to="/signup"
                  className="px-8 py-3 bg-orange-600 text-white font-semibold hover:bg-orange-700 transition-colors"
                >
                  {t('about.cta.signup')}
                </Link>
                <Link
                  to="/meet"
                  className="px-8 py-3 border border-orange-600 text-orange-600 font-semibold hover:bg-orange-900/30 transition-colors"
                >
                  {t('about.cta.browse')}
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}

export default About;
