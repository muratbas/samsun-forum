'use client'

import { useState, useRef, useEffect } from 'react'
import { Comment } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import AdminBadge from './AdminBadge'
import { upvoteComment, downvoteComment, getUserCommentVote } from '@/lib/votes'

interface CommentItemProps {
  comment: Comment
  currentUser: any
  onDelete: (id: string) => void
}

export default function CommentItem({ comment, currentUser, onDelete }: CommentItemProps) {
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const [voteState, setVoteState] = useState<'upvote' | 'downvote' | null>(null)
  const [score, setScore] = useState(comment.score || 0)
  const [voting, setVoting] = useState(false)

  const timeAgo = comment.createdAt
    ? formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true, locale: tr })
    : 'az önce'

  const canDelete = currentUser && (
    currentUser.uid === comment.authorId || 
    currentUser.role === 'admin'
  )

  useEffect(() => {
    if (currentUser) {
      getUserCommentVote(currentUser.uid, comment.id).then(setVoteState)
    }
  }, [currentUser, comment.id])

  // Menü dışına tıklanınca kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleUpvote = async () => {
    if (!currentUser) {
      alert('Oy vermek için giriş yapmalısın!')
      return
    }
    if (voting) return

    const prevScore = score
    const prevVote = voteState

    try {
      setVoting(true)
      
      if (voteState === 'upvote') {
        setVoteState(null)
        setScore(prevScore - 1)
      } else if (voteState === 'downvote') {
        setVoteState('upvote')
        setScore(prevScore + 2)
      } else {
        setVoteState('upvote')
        setScore(prevScore + 1)
      }

      await upvoteComment(currentUser.uid, comment.id)
    } catch (error) {
      console.error('Upvote hatası:', error)
      // Hata durumunda geri al
      setVoteState(prevVote)
      setScore(prevScore)
    } finally {
      setVoting(false)
    }
  }

  const handleDownvote = async () => {
    if (!currentUser) {
      alert('Oy vermek için giriş yapmalısın!')
      return
    }
    if (voting) return

    const prevScore = score
    const prevVote = voteState

    try {
      setVoting(true)
      
      if (voteState === 'downvote') {
        setVoteState(null)
        setScore(prevScore + 1)
      } else if (voteState === 'upvote') {
        setVoteState('downvote')
        setScore(prevScore - 2)
      } else {
        setVoteState('downvote')
        setScore(prevScore - 1)
      }

      await downvoteComment(currentUser.uid, comment.id)
    } catch (error) {
      console.error('Downvote hatası:', error)
      // Hata durumunda geri al
      setVoteState(prevVote)
      setScore(prevScore)
    } finally {
      setVoting(false)
    }
  }

  return (
    <div className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors group">
      <div 
        className="w-8 h-8 rounded-full bg-center bg-cover bg-no-repeat bg-gray-400 flex-shrink-0"
        style={{ backgroundImage: comment.authorPhotoURL ? `url("${comment.authorPhotoURL}")` : 'none' }}
      >
        {!comment.authorPhotoURL && (
          <div className="w-full h-full flex items-center justify-center text-white text-xs font-bold rounded-full bg-primary">
            {comment.authorNickname.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">{comment.authorNickname}</span>
            {comment.authorRole === 'admin' && <AdminBadge />}
            <span className="text-text-secondary-light dark:text-text-secondary-dark text-xs">{timeAgo}</span>
          </div>

          {/* Üç nokta menüsü */}
          {canDelete && (
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark transition-opacity"
              >
                <span className="material-symbols-outlined text-lg">more_horiz</span>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-1 w-32 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-border-light dark:border-border-dark py-1 z-50">
                  <button
                    onClick={() => {
                        setShowMenu(false)
                        onDelete(comment.id)
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-red-500 hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    Yorumu Sil
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        <p className="text-text-primary-light dark:text-text-primary-dark text-sm whitespace-pre-wrap break-words mb-2">
          {comment.content}
        </p>

        {/* Aksiyonlar (Vote) */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleUpvote}
            disabled={voting}
            className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${
              voteState === 'upvote' ? 'text-primary' : 'text-text-secondary-light dark:text-text-secondary-dark'
            }`}
          >
            <i className={`hgi-stroke hgi-thumbs-up text-sm ${voteState === 'upvote' ? 'fill-current' : ''}`}></i>
            <span className="text-xs font-medium">{score}</span>
          </button>

          <button
            onClick={handleDownvote}
            disabled={voting}
            className={`p-1 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${
              voteState === 'downvote' ? 'text-accent' : 'text-text-secondary-light dark:text-text-secondary-dark'
            }`}
          >
            <i className={`hgi-stroke hgi-thumbs-down text-sm ${voteState === 'downvote' ? 'fill-current' : ''}`}></i>
          </button>
          

        </div>
      </div>
    </div>
  )
}
