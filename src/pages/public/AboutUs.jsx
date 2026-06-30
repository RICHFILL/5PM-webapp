import { Shield, TrendingUp, Users, Globe } from "lucide-react";

const values = [
  { icon: Shield, title: "Trust & Integrity", description: "We prioritize transparency and ethical practices in every investment opportunity we offer." },
  { icon: TrendingUp, title: "Financial Growth", description: "We help our investors build sustainable wealth through carefully curated asset-backed opportunities." },
  { icon: Users, title: "Community Focused", description: "We believe in democratizing access to premium investment opportunities for all Nigerians." },
  { icon: Globe, title: "Global Standards", description: "Our platform operates with world-class security standards and regulatory compliance." },
];

function AboutUs() {
  return (
    <div>
      <section className="bg-dark-lavender text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-5xl font-bold mb-6">About 5PM Nexus Invest</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            We are a fintech-powered digital wealth and investment platform committed to transforming how Nigerians invest.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                At 5PM Nexus Invest, our mission is to democratize wealth creation by providing accessible, 
                transparent, and secure investment opportunities to every Nigerian.
              </p>
              <p className="text-gray-600 mb-4">
                We bridge the gap between traditional investment vehicles and modern fintech solutions, 
                making it possible for everyday investors to participate in asset-backed opportunities 
                that were previously reserved for institutions and high-net-worth individuals.
              </p>
              <p className="text-gray-600">
                From fractional real estate to fixed-income instruments, we curate opportunities that 
                deliver consistent returns while maintaining rigorous risk management standards.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Our Story</h3>
              <p className="text-gray-600 mb-4">
                Founded with a vision to transform the Nigerian investment landscape, 5PM Nexus Invest 
                brings together expertise in finance, technology, and real estate.
              </p>
              <p className="text-gray-600">
                We have grown from a small team of passionate innovators to a trusted platform serving 
                thousands of investors across Nigeria, managing billions in assets under management.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-8 text-center border border-gray-100">
                <div className="w-14 h-14 mx-auto mb-5 bg-neon-tangerine/10 rounded-2xl flex items-center justify-center">
                  <v.icon className="text-neon-tangerine" size={28} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{v.title}</h3>
                <p className="text-gray-600 text-sm">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;
