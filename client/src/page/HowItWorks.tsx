import Layout from "../components/Layout";
import { useTranslation } from "react-i18next";

function HowItWorks() {
  const { t } = useTranslation('pages');

  return (
    <Layout>
      <div className="min-h-screen pt-40 px-4 pb-12 bg-[#232323] text-gray-300">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-bold text-4xl uppercase text-orange-600 mb-4">
            {t('howItWorks.title')}
          </h1>
          <p className="text-lg text-gray-400 mb-12">
            {t('howItWorks.subtitle')}
          </p>

          {/* What is XMR Meet */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              {t('howItWorks.whatIs.title')}
            </h2>
            <div className="space-y-4">
              <p>
                {t('howItWorks.whatIs.intro')}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t('howItWorks.whatIs.li1')}</li>
                <li>{t('howItWorks.whatIs.li2')}</li>
                <li>{t('howItWorks.whatIs.li3')}</li>
                <li>{t('howItWorks.whatIs.li4')}</li>
              </ul>
              <p className="text-sm text-gray-500 mt-4">
                <strong>Important:</strong> {t('howItWorks.whatIs.note')}
              </p>
            </div>
          </section>

          {/* Getting Started */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              {t('howItWorks.gettingStarted.title')}
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">{t('howItWorks.gettingStarted.step1.title')}</h3>
                <p>{t('howItWorks.gettingStarted.step1.text')}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">{t('howItWorks.gettingStarted.step2.title')}</h3>
                <p>
                  {t('howItWorks.gettingStarted.step2.text')}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">{t('howItWorks.gettingStarted.step3.title')}</h3>
                <p>
                  {t('howItWorks.gettingStarted.step3.text')}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">{t('howItWorks.gettingStarted.step4.title')}</h3>
                <p>
                  {t('howItWorks.gettingStarted.step4.text')}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">{t('howItWorks.gettingStarted.step5.title')}</h3>
                <p>
                  {t('howItWorks.gettingStarted.step5.textPrefix')} <a href="/meet" className="text-orange-500 hover:underline">{t('howItWorks.gettingStarted.step5.meetLink')}</a> {t('howItWorks.gettingStarted.step5.textMid')} <a href="/map" className="text-orange-500 hover:underline">{t('howItWorks.gettingStarted.step5.mapLink')}</a> {t('howItWorks.gettingStarted.step5.textSuffix')}
                </p>
              </div>
            </div>
          </section>

          {/* Safety Guidelines */}
          <section className="mb-12 border-t border-orange-900 pt-8">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              {t('howItWorks.safety.title')}
            </h2>
            <p className="mb-6 text-gray-400">
              {t('howItWorks.safety.intro')}
            </p>

            <div className="space-y-8">
              {/* General Safety */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">{t('howItWorks.safety.general.title')}</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t('howItWorks.safety.general.li1')}</li>
                  <li>{t('howItWorks.safety.general.li2')}</li>
                  <li>{t('howItWorks.safety.general.li3')}</li>
                  <li>{t('howItWorks.safety.general.li4')}</li>
                  <li>{t('howItWorks.safety.general.li5')}</li>
                </ul>
              </div>

              {/* Transaction Limits */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {t('howItWorks.safety.transactions.title')}
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t('howItWorks.safety.transactions.li1')}</li>
                  <li>{t('howItWorks.safety.transactions.li2')}</li>
                  <li>{t('howItWorks.safety.transactions.li3')}</li>
                  <li>{t('howItWorks.safety.transactions.li4')}</li>
                </ul>
              </div>

              {/* Communication */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {t('howItWorks.safety.communication.title')}
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t('howItWorks.safety.communication.li1')}</li>
                  <li>{t('howItWorks.safety.communication.li2')}</li>
                  <li>{t('howItWorks.safety.communication.li3')}</li>
                </ul>
              </div>

              {/* Common Sense Tips */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">{t('howItWorks.safety.commonSense.title')}</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t('howItWorks.safety.commonSense.li1')}</li>
                  <li>{t('howItWorks.safety.commonSense.li2')}</li>
                  <li>{t('howItWorks.safety.commonSense.li3')}</li>
                </ul>
              </div>

              {/* Conduct */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">{t('howItWorks.safety.conduct.title')}</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t('howItWorks.safety.conduct.li1')}</li>
                  <li>{t('howItWorks.safety.conduct.li2')}</li>
                  <li>{t('howItWorks.safety.conduct.li3')}</li>
                  <li>{t('howItWorks.safety.conduct.li4')}</li>
                </ul>
              </div>

              {/* Building Trust */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">{t('howItWorks.safety.trust.title')}</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>{t('howItWorks.safety.trust.li1')}</li>
                  <li>{t('howItWorks.safety.trust.li2')}</li>
                  <li>{t('howItWorks.safety.trust.li3')}</li>
                  <li>{t('howItWorks.safety.trust.li4')}</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Final Note */}
          <section className="border-t border-orange-900 pt-8">
            <div className="bg-[#2a2a2a] border border-orange-600 p-6">
              <h3 className="text-xl font-bold text-orange-500 mb-3">{t('howItWorks.finalNote.title')}</h3>
              <p className="text-gray-300">
                {t('howItWorks.finalNote.p1')}
              </p>
              <p className="text-gray-400 mt-4 text-sm">
                {t('howItWorks.finalNote.p2')}
              </p>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}

export default HowItWorks;
