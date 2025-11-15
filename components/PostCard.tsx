'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { upvotePost, downvotePost, getUserVote } from '@/lib/votes'
import { Post } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'

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
      // Başarılı - optimistic update zaten yapıldı
    } catch (error) {
      console.error('Upvote hatası:', error)
      // Hata olursa geri al
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
      // Başarılı - optimistic update zaten yapıldı
    } catch (error) {
      console.error('Downvote hatası:', error)
      // Hata olursa geri al
      setVoteState(voteState)
      setCurrentScore(currentScore)
    } finally {
      setVoting(false)
    }
  }

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl overflow-hidden flex">
      {/* Oy Bölümü */}
      <div className="flex flex-col items-center p-2 bg-background-light dark:bg-background-dark">
        <button
          onClick={handleUpvote}
          disabled={voting}
          className={`${
            voteState === 'upvote'
              ? 'text-primary'
              : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-primary'
          } disabled:opacity-50`}
          aria-label="Upvote"
        >
          <span className="material-symbols-outlined">arrow_upward</span>
        </button>
        <p className="text-sm font-bold leading-normal py-1">{currentScore}</p>
        <button
          onClick={handleDownvote}
          disabled={voting}
          className={`${
            voteState === 'downvote'
              ? 'text-accent'
              : 'text-text-secondary-light dark:text-text-secondary-dark hover:text-accent'
          } disabled:opacity-50`}
          aria-label="Downvote"
        >
          <span className="material-symbols-outlined">arrow_downward</span>
        </button>
      </div>

      {/* İçerik Bölümü */}
      <div className="p-4 w-full">
        <div className={`flex ${post.imageUrl ? 'items-stretch justify-between' : ''} gap-4`}>
          <div className="flex flex-1 flex-col gap-2">
            {/* Kullanıcı Bilgisi */}
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-full bg-center bg-cover bg-no-repeat bg-gray-400"
                style={{ backgroundImage: post.authorPhotoURL ? `url("${post.authorPhotoURL}")` : 'none' }}
              >
                {!post.authorPhotoURL && (
                  <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold">
                    {post.authorNickname.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm">u/{post.authorNickname}</span>
                <span className="text-text-secondary-light dark:text-text-secondary-dark text-xs">•</span>
                <span className="text-text-secondary-light dark:text-text-secondary-dark text-xs">{timeAgo}</span>
                <span className="text-text-secondary-light dark:text-text-secondary-dark text-xs">•</span>
                <a
                  className="text-primary font-bold hover:underline text-xs"
                  href={`/topic/${post.topicId}`}
                >
                  #{post.topicName}
                </a>
              </div>
            </div>

            {/* Başlık */}
            <h3 className="text-lg font-bold leading-tight hover:text-primary cursor-pointer">
              {post.title}
            </h3>

            {/* İçerik */}
            {post.content && (
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-normal line-clamp-3">
                {post.content}
              </p>
            )}

            {/* Aksiyon Butonları */}
            <div className="flex gap-4 mt-2 flex-wrap">
              <button className="flex items-center justify-center gap-1.5 rounded-lg text-sm font-medium leading-normal text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/5 px-2 py-1">
                <span className="material-symbols-outlined text-lg">
                  chat_bubble
                </span>
                <span className="truncate">{post.commentCount} Yorum</span>
              </button>
              <button className="flex items-center justify-center gap-1.5 rounded-lg text-sm font-medium leading-normal text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/5 px-2 py-1">
                <span className="material-symbols-outlined text-lg">share</span>
                <span className="truncate">Paylaş</span>
              </button>
            </div>
          </div>

          {/* Resim - Responsive */}
          {post.imageUrl && (
            <div
              className="w-24 h-24 sm:w-32 sm:h-32 bg-center bg-no-repeat aspect-square bg-cover rounded-lg flex-shrink-0"
              style={{ backgroundImage: `url("${post.imageUrl}")` }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

