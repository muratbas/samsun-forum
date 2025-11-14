import PostCard from './PostCard'

// Mock data for now - will be replaced with Firebase data
const mockPosts = [
  {
    id: '1',
    title: 'Atakum yakınlarındaki en iyi pideci?',
    content:
      'Atakum bölgesindeki en otantik ve lezzetli pide için tavsiye arıyorum. Buraya yeni taşındım ve güzel bir mekan bulmam lazım! Favorileriniz nereler?',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDekL5cRKyyw5QwRj9nziP5ijNb3Z9IbJhZv0-FK5DpXaoAjXRaKtu-16C67Xieyz3iWyNx9SJHQ61P7FheAG13wfOaJFG6nn01E9StofShmAevaS2Jlj1PnlF7hwa1H49ViafUcT3pJKnu3ebwHvHRPYRvfoYgZJfY89f39maEqa15ogtFGiQJ7__n37wcSny7AWhLFJUHYiiNyXs4s3Eju3Jms2mkfYeji14YEIPfUdcKO_FcbmIewznRo2jVYTIMttF_lgVUk3g',
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
    content: '',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCdzm6Rdu9yPd2qjNXaX4zXhC9LHC_uMEXeUwJI5vKgFIamkV_y9Wk_cftD1T7wKvCI--Kkghjz3sQjgPiJZN7AXp8u-Xl2cwamZBTYw3byALH5Hf-HSLssnPcNQ0WRlFLVMyIfYZEFn5B8x8c7FXYDe1FuWdFbJ7HpIgb3Ubjno3UN4P6lOjkzGPDf-VyBtbvzuGzqQ4z3FC68FQTWs5JKyKaN25DUL6E6HE5EJmAwsk0GsfP7D5ig36RUXQhrSBlA0y_MUK4jjYg',
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

