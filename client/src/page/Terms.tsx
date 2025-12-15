import Layout from "../components/Layout";
import { useTranslation } from "react-i18next";

function Terms() {
  const { t } = useTranslation('legal');

  return (
    <Layout>
      <div className="min-h-screen pt-40 px-4 bg-[#232323] text-orange-600">
        <h2 className="font-bold text-4xl uppercase mb-6">{t('terms.title')}</h2>

        <div className="max-w-2xl text-gray-300 space-y-6">
          <section>
            <h3 className="text-xl font-semibold text-orange-500 mb-3">
              {t('terms.hobbyUse.title')}
            </h3>
            <p>
              {t('terms.hobbyUse.text')}
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-orange-500 mb-3">
              {t('terms.tradeLimits.title')}
            </h3>
            <p>
              {t('terms.tradeLimits.text')}
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-orange-500 mb-3">
              {t('terms.responsibility.title')}
            </h3>
            <p>
              {t('terms.responsibility.intro')}
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
              <li>{t('terms.responsibility.li1')}</li>
              <li>{t('terms.responsibility.li2')}</li>
              <li>{t('terms.responsibility.li3')}</li>
              <li>{t('terms.responsibility.li4')}</li>
              <li>{t('terms.responsibility.li5')}</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-orange-500 mb-3">
              {t('terms.liability.title')}
            </h3>
            <p>
              {t('terms.liability.text')}
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-orange-500 mb-3">
              {t('terms.termination.title')}
            </h3>
            <p>
              {t('terms.termination.text')}
            </p>
          </section>

          <p className="text-sm text-gray-500 pt-4">
            {t('terms.agreement')}
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Terms;
