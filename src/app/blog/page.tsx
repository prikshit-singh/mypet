'use client'
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

const blogPosts = [
  {
    id: 1,
    title: "How to Choose the Right Pet for Your Lifestyle",
    excerpt: "Finding the perfect pet companion depends on various factors including your living situation, activity level, and time commitment. This guide will help you make the right choice.",
    coverImage: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Pet Adoption",
    date: "April 10, 2025",
    readTime: "5 min read",
    author: {
      name: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?img=10"
    }
  },
  {
    id: 2,
    title: "Essential Vaccinations for New Puppies",
    excerpt: "A complete guide to puppy vaccinations including what shots they need, when they need them, and why they're so important for your puppy's health.",
    coverImage: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Pet Care",
    date: "April 8, 2025",
    readTime: "7 min read",
    author: {
      name: "Dr. Emma Thompson",
      avatar: "https://i.pravatar.cc/150?img=3"
    }
  },
  {
    id: 3,
    title: "Understanding Cat Behavior: What Your Cat is Trying to Tell You",
    excerpt: "Cats communicate in subtle ways. Learn to decode your cat's body language, vocalizations, and behaviors to better understand their needs and emotions.",
    coverImage: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Cat Behavior",
    date: "April 5, 2025",
    readTime: "6 min read",
    author: {
      name: "Mark Wilson",
      avatar: "https://i.pravatar.cc/150?img=5"
    }
  },
  {
    id: 4,
    title: "Breeding Basics: What to Know Before Getting Started",
    excerpt: "Responsible pet breeding requires knowledge, dedication, and ethical considerations. This article covers the essentials for those considering breeding their pets.",
    coverImage: "https://images.unsplash.com/photo-1542082873-c1d89ae3a10a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Pet Breeding",
    date: "April 2, 2025",
    readTime: "8 min read",
    author: {
      name: "Jessica Brown",
      avatar: "https://i.pravatar.cc/150?img=6"
    }
  },
  {
    id: 5,
    title: "Creating a Safe Home Environment for Your New Pet",
    excerpt: "Before bringing a new pet home, it's important to pet-proof your living space. Follow these tips to create a safe and welcoming environment for your new family member.",
    coverImage: "https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Pet Care",
    date: "March 30, 2025",
    readTime: "5 min read",
    author: {
      name: "Michael Chen",
      avatar: "https://i.pravatar.cc/150?img=7"
    }
  },
  {
    id: 6,
    title: "The Ethics of Pet Buying vs. Adoption",
    excerpt: "Exploring the ethical considerations of buying pets from breeders versus adopting from shelters, and how to make responsible choices whatever path you choose.",
    coverImage: "https://images.unsplash.com/photo-1415369629372-26f2fe60c467?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: "Pet Adoption",
    date: "March 27, 2025",
    readTime: "9 min read",
    author: {
      name: "Rachel Green",
      avatar: "https://i.pravatar.cc/150?img=8"
    }
  }
];

const categories = [
  "All",
  "Pet Adoption",
  "Pet Care",
  "Dog Training",
  "Cat Behavior",
  "Pet Breeding",
  "Pet Nutrition",
  "Pet Health"
];

const BlogPage: React.FC = () => {
  return (
    <Layout>
      <div className="container py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold">Blog</h1>
              <p className="text-muted-foreground mt-2">Latest articles, tips and resources for pet lovers</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <Badge key={index} variant={index === 0 ? "default" : "outline"} className="cursor-pointer">
                  {category}
                </Badge>
              ))}
            </div>
          </div>
          
          <Separator className="my-8" />
          
          {/* Featured Article */}
          <div className="mb-12">
            <div className="relative rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10" />
              <img 
                src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80" 
                alt="Featured article" 
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20 text-white">
                <Badge className="mb-4">Featured</Badge>
                <h2 className="text-3xl font-bold mb-3">10 Signs Your Pet is Happy and Healthy</h2>
                <p className="mb-4 max-w-3xl">Understanding your pet's wellbeing is crucial for being a responsible pet owner. Learn the key indicators that your furry friend is thriving under your care.</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <img src="https://i.pravatar.cc/150?img=4" alt="Author" className="w-10 h-10 rounded-full mr-3" />
                    <div>
                      <p className="font-medium">Dr. James Miller</p>
                      <p className="text-sm opacity-75">April 14, 2025 · 10 min read</p>
                    </div>
                  </div>
                  <Button variant="secondary" size="sm">Read Article</Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Article Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map(post => (
              <div key={post.id} className="flex flex-col rounded-lg overflow-hidden bg-card border">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={post.coverImage} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <Badge variant="outline" className="self-start mb-2">{post.category}</Badge>
                  <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4 flex-grow">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <img src={post.author.avatar} alt={post.author.name} className="w-8 h-8 rounded-full mr-2" />
                      <span className="text-xs text-muted-foreground">{post.date}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{post.readTime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Button variant="outline">Load More Articles</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default BlogPage;
