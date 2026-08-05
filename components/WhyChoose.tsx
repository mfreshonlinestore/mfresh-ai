export default function WhyChoose() {
  const features = [
    {
      title: "100% Pure Cow Milk",
      text: "Fresh milk collected directly from trusted farms.",
      icon: "🥛",
    },
    {
      title: "Morning Delivery",
      text: "Delivered fresh to your doorstep every morning.",
      icon: "🚚",
    },
    {
      title: "No Preservatives",
      text: "Natural milk with no chemicals or preservatives.",
      icon: "🌿",
    },
    {
      title: "Farm Fresh",
      text: "Directly sourced from healthy cows and farms.",
      icon: "🐄",
    },
    {
      title: "Hygienic Packing",
      text: "Packed safely with modern hygienic standards.",
      icon: "📦",
    },
    {
      title: "Trusted Quality",
      text: "Loved by hundreds of happy families.",
      icon: "⭐",
    },
  ];

  return (
    <section className="py-24 bg-green-50">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center">
          <p className="text-green-600 font-semibold uppercase">
            Why Choose Us
          </p>

          <h2 className="text-5xl font-bold text-green-800 mt-3">
            Why Choose M Fresh Dairy?
          </h2>

          <p className="mt-5 text-gray-600 max-w-2xl mx-auto">
            We deliver fresh, pure and healthy dairy products directly
            from our trusted farms to your home every day.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">

          {features.map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition duration-300"
            >
              <div className="text-5xl">{item.icon}</div>

              <h3 className="mt-6 text-2xl font-bold text-green-700">
                {item.title}
              </h3>

              <p className="mt-4 text-gray-600 leading-7">
                {item.text}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}