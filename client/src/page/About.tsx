import Layout from "../components/Layout";
import { Link } from "react-router";

function About() {
  return (
    <Layout>
      <div className="min-h-screen pt-40 px-4 pb-12 bg-[#121212] text-[#FAFAFA]">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-bold text-4xl uppercase text-orange-600 mb-6">
            About XMR Meet
          </h1>

          {/* Mission Statement */}
          <section className="mb-12">
            <p className="text-xl text-[#FAFAFA] leading-relaxed">
              XMR Meet is an open-source, community-driven platform for Monero
              enthusiasts who enjoy connecting with others in person to exchange
              Monero and cash. We're a simple directory for hobbyists who want
              to discover fellow community members in their area and engage in
              casual, P2P exchanges.
            </p>
          </section>

          {/* Why Section */}
          <section className="mb-12 border-t border-orange-900 pt-8">
            <h2 className="text-3xl font-bold text-orange-500 mb-6">
              Why XMR Meet?
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Making Monero Real
                </h3>
                <p className="leading-relaxed">
                  Cryptocurrency becomes truly powerful when it moves beyond
                  digital wallets and into the real world. XMR Meet exists to
                  bridge that gap - to make Monero more dynamic, more tangible,
                  and more accessible to everyday people. When you can meet
                  someone at a local café and exchange cash for XMR, it stops
                  being just numbers on a screen and becomes real money.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Fighting Exchange Delistings
                </h3>
                <p className="leading-relaxed">
                  As more exchanges delist Monero due to regulatory pressure,
                  P2P networks become increasingly important. XMR Meet empowers
                  the community to create its own liquidity, independent of
                  centralized platforms. You don't need an exchange when you
                  have neighbors who believe in financial privacy.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Building Real Adoption
                </h3>
                <p className="leading-relaxed">
                  For XMR holders who want to see the price go up - and let's be
                  honest, we all do - there's no better strategy than real-world
                  usage. The more people actively using and exchanging Monero in
                  their daily lives, the more it behaves like an actual currency
                  rather than just a speculative asset. Real adoption drives
                  real value. Every local meetup, every in-person exchange,
                  every new user who discovers XMR through a friendly face
                  instead of a corporate interface - that's what makes the
                  network stronger and more resilient.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Community Over Corporations
                </h3>
                <p className="leading-relaxed">
                  Monero was built on principles of decentralization and
                  privacy. XMR Meet extends those principles to the way we
                  acquire and exchange it. No KYC, no corporate middlemen, no
                  surveillance - just people connecting with people. This is how
                  P2P currency was always meant to work.
                </p>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="mb-12 border-t border-orange-900 pt-8">
            <h2 className="text-3xl font-bold text-orange-500 mb-6">
              How It Works
            </h2>
            <div className="space-y-4">
              <p>
                XMR Meet is intentionally simple. Users create a profile, share
                their location (country + postal code), and indicate whether
                they're available to buy or sell XMR for cash. That's it.
              </p>
              <p>
                We don't facilitate trades, set prices, or handle transactions.
                All communication happens offline through your preferred
                messaging service - Signal, Telegram, email, whatever you're
                comfortable with. We're just the directory that helps you find
                like-minded people nearby.
              </p>
              <p>
                This platform is for <strong>hobby purposes only</strong> with a
                recommended limit of $300 USD per trade. We're about building
                community and making small, casual exchanges accessible - not
                competing with commercial trading platforms.
              </p>
              <p className="text-sm text-gray-500">
                Want to know more?{" "}
                <Link
                  to="/how-it-works"
                  className="text-orange-500 hover:underline"
                >
                  Check out our detailed guide
                </Link>{" "}
                including safety tips and best practices.
              </p>
            </div>
          </section>

          {/* Open Source */}
          <section className="mb-12 border-t border-orange-900 pt-8">
            <h2 className="text-3xl font-bold text-orange-500 mb-6">
              Open Source & Community
            </h2>
            <div className="space-y-4">
              <p>
                XMR Meet is fully open source under the AGPLv3 license. The code
                is transparent, auditable, and available for anyone to review,
                fork, or contribute to. We believe in the same principles that
                make Monero great: openness, privacy, and community ownership.
              </p>
              <p>
                This project is built by enthusiasts, for enthusiasts. No
                venture capital, no corporate interests, no profit motive - just
                a tool to help the Monero community connect and thrive.
              </p>
            </div>
          </section>

          {/* Support the Project */}
          <section className="mb-12 border-t border-orange-900 pt-8">
            <h2 className="text-3xl font-bold text-orange-500 mb-6">
              Support This Project
            </h2>
            <div className="space-y-4">
              <p>
                XMR Meet was created by{" "}
                <a
                  href="https://x.com/zechnologic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-orange-500 hover:underline font-semibold"
                >
                  @zechnologic
                </a>{" "}
                - a developer passionate about Monero, privacy, and building
                tools for the community. If you find this platform useful and
                want to support its continued development, consider:
              </p>
              <div className="bg-[#171717] border border-orange-600 p-6 rounded-md">
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 text-xl">→</span>
                    <div>
                      <strong className="text-white">Follow on X:</strong>{" "}
                      <a
                        href="https://x.com/zechnologic"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 hover:underline"
                      >
                        @zechnologic
                      </a>{" "}
                      for updates and XMR content
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 text-xl">→</span>
                    <div>
                      <strong className="text-white">
                        Subscribe on YouTube:
                      </strong>{" "}
                      <a
                        href="https://youtube.com/@zechnologic"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 hover:underline"
                      >
                        @zechnologic
                      </a>{" "}
                      for crypto tutorials and project updates
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-orange-500 text-xl">→</span>
                    <div>
                      <strong className="text-white">Star on GitHub:</strong>{" "}
                      <a
                        href="https://github.com/zechnologic/xmrmeet"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 hover:underline"
                      >
                        github.com/zechnologic/xmrmeet
                      </a>{" "}
                      to contribute or follow development
                    </div>
                  </li>
                </ul>
              </div>
              <p className="text-sm text-gray-500">
                Your support helps keep this project free, open-source, and
                ad-free for the entire community.
              </p>
            </div>
          </section>

          {/* Privacy */}
          <section className="mb-12 border-t border-orange-900 pt-8">
            <h2 className="text-3xl font-bold text-orange-500 mb-6">
              Your Privacy
            </h2>
            <div className="space-y-4">
              <p>
                We don't track IP addresses, use analytics tools, or collect any
                data beyond what's necessary to provide the service. We store
                your username, location preferences, availability settings, and
                optional contact information - that's it.
              </p>
              <p>
                No cookies, no trackers, no surveillance. Your activity on this
                site is your business, not ours.
              </p>
              <p className="text-sm text-gray-500">
                Read our full{" "}
                <Link to="/privacy" className="text-orange-500 hover:underline">
                  Privacy Policy
                </Link>{" "}
                for details.
              </p>
            </div>
          </section>

          {/* Call to Action */}
          <section className="border-t border-orange-900 pt-8">
            <div className="bg-[#171717] border border-orange-600 p-8 text-center rounded-md">
              <h2 className="text-2xl font-bold text-orange-500 mb-4">
                Ready to Connect?
              </h2>
              <p className="mb-6 text-[#FAFAFA]">
                Join the community and start meeting fellow Monero enthusiasts
                in your area.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  to="/signup"
                  className="px-8 py-3 bg-orange-600 text-white font-semibold hover:bg-orange-700 transition-all rounded-md"
                >
                  Sign Up
                </Link>
                <Link
                  to="/meet"
                  className="px-8 py-3 border border-orange-600 text-orange-600 font-semibold hover:bg-orange-900/30 transition-all rounded-md"
                >
                  Browse Users
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
