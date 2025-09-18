'use server'

const HABITICA_API_URL = 'https://habitica.com/api/v3'

interface HabiticaStats {
  hp: number;
  maxHealth: number;
  mp: number;
  maxMP: number;
  exp: number;
  toNextLevel: number;
  lvl: number;
  gp: number;
  class: string;
}

export async function getHabiticaStats(): Promise<HabiticaStats> {
  try {
    // Check if environment variables are set
    if (!process.env.HABITICA_USER_ID || !process.env.HABITICA_API_TOKEN) {
      throw new Error(
        "Habitica credentials not found. Please set HABITICA_USER_ID and HABITICA_API_TOKEN environment variables."
      );
    }

    const response = await fetch(`${HABITICA_API_URL}/user`, {
      headers: {
        "x-client": "habitica-readme-stats-1.0.0",
        "x-api-user": process.env.HABITICA_USER_ID!,
        "x-api-key": process.env.HABITICA_API_TOKEN!,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to fetch Habitica stats: ${response.status} ${response.statusText} - ${errorText}`
      );
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

