'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const CTA = () => (
  <section className="py-16 px-4 bg-primary text-primary-foreground">
    <div className="container text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 fade-in-up">Ready to Find Your Perfect Pet?</h2>
      <p className="max-w-2xl mx-auto mb-8 fade-in-up delay-200">
        Whether you're looking to adopt, buy, sell, or breed, PawConnect has everything you need to connect with pets and pet lovers.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in-up delay-400">
        <Button asChild size="lg" variant="secondary">
          <Link href="/pets">Browse Pets</Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="border-primary-foreground">
          <Link href="/login">Sign Up Now</Link>
        </Button>
      </div>
    </div>
  </section>
);

export default CTA;
