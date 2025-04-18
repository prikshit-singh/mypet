
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Separator } from '@/components/ui/separator';

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">About PawConnect</h1>
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg mb-6 text-muted-foreground">
              PawConnect is the premier platform for connecting pets with loving homes. Whether you're looking to adopt, buy, sell, or breed, we've got you covered.
            </p>
            
            <Separator className="my-8" />
            
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="mb-6">
              At PawConnect, our mission is to create happy matches between pets and their perfect humans. We believe every pet deserves a loving home, and every pet lover deserves to find their ideal companion.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="mb-6">
              Founded in 2023 by a group of passionate pet lovers, PawConnect was born out of frustration with the fragmented pet marketplace. We wanted to create a single platform where adoption, sales, and breeding services could all exist in harmony, with the welfare of animals always at the center.
            </p>
            
            <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
            <ul className="space-y-2 mb-6 list-disc pl-6">
              <li><strong>Animal Welfare</strong> - We prioritize the well-being of all animals on our platform.</li>
              <li><strong>Community</strong> - We believe in building a supportive community of pet lovers.</li>
              <li><strong>Transparency</strong> - We promote honest and open communication between all parties.</li>
              <li><strong>Inclusivity</strong> - We welcome all kinds of pets and pet lovers on our platform.</li>
              <li><strong>Innovation</strong> - We continuously improve our services to better serve pets and their humans.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
            <p className="mb-6">
              Our dedicated team comprises animal experts, technology enthusiasts, and business professionals who share a love for pets. Together, we work tirelessly to make PawConnect the best platform for all your pet-related needs.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              <div className="bg-card p-4 rounded-lg text-center">
                <img src="https://i.pravatar.cc/150?img=1" alt="Team Member" className="w-32 h-32 rounded-full mx-auto mb-4" />
                <h3 className="font-medium">Sarah Johnson</h3>
                <p className="text-sm text-muted-foreground">CEO & Founder</p>
              </div>
              <div className="bg-card p-4 rounded-lg text-center">
                <img src="https://i.pravatar.cc/150?img=2" alt="Team Member" className="w-32 h-32 rounded-full mx-auto mb-4" />
                <h3 className="font-medium">David Miller</h3>
                <p className="text-sm text-muted-foreground">CTO</p>
              </div>
              <div className="bg-card p-4 rounded-lg text-center">
                <img src="https://i.pravatar.cc/150?img=3" alt="Team Member" className="w-32 h-32 rounded-full mx-auto mb-4" />
                <h3 className="font-medium">Emma Thompson</h3>
                <p className="text-sm text-muted-foreground">Head of Animal Welfare</p>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
            <p className="mb-6">
              Whether you're a pet owner, breeder, or someone looking to add a furry friend to your family, we invite you to join our growing community. Together, we can make the world a better place for pets and humans alike.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
