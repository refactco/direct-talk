export default function PrivacyPage() {
  return (
    <div className="container mx-auto max-w-2xl p-6">
      <h1 className="mb-8 text-4xl font-bold">Privacy Policy</h1>

      <div className="space-y-8">
        <p className="mb-4">
          Privacy notice discloses the privacy practices for{' '}
          <a
            href="https://www.refact.co"
            className="text-primary hover:underline"
          >
            askauthor.com
          </a>
          . This privacy notice applies solely to information collected by this
          website. It will notify you of the following:
        </p>

        <ul className="list-disc pl-6 mb-4">
          <li>
            What personally identifiable information we collect from you through
            the website, how we use it, and with whom we may share it.
          </li>
          <li>
            What choices are available to you regarding the use of your data.
          </li>
          <li>
            The security procedures that are in place to protect the misuse of
            your information.
          </li>
          <li>How you can correct any inaccuracies in the information.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2">
          Information Collection, Use, and Sharing
        </h2>
        <p className="mb-4">
          We are the sole owners of the information collected on this site. We
          only have access to/collect information that you voluntarily give us
          via email or other direct contacts from you. We will not sell or rent
          this information to anyone.
        </p>
        <p className="mb-4">
          We will use your information to respond to you regarding the reason
          you contacted us. We will not share your information with any third
          party outside of our organization, other than as necessary to fulfill
          your request, e.g., to mail you an invoice.
        </p>
        <p className="mb-4">
          Unless you ask us not to, we may contact you via email in the future
          to tell you about specials, new products or services, or changes to
          this privacy policy.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">
          Your Access to and Control Over Information
        </h2>
        <p className="mb-4">
          You may opt-out of any future contacts from us at any time. You can do
          the following at any time by contacting us via the email address or
          phone number given on our website:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>See what data we have about you, if any.</li>
          <li>Change/correct any data we have about you.</li>
          <li>Have us delete any data we have about you.</li>
          <li>Express any concern you have about our use of your data.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Security</h2>
        <p className="mb-4">
          We take precautions to protect your information. When you submit
          sensitive information via the website, your information is protected
          both online and offline.
        </p>
        <p className="mb-4">
          Wherever we collect sensitive information (such as credit card data),
          that information is encrypted and securely transmitted to us. You can
          verify this by looking for a closed lock icon at the bottom of your
          web browser, or looking for “https” at the beginning of the address of
          the web page. While we use encryption to protect sensitive information
          transmitted online, we also protect your information offline.
        </p>
        <p className="mb-4">
          Only employees who need the information to perform a specific job (for
          example, billing or customer service) are granted access to personally
          identifiable information. We keep the computers/servers in which we
          store personally identifiable information in a secure environment.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">Acknowledgment</h2>
        <p className="mb-4 font-semibold">
          BY ACCESSING OR USING THE SITE, YOU ACKNOWLEDGE THAT YOU HAVE READ,
          UNDERSTAND, AND CONSENT TO OUR PRIVACY PRACTICES AND TO THE USES AND
          DISCLOSURES OF INFORMATION THAT WE COLLECT ABOUT YOU, AND YOU AGREE TO
          BE BOUND BY THE TERMS OF USE APPLICABLE TO YOU.
        </p>
        <p className="mb-4">
          If you feel that we are not abiding by this privacy policy, you should
          contact us immediately via email at{' '}
          <a
            href="mailto:info@refact.co"
            className="text-primary hover:underline"
          >
            hi@refact.co
          </a>
          .
        </p>
      </div>
    </div>
  );
}
