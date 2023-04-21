import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import '@aws-amplify/ui-react/styles.css'
import { AmplifyProvider } from '@aws-amplify/ui-react'
export default function App({ Component, pageProps }: AppProps) {
  return (
  <AmplifyProvider>
    <Component {...pageProps} />
  </AmplifyProvider>
  )
}
