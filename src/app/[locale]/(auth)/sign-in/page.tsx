import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import CredentialsSignInForm from './credentials-signin-form'
import { Button } from '@/components/ui/button'
import { getSetting } from '@/actions/settings/settings'
import { Separator } from '@/components/ui/separator'

export default async function SignInPage(props: {
  searchParams: Promise<{
    callbackUrl: string
  }>
}) {
  const searchParams = await props.searchParams
  let site

  try {
    const settings = await getSetting()
    site = settings.site
  } catch (error) {
    console.error('Failed to fetch site settings:', error)
    site = { name: 'our site' } // Fallback value
  }

  const { callbackUrl = '/' } = searchParams

  return (
    <div className='w-full'>
      <Card>
        <CardHeader>
          <CardTitle className='text-2xl'>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <CredentialsSignInForm />
            <Separator />
            <div className='mt-4'>
              {/* Placeholder for additional forms */}
            </div>
          </div>
        </CardContent>
      </Card>
      <Separator>New to {site.name}?</Separator>

      <Link href={`/sign-up?callbackUrl=${encodeURIComponent(callbackUrl)}`}>
        <Button className='w-full' variant='outline'>
          Create your {site.name} account
        </Button>
      </Link>
    </div>
  )
}
