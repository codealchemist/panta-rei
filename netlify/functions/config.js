/**
 * Netlify Function: config
 * GET /api/config
 *
 * Returns public site configuration (social links, etc.).
 * Does NOT expose sensitive env vars (Box tokens).
 */

exports.handler = async function (event) {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const { SOCIAL_INSTAGRAM, SOCIAL_SPOTIFY, SOCIAL_YOUTUBE, SOCIAL_EMAIL } = process.env

  const config = {
    social: {
      instagram: SOCIAL_INSTAGRAM || null,
      spotify: SOCIAL_SPOTIFY || null,
      youtube: SOCIAL_YOUTUBE || null,
      email: SOCIAL_EMAIL || null,
    },
  }

  return {
    statusCode: 200,
    body: JSON.stringify(config),
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300',
    },
  }
}
