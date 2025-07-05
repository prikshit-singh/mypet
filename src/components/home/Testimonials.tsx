'use client';

const testimonials = [
  {
    quote: " ThePetWala helped me find my perfect furry companion.",
    author: "Sarah Johnson",
    image: "https://i.pravatar.cc/150?img=10"
  },
  {
    quote: "As a breeder, I've connected with wonderful pet owners.",
    author: "David Miller",
    image: "https://i.pravatar.cc/150?img=11"
  },
  {
    quote: "Our shelter placed dozens of animals in loving homes.",
    author: "Happy Paws Shelter",
    image: "https://i.pravatar.cc/150?img=12"
  }
];

const Testimonials = () => (
  <section className="py-12 px-4">
    <div className="container">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 fade-in-up">What Our Users Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <div key={i} className={`bg-card p-6 rounded-xl fade-in-up delay-${i * 200}`}>
            <p className="mb-4 text-muted-foreground">{t.quote}</p>
            <div className="flex items-center">
              <img src={t.image} alt={t.author} className="h-10 w-10 rounded-full mr-3" />
              <span className="font-medium">{t.author}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
