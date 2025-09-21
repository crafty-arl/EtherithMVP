/**
 * Discord OAuth Callback Handler for Etherith
 * Handles Discord OAuth callback and returns user profile data
 */

export async function onRequest(context) {
    const { request, env } = context;

    // CORS headers for cross-origin requests
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 200, headers: corsHeaders });
    }

    try {
        const url = new URL(request.url);
        const code = url.searchParams.get('code');
        const state = url.searchParams.get('state');

        if (!code) {
            return new Response(
                JSON.stringify({ error: 'Missing authorization code' }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            );
        }

        console.log('🎮 Processing Discord OAuth callback');

        // Exchange code for access token
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: env.DISCORD_CLIENT_ID,
                client_secret: env.DISCORD_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: env.DISCORD_REDIRECT_URI,
            }),
        });

        if (!tokenResponse.ok) {
            throw new Error(`Token exchange failed: ${tokenResponse.status}`);
        }

        const tokenData = await tokenResponse.json();
        console.log('✅ Discord token obtained');

        // Get user profile
        const userResponse = await fetch('https://discord.com/api/users/@me', {
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`,
            },
        });

        if (!userResponse.ok) {
            throw new Error(`User fetch failed: ${userResponse.status}`);
        }

        const userData = await userResponse.json();
        console.log('✅ Discord user profile obtained:', userData.username);

        // Create Etherith user profile
        const etherithProfile = {
            id: userData.id,
            username: userData.username,
            discriminator: userData.discriminator,
            avatar: userData.avatar,
            avatarURL: userData.avatar
                ? `https://cdn.discordapp.com/avatars/${userData.id}/${userData.avatar}.webp`
                : `https://cdn.discordapp.com/embed/avatars/${parseInt(userData.discriminator || '0') % 5}.png`,
            email: userData.email,
            verified: userData.verified,
            timestamp: Date.now(),
            accessToken: tokenData.access_token, // Store for potential future API calls
            refreshToken: tokenData.refresh_token
        };

        // Return HTML that will store auth data locally and redirect back to app
        const htmlResponse = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Discord Login Success</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
                    background: #2c2f33;
                    color: white;
                    text-align: center;
                    padding: 60px 20px;
                }
                .success {
                    max-width: 400px;
                    margin: 0 auto;
                }
                .avatar {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    margin: 0 auto 20px;
                }
                .loading {
                    margin-top: 30px;
                    opacity: 0.7;
                }
                .spinner {
                    border: 2px solid #f3f3f3;
                    border-top: 2px solid #3498db;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    animation: spin 1s linear infinite;
                    margin: 10px auto;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        </head>
        <body>
            <div class="success">
                <img src="${etherithProfile.avatarURL}" alt="Avatar" class="avatar">
                <h1>Welcome to Etherith!</h1>
                <p>Successfully logged in as <strong>${etherithProfile.username}</strong></p>
                <div class="loading">
                    <div class="spinner"></div>
                    Storing your session locally...
                </div>
            </div>

            <script>
                // Store user data in localStorage for local-first approach
                const userData = ${JSON.stringify(etherithProfile)};
                
                try {
                    // Store in localStorage as fallback
                    localStorage.setItem('etherith_user', JSON.stringify(userData));
                    localStorage.setItem('etherith_auth_timestamp', Date.now().toString());
                    
                    console.log('✅ User data stored locally:', userData.username);
                    
                    // Try to communicate with parent window first
                    if (window.opener && !window.opener.closed) {
                        try {
                            window.opener.postMessage({
                                type: 'DISCORD_LOGIN_SUCCESS',
                                user: userData
                            }, window.location.origin);
                            
                            console.log('✅ Message sent to parent window');
                            
                            // Close popup after short delay
                            setTimeout(() => {
                                window.close();
                            }, 1500);
                        } catch (error) {
                            console.warn('⚠️ Failed to communicate with parent, using redirect fallback');
                            // Fallback: redirect to main app
                            setTimeout(() => {
                                window.location.href = '/?auth=' + btoa(JSON.stringify(userData));
                            }, 2000);
                        }
                    } else {
                        // No parent window, redirect to main app
                        console.log('📱 No parent window, redirecting to main app');
                        setTimeout(() => {
                            window.location.href = '/?auth=' + btoa(JSON.stringify(userData));
                        }, 2000);
                    }
                } catch (error) {
                    console.error('❌ Failed to store user data:', error);
                    // Still try to redirect with URL parameter
                    setTimeout(() => {
                        window.location.href = '/?auth=' + btoa(JSON.stringify(userData));
                    }, 2000);
                }
            </script>
        </body>
        </html>
        `;

        return new Response(htmlResponse, {
            headers: {
                ...corsHeaders,
                'Content-Type': 'text/html; charset=utf-8',
            },
        });

    } catch (error) {
        console.error('❌ Discord OAuth error:', error);

        const errorHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Login Error</title>
            <style>
                body {
                    font-family: system-ui, sans-serif;
                    background: #2c2f33;
                    color: white;
                    text-align: center;
                    padding: 60px 20px;
                }
                .error {
                    max-width: 400px;
                    margin: 0 auto;
                    background: #ed4245;
                    padding: 30px;
                    border-radius: 8px;
                }
            </style>
        </head>
        <body>
            <div class="error">
                <h1>❌ Login Failed</h1>
                <p>There was an error logging in with Discord.</p>
                <p><small>${error.message}</small></p>
                <button onclick="window.close()">Close</button>
            </div>
        </body>
        </html>
        `;

        return new Response(errorHtml, {
            status: 500,
            headers: {
                ...corsHeaders,
                'Content-Type': 'text/html; charset=utf-8',
            },
        });
    }
}