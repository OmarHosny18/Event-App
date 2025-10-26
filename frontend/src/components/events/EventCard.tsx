import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { Badge } from "@/components/ui/badge";
import type { Event } from "@/types";
import { formatDateTime, truncateText } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  index?: number;
  className?: string;
}

export function EventCard({
  event,
  index = 0,
  className = "",
}: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`w-full h-full flex ${className}`}
    >
      <CardContainer className="inter-var w-full h-full flex">
        <CardBody className="relative group/card flex flex-col justify-between w-full h-full rounded-xl p-6 border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-purple-500/[0.1] hover:border-purple-500/50 transition-all duration-300">
          {/* Date Badge */}
          <CardItem translateZ="50" className="absolute top-6 right-6">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(event.DateTime).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </Badge>
          </CardItem>

          {/* Event Content */}
          <div>
            <CardItem
              translateZ="60"
              className="text-2xl font-bold text-white mb-2 pr-24"
            >
              {truncateText(event.Name, 50)}
            </CardItem>

            <CardItem
              as="p"
              translateZ="50"
              className="text-neutral-400 text-sm mb-4 line-clamp-2"
            >
              {truncateText(event.Description, 120)}
            </CardItem>

            <div className="space-y-2 mb-6">
              <CardItem
                translateZ="40"
                className="flex items-center gap-2 text-neutral-500 text-sm"
              >
                <MapPin className="w-4 h-4 text-purple-400" />
                <span className="text-neutral-300">{event.Location}</span>
              </CardItem>

              <CardItem
                translateZ="40"
                className="flex items-center gap-2 text-neutral-500 text-sm"
              >
                <Clock className="w-4 h-4 text-pink-400" />
                <span className="text-neutral-300">
                  {formatDateTime(event.DateTime)}
                </span>
              </CardItem>
            </div>

            <CardItem translateZ="30" className="w-full mb-6">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />
            </CardItem>
          </div>

          {/* Button at bottom */}
          <Link to={`/events/${event.Id}`}>
            <CardItem translateZ="60" className="w-full mt-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold flex items-center justify-center gap-2 group/btn hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                View Details
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </motion.button>
            </CardItem>
          </Link>

          {/* Glow */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 via-pink-500/0 to-purple-500/0 opacity-0 group-hover/card:opacity-10 transition-opacity duration-500 pointer-events-none" />
        </CardBody>
      </CardContainer>
    </motion.div>
  );
}
