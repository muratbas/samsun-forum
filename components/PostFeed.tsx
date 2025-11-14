import PostCard from './PostCard'

// Mock data - Firebase'den gerçek veri gelene kadar
const mockPosts = [
  {
    id: '1',
    title: 'Atakum yakınlarındaki en iyi pideci?',
    content:
      'Atakum bölgesindeki en otantik ve lezzetli pide için tavsiye arıyorum. Buraya yeni taşındım ve güzel bir mekan bulmam lazım! Favorileriniz nereler?',
    imageUrl:
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    authorNickname: 'samsunlu55',
    topicName: 'Yemek',
    topicSlug: 'yemek',
    upvotes: 1200,
    downvotes: 0,
    commentCount: 82,
    timeAgo: '2 saat önce',
  },
  {
    id: '2',
    title: "Atatürk Bulvarı'nda yol çalışması",
    content: 'Dikkat! Bu hafta sonu trafik yoğun olabilir.',
    imageUrl:
      'https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=400',
    authorNickname: 'karadeniz_asigi',
    topicName: 'Gündem',
    topicSlug: 'gundem',
    upvotes: 347,
    downvotes: 0,
    commentCount: 45,
    timeAgo: '5 saat önce',
  },
  {
    id: '3',
    title: 'CANLI: Samsunspor vs. Adanaspor maçı',
    content: 'Maç hakkındaki düşünceleriniz neler? Haydi Kırmızı Şimşekler!',
    authorNickname: 'samsunsporlu',
    topicName: 'Samsunspor',
    topicSlug: 'samsunspor',
    upvotes: 912,
    downvotes: 0,
    commentCount: 218,
    timeAgo: '1 gün önce',
  },
]

export default function PostFeed() {
  return (
    <div className="flex flex-col gap-4">
      {mockPosts.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  )
}

