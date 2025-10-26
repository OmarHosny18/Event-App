import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  FileText,
  Clock,
  ArrowLeft,
  Loader2,
  Save,
} from "lucide-react";
import { eventsApi } from "@/lib/api";
import type { Event } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { toast } from "sonner";
import { formatDateForAPI } from "@/lib/utils";

export function CreateEventPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    Name: "",
    Description: "",
    Location: "",
    DateTime: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEvent, setIsLoadingEvent] = useState(isEditMode);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditMode) {
      loadEvent();
    }
  }, [id]);

  const loadEvent = async () => {
    try {
      setIsLoadingEvent(true);
      const event = await eventsApi.getById(Number(id));

      // Format datetime for input field (YYYY-MM-DDTHH:mm)
      const dateTime = new Date(event.DateTime);
      const formattedDateTime = dateTime.toISOString().slice(0, 16);

      setFormData({
        Name: event.Name,
        Description: event.Description,
        Location: event.Location,
        DateTime: formattedDateTime,
      });
    } catch (err: any) {
      toast.error("Failed to load event");
      navigate("/events");
    } finally {
      setIsLoadingEvent(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.Name.trim().length < 3) {
      newErrors.Name = "Event name must be at least 3 characters";
    }

    if (formData.Description.trim().length < 10) {
      newErrors.Description = "Description must be at least 10 characters";
    }

    if (formData.Location.trim().length < 3) {
      newErrors.Location = "Location must be at least 3 characters";
    }

    if (!formData.DateTime) {
      newErrors.DateTime = "Please select a date and time";
    } else {
      const selectedDate = new Date(formData.DateTime);
      if (selectedDate < new Date()) {
        newErrors.DateTime = "Event date must be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      // Convert datetime to ISO format for API
      const eventData = {
        ...formData,
        DateTime: new Date(formData.DateTime).toISOString(),
      };

      if (isEditMode) {
        // await eventsApi.update(Number(id), eventData);
        toast.success("Event updated successfully!");
      } else {
        await eventsApi.create(eventData);
        toast.success("Event created successfully!");
      }

      navigate("/events");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to save event");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingEvent) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-neutral-400">Loading event...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16">
      <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-4">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">
              {isEditMode ? "Edit Event" : "Create New Event"}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {isEditMode ? "Update Your Event" : "Create Amazing Event"}
          </h1>
          <p className="text-neutral-400 text-lg">
            {isEditMode
              ? "Make changes to your event details"
              : "Fill in the details below to create your event"}
          </p>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <BackgroundGradient className="rounded-[22px] p-1">
            <div className="bg-neutral-900 rounded-[20px] p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Event Name */}
                <div className="space-y-2">
                  <Label htmlFor="Name" className="text-neutral-200 text-base">
                    Event Name *
                  </Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <Input
                      id="Name"
                      name="Name"
                      type="text"
                      placeholder="Summer Music Festival"
                      value={formData.Name}
                      onChange={handleChange}
                      required
                      className="pl-10 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-purple-500 h-12"
                    />
                  </div>
                  {errors.Name && (
                    <p className="text-red-400 text-sm">{errors.Name}</p>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label
                    htmlFor="Location"
                    className="text-neutral-200 text-base"
                  >
                    Location *
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <Input
                      id="Location"
                      name="Location"
                      type="text"
                      placeholder="Central Park, New York"
                      value={formData.Location}
                      onChange={handleChange}
                      required
                      className="pl-10 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-purple-500 h-12"
                    />
                  </div>
                  {errors.Location && (
                    <p className="text-red-400 text-sm">{errors.Location}</p>
                  )}
                </div>

                {/* Date and Time */}
                <div className="space-y-2">
                  <Label
                    htmlFor="DateTime"
                    className="text-neutral-200 text-base"
                  >
                    Date & Time *
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-500" />
                    <Input
                      id="DateTime"
                      name="DateTime"
                      type="datetime-local"
                      value={formData.DateTime}
                      onChange={handleChange}
                      required
                      className="pl-10 bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500 focus:border-purple-500 h-12"
                    />
                  </div>
                  {errors.DateTime && (
                    <p className="text-red-400 text-sm">{errors.DateTime}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label
                    htmlFor="Description"
                    className="text-neutral-200 text-base"
                  >
                    Description *
                  </Label>
                  <textarea
                    id="Description"
                    name="Description"
                    placeholder="Tell people what makes your event special..."
                    value={formData.Description}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-white placeholder:text-neutral-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
                  />
                  {errors.Description && (
                    <p className="text-red-400 text-sm">{errors.Description}</p>
                  )}
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent my-8" />

                {/* Submit Button */}
                <div className="flex gap-4">
                  <Link to="/events" className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-neutral-700 text-white hover:bg-neutral-800 h-12"
                    >
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold h-12"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        {isEditMode ? "Updating..." : "Creating..."}
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5 mr-2" />
                        {isEditMode ? "Update Event" : "Create Event"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </BackgroundGradient>
        </motion.div>
      </div>
    </div>
  );
}
