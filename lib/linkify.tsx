import React from 'react'

// URL regex pattern - http, https, www ile başlayan linkler
const URL_REGEX = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g

interface LinkifyProps {
  text: string
  className?: string
}

/**
 * Metindeki URL'leri tıklanabilir linklere çevirir
 */
export function Linkify({ text, className = '' }: LinkifyProps) {
  if (!text) return null

  const parts = text.split(URL_REGEX).filter(Boolean)

  return (
    <>
      {parts.map((part, index) => {
        // URL mi kontrol et
        if (part.match(URL_REGEX)) {
          // www ile başlıyorsa https ekle
          const url = part.startsWith('www.') ? `https://${part}` : part
          
          return (
            <a
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium break-all"
              onClick={(e) => e.stopPropagation()} // Post card tıklamasını engelle
            >
              {part}
            </a>
          )
        }
        
        // Normal metin
        return <span key={index}>{part}</span>
      })}
    </>
  )
}

/**
 * Sadece URL'leri plain string olarak döndürür (title vb. için)
 */
export function stripLinks(text: string): string {
  return text.replace(URL_REGEX, '[link]')
}

/**
 * Metinde link var mı kontrol eder
 */
export function hasLinks(text: string): boolean {
  return URL_REGEX.test(text)
}

