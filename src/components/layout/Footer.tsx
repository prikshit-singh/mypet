
import React from 'react';
import Link from 'next/link';
import { 
  Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin 
} from 'lucide-react';
import Image from 'next/image';

const Footer: React.FC = () => {
  return (
    <footer className="bg-card border-t">
      <div className="container py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-purple-600"
              >
                <path d="M10 16c1-1 3-1 4 0" />
                <path d="M8 11.973c2 1 6 1 8 0" />
                <path d="M12 2C6.5 2 2 6.5 2 12a10 10 0 0 0 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
              </svg>
              <span className="text-xl font-bold text-purple-600"> ThePetWala</span> */}
              <Image src="/logo.png" height={200} width={200} alt='the pet wala' />
            </div>
            <p className="text-sm text-muted-foreground">
              The Pet Wala is your all-in-one pet marketplace. Register pets for sale, adoption, or breeding, and shop pet accessories all in one trusted platform.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/pets" className="text-sm text-muted-foreground hover:text-primary">
                  Find Pets
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Pet Services
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/pets?purpose=adopt" className="text-sm text-muted-foreground hover:text-primary">
                  Pet Adoption
                </Link>
              </li>
              <li>
                <Link href="/pets?purpose=sell" className="text-sm text-muted-foreground hover:text-primary">
                  Buy a Pet
                </Link>
              </li>
              <li>
                <Link href="/add-pet" className="text-sm text-muted-foreground hover:text-primary">
                  Sell Your Pet
                </Link>
              </li>
              <li>
                <Link href="/add-pet" className="text-sm text-muted-foreground hover:text-primary">
                  Pet Breeding
                </Link>
              </li>
              <li>
                <Link href="/add-pet" className="text-sm text-muted-foreground hover:text-primary">
                  Pet Care Advice
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Contact Us
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  123 Pet Street, Animal City
                </a>
              </li>
              <li>
                <a href="tel:+11234567890" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  +1 (123) 456-7890
                </a>
              </li>
              <li>
                <a href="mailto:info@ ThePetWala.com" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  info@ ThePetWala.com
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()}  ThePetWala. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0 flex space-x-6">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
