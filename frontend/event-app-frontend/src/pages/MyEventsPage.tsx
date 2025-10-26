import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Loader2, AlertCircle, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { attendeesApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { Event } from "@/types";
import { EventCard } from "@/components/events/EventCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function MyEventsPage() {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    console.log("Current user:", user);
    console.log("User Id:", user?.Id);
    console.log("User keys:", user ? Object.keys(user) : "no user");
  }, [user]);

  useEffect(() => {
    if (user) {
      loadMyEvents();
    }
  }, [user]);

  const loadMyEvents = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const data = await attendeesApi.getEventsByAttendee(user.Id);
      setMyEvents(data || []);
    } catch (err: any) {
      setError("Failed to load your events");
      console.error("Failed to load my events:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Separate upcoming and past events
  const now = new Date();
  const upcomingEvents = myEvents.filter(
    (event) => new Date(event.DateTime) >= now
  );
  const pastEvents = myEvents.filter((event) => new Date(event.DateTime) < now);

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
            <span className="text-sm text-purple-300">My Events</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Your Events
          </h1>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto mb-8">
            Manage and track all the events you're attending
          </p>

          <Link to="/events/create">
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 gap-2">
              <Plus className="w-4 h-4" />
              Create New Event
            </Button>
          </Link>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-purple-500 mb-4" />
            <p className="text-neutral-400">Loading your events...</p>
          </div>
        )}

        {/* Error State */}
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
                onClick={loadMyEvents}
                variant="outline"
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                Try Again
              </Button>
            </div>
          </motion.div>
        )}

        {/* Events Tabs */}
        {!isLoading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 bg-neutral-900 border border-neutral-800">
                <TabsTrigger
                  value="upcoming"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                >
                  Upcoming ({upcomingEvents.length})
                </TabsTrigger>
                <TabsTrigger
                  value="past"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white"
                >
                  Past ({pastEvents.length})
                </TabsTrigger>
              </TabsList>

              {/* Upcoming Events */}
              <TabsContent value="upcoming">
                {upcomingEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {upcomingEvents.map((event, index) => (
                      <EventCard key={event.Id} event={event} index={index} />
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-800 mb-4">
                      <Calendar className="w-8 h-8 text-neutral-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No Upcoming Events
                    </h3>
                    <p className="text-neutral-400 mb-6">
                      You haven't joined any upcoming events yet
                    </p>
                    <Link to="/events">
                      <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                        Browse Events
                      </Button>
                    </Link>
                  </motion.div>
                )}
              </TabsContent>

              {/* Past Events */}
              <TabsContent value="past">
                {pastEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pastEvents.map((event, index) => (
                      <EventCard key={event.Id} event={event} index={index} />
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-800 mb-4">
                      <Calendar className="w-8 h-8 text-neutral-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      No Past Events
                    </h3>
                    <p className="text-neutral-400">
                      You haven't attended any events yet
                    </p>
                  </motion.div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </div>
    </div>
  );
}
