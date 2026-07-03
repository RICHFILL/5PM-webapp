import useAuthStore from "../../store/authStore";

function TermsConditions() {
  const { user } = useAuthStore();

  const sections = [
    {
      title: "Acceptance of Terms",
      content: null,
      items: [
        "Be bound by these Terms and any additional policies or agreements that govern specific features of our services.",
        "Adhere to applicable laws and regulations while using our platform.",
      ],
      footer: "If you do not agree to these Terms, you must discontinue using our services.",
      intro:
        "By registering for an account, accessing our platform, or using any of our services, you agree to:",
    },
    {
      title: "Eligibility",
      content: "To use our platform, you must meet the following requirements:",
      items: [
        "Be at least 18 years old or the age of majority in your jurisdiction.",
        "Possess the legal capacity to enter into a binding contract.",
        "Not be prohibited from using our services under applicable laws or regulations.",
      ],
      footer: "By using our platform, you confirm that you meet these requirements.",
    },
    {
      title: "User Responsibilities",
      content: "As a user, you agree to:",
      items: [
        "Provide accurate, up-to-date, and complete information during registration and whenever required.",
        "Safeguard your account credentials and notify us immediately if you suspect unauthorized access.",
        "Use the platform solely for lawful and intended purposes, refraining from any actions that could harm 5PM Nexus Limited, its users, or its operations.",
      ],
    },
    {
      title: "Investment Disclaimer",
      content:
        "Investing involves inherent risks, and while 5PM Nexus Limited strives to offer reliable and secure investment opportunities, we cannot guarantee specific outcomes. By using our services, you acknowledge and agree that:",
      items: [
        "Past performance is not indicative of future results.",
        "You are solely responsible for evaluating and understanding the risks of any investment decisions you make.",
        "5PM Nexus Limited is not liable for any loss or damages resulting from your investments.",
      ],
      footer:
        "We recommend consulting with a financial advisor if you are uncertain about your investment choices.",
    },
    {
      title: "Prohibited Activities",
      content:
        "You agree not to engage in any activities that may compromise the security, integrity, or functionality of our platform, including but not limited to:",
      items: [
        "Attempting to hack, disrupt, or disable our systems or services.",
        "Using the platform for any fraudulent, illegal, or unauthorized purposes.",
        "Impersonating any person or entity or misrepresenting your affiliation with any person or entity.",
        "Uploading or distributing harmful code, viruses, or malware.",
      ],
      footer:
        "Violations may result in the suspension or termination of your account and potential legal action.",
    },
    {
      title: "Termination of Services",
      content:
        "5PM Nexus Limited reserves the right to suspend or terminate your access to our platform, with or without notice, for the following reasons:",
      items: [
        "Violation of these Terms or any applicable laws.",
        "Engagement in fraudulent or unlawful activities.",
        "At our sole discretion, if we determine that your continued use poses risks to our platform or other users.",
      ],
      footer:
        "You may also terminate your account at any time by contacting our support team.",
    },
    {
      title: "Intellectual Property",
      content:
        "All content, trademarks, logos, and other intellectual property displayed on our platform are the property of 5PM Nexus Limited or its licensors. You may not copy, reproduce, modify, or distribute any content without prior written permission.",
    },
    {
      title: "Limitation of Liability",
      content:
        "To the fullest extent permitted by law, 5PM Nexus Limited and its affiliates shall not be liable for:",
      items: [
        "Indirect, incidental, special, or consequential damages arising from your use of the platform.",
        "Any loss or damage resulting from unauthorized access to your account or data breaches beyond our reasonable control.",
      ],
    },
    {
      title: "Governing Law and Dispute Resolution",
      content:
        "These Terms shall be governed by and construed under the laws of The Federal Republic of Nigeria. Any disputes arising from these Terms or your use of the platform shall be resolved exclusively through arbitration or mediation under the applicable legal framework of The Federal Republic of Nigeria.",
    },
    {
      title: "Changes to the Terms of Service",
      content:
        "5PM Nexus Limited reserves the right to modify or update these Terms at any time. Changes will be posted on our website or app, and your continued use of the platform constitutes acceptance of the updated Terms.",
    },
    {
      title: "Contact Information",
      content: "If you have any questions, concerns, or feedback regarding these Terms, please contact us at:",
      contact: {
        email: "contact@5pmnexus.com",
        phone: "+2347033417802 or +2347080897994",
        address: "No. 52, Raymond Njoku St, Ikoyi, Lagos State, Nigeria.",
      },
    },
    {
      title: "Entire Agreement",
      content:
        "These Terms, along with our Privacy Policy and other applicable policies, constitute the entire agreement between you and 5PM Nexus Limited, superseding any prior agreements or understandings.",
    },
  ];

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">Terms of Service</h1>
        <p className="text-gray-500 mb-2">Effective Date: 01/01/2026</p>

        {/* Welcome */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          Thank you for choosing <strong>5PM Nexus Limited</strong>. These Terms of Service
          ("Terms") govern your use of the 5PM Nexus mobile app, website, and related
          services. By accessing or using our services, you agree to these Terms, our Privacy
          Policy, and any other applicable policies. Please read them carefully.
        </p>

        <div className="space-y-8">
          {sections.map((section, i) => (
            <section key={section.title} className="border-t border-gray-100 pt-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
                {i + 1}. {section.title}
              </h2>

              {section.intro && (
                <p className="text-gray-700 mb-3 leading-relaxed">{section.intro}</p>
              )}

              {section.content && !section.intro && (
                <p className="text-gray-700 mb-3 leading-relaxed">{section.content}</p>
              )}

              {section.items && section.items.length > 0 && (
                <ul className="list-disc list-inside space-y-2 text-gray-700 mb-3 ml-1">
                  {section.items.map((item, j) => (
                    <li key={j} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {section.footer && (
                <p className="text-gray-700 leading-relaxed">{section.footer}</p>
              )}

              {section.contact && (
                <ul className="mt-1 space-y-1 text-gray-700">
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
            </section>
          ))}
        </div>

        {/* Closing acknowledgment */}
        <p className="mt-10 pt-6 border-t border-gray-100 text-gray-500 text-sm leading-relaxed">
          By using our services, you acknowledge that you have read, understood, and agreed to
          these Terms.
        </p>
      </div>
    </div>
  );
}

export default TermsConditions;