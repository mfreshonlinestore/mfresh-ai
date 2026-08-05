import Image from "next/image";

export default function About() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">

        <div>
          <Image
            src="/images/about.png"
            alt="About M Fresh"
            width={600}
            height={500}
            className="rounded-3xl shadow-2xl"
          />
        </div>

        <div>
          <p className="text-green-600 font-semibold uppercase">
            About Us
          </p>

          <h2 className="text-5xl font-bold mt-4 text-gray-900">
            Fresh Cow Milk Delivered Every Morning
          </h2>

          <p className="mt-6 text-gray-600 leading-8">
            At M Fresh Dairy, we deliver 100% pure farm fresh cow milk,
            curd, paneer, butter and ghee directly from trusted farms
            to your doorstep every morning.
          </p>

          <div className="grid grid-cols-2 gap-6 mt-10">

            <div className="bg-green-50 p-6 rounded-2xl">
              <h3 className="text-3xl font-bold text-green-700">100%</h3>
              <p>Pure Cow Milk</p>
            </div>

            <div className="bg-green-50 p-6 rounded-2xl">
              <h3 className="text-3xl font-bold text-green-700">365</h3>
              <p>Days Delivery</p>
            </div>

            <div className="bg-green-50 p-6 rounded-2xl">
              <h3 className="text-3xl font-bold text-green-700">500+</h3>
              <p>Happy Customers</p>
            </div>

            <div className="bg-green-50 p-6 rounded-2xl">
              <h3 className="text-3xl font-bold text-green-700">Farm</h3>
              <p>Fresh Everyday</p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}