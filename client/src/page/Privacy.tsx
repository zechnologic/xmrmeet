import Layout from "../components/Layout";
import { useTranslation } from "react-i18next";

function Privacy() {
  const { t } = useTranslation('legal');

  return (
    <Layout>
      <div className="min-h-screen pt-40 px-4 bg-[#232323] text-orange-600">
        <h2 className="font-bold text-4xl uppercase mb-6">{t('privacy.title')}</h2>

        <div className="max-w-2xl text-gray-300 space-y-4">
          <p className="text-lg">
            {t('privacy.intro')}
          </p>

          <p>
            {t('privacy.whatWeStore')}
          </p>

          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>{t('privacy.li1')}</li>
            <li>{t('privacy.li2')}</li>
            <li>{t('privacy.li3')}</li>
            <li>{t('privacy.li4')}</li>
            <li>{t('privacy.li5')}</li>
          </ul>

          <p>
            {t('privacy.conclusion')}
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Privacy;
