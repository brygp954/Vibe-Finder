import './globals.css'

export const metadata = {
  title: 'Find Your Vibe — Cannabis Explorer',
  description: 'Tell us what you\'re looking for and we\'ll match you with something you\'ll love.',
  openGraph: {
    title: 'Find Your Vibe — Cannabis Explorer',
    description: 'Personalized cannabis recommendations powered by real user data.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,800&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#0F0E13" />
      </head>
      <body>{children}</body>
    </html>
  )
}
