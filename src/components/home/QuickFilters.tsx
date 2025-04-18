'use client';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const quickFilters = [
  { 
    name: 'Adopt', 
    icon: <span className="iconify" data-icon="mdi:paw" />, 
    description: 'Find pets needing a forever home',
    color: 'bg-green-100 dark:bg-green-900',
    textColor: 'text-green-800 dark:text-green-100',
    link: '/pets?purpose=adopt'
  },
  { 
    name: 'Buy', 
    icon: <span className="iconify" data-icon="mdi:currency-usd" />, 
    description: 'Purchase from trusted sellers',
    color: 'bg-blue-100 dark:bg-blue-900',
    textColor: 'text-blue-800 dark:text-blue-100',
    link: '/pets?purpose=sell'
  },
  { 
    name: 'Sell', 
    icon: <span className="iconify" data-icon="mdi:heart" />, 
    description: 'List your pet for sale',
    color: 'bg-red-100 dark:bg-red-900',
    textColor: 'text-red-800 dark:text-red-100',
    link: '/add-pet'
  },
  { 
    name: 'Breeding', 
    icon: <span className="iconify" data-icon="mdi:calendar" />, 
    description: 'Connect for breeding services',
    color: 'bg-purple-100 dark:bg-purple-900',
    textColor: 'text-purple-800 dark:text-purple-100',
    link: '/pets?purpose=breed'
  },
];

const QuickFilters = () => (
  <section className="py-12 px-4 bg-secondary/50">
    <div className="container">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 fade-in-up">How Can We Help You Today?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {quickFilters.map((filter, index) => (
          <Link
            key={filter.name}
            href={filter.link}
            className={`${filter.color} ${filter.textColor} p-6 rounded-xl transition-all duration-300 hover:shadow-lg flex flex-col items-center text-center group fade-in-up delay-${index * 100}`}
          >
            <div className="p-3 rounded-full bg-white/20 mb-4 group-hover:scale-110 transition-transform">
              {filter.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{filter.name}</h3>
            <p className="text-sm opacity-90 mb-3">{filter.description}</p>
            <div className="flex items-center text-sm font-medium">
              Learn More <ArrowRight className="h-4 w-4 ml-1" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default QuickFilters;
