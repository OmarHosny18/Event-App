import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  ArrowLeft,
  Loader2,
  AlertCircle,
  UserPlus,
  Edit,
  Trash2,
} from "lucide-react";
import { eventsApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import type { Event, User } from "@/types";
import { formatDateTime, getInitials, generateAvatarColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export function EventDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [attendees, setAttendees] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const isUserAttending = attendees.some(
    (attendee) => attendee.Id === user?.Id
  );
  const isEventCreator = event?.UserId === user?.Id;
  useEffect(() => {
    console.log("Current user:", user);
    console.log("User Id:", user?.Id);
    console.log("User keys:", user ? Object.keys(user) : "no user");
  }, [user]);

  useEffect(() => {
    if (id) {
      loadEventDetails();
    }
  }, [id]);

  const loadEventDetails = async () => {
    try {
      setIsLoading(true);
      const [eventData, attendeesData] = await Promise.all([
        eventsApi.getById(Number(id)),
        eventsApi.getAttendees(Number(id)),
      ]);
      setEvent(eventData);
      setAttendees(attendeesData || []);
    } catch (err: any) {
      setError("Failed to load event details");
      console.error("Failed to load event:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinEvent = async () => {
    if (!isAuthenticated || !user || !event) {
      toast.error("Please login to join events");
      navigate("/login");
      return;
    }

    try {
      setIsJoining(true);
      await eventsApi.addAttendee(event.Id, user.Id);
      toast.success("Successfully joined the event!");
      loadEventDetails();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to join event");
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveEvent = async () => {
    if (!user || !event) return;

    try {
      setIsJoining(true);
      await eventsApi.removeAttendee(event.Id, user.Id);
      toast.success("You have left the event");
      loadEventDetails();
    } catch (err: any) {
      toast.error("Failed to leave event");
    } finally {
      setIsJoining(false);
    }
  };

  const handleDeleteEvent = async () => {
    if (!event) return;

    try {
      setIsDeleting(true);
      await eventsApi.delete(event.Id);
      toast.success("Event deleted successfully");
      navigate("/events");
    } catch (err: any) {
      toast.error("Failed to delete event");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-neutral-400">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Event Not Found
          </h2>
          <p className="text-neutral-400 mb-6">
            {error || "This event doesn't exist"}
          </p>
          <Link to="/events">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <Link to="/events">
            <Button
              variant="ghost"
              className="text-neutral-400 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          </Link>
        </motion.div>

        {/* Event Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BackgroundGradient className="rounded-[22px] p-1">
            <div className="bg-neutral-900 rounded-[20px] p-8 md:p-12">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-white mb-4">
                    {event.Name}
                  </h1>

                  {/* Event Meta Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-neutral-300">
                      <Calendar className="w-5 h-5 text-purple-400" />
                      <span>{formatDateTime(event.DateTime)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-neutral-300">
                      <MapPin className="w-5 h-5 text-pink-400" />
                      <span>{event.Location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-neutral-300">
                      <Users className="w-5 h-5 text-blue-400" />
                      <span>
                        {attendees.length} Attendee
                        {attendees.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                  {isAuthenticated && isEventCreator && (
                    <>
                      <Link to={`/events/${event.Id}/edit`}>
                        <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                          <Edit className="w-4 h-4" />
                          Edit Event
                        </Button>
                      </Link>
                      <Dialog
                        open={showDeleteDialog}
                        onOpenChange={setShowDeleteDialog}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="destructive"
                            className="w-full gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Event
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-neutral-900 border-neutral-800 text-white">
                          <DialogHeader>
                            <DialogTitle>Delete Event</DialogTitle>
                            <DialogDescription className="text-neutral-400">
                              Are you sure you want to delete this event? This
                              action cannot be undone.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex gap-3 justify-end mt-4">
                            <Button
                              variant="outline"
                              onClick={() => setShowDeleteDialog(false)}
                              className="border-neutral-700"
                            >
                              Cancel
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={handleDeleteEvent}
                              disabled={isDeleting}
                            >
                              {isDeleting ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Deleting...
                                </>
                              ) : (
                                "Delete"
                              )}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </>
                  )}

                  {isAuthenticated && !isEventCreator && (
                    <Button
                      onClick={
                        isUserAttending ? handleLeaveEvent : handleJoinEvent
                      }
                      disabled={isJoining}
                      className={
                        isUserAttending
                          ? "w-full gap-2 bg-neutral-700 hover:bg-neutral-600"
                          : "w-full gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                      }
                    >
                      {isJoining ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : isUserAttending ? (
                        "Leave Event"
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4" />
                          Join Event
                        </>
                      )}
                    </Button>
                  )}

                  {!isAuthenticated && (
                    <Link to="/login">
                      <Button className="w-full gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                        <UserPlus className="w-4 h-4" />
                        Login to Join
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent mb-8" />

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  About This Event
                </h2>
                <p className="text-neutral-300 leading-relaxed whitespace-pre-wrap">
                  {event.Description}
                </p>
              </div>

              {/* Attendees Section */}
              {attendees.length > 0 && (
                <>
                  <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent mb-8" />

                  <div>
                    <h2 className="text-2xl font-semibold text-white mb-6">
                      Attendees ({attendees.length})
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {attendees.map((attendee) => (
                        <motion.div
                          key={attendee.Id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="flex items-center gap-3 p-3 rounded-lg bg-neutral-800 hover:bg-neutral-750 transition-colors"
                        >
                          <Avatar
                            className={generateAvatarColor(attendee.Name)}
                          >
                            <AvatarFallback className="text-white font-semibold">
                              {getInitials(attendee.Name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">
                              {attendee.Name}
                            </p>
                            <p className="text-neutral-400 text-sm truncate">
                              {attendee.Email}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </BackgroundGradient>
        </motion.div>
      </div>
    </div>
  );
}
