import React from 'react';

const TermsAndConditions = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white p-6 sm:p-8 lg:p-12">
            <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-xl p-6 sm:p-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-yellow-400 mb-6 text-center">Terms and Conditions</h1>

                <p className="mb-4 text-gray-300">
                    Welcome to De Elite Movies! These terms and conditions ("Terms") outline the rules and regulations for the use of De Elite Movies' website and services (the "Service").
                </p>
                <p className="mb-4 text-gray-300">
                    By accessing this website, we assume you accept these terms and conditions. Do not continue to use De Elite Movies if you do not agree to take all of the terms and conditions stated on this page.
                </p>

                <h2 className="text-2xl font-semibold text-yellow-300 mt-8 mb-4">1. Intellectual Property Rights</h2>
                <p className="mb-4 text-gray-300">
                    Unless otherwise stated, De Elite Movies and/or its licensors own the intellectual property rights for all material on De Elite Movies. All intellectual property rights are reserved. You may access this from De Elite Movies for your own personal use subjected to restrictions set in these terms and conditions.
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300">
                    <li>Republish material from De Elite Movies</li>
                    <li>Sell, rent or sub-license material from De Elite Movies</li>
                    <li>Reproduce, duplicate or copy material from De Elite Movies</li>
                    <li>Redistribute content from De Elite Movies</li>
                </ul>

                <h2 className="text-2xl font-semibold text-yellow-300 mt-8 mb-4">2. User Accounts</h2>
                <p className="mb-4 text-gray-300">
                    When you create an account with us, you must provide us with information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
                </p>

                <h2 className="text-2xl font-semibold text-yellow-300 mt-8 mb-4">3. Content</h2>
                <p className="mb-4 text-gray-300">
                    Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.
                </p>
                <p className="mb-4 text-gray-300">
                    By posting Content to the Service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service. You retain any and all of your rights to any Content you submit, post or display on or through the Service and you are responsible for protecting those rights.
                </p>

                <h2 className="text-2xl font-semibold text-yellow-300 mt-8 mb-4">4. Prohibited Uses</h2>
                <p className="mb-4 text-gray-300">
                    You may use the Service only for lawful purposes and in accordance with Terms. You agree not to use the Service:
                </p>
                <ul className="list-disc list-inside space-y-2 mb-4 text-gray-300">
                    <li>In any way that violates any applicable national or international law or regulation.</li>
                    <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way.</li>
                    <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent, including any "junk mail", "chain letter," "spam," or any other similar solicitation.</li>
                    <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity.</li>
                </ul>

                <h2 className="text-2xl font-semibold text-yellow-300 mt-8 mb-4">5. Termination</h2>
                <p className="mb-4 text-gray-300">
                    We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the Service will immediately cease.
                </p>

                <h2 className="text-2xl font-semibold text-yellow-300 mt-8 mb-4">6. Governing Law</h2>
                <p className="mb-4 text-gray-300">
                    These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.
                </p>

                <h2 className="text-2xl font-semibold text-yellow-300 mt-8 mb-4">7. Changes to Terms</h2>
                <p className="mb-4 text-gray-300">
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                </p>

                <h2 className="text-2xl font-semibold text-yellow-300 mt-8 mb-4">8. Contact Us</h2>
                <p className="text-gray-300">
                    If you have any questions about these Terms, please contact us at: <a href="mailto:support@deelitewatch.com" className="text-yellow-400 hover:underline">support@deelitewatch.com</a>
                </p>

                <p className="text-sm text-gray-500 mt-8 text-center">
                    Last updated: June 27, 2025
                </p>
            </div>
        </div>
    );
};

export default TermsAndConditions;
