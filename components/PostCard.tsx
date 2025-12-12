'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { upvotePost, downvotePost, getUserVote } from '@/lib/votes'
import { deletePost, pinPost, unpinPost } from '@/lib/posts'
import { Post } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Linkify } from '@/lib/linkify'
import AdminBadge from './AdminBadge'
import ConfirmModal from './ConfirmModal'

interface PostCardProps {
  post: Post
  onDelete?: () => void
  onPinChange?: () => void
}

export default function PostCard({ post, onDelete, onPinChange }: PostCardProps) {
  const router = useRouter()
  const { user } = useAuth()
  const [voteState, setVoteState] = useState<'upvote' | 'downvote' | null>(null)
  const [currentScore, setCurrentScore] = useState(post.score)
  const [voting, setVoting] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [isPinned, setIsPinned] = useState(post.pinned || false)
  const [pinning, setPinning] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Kullanıcının mevcut oyunu yükle
  useEffect(() => {
    if (user) {
      getUserVote(user.uid, post.id).then((vote) => {
        setVoteState(vote)
      })
    }
  }, [user, post.id])

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

  // Zaman formatı
  const timeAgo = post.createdAt
    ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true, locale: tr })
    : 'az önce'

  // Silme yetkisi kontrolü
  const canDelete = user && (user.uid === post.authorId || user.role === 'admin')

  const handleUpvote = async () => {
    if (!user) {
      alert('Oy vermek için giriş yapmalısın!')
      return
    }

    if (voting) return

    try {
      setVoting(true)
      
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

  const handlePin = async () => {
    if (!user || user.role !== 'admin') return

    try {
      setPinning(true)
      setShowMenu(false)
      
      if (isPinned) {
        await unpinPost(post.id)
        setIsPinned(false)
      } else {
        await pinPost(post.id)
        setIsPinned(true)
      }
      
      // Parent'a bildir
      if (onPinChange) {
        onPinChange()
      }
    } catch (error) {
      console.error('Pin hatası:', error)
    } finally {
      setPinning(false)
    }
  }

  const handleDeleteClick = () => {
    setShowMenu(false)
    setShowConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    if (!user || !canDelete) return

    try {
      setDeleting(true)
      await deletePost(post.id, user.uid, user.role === 'admin')
      setShowConfirm(false)
      
      // Parent'a bildir
      if (onDelete) {
        onDelete()
      }
    } catch (error) {
      console.error('Silme hatası:', error)
      alert('Gönderi silinemedi!')
      setDeleting(false)
    }
  }

  if (deleting && !showConfirm) {
    return (
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 border border-border-light/60 dark:border-border-dark/60 opacity-50">
        <p className="text-center text-text-secondary-light dark:text-text-secondary-dark">
          Siliniyor...
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 border border-border-light/60 dark:border-border-dark/60">
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
              {post.authorRole === 'admin' && <AdminBadge />}
              <span className="text-text-secondary-light dark:text-text-secondary-dark text-xs">•</span>
              <span className="text-text-secondary-light dark:text-text-secondary-dark text-xs">{timeAgo}</span>
              <span className="text-text-secondary-light dark:text-text-secondary-dark text-xs">•</span>
              <a href={`/topic/${post.topicId}`} className="text-primary font-semibold text-xs hover:underline">
                #{post.topicName}
              </a>
            </div>
          </div>
          
          {/* Üç Nokta Menü */}
          <div className="relative" ref={menuRef}>
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark"
            >
              <span className="material-symbols-outlined">more_horiz</span>
            </button>

            {/* Dropdown Menü */}
            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-border-light dark:border-border-dark py-1 z-50">
                {/* Admin: Sabitle/Kaldır */}
                {user?.role === 'admin' && (
                  <button
                    onClick={handlePin}
                    disabled={pinning}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2 disabled:opacity-50"
                  >
                    <i className={`hgi-stroke ${isPinned ? 'hgi-pin-off' : 'hgi-pin'} text-lg`}></i>
                    {pinning ? 'İşleniyor...' : isPinned ? 'Sabitlemeyi Kaldır' : 'Gönderiyi Sabitle'}
                  </button>
                )}
                {canDelete && (
                  <button
                    onClick={handleDeleteClick}
                    className="w-full text-left px-4 py-2 text-sm text-primary hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                    Gönderiyi Kaldır
                  </button>
                )}
                {!canDelete && user?.role !== 'admin' && (
                  <p className="px-4 py-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                    Seçenek yok
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* İçerik - Tıklanabilir */}
        <div 
          className="mb-3 cursor-pointer overflow-hidden"
          onClick={() => router.push(`/post/${post.id}`)}
        >
          {/* Başlık */}
          <h3 className="text-base font-semibold leading-snug mb-2 hover:text-primary break-words">
            <Linkify text={post.title} />
          </h3>

          {/* İçerik */}
          {post.content && (
            <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm font-normal leading-relaxed line-clamp-3 break-words">
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
            <i className="hgi-stroke hgi-thumbs-up text-lg"></i>
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
            <i className="hgi-stroke hgi-thumbs-down text-lg"></i>
          </button>

          {/* Yorum */}
          <button 
            onClick={() => router.push(`/post/${post.id}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            <i className="hgi-stroke hgi-comment-01 text-lg"></i>
            <span>{post.commentCount} yorum</span>
          </button>

          {/* Paylaş */}
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
            <i className="hgi-stroke hgi-share-08 text-lg"></i>
            <span>Paylaş</span>
          </button>
        </div>
      </div>

      {/* Silme Onay Modal */}
      <ConfirmModal
        isOpen={showConfirm}
        title="Gönderiyi Kaldır"
        message="Bu gönderiyi kaldırmak istediğinize emin misiniz? Bu işlem geri alınamaz."
        confirmText="Kaldır"
        cancelText="İptal"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowConfirm(false)}
        loading={deleting}
      />
    </>
  )
}
