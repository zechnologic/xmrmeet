import Layout from "../components/Layout";

function Terms() {
  return (
    <Layout>
      <div className="min-h-screen pt-40 px-4 bg-[#121212] text-orange-600">
        <h2 className="font-bold text-4xl uppercase mb-6">Terms of Service</h2>

        <div className="max-w-2xl text-[#FAFAFA] space-y-6">
          <section>
            <h3 className="text-xl font-semibold text-orange-500 mb-3">
              Hobby Use Only
            </h3>
            <p>
              By using XMR Meet, you agree that you are using this platform for{" "}
              <strong className="text-white">hobby purposes only</strong>. This is not a
              commercial trading platform.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-orange-500 mb-3">
              Trade Limits for Your Safety
            </h3>
            <p>
              For your own safety and security, you agree to{" "}
              <strong className="text-white">
                not exceed XMR valued at $300 USD on any single trade
              </strong>
              . This limit helps protect all users from significant financial risk.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-orange-500 mb-3">
              Personal Responsibility
            </h3>
            <p>
              You are solely responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
              <li>Your personal safety when meeting others</li>
              <li>Verifying the identity and trustworthiness of trading partners</li>
              <li>Meeting in safe, public locations</li>
              <li>Complying with all local laws and regulations</li>
              <li>The accuracy of information you provide</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-orange-500 mb-3">
              No Liability
            </h3>
            <p>
              XMR Meet is a bulletin board service only. We provide no guarantees,
              warranties, or liability for any trades, meetings, or interactions that occur
              through this platform.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold text-orange-500 mb-3">
              Account Termination
            </h3>
            <p>
              We reserve the right to terminate accounts that violate these terms or engage
              in fraudulent, illegal, or harmful behavior.
            </p>
          </section>

          <p className="text-sm text-gray-500 pt-4">
            By creating an account and using this service, you acknowledge that you have
            read, understood, and agree to these terms.
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Terms;
