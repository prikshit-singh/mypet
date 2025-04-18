'use client';
import { Search, Heart, PawPrint } from 'lucide-react';

const HowItWorks = () => (
  <section className="py-12 px-4 bg-secondary/50">
    <div className="container">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 fade-in-up">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: <Search className="h-8 w-8" />, title: 'Browse', desc: 'Search through thousands of pets...' },
          { icon: <Heart className="h-8 w-8" />, title: 'Connect', desc: 'Message owners directly...' },
          { icon: <PawPrint className="h-8 w-8" />, title: 'Adopt or Buy', desc: 'Complete the process safely...' },
        ].map((item, index) => (
          <div key={index} className={`bg-card rounded-xl p-6 text-center flex flex-col items-center fade-in-up delay-${index * 200}`}>
            <div className="bg-primary/10 text-primary rounded-full w-16 h-16 flex items-center justify-center mb-4">
              {item.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
