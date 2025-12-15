import Layout from "../components/Layout";

function HowItWorks() {
  return (
    <Layout>
      <div className="min-h-screen pt-40 px-4 pb-12 bg-[#121212] text-[#FAFAFA]">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-bold text-4xl uppercase text-orange-600 mb-4">
            How It Works
          </h1>
          <p className="text-lg text-gray-400 mb-12">
            XMR Meet is a community directory for Monero enthusiasts who enjoy casual,
            in-person exchanges. This is for fun, education, and connecting with
            like-minded peers.
          </p>

          {/* What is XMR Meet */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              What is XMR Meet?
            </h2>
            <div className="space-y-4">
              <p>
                XMR Meet is an open-source platform where users can:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Create a profile and share their location (country + postal code)</li>
                <li>Indicate if they're available to sell XMR for cash, buy XMR with cash, or both</li>
                <li>Browse and discover others in their area who are interested in meetups</li>
                <li>View contact information and reach out via secure messaging apps</li>
              </ul>
              <p className="text-sm text-gray-500 mt-4">
                <strong>Important:</strong> XMR Meet is just a directory. All communication,
                pricing negotiation, and meetup coordination happens offline via your
                preferred messaging service (Signal, Telegram, WhatsApp, email, etc.).
              </p>
            </div>
          </section>

          {/* Getting Started */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              Getting Started
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">1. Sign Up</h3>
                <p>Create an account with just a username and password. Simple.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">2. Set Your Location</h3>
                <p>
                  In your Account settings, add your country and postal code. We'll show you
                  on the map at street-level precision so others nearby can find you.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">3. Set Availability</h3>
                <p>
                  Check the boxes for whether you're available to sell XMR for cash, buy XMR
                  with cash, or both.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">4. Add Contact Info</h3>
                <p>
                  Share how people should reach you (e.g., "Signal: @username" or "Email:
                  your@email.com"). This will be visible to signed-in users.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">5. Browse & Connect</h3>
                <p>
                  Check out the <a href="/meet" className="text-orange-500 hover:underline">Meet</a> page
                  or <a href="/map" className="text-orange-500 hover:underline">Map</a> to find
                  others in your area. Reach out via their contact info and coordinate a meetup!
                </p>
              </div>
            </div>
          </section>

          {/* Safety Guidelines */}
          <section className="mb-12 border-t border-orange-900 pt-8">
            <h2 className="text-2xl font-bold text-orange-500 mb-4">
              Safety Guidelines
            </h2>
            <p className="mb-6 text-gray-400">
              While XMR Meet is for fun and community, personal safety should always come
              first. Follow these guidelines to make your meetups safe and enjoyable.
            </p>

            <div className="space-y-8">
              {/* General Safety */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">General Safety</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Meet in public, busy places:</strong> Parks, cafés, co-working
                    spaces, or shopping areas are ideal. Avoid secluded locations or private
                    homes for first-time meetings.
                  </li>
                  <li>
                    <strong>Daytime is best:</strong> If possible, schedule meetups during
                    daylight hours when visibility is higher.
                  </li>
                  <li>
                    <strong>Bring a friend:</strong> Let someone know where you're going and who
                    you're meeting. Bring a trusted friend if you can.
                  </li>
                  <li>
                    <strong>Stay alert:</strong> Keep your phone accessible, be aware of your
                    surroundings, and trust your instincts. If something feels off, leave.
                  </li>
                  <li>
                    <strong>Limit distractions:</strong> Avoid headphones or being too engrossed
                    in your phone during the meetup.
                  </li>
                </ul>
              </div>

              {/* Transaction Limits */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Transaction Limits & Handling
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Start small:</strong> For first-time meetups, keep transactions
                    under $300 USD worth of Monero. Build trust gradually.
                  </li>
                  <li>
                    <strong>Count and verify cash discreetly:</strong> Ensure both parties agree
                    on the amount before completing the exchange.
                  </li>
                  <li>
                    <strong>Verify Monero transfers:</strong> Double-check wallet addresses and
                    amounts. Confirm transactions before handing over cash.
                  </li>
                  <li>
                    <strong>Separate your funds:</strong> Don't carry more cash or Monero than
                    necessary for a single meetup.
                  </li>
                </ul>
              </div>

              {/* Communication */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  Communication & Planning
                </h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Use secure messaging apps:</strong> Signal, Telegram, WhatsApp, or
                    email. Avoid sharing sensitive info publicly.
                  </li>
                  <li>
                    <strong>Confirm details before meeting:</strong> Double-check location, time,
                    and amount. Send a photo of the meetup spot if needed.
                  </li>
                  <li>
                    <strong>Have a backup plan:</strong> Agree on what to do if one party is
                    late or cancels.
                  </li>
                </ul>
              </div>

              {/* Common Sense Tips */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Common Sense Tips</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Choose good locations:</strong> Pick busy cafés or public spaces with
                    good visibility.
                  </li>
                  <li>
                    <strong>Keep it low-key:</strong> Be discreet with cash - no need to draw
                    attention.
                  </li>
                  <li>
                    <strong>Start small:</strong> Build trust over multiple meetups rather than
                    doing large amounts right away.
                  </li>
                </ul>
              </div>

              {/* Conduct */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Conduct</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Respect boundaries:</strong> Be polite, professional, and friendly.
                  </li>
                  <li>
                    <strong>No pricing discussion on the platform:</strong> Discuss prices and
                    rates privately offline.
                  </li>
                  <li>
                    <strong>Be punctual:</strong> Respect others' time; communicate delays
                    immediately.
                  </li>
                  <li>
                    <strong>Avoid risky behavior:</strong> Don't agree to exchanges that feel
                    unsafe, pressured, or suspicious.
                  </li>
                </ul>
              </div>

              {/* Building Trust */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-3">Building Trust</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    <strong>Start with small amounts:</strong> Test the process before committing
                    to larger exchanges.
                  </li>
                  <li>
                    <strong>Repeat meetups:</strong> Trust builds over time—don't feel pressured
                    to transact large amounts immediately.
                  </li>
                  <li>
                    <strong>Reference mutual contacts if possible:</strong> Community connections
                    can help establish credibility.
                  </li>
                  <li>
                    <strong>Report unsafe behavior:</strong> If someone behaves inappropriately,
                    block them and report to the platform.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Final Note */}
          <section className="border-t border-orange-900 pt-8">
            <div className="bg-[#171717] border border-orange-600 p-6 rounded-md">
              <h3 className="text-xl font-bold text-orange-500 mb-3">Final Note</h3>
              <p className="text-[#FAFAFA]">
                XMR Meet is all about community, fun, and safe in-person exchanges. By
                following these guidelines, you can enjoy connecting with fellow Monero
                enthusiasts while keeping yourself and others safe.
              </p>
              <p className="text-gray-400 mt-4 text-sm">
                Remember: This is a hobby platform for small, casual exchanges. Keep
                transactions under $300 USD and prioritize safety above all else.
              </p>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}

export default HowItWorks;
