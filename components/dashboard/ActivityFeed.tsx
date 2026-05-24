'use client';

import React from 'react';
import { GitPullRequest, AlertCircle, MessageSquare, GitBranch, Share2 } from 'lucide-react';
import { ActivityEvent } from '@/types';

interface ActivityFeedProps {
  events: ActivityEvent[];
  maxItems?: number;
}

const getEventIcon = (type: string) => {
  const iconProps = { size: 16 };
  switch (type) {
    case 'push':
      return <GitBranch {...iconProps} />;
    case 'pull_request':
      return <GitPullRequest {...iconProps} />;
    case 'issue':
      return <AlertCircle {...iconProps} />;
    case 'comment':
      return <MessageSquare {...iconProps} />;
    case 'fork':
      return <Share2 {...iconProps} />;
    default:
      return <GitBranch {...iconProps} />;
  }
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  events,
  maxItems = 10,
}) => {
  const displayEvents = events.slice(0, maxItems);

  return (
    <div className="border-3 border-black">
      {/* Header */}
      <div className="px-4 py-3 border-b-3 border-black bg-black text-white">
        <h3 className="text-sm font-bold uppercase tracking-widest">ACTIVITY FEED</h3>
      </div>

      {/* Events List */}
      <div className="divide-y-2 divide-black">
        {displayEvents.map((event) => (
          <div
            key={event.id}
            className="p-4 border-none hover:bg-black hover:text-white transition-brutal cursor-pointer"
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0 p-2 border-2 border-current">
                {getEventIcon(event.type)}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-bold uppercase">
                      {event.user} {event.type.replace('_', ' ')}
                    </p>
                    <p className="text-xs opacity-75 mt-1">{event.description}</p>
                    <p className="text-xs opacity-50 mt-2 font-mono">
                      {event.repository}
                    </p>
                  </div>
                  <span className="text-xs opacity-60 flex-shrink-0">{event.timestamp}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View More */}
      {events.length > maxItems && (
        <div className="px-4 py-3 border-t-2 border-black bg-gray-200 text-center">
          <a href="/activity" className="text-xs font-bold uppercase hover:underline">
            View all activity →
          </a>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;