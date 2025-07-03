import ThreeScene from "@/components/ThreeScene";
import { Button } from "@/components/ui/button";
import { Bot, Users, Award, Globe, ArrowRight, Twitter, Linkedin, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import riteshImg from "../assets/ritesh.jpeg";
import vishalImg from "../assets/vishal.jpeg"

const About = () => {
  const teamMembers = [
    {
      name: "Ritesh Agarwal",
      role: "CEO & Founder",
      image: riteshImg,
      bio: "Former AI Research Lead at Google with 10+ years experience in machine learning and natural language processing.",
      links: { twitter: "#", linkedin: "#", email: "#" }
    },
    {
      name: "Aman Agarwal",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      bio: "Former Lead Engineer at OpenAI with expertise in large language models and conversational AI systems.",
      links: { twitter: "#", linkedin: "#", email: "#" }
    },
    {
      name: "Vishal Singhal",
      role: "Head of Product",
      image: vishalImg,
      bio: "Product visionary with experience at Microsoft and Amazon, focused on making AI accessible and useful.",
      links: { twitter: "#", linkedin: "#", email: "#" }
    },
    {
      name: "Vinay Naugain",
      role: "VP of Sales",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=256&q=80",
      bio: "20+ years in enterprise sales, previously led global sales teams at Salesforce and Oracle.",
      links: { twitter: "#", linkedin: "#", email: "#" }
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 hero-gradient">
        <ThreeScene />
        <div className="container mx-auto px-4 z-10 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Story
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              We're on a mission to transform customer interactions through innovative AI solutions that feel human.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white dark:bg-ai-charcoal">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                At AI UmbrellaX, we believe that artificial intelligence should enhance human experiences, not replace them. Our mission is to create AI solutions that bridge the gap between technological efficiency and human connection.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Founded in 2019 by a team of AI researchers and customer experience experts, we set out to solve one of the biggest challenges in business: providing consistent, high-quality customer support at scale without losing the personal touch.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Today, our AI-powered solutions help hundreds of businesses across the globe deliver exceptional customer experiences while reducing operational costs and improving efficiency.
              </p>
            </div>
            <div className="order-1 md:order-2 bg-gradient-to-br from-ai-purple/10 to-ai-blue/10 p-8 rounded-2xl">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <Bot size={40} className="text-ai-purple mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Pioneering AI technologies that push the boundaries of what's possible.
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <Users size={40} className="text-ai-blue mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Humanity</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Creating AI that enhances human connections, not replaces them.
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <Award size={40} className="text-ai-deep-purple mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Excellence</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Committed to delivering the highest quality in everything we do.
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                  <Globe size={40} className="text-ai-purple mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Impact</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Making a positive difference for businesses and their customers worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We're a diverse group of AI experts, engineers, and business leaders passionate about creating the future of customer experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md transition-transform hover:scale-[1.02]">
                <div className="aspect-square overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-ai-purple dark:text-ai-light-purple mb-3">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                    {member.bio}
                  </p>
                  <div className="flex space-x-3">
                    <a href={member.links.twitter} className="text-gray-400 hover:text-ai-purple">
                      <Twitter size={18} />
                    </a>
                    <a href={member.links.linkedin} className="text-gray-400 hover:text-ai-purple">
                      <Linkedin size={18} />
                    </a>
                    <a href={member.links.email} className="text-gray-400 hover:text-ai-purple">
                      <Mail size={18} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We're backed by a team of 50+ AI engineers, customer success specialists, and industry experts.
            </p>
            <Button variant="outline" className="border-slate-300 dark:border-slate-700 hover:border-ai-purple dark:hover:border-ai-purple">
              View All Team Members
            </Button>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white dark:bg-ai-charcoal">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              From startup to industry leader, see how we've grown and evolved over the years.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col space-y-12">
              <div className="flex">
                <div className="flex flex-col items-center mr-6">
                  <div className="rounded-full bg-ai-purple text-white h-10 w-10 flex items-center justify-center">
                    <span className="font-semibold">1</span>
                  </div>
                  <div className="h-full w-0.5 bg-ai-purple/30 mt-2"></div>
                </div>
                <div className="pt-1.5">
                  <h3 className="text-xl font-semibold mb-2">2019 - Founded</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    AI UmbrellaX was founded by Alexandra Chen and Marcus Reynolds with the vision of creating AI that enhances human interactions rather than replacing them.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Initial seed funding of $2M raised to develop the first prototype of our LLM chatbot.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex flex-col items-center mr-6">
                  <div className="rounded-full bg-ai-purple text-white h-10 w-10 flex items-center justify-center">
                    <span className="font-semibold">2</span>
                  </div>
                  <div className="h-full w-0.5 bg-ai-purple/30 mt-2"></div>
                </div>
                <div className="pt-1.5">
                  <h3 className="text-xl font-semibold mb-2">2020 - First Product Launch</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Launched our first product: a basic chatbot solution for e-commerce businesses. Signed our first 10 clients.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Expanded the team to 15 employees, adding key expertise in natural language processing and customer experience.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex flex-col items-center mr-6">
                  <div className="rounded-full bg-ai-purple text-white h-10 w-10 flex items-center justify-center">
                    <span className="font-semibold">3</span>
                  </div>
                  <div className="h-full w-0.5 bg-ai-purple/30 mt-2"></div>
                </div>
                <div className="pt-1.5">
                  <h3 className="text-xl font-semibold mb-2">2021 - Series A Funding</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Secured $15M in Series A funding to expand product offerings and scale operations.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Introduced voice AI capabilities and messaging platform integrations. Client base grew to 50+ companies.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex flex-col items-center mr-6">
                  <div className="rounded-full bg-ai-purple text-white h-10 w-10 flex items-center justify-center">
                    <span className="font-semibold">4</span>
                  </div>
                  <div className="h-full w-0.5 bg-ai-purple/30 mt-2"></div>
                </div>
                <div className="pt-1.5">
                  <h3 className="text-xl font-semibold mb-2">2022 - Global Expansion</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Expanded to Europe and Asia, opening offices in London and Singapore. Launched multi-language support for 20+ languages.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Team grew to 100+ employees worldwide. Named one of the "Top 50 AI Companies to Watch" by Forbes.
                  </p>
                </div>
              </div>

              <div className="flex">
                <div className="flex flex-col items-center mr-6">
                  <div className="rounded-full bg-ai-purple text-white h-10 w-10 flex items-center justify-center">
                    <span className="font-semibold">5</span>
                  </div>
                </div>
                <div className="pt-1.5">
                  <h3 className="text-xl font-semibold mb-2">2023 - Present</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Series B funding of $50M to accelerate growth and innovation. Launched our Enterprise AI platform.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Currently serving 500+ businesses globally, with a team of 150+ AI specialists, engineers, and customer success experts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-ai-purple/20 to-ai-blue/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Join Us on Our Mission
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            We're always looking for talented individuals passionate about AI and customer experience to join our team.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button
              className="bg-ai-purple hover:bg-ai-deep-purple text-white"
              asChild
            >
              <Link to="/contact">
                View Open Positions <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
            <Button
              variant="outline"
              className="border-slate-300 dark:border-slate-700 hover:border-ai-purple dark:hover:border-ai-purple"
              asChild
            >
              <Link to="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
