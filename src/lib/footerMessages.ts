const messages = [
  'If you can still hear your thoughts, add more rain.',
  'Looks like we have a modern hippie here...',
  'Consider supporting this app, I need to play Ocarina of Time remake :(',
  'If you like this app, consider supporting — you\'ll earn absolutely f* nothing :)',
  'Consider supporting this app, GTA VI will be very expensive :(',
  'I\'ll add a World Cup ambient sound one day.',
  'I may have to pay Cloudflare one day, consider supporting pls D:',
  'This looks vibe-coded? Well, it is...',
  'Imagine if presidents used this — there would be no more wars.',
  'Hey! Listen! Link, can you support this app?',
  'I am once again asking you for financial support.',
  '*Passinho do Jamal*',
  'Built at 2am, tested at 3am, deployed at 4am.',
  'My mom still doesn\'t understand what this does.',
  'It\'s dangerous to focus alone. Take this.',
  'No AI was harmed in the making of this app. Mostly.',
  'Please don\'t close this tab, I (Claude) worked really hard on it.',
  'The sounds are free. The developer is not.',
  'Not responsible for any accidental naps.',
  'One day I\'ll refactor this. One day.',
  'Your open-plan office wishes it sounded this good.',
  'Powered by caffeine and existential dread.',
  'If this crashes, it\'s Cloudflare\'s fault. Probably.',
  'Waiting for the Mortal Kombat: Shaolin Monks remake man ...'
]

export function randomFooterMessage(): string {
  return messages[Math.floor(Math.random() * messages.length)]!
}
