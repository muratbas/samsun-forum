'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { getPost, deletePost, pinPost, unpinPost } from '@/lib/posts'
import { getCommentsByPost, createComment, deleteComment } from '@/lib/comments'
import { upvotePost, downvotePost, getUserVote } from '@/lib/votes'
import { Post, Comment } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Linkify } from '@/lib/linkify'
import LeftSidebar from '@/components/LeftSidebar'
import RightSidebar from '@/components/RightSidebar'
import AdminBadge from '@/components/AdminBadge'
import ConfirmModal from '@/components/ConfirmModal'
import CommentItem from '@/components/CommentItem'

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string
  const { user } = useAuth()
  
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  
  // Vote state
  const [voteState, setVoteState] = useState<'upvote' | 'downvote' | null>(null)
  const [currentScore, setCurrentScore] = useState(0)
  const [voting, setVoting] = useState(false)

  // Menu state
  const [showMenu, setShowMenu] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [isPinned, setIsPinned] = useState(false)
  const [pinning, setPinning] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const shareMenuRef = useRef<HTMLDivElement>(null)

  // Silme yetkisi kontrolü
  const canDelete = user && post && (user.uid === post.authorId || user.role === 'admin')
  const canPin = user && user.role === 'admin'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const postData = await getPost(postId)
        setPost(postData)
        setCurrentScore(postData.score)
        setIsPinned(postData.pinned || false)
        
        // Yorumları ayrı yükle
        try {
          const commentsData = await getCommentsByPost(postId)
          setComments(commentsData)
        } catch (commentError) {
          console.error('Yorum yükleme hatası:', commentError)
          setComments([])
        }
      } catch (error) {
        console.error('Post yükleme hatası:', error)
        setPost(null)
      } finally {
        setLoading(false)
      }
    }

    if (postId) {
      fetchData()
    }
  }, [postId])

  // Kullanıcının mevcut oyunu yükle
  useEffect(() => {
    if (user && postId) {
      getUserVote(user.uid, postId).then((vote) => {
        setVoteState(vote)
      })
    }
  }, [user, postId])

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

      await upvotePost(user.uid, postId)
    } catch (error) {
      console.error('Upvote hatası:', error)
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

      await downvotePost(user.uid, postId)
    } catch (error) {
      console.error('Downvote hatası:', error)
    } finally {
      setVoting(false)
    }
  }

  // Menü dışına tıklanınca kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
        setShowShareMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handlePin = async () => {
    if (!user || user.role !== 'admin' || !post) return

    try {
      setPinning(true)
      setShowMenu(false)
      
      if (isPinned) {
        await unpinPost(post.id)
        setIsPinned(false)
        setPost({ ...post, pinned: false })
      } else {
        await pinPost(post.id)
        setIsPinned(true)
        setPost({ ...post, pinned: true })
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
    if (!user || !canDelete || !post) return

    try {
      setDeleting(true)
      await deletePost(post.id, user.uid, user.role === 'admin')
      
      // Ana sayfaya yönlendir
      router.push('/')
    } catch (error) {
      console.error('Silme hatası:', error)
      alert('Gönderi silinemedi!')
      setDeleting(false)
      setShowConfirm(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!user) {
      alert('Yorum yapmak için giriş yapmalısın!')
      return
    }

    if (!commentText.trim()) return

    try {
      setSubmitting(true)
      await createComment(
        postId,
        user.uid,
        user.nickname,
        user.photoURL,
        commentText.trim(),
        user.role
      )
      
      // Yorumları yeniden yükle
      const newComments = await getCommentsByPost(postId)
      setComments(newComments)
      setCommentText('')
      
      // Post'un yorum sayısını güncelle
      if (post) {
        setPost({ ...post, commentCount: post.commentCount + 1 })
      }
    } catch (error) {
      console.error('Yorum gönderme hatası:', error)
      alert('Yorum gönderilemedi!')
    } finally {
      setSubmitting(false)
    }
  }

  // Yorum silme işleyicisi
  const handleCommentDelete = async (commentId: string) => {
    if (!window.confirm('Bu yorumu silmek istediğinize emin misiniz?')) return

    try {
      await deleteComment(commentId, postId)
      
      // Listeden çıkar
      setComments(prev => prev.filter(c => c.id !== commentId))
      
      // Post yorum sayısını güncelle
      if (post) {
        setPost({ ...post, commentCount: Math.max(0, post.commentCount - 1) })
      }
    } catch (error) {
      console.error('Yorum silme hatası:', error)
      alert('Yorum silinemedi.')
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <LeftSidebar />
        <main className="flex-1 lg:ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex gap-6">
              <div className="flex-1 min-w-0">
                <div className="animate-pulse">
                  <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6">
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
              <div className="hidden lg:block w-80 flex-shrink-0">
                <RightSidebar />
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex min-h-screen">
        <LeftSidebar />
        <main className="flex-1 lg:ml-64">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex gap-6">
              <div className="flex-1 min-w-0">
                <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 text-center">
                  <p className="text-text-secondary-light dark:text-text-secondary-dark">
                    Gönderi bulunamadı
                  </p>
                </div>
              </div>
              <div className="hidden lg:block w-80 flex-shrink-0">
                <RightSidebar />
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  const timeAgo = post.createdAt
    ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true, locale: tr })
    : 'az önce'

  return (
    <div className="flex min-h-screen">
      <LeftSidebar />
      
      <main className="flex-1 lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-6">
            {/* Sol - Post ve Yorumlar */}
            <div className="flex-1 min-w-0">
          
          {/* Post Detay */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 border border-border-light/60 dark:border-border-dark/60 mb-4 overflow-hidden">
            {/* Üst Kısım - Kullanıcı Bilgisi + Üç Nokta */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
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
                  <a href={`/gundem/${post.topicId}`} className="text-primary font-semibold text-xs hover:underline">
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
                    {canPin && (
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
                    {!canDelete && !canPin && (
                      <p className="px-4 py-2 text-sm text-text-secondary-light dark:text-text-secondary-dark">
                        Seçenek yok
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Başlık */}
            <h1 className="text-xl font-bold leading-snug mb-3 break-words">
              <Linkify text={post.title} />
            </h1>

            {/* İçerik */}
            {post.content && (
              <p className="text-text-primary-light dark:text-text-primary-dark text-base leading-relaxed mb-4 break-words whitespace-pre-wrap">
                <Linkify text={post.content} />
              </p>
            )}

            {/* Resim */}
            {post.imageUrl && (
              <div
                className="w-full h-64 sm:h-96 bg-center bg-no-repeat bg-cover rounded-lg mb-4"
                style={{ backgroundImage: `url("${post.imageUrl}")` }}
              />
            )}

            {/* Alt Kısım - Aksiyonlar */}
            <div className="flex items-center gap-1 flex-wrap pt-4 border-t border-border-light dark:border-border-dark">
              {/* Upvote */}
              <button
                onClick={handleUpvote}
                disabled={voting}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full border ${
                  voteState === 'upvote'
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/5'
                } disabled:opacity-50 transition-colors`}
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
              >
                <i className="hgi-stroke hgi-thumbs-down text-lg"></i>
              </button>

              {/* Yorum Sayısı */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                <i className="hgi-stroke hgi-comment-01 text-lg"></i>
                <span>{post.commentCount} yorum</span>
              </div>

              {/* Paylaş */}
              <div className="relative" ref={shareMenuRef}>
                <button 
                  onClick={() => setShowShareMenu(!showShareMenu)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <i className="hgi-stroke hgi-share-08 text-lg"></i>
                  <span>Paylaş</span>
                </button>

                {showShareMenu && (
                  <div className="absolute left-0 mt-1 w-48 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-border-light dark:border-border-dark py-1 z-50">
                    <button
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(window.location.href)
                          setShowShareMenu(false)
                        } catch (err) {
                          console.error('Kopyalama hatası:', err)
                        }
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-black/5 dark:hover:bg-white/5 flex items-center gap-2"
                    >
                      <i className="hgi-stroke hgi-link-01 text-lg"></i>
                      Bağlantıyı Kopyala
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Yorum Yap Formu */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 border border-border-light/60 dark:border-border-dark/60 mb-4">
            <h3 className="font-bold text-sm mb-3">Yorum Yap</h3>
            {user ? (
              <form onSubmit={handleSubmitComment}>
                <div className="flex gap-3">
                  <div 
                    className="w-10 h-10 rounded-full bg-center bg-cover bg-no-repeat bg-gray-400 flex-shrink-0"
                    style={{ backgroundImage: `url("${user.photoURL}")` }}
                  />
                  <div className="flex-1">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Düşüncelerini paylaş..."
                      className="w-full p-3 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark placeholder:text-text-secondary-light dark:placeholder:text-text-secondary-dark resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                      rows={3}
                    />
                    <div className="flex justify-end mt-2">
                      <button
                        type="submit"
                        disabled={submitting || !commentText.trim()}
                        className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? 'Gönderiliyor...' : 'Gönder'}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm">
                Yorum yapmak için <Link href="/login" className="text-primary font-semibold hover:underline">giriş yap</Link>.
              </p>
            )}
          </div>

          {/* Yorumlar */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-4 border border-border-light/60 dark:border-border-dark/60">
            <h3 className="font-bold text-sm mb-4">Yorumlar ({comments.length})</h3>
            
            {comments.length === 0 ? (
              <p className="text-text-secondary-light dark:text-text-secondary-dark text-sm text-center py-6">
                Henüz yorum yapılmamış. İlk yorumu sen yap!
              </p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <CommentItem 
                    key={comment.id} 
                    comment={comment} 
                    currentUser={user} 
                    onDelete={handleCommentDelete} 
                  />
                ))}
              </div>
            )}
          </div>
            </div>

            {/* Sağ Sidebar */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <RightSidebar />
            </div>
          </div>
        </div>
      </main>

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
    </div>
  )
}
