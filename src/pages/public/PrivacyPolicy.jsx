function PrivacyPolicy() {
  const sections = [
    {
      title: "Information We Collect",
      content: null,
      subsections: [
        {
          subtitle: "Personal Information",
          items: [
            "Name, email address, phone number, and payment details",
            "Identification documents for account verification (e.g., government-issued ID)",
          ],
        },
        {
          subtitle: "Transaction Details",
          items: [
            "Records of your investments, deposits, withdrawals, and transaction history",
          ],
        },
        {
          subtitle: "Technical Data",
          items: [
            "IP address, browser type, device type, operating system, and app usage statistics",
            "Cookies and similar technologies to enhance user experience and analyze trends",
          ],
        },
        {
          subtitle: "Communication Information",
          items: [
            "Messages, inquiries, and feedback you send to our support or sales team",
          ],
        },
      ],
    },
    {
      title: "How We Use Your Information",
      content: null,
      subsections: [
        {
          subtitle: "Provide and Maintain Services",
          items: ["Manage your account and facilitate your investments"],
        },
        {
          subtitle: "Enhance User Experience",
          items: ["Analyze app usage to improve functionality and features"],
        },
        {
          subtitle: "Ensure Security",
          items: [
            "Monitor suspicious activity, prevent fraud, and comply with regulatory requirements",
          ],
        },
        {
          subtitle: "Marketing and Communication",
          items: [
            "Inform you of new features, promotional offers, and updates. You may opt out of marketing communications at any time.",
          ],
        },
      ],
    },
    {
      title: "Sharing Your Information",
      content:
        "We do not sell or rent your data. Information may be shared with trusted third parties to process payments, comply with regulations, or provide customer support, under strict confidentiality agreements. This includes:",
      subsections: [
        {
          subtitle: "With Trusted Partners",
          items: [
            "Payment processors, IT service providers, and customer support platforms who assist or partner with us in delivering our services",
          ],
        },
        {
          subtitle: "For Legal Compliance",
          items: [
            "To comply with legal obligations, court orders, or government regulations",
          ],
        },
        {
          subtitle: "In Business Transfers",
          items: [
            "If our business is acquired, merged, or restructured, your data may be transferred as part of the transaction",
          ],
        },
      ],
    },
    {
      title: "Data Security",
      content:
        "We prioritize your data security by implementing the following measures. Despite our efforts, no system is 100% secure — we encourage users to safeguard their account credentials.",
      subsections: [
        {
          subtitle: "Encryption",
          items: ["Secure transmission and storage of sensitive data"],
        },
        {
          subtitle: "Access Controls",
          items: [
            "Restricted access to personal data based on the principle of least privilege",
          ],
        },
        {
          subtitle: "Periodic Reviews",
          items: ["Regular audits and updates to our security practices"],
        },
      ],
    },
    {
      title: "Your Rights",
      content:
        "You have the following rights concerning your personal data. To exercise these rights, please use your dashboard.",
      subsections: [
        {
          subtitle: null,
          items: [
            "Access and Correction — Review and update your information",
            "Deletion — Request the removal of your personal data where legally permissible",
            "Restriction — Limit the use of your data in certain circumstances",
            "Portability — Request a copy of your data in a machine-readable format",
          ],
        },
      ],
    },
    {
      title: "Use of Cookies and Similar Technologies",
      content: "We use cookies and similar technologies to:",
      subsections: [
        {
          subtitle: null,
          items: [
            "Analyze website traffic and usage trends",
            "Save user preferences for a seamless experience",
            "Provide targeted marketing based on your interactions with our app or website",
          ],
        },
      ],
      footer:
        "You can manage or disable cookies through your browser settings, though this may affect functionality.",
    },
    {
      title: "Third-Party Links",
      content:
        "Our website or app may contain links to third-party sites. We are not responsible for the privacy practices or content of these external platforms. We encourage you to review their policies before sharing any information.",
      subsections: [],
    },
    {
      title: "Changes to This Policy",
      content:
        "We may update this Privacy Policy from time to time to reflect changes in our practices or for legal reasons. Any updates will be posted on this page with a revised effective date. Continued use of our services indicates your acceptance of the updated policy.",
      subsections: [],
    },
    {
      title: "Contact Us",
      content:
        "If you have questions, concerns, or complaints about this Privacy Policy or your data, please reach out to us:",
      subsections: [],
      contact: {
        email: "contact@5pmnexus.com",
        phone: "+2347033417802 or +2347080897994",
        address: "No. 52, Raymond Njoku St, Ikoyi, Lagos State, Nigeria.",
      },
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="bg-dark-lavender text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
          <p className="text-xl text-gray-300 max-w-3xl">Effective Date: 01/01/2026</p>
        </div>
      </section>

      {/* Body */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Intro */}
          <p className="text-gray-600 text-lg leading-relaxed">
            Welcome to <strong>5PM Nexus Limited</strong>. Your privacy is our priority. This
            Privacy Policy outlines how we collect, use, and protect your information. By using our
            app or website, you agree to the terms outlined below.
          </p>

          {sections.map((section, i) => (
            <div key={section.title} className="border-t border-gray-100 pt-8">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
                {i + 1}. {section.title}
              </h2>

              {section.content && (
                <p className="text-gray-600 mb-4 leading-relaxed">{section.content}</p>
              )}

              {section.subsections && section.subsections.length > 0 && (
                <div className="space-y-4">
                  {section.subsections.map((sub, j) => (
                    <div key={j}>
                      {sub.subtitle && (
                        <h3 className="font-semibold text-gray-800 mb-2">{sub.subtitle}</h3>
                      )}
                      <ul className="list-disc list-inside space-y-1 text-gray-600 ml-1">
                        {sub.items.map((item, k) => (
                          <li key={k} className="leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {section.footer && (
                <p className="text-gray-600 mt-4 leading-relaxed">{section.footer}</p>
              )}

              {section.contact && (
                <ul className="mt-2 space-y-1 text-gray-600">
                  <li>
                    <span className="font-medium">Email:</span>{" "}
                    <a
                      href={`mailto:${section.contact.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {section.contact.email}
                    </a>
                  </li>
                  <li>
                    <span className="font-medium">Phone:</span> {section.contact.phone}
                  </li>
                  <li>
                    <span className="font-medium">Address:</span> {section.contact.address}
                  </li>
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default PrivacyPolicy;