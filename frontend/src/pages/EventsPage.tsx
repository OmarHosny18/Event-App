import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, Loader2, AlertCircle } from "lucide-react";
import { eventsApi } from "@/lib/api";
import type { Event } from "@/types";
import { EventCard } from "@/components/events/EventCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(
        (event) =>
          event.Name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.Description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.Location.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  }, [searchQuery, events]);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const data = await eventsApi.getAll();
      console.log("✅ Loaded events:", data);
      setEvents(data);
      setFilteredEvents(data);
    } catch (err: any) {
      // Show more detailed error
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to load events. Please try again later.";
      setError(errorMessage);
      console.error("❌ Failed to load events:", {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-4">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Discover Events</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Upcoming Events
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Find and join amazing events happening near you
          </p>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-12"
        >
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <Input
                type="text"
                placeholder="Search events by name, description, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500 focus:border-purple-500 rounded-xl text-base"
              />
            </div>
          </div>
        </motion.div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
            <p className="text-neutral-400">Loading events...</p>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto"
          >
            <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/50 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-400 mb-2">
                Error Loading Events
              </h3>
              <p className="text-neutral-400 mb-4">{error}</p>
              <Button
                onClick={loadEvents}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                Try Again
              </Button>
            </div>
          </motion.div>
        )}

        {/* Events Grid */}
        {!isLoading && !error && (
          <>
            {filteredEvents.length > 0 ? (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="mb-6"
                >
                  <p className="text-neutral-400 text-sm">
                    Showing{" "}
                    <span className="text-white font-semibold">
                      {filteredEvents.length}
                    </span>{" "}
                    event{filteredEvents.length !== 1 ? "s" : ""}
                  </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredEvents.map((event, index) => (
                    <EventCard key={event.Id} event={event} index={index} />
                  ))}
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-800 mb-4">
                  <Search className="w-8 h-8 text-neutral-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No events found
                </h3>
                <p className="text-neutral-400 mb-6">
                  {searchQuery
                    ? "Try adjusting your search to find what you're looking for."
                    : "There are no events available at the moment."}
                </p>
                {searchQuery && (
                  <Button
                    onClick={() => setSearchQuery("")}
                    variant="outline"
                    className="border-neutral-700 text-white hover:bg-neutral-800"
                  >
                    Clear Search
                  </Button>
                )}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
