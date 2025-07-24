
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ContinentMapping {
  [key: string]: { continent: string; continentCode: string }
}

const continentMapping: ContinentMapping = {
  'North America': { continent: 'North America', continentCode: 'NA' },
  'South America': { continent: 'South America', continentCode: 'SA' },
  'Europe': { continent: 'Europe', continentCode: 'EU' },
  'Asia': { continent: 'Asia', continentCode: 'AS' },
  'Africa': { continent: 'Africa', continentCode: 'AF' },
  'Oceania': { continent: 'Oceania', continentCode: 'OC' },
  'Antarctica': { continent: 'Antarctica', continentCode: 'AN' }
}

const flagMapping: { [key: string]: string } = {
  'NA': '🌎',
  'SA': '🌎', 
  'EU': '🌍',
  'AS': '🌏',
  'AF': '🌍',
  'OC': '🌏',
  'AN': '🐧'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { taps = 1, selectedContinent } = await req.json()
    
    let continentCode = 'SA' // Default fallback
    let continentName = 'South America'
    let flagEmoji = '🌎'

    // If user has manually selected a continent, use that
    if (selectedContinent && selectedContinent.code) {
      continentCode = selectedContinent.code
      continentName = selectedContinent.name
      flagEmoji = selectedContinent.flag
      console.log(`Using user-selected continent: ${continentName} (${continentCode})`)
    } else {
      // Fall back to IP-based detection
      const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 
                      req.headers.get('x-real-ip') || 
                      req.headers.get('cf-connecting-ip') || 
                      '127.0.0.1'

      console.log(`Processing tap from IP: ${clientIP}`)
      console.log('Headers:', Object.fromEntries(req.headers.entries()))

      try {
        // Use ip-api.com for geolocation
        const geoResponse = await fetch(`http://ip-api.com/json/${clientIP}?fields=continent,continentCode`)
        
        if (geoResponse.ok) {
          const geoData = await geoResponse.json()
          console.log(`IP API response for ${clientIP}:`, geoData)

          if (geoData.continent && continentMapping[geoData.continent]) {
            const mapped = continentMapping[geoData.continent]
            continentCode = mapped.continentCode
            continentName = mapped.continent
            flagEmoji = flagMapping[continentCode] || '🌍'
            console.log(`Mapped to continent: ${continentName} (${continentCode})`)
          } else {
            console.log(`Unknown continent from API: ${geoData.continent}, using default: South America`)
          }
        } else {
          console.log(`IP API failed with status: ${geoResponse.status}, using default continent`)
        }
      } catch (geoError) {
        console.error('Error fetching geolocation:', geoError)
        console.log('Using default continent: South America')
      }
    }

    // Call the increment function
    const { error } = await supabaseClient.rpc('increment_continent_taps', {
      p_continent_code: continentCode,
      p_continent_name: continentName,
      p_flag_emoji: flagEmoji
    })

    if (error) {
      console.error('Error incrementing continent taps:', error)
      throw error
    }

    console.log(`Successfully incremented taps for ${continentName}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        continent: continentName,
        continentCode: continentCode,
        method: selectedContinent ? 'user-selected' : 'ip-detected'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in track-continent-tap:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
