export type ClubGift = {
  image: string
  name: string
}

const gifts: Record<string, ClubGift> = {
  vasco: { image: '/gifts/gg.webp', name: 'GG' },
  palmeiras: { image: '/gifts/glowsticks.webp', name: 'Bastões luminosos' },
  santos: { image: '/gifts/cake.webp', name: 'Fatia de bolo' },
  'sao-paulo': { image: '/gifts/thumbs.webp', name: 'Joinha' },
  internacional: { image: '/gifts/piano.webp', name: 'Teclado divertido' },
  botafogo: { image: '/gifts/tiktok.webp', name: 'TikTok' },
  flamengo: { image: '/gifts/heartbox.webp', name: 'Coração surpresa' },
  'atletico-mg': { image: '/gifts/whiterose.webp', name: 'Rosa branca' },
  'athletico-pr': { image: '/gifts/keyboard.webp', name: 'Teclado musical' },
  corinthians: { image: '/gifts/car.webp', name: 'Carro esportivo' },
  remo: { image: '/gifts/fries.webp', name: 'Batata frita' },
  gremio: { image: '/gifts/rose.webp', name: 'Rosa' },
  vitoria: { image: '/gifts/radio.webp', name: 'Rádio' },
  cruzeiro: { image: '/gifts/pinkheart.webp', name: 'Coração rosa' },
  bahia: { image: '/gifts/heartface.webp', name: 'Abraço de coração' },
  ceara: { image: '/gifts/cat.webp', name: 'Gatinho' },
  fluminense: { image: '/gifts/tiktokheart.webp', name: 'TikTok coração' },
  fortaleza: { image: '/gifts/mascot.webp', name: 'Mascote TikTok' },
  sport: { image: '/gifts/icecream.webp', name: 'Sorvete' },
  bragantino: { image: '/gifts/microphone.webp', name: 'Microfone musical' },
}

export function getClubGift(clubId: string): ClubGift {
  return gifts[clubId] ?? { image: '/gifts/gg.webp', name: 'Presente' }
}
