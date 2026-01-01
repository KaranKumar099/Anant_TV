import React from "react";

const HorizontalVideoCard = ({
  thumbnail,
  duration,
  title,
  channel,
  views,
  timeAgo,
  isLive
}) => {
  return (
    <div className="flex gap-3 cursor-pointer group max-w-3xl">
      {/* Thumbnail */}
      <div className="relative w-64">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover rounded-md"
        />

        {/* Duration/Live */}
        <span className={`absolute bottom-1 right-1 ${isLive ? 'bg-red-600' : 'bg-black'} text-white text-xs px-1.5 py-0.5 rounded`}>
          {duration}
        </span>
      </div>

      {/* Right Section */}
      <div className="flex flex-col">
        {/* Title */}
        <h3 className="text-white font-medium leading-tight line-clamp-2 group-hover:underline">
          {title}
        </h3>

        {/* Channel + Meta */}
        <div className="text-gray-400 text-sm mt-1">
          <p>{channel}</p>
          <p>
            {views} {!isLive ? `• ${timeAgo}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HorizontalVideoCard;
