'use server'

const HABITICA_API_URL = 'https://habitica.com/api/v3'

interface HabiticaStats {
  hp: number
  maxHealth: number
  mp: number
  maxMP: number
  exp: number
  toNextLevel: number
  lvl: number
  gp: number
  class: string
}

export async function getHabiticaStats(): Promise<HabiticaStats> {
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
    const stats = data.data.stats

    return {
      hp: stats.hp,
      maxHealth: stats.maxHealth,
      mp: stats.mp,
      maxMP: stats.maxMP,
      exp: stats.exp,
      toNextLevel: stats.toNextLevel,
      lvl: stats.lvl,
      gp: Math.floor(stats.gp),
      class: stats.class
    }
  } catch (error) {
    console.error('Error fetching Habitica stats:', error)
    throw error
  }
}

