'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { upvotePost, downvotePost, getUserVote } from '@/lib/votes'
import { Post } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Linkify } from '@/lib/linkify'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuth()
  const [voteState, setVoteState] = useState<'upvote' | 'downvote' | null>(null)
  const [currentScore, setCurrentScore] = useState(post.score)
  const [voting, setVoting] = useState(false)

  // Kullanıcının mevcut oyunu yükle
  useEffect(() => {
    if (user) {
      getUserVote(user.uid, post.id).then((vote) => {
        setVoteState(vote)
      })
    }
  }, [user, post.id])

  // Zaman formatı
  const timeAgo = post.createdAt
    ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true, locale: tr })
    : 'az önce'

  const handleUpvote = async () => {
    if (!user) {
      alert('Oy vermek için giriş yapmalısın!')
      return
    }

    if (voting) return

    try {
      setVoting(true)
      
      // Optimistic update
      const oldVoteState = voteState
      const oldScore = currentScore
      
      if (voteState === 'upvote') {
        setVoteState(null)
        setCurrentScore(currentScore - 1)
      } else if (voteState === 'downvote') {
        setVoteState('upvote')
        setCurrentScore(currentScore + 2)
      } else {
        setVoteState('upvote')
        setCurrentScore(currentScore + 1)
      }

      await upvotePost(user.uid, post.id)
    } catch (error) {
      console.error('Upvote hatası:', error)
      setVoteState(voteState)
      setCurrentScore(currentScore)
    } finally {
      setVoting(false)
    }
  }

  const handleDownvote = async () => {
    if (!user) {
      alert('Oy vermek için giriş yapmalısın!')
      return
    }

    if (voting) return

    try {
      setVoting(true)
      
      // Optimistic update
      const oldVoteState = voteState
      const oldScore = currentScore
      
      if (voteState === 'downvote') {
        setVoteState(null)
        setCurrentScore(currentScore + 1)
      } else if (voteState === 'upvote') {
        setVoteState('downvote')
        setCurrentScore(currentScore - 2)
      } else {
        setVoteState('downvote')
        setCurrentScore(currentScore - 1)
      }

      await downvotePost(user.uid, post.id)
    } catch (error) {
      console.error('Downvote hatası:', error)
      setVoteState(voteState)
      setCurrentScore(currentScore)
    } finally {
      setVoting(false)
    }
  }

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4">
      {/* Üst Kısım - Kullanıcı Bilgisi + Üç Nokta */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div 
            className="w-10 h-10 rounded-full bg-center bg-cover bg-no-repeat bg-gray-400"
            style={{ backgroundImage: post.authorPhotoURL ? `url("${post.authorPhotoURL}")` : 'none' }}
          >
            {!post.authorPhotoURL && (
              <div className="w-full h-full flex items-center justify-center text-white text-sm font-bold rounded-full bg-primary">
                {post.authorNickname.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-sm">{post.authorNickname}</span>
            <span className="text-text-secondary-light dark:text-text-secondary-dark text-xs">•</span>
            <span className="text-text-secondary-light dark:text-text-secondary-dark text-xs">{timeAgo}</span>
            <span className="text-text-secondary-light dark:text-text-secondary-dark text-xs">•</span>
            <a href={`/topic/${post.topicId}`} className="text-primary font-semibold text-xs hover:underline">
              #{post.topicName}
            </a>
          </div>
        </div>
        
        {/* Üç Nokta Menü */}
        <button className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>

      {/* İçerik */}
      <div className="mb-3">
        {/* Başlık */}
        <h3 className="text-base font-semibold leading-snug mb-2 hover:text-primary cursor-pointer">
          <Linkify text={post.title} />
        </h3>

        {/* İçerik */}
        {post.content && (
          <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-relaxed line-clamp-3">
            <Linkify text={post.content} />
          </p>
        )}

        {/* Resim */}
        {post.imageUrl && (
          <div
            className="mt-3 w-full h-48 sm:h-64 bg-center bg-no-repeat bg-cover rounded-lg"
            style={{ backgroundImage: `url("${post.imageUrl}")` }}
          />
        )}
      </div>

      {/* Alt Kısım - Aksiyonlar */}
      <div className="flex items-center gap-1 flex-wrap">
        {/* Upvote */}
        <button
          onClick={handleUpvote}
          disabled={voting}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full border ${
            voteState === 'upvote'
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/5'
          } disabled:opacity-50 transition-colors`}
          aria-label="Upvote"
        >
          <span className="material-symbols-outlined text-lg">thumb_up</span>
          <span className="text-sm font-medium">{currentScore}</span>
        </button>

        {/* Downvote */}
        <button
          onClick={handleDownvote}
          disabled={voting}
          className={`flex items-center justify-center p-1.5 rounded-full border ${
            voteState === 'downvote'
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/5'
          } disabled:opacity-50 transition-colors`}
          aria-label="Downvote"
        >
          <span className="material-symbols-outlined text-lg">thumb_down</span>
        </button>

        {/* Yorum */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
          <span className="material-symbols-outlined text-lg">chat_bubble_outline</span>
          <span>{post.commentCount} comments</span>
        </button>

        {/* Paylaş */}
        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
          <span className="material-symbols-outlined text-lg">share</span>
        </button>
      </div>
    </div>
  )
}
