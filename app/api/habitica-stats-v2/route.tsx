import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    // Different approach to URL parsing
    const requestUrl = request.url;
    console.log('Raw request URL:', requestUrl);
    
    // Manual parameter extraction
    const urlParts = requestUrl.split('?');
    const hasParams = urlParts.length > 1;
    const paramString = hasParams ? urlParts[1] : '';
    
    console.log('Param string:', paramString);
    
    // Parse manually
    const params: Record<string, string> = {};
    if (paramString) {
      paramString.split('&').forEach(pair => {
        const [key, value] = pair.split('=');
        if (key && value) {
          params[decodeURIComponent(key)] = decodeURIComponent(value);
        }
      });
    }
    
    console.log('Parsed params:', params);
    
    const userId = params.userId || params.userid;
    const apiToken = params.apiToken || params.apitoken;
    
    // If no credentials, show parameter info
    if (!userId || !apiToken) {
      return new ImageResponse(
        (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#2D1B47",
              fontFamily: "monospace",
              color: "white",
              padding: "20px",
            }}
          >
            <h1 style={{ fontSize: "24px", margin: "0 0 20px 0" }}>
              Parameters Debug
            </h1>
            <p style={{ fontSize: "16px", margin: "0 0 10px 0" }}>
              URL: {requestUrl}
            </p>
            <p style={{ fontSize: "14px", margin: "0 0 10px 0" }}>
              Has params: {hasParams ? 'Yes' : 'No'}
            </p>
            <p style={{ fontSize: "14px", margin: "0 0 10px 0" }}>
              Param string: {paramString || 'None'}
            </p>
            <p style={{ fontSize: "14px", margin: "0 0 10px 0" }}>
              UserId found: {userId ? 'Yes' : 'No'}
            </p>
            <p style={{ fontSize: "14px", margin: "0 0 10px 0" }}>
              ApiToken found: {apiToken ? 'Yes' : 'No'}
            </p>
            <div style={{ fontSize: "12px", marginTop: "20px", textAlign: "left" }}>
              <p>All params:</p>
              {Object.entries(params).map(([key, value]) => (
                <div key={key}>
                  {key}: {value.substring(0, 20)}...
                </div>
              ))}
            </div>
          </div>
        ),
        {
          width: 600,
          height: 400,
        }
      );
    }
    
    // If we have credentials, try a simple fetch
    console.log('Attempting Habitica API call...');
    
    const response = await fetch('https://habitica.com/api/v3/user', {
      headers: {
        'x-client': 'habitica-readme-stats-v2',
        'x-api-user': userId,
        'x-api-key': apiToken,
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Habitica API response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('Habitica API error:', errorText);
      
      return new ImageResponse(
        (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#2D1B47",
              fontFamily: "monospace",
              color: "#F74E52",
              padding: "20px",
            }}
          >
            <h1 style={{ fontSize: "24px", margin: "0 0 20px 0" }}>
              API Error
            </h1>
            <p style={{ fontSize: "16px", margin: "0 0 10px 0" }}>
              Status: {response.status}
            </p>
            <p style={{ fontSize: "14px", margin: "0", textAlign: "center" }}>
              {errorText.substring(0, 100)}...
            </p>
          </div>
        ),
        {
          width: 600,
          height: 400,
        }
      );
    }
    
    const data = await response.json();
    console.log('Got Habitica data, generating image...');
    
    const stats = data.data.stats;
    
    // Generate success image
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#2D1B47",
            fontFamily: "monospace",
            color: "white",
            padding: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "30px",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#8B5CF6",
                borderRadius: "50%",
                marginRight: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "40px",
              }}
            >
              🎮
            </div>
            <div>
              <h1 style={{ fontSize: "28px", margin: "0", color: "white" }}>
                @{stats.class}
              </h1>
              <p style={{ fontSize: "18px", margin: "5px 0 0 0", color: "#D3D3D3" }}>
                Level {stats.lvl} {stats.class}
              </p>
            </div>
          </div>
          
          <div style={{ width: "100%", maxWidth: "400px" }}>
            {/* Health Bar */}
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#D3D3D3",
                  fontSize: "14px",
                  marginBottom: "5px",
                }}
              >
                <span>❤️ Health</span>
                <span>{Math.floor(stats.hp)} / {stats.maxHealth}</span>
              </div>
              <div
                style={{
                  height: "20px",
                  backgroundColor: "#4D3B67",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(100, (stats.hp / stats.maxHealth) * 100)}%`,
                    height: "100%",
                    backgroundColor: "#F74E52",
                  }}
                />
              </div>
            </div>

            {/* Experience Bar */}
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#D3D3D3",
                  fontSize: "14px",
                  marginBottom: "5px",
                }}
              >
                <span>⭐ Experience</span>
                <span>{Math.floor(stats.exp)} / {stats.toNextLevel}</span>
              </div>
              <div
                style={{
                  height: "20px",
                  backgroundColor: "#4D3B67",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(100, (stats.exp / stats.toNextLevel) * 100)}%`,
                    height: "100%",
                    backgroundColor: "#FFB445",
                  }}
                />
              </div>
            </div>

            {/* Mana Bar */}
            <div style={{ marginBottom: "20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#D3D3D3",
                  fontSize: "14px",
                  marginBottom: "5px",
                }}
              >
                <span>💎 Mana</span>
                <span>{Math.floor(stats.mp)} / {stats.maxMP}</span>
              </div>
              <div
                style={{
                  height: "20px",
                  backgroundColor: "#4D3B67",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(100, (stats.mp / stats.maxMP) * 100)}%`,
                    height: "100%",
                    backgroundColor: "#50B5E9",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 600,
        height: 400,
      }
    );
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#2D1B47",
            fontFamily: "monospace",
            color: "#F74E52",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: "24px", margin: "0 0 10px 0" }}>
              Unexpected Error
            </h1>
            <p style={{ fontSize: "14px", margin: "0" }}>
              {error instanceof Error ? error.message : 'Unknown error'}
            </p>
          </div>
        </div>
      ),
      {
        width: 600,
        height: 400,
      }
    );
  }
}
