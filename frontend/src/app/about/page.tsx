"use client";

import Breadcrumb from "@/components/Breadcrumb";

export default function AboutPage() {
  return (
    <div className="py-4 md:py-8 bg-white">
      <div className="container mx-auto px-4">

        <Breadcrumb items={[{ label: "About Us" }]} />

        <h1 className="text-5xl font-bold text-center mb-12 text-black">
          About EZ Masala
        </h1>

        <p className="text-center text-xl text-gray-700 mb-12">
          Making Indian cooking simpler, more consistent and more enjoyable – for every kitchen.
        </p>

        <div className="max-w-4xl mx-auto">
          {/* MAIN CONTENT BOX */}
          <div className="bg-white rounded-lg p-8 md:p-12 mb-8 border border-gray-200 text-black leading-relaxed space-y-10">

            {/* 1. OUR STORY */}
            <section>
              <h2 className="text-3xl font-bold mb-4">1. Our Story</h2>

              <p>Most Indian kitchens share the same daily problem:</p>
              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Time is less</li>
                <li>Recipes are confusing</li>
                <li>Taste changes every day</li>
                <li>And new cooks feel nervous about “what if it goes wrong?”</li>
              </ul>

              <p className="mt-4">
                We saw this challenge again and again – in homes, hostels, tiffin kitchens and small food businesses.
                People love ghar ka khana, but:
              </p>

              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Cutting, chopping and roasting takes time</li>
                <li>Balancing multiple masalas is difficult</li>
                <li>One expert person in the family or kitchen carries all the “taste know-how”</li>
              </ul>

              <p className="mt-4">
                EZ Masala was born from a simple thought:<br />
                <b>“What if we create a support system that makes cooking easier and taste more dependable –
                  without taking away your freedom and creativity?”</b>
              </p>

              <p className="mt-4">
                EZ Masala is developed and marketed by <b>Shine Exports (India)</b>, backed by years of experience in
                printing, packaging and understanding how real people use products in real life.
              </p>
            </section>

            {/* 2. WHAT EXACTLY IS EZ MASALA */}
            <section>
              <h2 className="text-3xl font-bold mb-4">2. What Exactly is EZ Masala?</h2>

              <p>
                EZ Masala is not just another dry masala powder – and it is not a ready-to-eat gravy.<br />
                It is a <b>ready cooking support</b> designed to help you:
              </p>

              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Start your dish faster</li>
                <li>Control taste more easily</li>
                <li>Repeat the same flavour whenever you want</li>
              </ul>

              <p className="mt-4">Think of EZ Masala as a foundation for your cooking:</p>

              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>It works like a gravy + tadka + flavour guide in one product.</li>
                <li>You still decide how much oil, water, vegetables, dal, paneer or pulses to use.</li>
                <li>EZ Masala makes the “base taste” reliable, so you don’t have to guess every time.</li>
              </ul>

              <p className="mt-4">We currently have two variants:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li><b>EZ Masala J</b> – North Indian style gravies, dals, rajma, chole, paneer and sabzis</li>
                <li><b>EZ Masala M</b> – South Indian style sambar, rasam, dals and veg curries</li>
              </ul>
            </section>

            {/* 3. WHY WE CREATED EZ MASALA */}
            <section>
              <h2 className="text-3xl font-bold mb-4">3. Why We Created EZ Masala</h2>

              <p>We created EZ Masala to solve very practical problems:</p>
              <ul className="list-disc ml-6 space-y-1 mt-2">
                <li><b>Time Pressure:</b> Busy people don’t always have time for long cooking processes.</li>
                <li><b>Inconsistent Taste:</b> The same dish tastes different every day.</li>
                <li><b>Fear of Cooking:</b> Beginners feel unsure about masala quantities.</li>
                <li><b>Dependence on One Person:</b> Only one person knows the “right way” to cook.</li>
              </ul>

              <p className="mt-4">EZ Masala is our answer:</p>
              <ul className="list-disc ml-6 space-y-1 mt-2">
                <li>A simple, easy-to-understand support</li>
                <li>Clear guidance printed on all sides of the box</li>
                <li>Helps beginners & experts achieve dependable results</li>
              </ul>
            </section>

            {/* 4. OUR PHILOSOPHY OF COOKING */}
            <section>
              <h2 className="text-3xl font-bold mb-4">4. Our Philosophy of Cooking</h2>

              <p>We believe that:</p>
              <ul className="list-disc ml-6 space-y-1 mt-2">
                <li>Cooking should be simple enough for anyone.</li>
                <li>Taste should be stable enough to repeat.</li>
                <li>You should always have freedom to add your own touch.</li>
              </ul>

              <p className="mt-4">
                EZ Masala is not meant to replace the cook — it is designed to support the cook.
              </p>

              <p className="mt-4">You can:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Follow the basic method exactly</li>
                <li>Or use EZ Masala as a base and add your own twists</li>
              </ul>

              <p className="mt-4">
                Our aim is to remove confusion and fear, not creativity and joy.
              </p>
            </section>

            {/* 5. WHY THE NAME EZ MASALA */}
            <section>
              <h2 className="text-3xl font-bold mb-4">5. Why the Name “EZ Masala”?</h2>

              <p>
                “EZ” simply means “easy”.
                We wanted the name to feel friendly and approachable.
              </p>

              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>It is a daily-use kitchen helper</li>
                <li>Not a complicated gourmet product</li>
                <li>Reminds you that cooking can be easier and enjoyable</li>
              </ul>

              <p className="mt-4"><b>Easy support, Indian taste, your own style.</b></p>
            </section>

            {/* 6. WHAT MAKES EZ MASALA DIFFERENT */}
            <section>
              <h2 className="text-3xl font-bold mb-4">6. What Makes EZ Masala Different?</h2>

              <ol className="list-decimal ml-6 space-y-2">
                <li>
                  <b>Support-Based Concept</b><br />
                  Helps you start & finish a dish with less confusion.
                </li>

                <li>
                  <b>Education on the Box</b><br />
                  Simple steps printed clearly so anyone can cook easily.
                </li>

                <li>
                  <b>Suitable for Home & HoReCa</b><br />
                  Works for homes, tiffin services, restaurants, canteens & cloud kitchens.
                </li>

                <li>
                  <b>Consistency for Shared Kitchens</b><br />
                  Maintains a standard taste even when multiple people cook.
                </li>

                <li>
                  <b>Flexible Use</b><br />
                  Use less for light taste, more for stronger taste — customise freely.
                </li>
              </ol>
            </section>

            {/* 7. QUALITY & CARE */}
            <section>
              <h2 className="text-3xl font-bold mb-4">7. Quality & Care</h2>

              <p>We understand food is personal and sensitive. We are committed to:</p>

              <ul className="list-disc ml-6 mt-2 space-y-1">
                <li>Using carefully selected ingredients</li>
                <li>Maintaining hygienic processing conditions</li>
                <li>Providing clear usage instructions</li>
              </ul>

              <p className="mt-4">
                We do not make unrealistic claims.
                Our focus is simple:
                <b>To help you cook better, more consistent and satisfying meals with less effort.</b>
              </p>
            </section>

            {/* 8. WHO CAN USE EZ MASALA */}
            <section>
              <h2 className="text-3xl font-bold mb-4">8. Who Can Use EZ Masala?</h2>

              <ul className="list-disc ml-6 space-y-1">
                <li>Home cooks wanting to save time</li>
                <li>Working professionals & students</li>
                <li>Home chefs & tiffin services</li>
                <li>Small hotels, cafés, stalls & cloud kitchens</li>
              </ul>

              <p className="mt-4">If you:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Feel confused about masala balance</li>
                <li>Want consistent daily taste</li>
                <li>Wish cooking felt a little more “EZ”</li>
              </ul>

              <p className="mt-4">
                …then EZ Masala is created exactly for you.
              </p>
            </section>

            {/* 9. OUR VISION */}
            <section>
              <h2 className="text-3xl font-bold mb-4">9. Our Vision</h2>

              <p>Our vision is simple:</p>
              <ul className="list-disc ml-6 space-y-1 mt-2">
                <li>No one should feel scared of the kitchen.</li>
                <li>Young people should feel confident to cook.</li>
                <li>Home cooks and small kitchens should get the support they deserve.</li>
              </ul>

              <p className="mt-4">
                EZ Masala is the first step in a larger journey where cooking becomes scientific,
                taste becomes dependable, and the kitchen becomes a place of calm, creativity and connection.
              </p>
            </section>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="font-bold text-xl mb-3 text-black">100% Natural</h3>
              <p className="text-black text-sm">No artificial colors or preservatives</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <div className="text-4xl mb-4">✓</div>
              <h3 className="font-bold text-xl mb-3 text-black">FSSAI Certified</h3>
              <p className="text-black text-sm">Meeting the highest quality standards</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
              <div className="text-4xl mb-4">♻️</div>
              <h3 className="font-bold text-xl mb-3 text-black">Sustainable</h3>
              <p className="text-black text-sm">Supporting local farmers and communities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
