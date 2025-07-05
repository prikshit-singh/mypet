
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Separator } from '@/components/ui/separator';

const PrivacyPage: React.FC = () => {
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose dark:prose-invert max-w-none text-muted-foreground">
            <p className="text-lg mb-6">
              Last Updated: April 14, 2025
            </p>
            
            <p className="mb-6">
              This Privacy Policy describes how  ThePetWala ("we", "our", or "us") collects, uses, and shares your personal information when you use our website, mobile application, or services (collectively, the "Services").
            </p>
            
            <Separator className="my-8" />
            
            <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Information We Collect</h2>
            <p className="mb-4">We collect several types of information from and about users of our Services, including:</p>
            
            <h3 className="text-xl font-medium mb-2 text-foreground">1.1 Personal Information</h3>
            <p className="mb-3">
              When you register for an account, list a pet, or communicate with other users, we collect personal information such as:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Name, email address, phone number, and physical address</li>
              <li>Username and password</li>
              <li>Profile pictures and biographical information</li>
              <li>Payment information (processed by our third-party payment processors)</li>
            </ul>
            
            <h3 className="text-xl font-medium mb-2 text-foreground">1.2 Pet Information</h3>
            <p className="mb-3">
              When you list a pet, we collect information about the pet, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Pet name, breed, age, gender, and photos</li>
              <li>Health information, vaccination records, and behavioral traits</li>
              <li>Adoption, sale, or breeding information</li>
            </ul>
            
            <h3 className="text-xl font-medium mb-2 text-foreground">1.3 Usage Information</h3>
            <p className="mb-3">
              We automatically collect certain information about your use of our Services, including:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>IP address, browser type, device information, and operating system</li>
              <li>Pages visited, features used, and search queries</li>
              <li>Clickstream data and interaction with advertisements</li>
              <li>Time spent on the platform and frequency of use</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4 text-foreground">2. How We Use Your Information</h2>
            <p className="mb-3">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Provide, maintain, and improve our Services</li>
              <li>Process transactions and send related information</li>
              <li>Connect pet owners, buyers, sellers, and breeders</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Send you technical notices, updates, security alerts, and administrative messages</li>
              <li>Communicate with you about products, services, offers, and events</li>
              <li>Monitor and analyze trends, usage, and activities in connection with our Services</li>
              <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
              <li>Personalize your experience on the platform</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4 text-foreground">3. How We Share Your Information</h2>
            <p className="mb-3">
              We may share your personal information in the following circumstances:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>With other users when you list a pet or communicate with them through our platform</li>
              <li>With service providers who perform services on our behalf</li>
              <li>In connection with a business transaction such as a merger, sale of assets, or bankruptcy</li>
              <li>To comply with legal obligations or to protect our rights or the rights of others</li>
              <li>With your consent or at your direction</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Your Choices</h2>
            <p className="mb-3">
              You have certain choices about how we use your personal information:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Account Information: You can update or correct your account information at any time through your account settings</li>
              <li>Marketing Communications: You can opt out of marketing emails by following the unsubscribe instructions in the emails</li>
              <li>Cookies: You can manage your cookie preferences through your browser settings</li>
              <li>Data Access and Deletion: You can request access to your personal information or request that we delete your account by contacting us</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Security</h2>
            <p className="mb-6">
              We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction. However, no method of transmission over the Internet or electronic storage is completely secure, so we cannot guarantee absolute security.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Children's Privacy</h2>
            <p className="mb-6">
              Our Services are not directed to children under the age of 16, and we do not knowingly collect personal information from children under 16. If we learn that we have collected personal information from a child under 16, we will promptly delete that information.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Changes to This Privacy Policy</h2>
            <p className="mb-6">
              We may update this Privacy Policy from time to time. If we make material changes, we will notify you by email or by posting a notice on our website prior to the change becoming effective. We encourage you to review this Privacy Policy periodically.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Contact Us</h2>
            <p className="mb-6">
              If you have any questions about this Privacy Policy, please contact us at privacy@ ThePetWala.com.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPage;
