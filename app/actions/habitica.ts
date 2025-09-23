"use server";

const HABITICA_API_URL = "https://habitica.com/api/v3";

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
        "Habitica credentials not found. Please set HABITICA_USER_ID and HABITICA_API_TOKEN environment variables.",
      );
    }

    return await getHabiticaStatsWithCredentials(
      process.env.HABITICA_USER_ID!,
      process.env.HABITICA_API_TOKEN!
    );
  } catch (error) {
    console.error("Error fetching Habitica stats:", error);
    throw error;
  }
}

export async function getHabiticaStatsWithCredentials(
  userId: string,
  apiToken: string
): Promise<HabiticaStats> {
  try {
    console.log("Making request to Habitica API...");
    const response = await fetch(`${HABITICA_API_URL}/user`, {
      headers: {
        "x-client": "habitica-readme-stats-1.0.0",
        "x-api-user": userId,
        "x-api-key": apiToken,
        "Content-Type": "application/json",
      },
    });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(
        `Habitica API returned ${response.status}: ${response.statusText}. ${errorText}`,
      );
    }

    const data = await response.json();
    console.log("Raw API response structure:", {
      hasData: !!data.data,
      hasStats: !!data.data?.stats,
      dataKeys: data.data ? Object.keys(data.data) : [],
      statsKeys: data.data?.stats ? Object.keys(data.data.stats) : []
    });

    if (!data.data || !data.data.stats) {
      throw new Error("Invalid response structure from Habitica API");
    }

    const stats = data.data.stats;

    // Validate required fields
    const requiredFields = ['hp', 'maxHealth', 'mp', 'maxMP', 'exp', 'toNextLevel', 'lvl', 'class'];
    const missingFields = requiredFields.filter(field => stats[field] === undefined);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields from Habitica API: ${missingFields.join(', ')}`);
    }

    const result = {
      hp: Number(stats.hp) || 0,
      maxHealth: Number(stats.maxHealth) || 50,
      mp: Number(stats.mp) || 0,
      maxMP: Number(stats.maxMP) || 0,
      exp: Number(stats.exp) || 0,
      toNextLevel: Number(stats.toNextLevel) || 100,
      lvl: Number(stats.lvl) || 1,
      gp: Math.floor(Number(stats.gp) || 0),
      class: String(stats.class || 'warrior'),
    };

    console.log("Processed stats:", result);
    return result;
  } catch (error) {
    console.error("Error in getHabiticaStatsWithCredentials:", error);
    throw error;
  }
}
