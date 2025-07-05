'use client'
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Separator } from '@/components/ui/separator';

const CookiePage: React.FC = () => {
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Cookie Policy</h1>
          
          <div className="prose dark:prose-invert max-w-none text-muted-foreground">
            <p className="text-lg mb-6">
              Last Updated: April 14, 2025
            </p>
            
            <p className="mb-6">
              This Cookie Policy explains how  ThePetWala ("we", "our", or "us") uses cookies and similar technologies when you visit our website or use our services. This policy should be read alongside our Privacy Policy, which explains how we use your personal information.
            </p>
            
            <Separator className="my-8" />
            
            <h2 className="text-2xl font-semibold mb-4 text-foreground">1. What Are Cookies?</h2>
            <p className="mb-6">
              Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and give website owners information about how the site is used. Cookies cannot harm your device or access other information on your device.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Types of Cookies We Use</h2>
            <p className="mb-4">
              We use several types of cookies for different purposes:
            </p>
            
            <h3 className="text-xl font-medium mb-2 text-foreground">2.1 Essential Cookies</h3>
            <p className="mb-3">
              These cookies are necessary for the website to function properly. They enable basic functions like page navigation, secure areas access, and enable the provision of our services. The website cannot function properly without these cookies.
            </p>
            
            <h3 className="text-xl font-medium mb-2 text-foreground">2.2 Performance Cookies</h3>
            <p className="mb-3">
              These cookies collect information about how visitors use our website, such as which pages visitors go to most often and if they receive error messages. These cookies don't collect information that identifies a visitor. All information collected by these cookies is aggregated and anonymous. They are only used to improve how the website works.
            </p>
            
            <h3 className="text-xl font-medium mb-2 text-foreground">2.3 Functionality Cookies</h3>
            <p className="mb-3">
              These cookies allow the website to remember choices you make (such as your username, language, or the region you are in) and provide enhanced, more personal features. They may also be used to provide services you have asked for, such as watching a video or commenting on a blog.
            </p>
            
            <h3 className="text-xl font-medium mb-2 text-foreground">2.4 Targeting/Advertising Cookies</h3>
            <p className="mb-6">
              These cookies are used to deliver advertisements more relevant to you and your interests. They are also used to limit the number of times you see an advertisement as well as help measure the effectiveness of the advertising campaign. They are usually placed by advertising networks with our permission. They remember that you have visited a website and this information is shared with other organizations such as advertisers.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Third-Party Cookies</h2>
            <p className="mb-6">
              Some cookies are placed by third parties on our website. These third parties may include analytics providers (like Google Analytics), advertising networks, and social media platforms. These third parties may use cookies, web beacons, and similar technologies to collect information about your use of our website and other websites. This information may be used to, among other things, analyze and track data, determine the popularity of certain content, and better understand your online activity.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-foreground">4. How to Manage Cookies</h2>
            <p className="mb-4">
              Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set, visit <a href="https://www.aboutcookies.org" className="text-primary underline" target="_blank" rel="noopener noreferrer">www.aboutcookies.org</a> or <a href="https://www.allaboutcookies.org" className="text-primary underline" target="_blank" rel="noopener noreferrer">www.allaboutcookies.org</a>.
            </p>
            
            <p className="mb-4">
              You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.
            </p>
            
            <p className="mb-6">
              To opt out of being tracked by Google Analytics across all websites, visit <a href="https://tools.google.com/dlpage/gaoptout" className="text-primary underline" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a>.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Cookie Preferences</h2>
            <p className="mb-6">
              When you first visit our website, we will ask for your consent to use non-essential cookies. You can change your cookie preferences at any time by clicking on the "Cookie Settings" link in the footer of our website.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Changes to This Cookie Policy</h2>
            <p className="mb-6">
              We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business practices. Any changes will become effective when we post the revised policy on our website. We encourage you to periodically review this page for the latest information on our cookie practices.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Contact Us</h2>
            <p className="mb-6">
              If you have any questions about our use of cookies, please contact us at privacy@ ThePetWala.com.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CookiePage;
