import { color, motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Calendar,
  Users,
  Sparkles,
  ArrowRight,
  MapPin,
  Clock,
} from "lucide-react";
import { Spotlight } from "@/components/ui/spotlight";
import { MovingBorderButton } from "@/components/ui/moving-border";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { eventsApi } from "@/lib/api";
import type { Event } from "@/types";
import { formatDateTime } from "@/lib/utils";

export function HomePage() {
  const { isAuthenticated } = useAuth();
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const events = await eventsApi.getAll();
        setFeaturedEvents(events.slice(0, 3));
      } catch (error) {
        console.error("Failed to load events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadEvents();
  }, []);

  return (
    <div className="min-h-screen bg-black/[0.96] antialiased bg-grid-white/[0.02]">
      {/* Hero Section with Spotlight */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Spotlight
          className="-top-40 left-0 md:left-60 md:-top-20"
          fill="white"
        />

        <div className="absolute inset-0 w-full h-full bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20"
            >
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300">
                Welcome to EventHub
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 leading-tight"
            >
              Discover Amazing Events
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Near You
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto"
            >
              Join thousands of people discovering and creating memorable
              events. Connect with your community and make every moment count.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            >
              <Link to={isAuthenticated ? "/events" : "/register"}>
                <MovingBorderButton
                  borderRadius="0.75rem"
                  className="px-8 py-4 text-white font-semibold"
                  containerClassName="h-auto"
                >
                  <div className="flex items-center gap-2">
                    {isAuthenticated ? "Browse Events" : "Get Started"}
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </MovingBorderButton>
              </Link>
              <Link to="/events">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-neutral-700 hover:bg-neutral-800 text-sky-900 font-semibold"
                >
                  Explore Events
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 rounded-full border-2 border-neutral-700 flex items-start justify-center p-2"
          >
            <motion.div className="w-1.5 h-3 bg-neutral-400 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Why Choose EventHub?
            </h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              Everything you need to discover and organize amazing events
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: "Easy Event Creation",
                description:
                  "Create and manage events effortlessly with our intuitive interface.",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: Users,
                title: "Community Driven",
                description:
                  "Connect with like-minded people and build your network.",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: Sparkles,
                title: "Seamless Experience",
                description:
                  "Enjoy a smooth and engaging experience from discovery to attendance.",
                gradient: "from-orange-500 to-yellow-500",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl from-purple-600 to-pink-600" />
                <div className="relative p-8 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events Preview */}
      {!isLoading && featuredEvents.length > 0 && (
        <section className="relative py-20 bg-gradient-to-b from-black to-neutral-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-white mb-4">
                Upcoming Events
              </h2>
              <p className="text-neutral-400 text-lg">
                Don't miss out on these exciting events
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredEvents.map((event, index) => (
                <motion.div
                  key={event.Id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Link to={`/events/${event.Id}`}>
                    <div className="relative p-6 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-purple-500/50 transition-all duration-300">
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative space-y-4">
                        <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">
                          {event.Name}
                        </h3>
                        <p className="text-neutral-400 text-sm line-clamp-2">
                          {event.Description}
                        </p>
                        <div className="space-y-2 text-sm text-neutral-500">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{event.Location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{formatDateTime(event.DateTime)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link to="/events">
                <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                  View All Events
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="relative py-20 bg-neutral-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold text-white">
              Ready to Get Started?
            </h2>
            <p className="text-neutral-400 text-lg">
              Join our community today and start discovering amazing events
            </p>
            <div className="pt-4">
              <Link to={isAuthenticated ? "/events/create" : "/register"}>
                <MovingBorderButton
                  borderRadius="0.75rem"
                  className="px-8 py-4 text-white font-semibold"
                  containerClassName="h-auto"
                >
                  {isAuthenticated ? "Create Your Event" : "Sign Up Now"}
                </MovingBorderButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
