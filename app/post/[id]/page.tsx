'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { getPost } from '@/lib/posts'
import { getCommentsByPost, createComment } from '@/lib/comments'
import { upvotePost, downvotePost, getUserVote } from '@/lib/votes'
import { Post, Comment } from '@/types'
import { formatDistanceToNow } from 'date-fns'
import { tr } from 'date-fns/locale'
import { Linkify } from '@/lib/linkify'
import LeftSidebar from '@/components/LeftSidebar'

export default function PostDetailPage() {
  const params = useParams()
  const postId = params.id as string
  const { user } = useAuth()
  
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  
  // Vote state
  const [voteState, setVoteState] = useState<'upvote' | 'downvote' | null>(null)
  const [currentScore, setCurrentScore] = useState(0)
  const [voting, setVoting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Post ID:', postId) // Debug
        const postData = await getPost(postId)
        console.log('Post Data:', postData) // Debug
        setPost(postData)
        setCurrentScore(postData.score)
        
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
        commentText.trim()
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

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <LeftSidebar />
        <main className="flex-1 lg:ml-64">
          <div className="max-w-3xl mx-auto px-4 py-6">
            <div className="animate-pulse">
              <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6">
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
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
          <div className="max-w-3xl mx-auto px-4 py-6">
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 text-center">
              <p className="text-text-secondary-light dark:text-text-secondary-dark">
                Gönderi bulunamadı
              </p>
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
        <div className="max-w-3xl mx-auto px-4 py-6">
          
          {/* Post Detay */}
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-6 border border-border-light/60 dark:border-border-dark/60 mb-4">
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
                  <span className="text-text-secondary-light dark:text-text-secondary-dark text-xs">•</span>
                  <span className="text-text-secondary-light dark:text-text-secondary-dark text-xs">{timeAgo}</span>
                  <span className="text-text-secondary-light dark:text-text-secondary-dark text-xs">•</span>
                  <a href={`/topic/${post.topicId}`} className="text-primary font-semibold text-xs hover:underline">
                    #{post.topicName}
                  </a>
                </div>
              </div>
              
              <button className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-text-secondary-light dark:text-text-secondary-dark">
                <span className="material-symbols-outlined">more_horiz</span>
              </button>
            </div>

            {/* Başlık */}
            <h1 className="text-xl font-bold leading-snug mb-3">
              <Linkify text={post.title} />
            </h1>

            {/* İçerik */}
            {post.content && (
              <p className="text-text-primary-light dark:text-text-primary-dark text-base leading-relaxed mb-4">
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
              >
                <span className="material-symbols-outlined text-lg">thumb_down</span>
              </button>

              {/* Yorum Sayısı */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark">
                <span className="material-symbols-outlined text-lg">chat_bubble_outline</span>
                <span>{post.commentCount} yorum</span>
              </div>

              {/* Paylaş */}
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-text-secondary-light dark:text-text-secondary-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <span className="material-symbols-outlined text-lg">share</span>
              </button>
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
                Yorum yapmak için <a href="#" className="text-primary font-semibold hover:underline">giriş yap</a>.
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
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

// Yorum komponenti
function CommentItem({ comment }: { comment: Comment }) {
  const timeAgo = comment.createdAt
    ? formatDistanceToNow(comment.createdAt.toDate(), { addSuffix: true, locale: tr })
    : 'az önce'

  return (
    <div className="flex gap-3">
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
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-sm">{comment.authorNickname}</span>
          <span className="text-text-secondary-light dark:text-text-secondary-dark text-xs">{timeAgo}</span>
        </div>
        <p className="text-text-primary-light dark:text-text-primary-dark text-sm">
          {comment.content}
        </p>
      </div>
    </div>
  )
}

