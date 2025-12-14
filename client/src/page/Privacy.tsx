import Layout from "../components/Layout";

function Privacy() {
  return (
    <Layout>
      <div className="min-h-screen pt-40 px-4 bg-[#232323] text-orange-600">
        <h2 className="font-bold text-4xl uppercase mb-6">Privacy Policy</h2>

        <div className="max-w-2xl text-gray-300 space-y-4">
          <p className="text-lg">
            We don't track shit - no IP addresses or analytics tools.
          </p>

          <p>
            The only information we store is:
          </p>

          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Your username</li>
            <li>Your chosen location (country and postal code)</li>
            <li>Your availability preferences (buy/sell XMR)</li>
            <li>Your contact information (if you provide it)</li>
            <li>Reputation and review scores (when implemented)</li>
          </ul>

          <p>
            That's it. No tracking, no analytics, no bullshit.
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Privacy;
