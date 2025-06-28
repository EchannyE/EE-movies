import React from 'react';

const Privacy = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 sm:p-8 lg:p-12">
            <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-6 text-center">Privacy Policy</h1>

                <p className="mb-4 text-gray-300">
                    This Privacy Policy describes how De Elite Movies ("we," "us," or "our") collects, uses, and discloses your personal information when you use our website and services (the "Service").
                </p>

                <h2 className="text-2xl font-semibold text-yellow-300 mt-8 mb-4">1. Information We Collect</h2>
                <p className="mb-4 text-gray-300">
                    We collect various types of information in connection with the Service, including:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300">
                    <li><strong className="text-white">Personal Information:</strong> When you register for an account, we may collect your username, email address, and password. If you choose to provide it, we may also collect your real name, bio, and avatar URL.</li>
                    <li><strong className="text-white">Usage Data:</strong> We automatically collect information about your interaction with the Service, such as the pages you visit, the movies you view, your watchlist and liked movies, reviews you post, and the time and date of your visits.</li>
                    <li><strong className="text-white">Device Information:</strong> We may collect information about the device you use to access the Service, including IP address, browser type, operating system, and unique device identifiers.</li>
                </ul>

                <h2 className="text-2xl font-semibold text-yellow-300 mt-8 mb-4">2. How We Use Your Information</h2>
                <p className="mb-4 text-gray-300">
                    We use the information we collect for various purposes, including:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300">
                    <li>To provide and maintain our Service.</li>
                    <li>To manage your account and provide you with access to its features.</li>
                    <li>To personalize your experience and provide movie recommendations.</li>
                    <li>To analyze and improve the Service, including monitoring usage patterns.</li>
                    <li>To communicate with you, including sending updates, security alerts, and support messages.</li>
                    <li>To detect, prevent, and address technical issues or fraudulent activities.</li>
                </ul>

                <h2 className="text-2xl font-semibold text-yellow-300 mt-8 mb-4">3. Sharing Your Information</h2>
                <p className="mb-4 text-gray-300">
                    We may share your information in the following situations:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300">
                    <li><strong className="text-white">With Other Users:</strong> Your username, avatar, and public activities (like reviews and follower/following lists) may be visible to other users of the Service.</li>
                    <li><strong className="text-white">For Business Transfers:</strong> In connection with any merger, sale of company assets, financing, or acquisition of all or a portion of our business by another company.</li>
                    <li><strong className="text-white">With Service Providers:</strong> We may share your information with third-party service providers who perform services on our behalf (e.g., hosting, analytics).</li>
                    <li><strong className="text-white">For Legal Reasons:</strong> When required by law or in response to valid requests by public authorities.</li>
                </ul>

                <h2 className="text-2xl font-semibold text-yellow-300 mt-8 mb-4">4. Your Data Protection Rights</h2>
                <p className="mb-4 text-gray-300">
                    Depending on your location, you may have certain rights regarding your personal information, including the right to access, update, or delete your information.
                </p>

                <h2 className="text-2xl font-semibold text-yellow-300 mt-8 mb-4">5. Security of Your Information</h2>
                <p className="mb-4 text-gray-300">
                    We implement reasonable security measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the Internet or electronic storage is 100% secure.
                </p>

                <h2 className="text-2xl font-semibold text-yellow-300 mt-8 mb-4">6. Changes to This Privacy Policy</h2>
                <p className="mb-4 text-gray-300">
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
                </p>

                <h2 className="text-2xl font-semibold text-yellow-300 mt-8 mb-4">7. Contact Us</h2>
                <p className="text-gray-300">
                    If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:support@deelitewatch.com" className="text-yellow-400 hover:underline">support@deelitewatch.com</a>
                </p>

                <p className="text-sm text-gray-500 mt-8 text-center">
                    Last updated: June 27, 2025
                </p>
            </div>
        </div>
    );
};

export default Privacy;
