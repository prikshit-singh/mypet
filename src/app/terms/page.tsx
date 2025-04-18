
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Separator } from '@/components/ui/separator';

const TermsPage: React.FC = () => {
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose dark:prose-invert max-w-none text-muted-foreground">
            <p className="text-lg mb-6">
              Last Updated: April 14, 2025
            </p>
            
            <p className="mb-6">
              Welcome to PawConnect. Please read these Terms of Service ("Terms") carefully as they contain important information about your legal rights, remedies, and obligations. By accessing or using the PawConnect platform, you agree to comply with and be bound by these Terms.
            </p>
            
            <Separator className="my-8" />
            
            <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h2>
            <p className="mb-6">
              By accessing or using PawConnect, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, you may not access or use the PawConnect platform.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Description of Service</h2>
            <p className="mb-6">
              PawConnect provides an online platform that connects pet owners, breeders, shelters, and individuals interested in adopting, buying, selling, or breeding pets. Our services include but are not limited to listing pets for adoption or sale, facilitating communication between parties, and providing educational content about pet care.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-foreground">3. User Accounts</h2>
            <p className="mb-6">
              To access certain features of the platform, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete. You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-foreground">4. User Conduct</h2>
            <p className="mb-6">
              You agree not to use the PawConnect platform to:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Violate any applicable law, regulation, or these Terms</li>
              <li>Impersonate any person or entity</li>
              <li>Engage in any activity that would constitute animal abuse or neglect</li>
              <li>List pets with false information or misrepresent the health, breed, or condition of a pet</li>
              <li>Post content that is defamatory, obscene, or otherwise objectionable</li>
              <li>Introduce viruses, malware, or other malicious code</li>
              <li>Attempt to gain unauthorized access to the platform or other users' accounts</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Pet Listings</h2>
            <p className="mb-6">
              When listing a pet for adoption, sale, or breeding, you agree to:
            </p>
            <ul className="list-disc pl-6 mb-6">
              <li>Provide accurate information about the pet's breed, age, health, temperament, and any known issues</li>
              <li>Upload recent and accurate photos of the pet</li>
              <li>Disclose all relevant information about the pet's history, including any behavioral issues or special needs</li>
              <li>Comply with all applicable laws and regulations regarding the sale, adoption, or breeding of animals</li>
              <li>Ensure the humane treatment of all animals at all times</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Limitation of Liability</h2>
            <p className="mb-6">
              PawConnect is not responsible for the actions, content, information, or data of third parties, and you release us from any claims and damages arising out of or in any way connected with any dispute you may have with other users of the platform or third parties.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Disclaimer of Warranties</h2>
            <p className="mb-6">
              The PawConnect platform is provided "as is" without any warranty of any kind. We disclaim all warranties, whether express or implied, including the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Changes to Terms</h2>
            <p className="mb-6">
              We reserve the right to modify these Terms at any time. We will provide notice of significant changes by posting the updated Terms on the platform and updating the "Last Updated" date. Your continued use of the platform after such changes constitutes your acceptance of the new Terms.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-foreground">9. Termination</h2>
            <p className="mb-6">
              We may terminate or suspend your access to the platform at any time, without prior notice or liability, for any reason, including if you breach these Terms. All provisions of these Terms which by their nature should survive termination shall survive termination, including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-foreground">10. Contact Information</h2>
            <p className="mb-6">
              If you have any questions about these Terms, please contact us at legal@pawconnect.com.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsPage;
