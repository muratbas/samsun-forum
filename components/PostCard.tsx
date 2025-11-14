'use client'

import { useState } from 'react'

interface PostCardProps {
  id: string
  title: string
  content?: string
  imageUrl?: string
  authorNickname: string
  topicName: string
  topicSlug: string
  upvotes: number
  downvotes: number
  commentCount: number
  timeAgo: string
}

export default function PostCard({
  id,
  title,
  content,
  imageUrl,
  authorNickname,
  topicName,
  topicSlug,
  upvotes,
  downvotes,
  commentCount,
  timeAgo,
}: PostCardProps) {
  const [voteState, setVoteState] = useState<'up' | 'down' | null>(null)
  const score = upvotes - downvotes

  const handleUpvote = () => {
    setVoteState(voteState === 'up' ? null : 'up')
  }

  const handleDownvote = () => {
    setVoteState(voteState === 'down' ? null : 'down')
  }

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden flex">
      {/* Vote Section */}
      <div className="flex flex-col items-center p-2 bg-background-light dark:bg-background-dark">
        <button
          onClick={handleUpvote}
          className={`${
            voteState === 'up'
              ? 'text-primary'
              : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-primary'
          }`}
          aria-label="Upvote"
        >
          <span className="material-symbols-outlined">arrow_upward</span>
        </button>
        <p className="text-sm font-bold leading-normal py-1">{score}</p>
        <button
          onClick={handleDownvote}
          className={`${
            voteState === 'down'
              ? 'text-accent'
              : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-accent'
          }`}
          aria-label="Downvote"
        >
          <span className="material-symbols-outlined">arrow_downward</span>
        </button>
      </div>

      {/* Content Section */}
      <div className="p-4 w-full">
        <div className={`flex ${imageUrl ? 'items-stretch justify-between' : ''} gap-4`}>
          <div className="flex flex-1 flex-col gap-2">
            {/* Meta Info */}
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-xs font-normal leading-normal">
              <span className="font-bold">u/{authorNickname}</span> • {timeAgo} •{' '}
              <a
                className="text-primary font-bold hover:underline"
                href={`/topic/${topicSlug}`}
              >
                #{topicName}
              </a>
            </p>

            {/* Title */}
            <h3 className="text-lg font-bold leading-tight hover:text-primary cursor-pointer">
              {title}
            </h3>

            {/* Content - Only show if no image or on mobile */}
            {content && (
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal line-clamp-3">
                {content}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-4 mt-2 flex-wrap">
              <button className="flex items-center justify-center gap-1.5 rounded-lg text-sm font-medium leading-normal text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/5 px-2 py-1">
                <span className="material-symbols-outlined text-lg">
                  chat_bubble
                </span>
                <span className="truncate">{commentCount} Yorum</span>
              </button>
              <button className="flex items-center justify-center gap-1.5 rounded-lg text-sm font-medium leading-normal text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/5 px-2 py-1">
                <span className="material-symbols-outlined text-lg">share</span>
                <span className="truncate">Paylaş</span>
              </button>
            </div>
          </div>

          {/* Image - Responsive */}
          {imageUrl && (
            <div
              className="w-24 h-24 sm:w-32 sm:h-32 bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex-shrink-0"
              style={{ backgroundImage: `url("${imageUrl}")` }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

