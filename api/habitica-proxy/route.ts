import { NextResponse } from 'next/server'

const HABITICA_API_URL = 'https://habitica.com/api/v3'

export async function GET() {
  try {
    const response = await fetch(`${HABITICA_API_URL}/user`, {
      headers: {
        'x-api-user': process.env.HABITICA_USER_ID!,
        'x-api-key': process.env.HABITICA_API_TOKEN!,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch Habitica stats')
    }

    const data = await response.json()
    return NextResponse.json(data.data)
  } catch (error) {
    console.error('Error fetching Habitica stats:', error)
    return NextResponse.json({ error: 'Failed to fetch Habitica stats' }, { status: 500 })
  }
}

