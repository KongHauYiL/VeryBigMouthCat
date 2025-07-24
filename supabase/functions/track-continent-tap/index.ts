
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// IP to continent mapping using IP range analysis
const getContinentFromIP = async (ip: string): Promise<{ code: string, name: string, emoji: string }> => {
  const continents = [
    { code: 'NA', name: 'North America', emoji: '🌎' },
    { code: 'EU', name: 'Europe', emoji: '🌍' },
    { code: 'AS', name: 'Asia', emoji: '🌏' },
    { code: 'SA', name: 'South America', emoji: '🌎' },
    { code: 'AF', name: 'Africa', emoji: '🌍' },
    { code: 'OC', name: 'Oceania', emoji: '🌏' },
    { code: 'AN', name: 'Antarctica', emoji: '🐧' },
  ];

  try {
    // Use ip-api.com for free IP geolocation
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=continent,continentCode`);
    const data = await response.json();
    
    console.log(`IP API response for ${ip}:`, data);
    
    if (data.status === 'success' && data.continentCode) {
      // Map the continent codes from ip-api to our format
      const continentMapping: { [key: string]: string } = {
        'NA': 'NA', // North America
        'SA': 'SA', // South America
        'EU': 'EU', // Europe
        'AS': 'AS', // Asia
        'AF': 'AF', // Africa
        'OC': 'OC', // Oceania
        'AN': 'AN', // Antarctica
      };
      
      const mappedCode = continentMapping[data.continentCode] || 'NA';
      const continent = continents.find(c => c.code === mappedCode);
      
      if (continent) {
        console.log(`Successfully mapped IP ${ip} to continent: ${continent.name}`);
        return continent;
      }
    }
  } catch (error) {
    console.error('Error fetching IP geolocation:', error);
  }
  
  // Fallback to basic IP range analysis for common cases
  if (ip.startsWith('127.') || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    console.log('Local IP detected, defaulting to North America');
    return continents[0]; // North America for local IPs
  }
  
  // Parse IP to determine rough geographic location
  const ipParts = ip.split('.');
  if (ipParts.length === 4) {
    const firstOctet = parseInt(ipParts[0]);
    
    // Basic IP range mapping (simplified)
    if (firstOctet >= 1 && firstOctet <= 36) return continents[0]; // North America
    if (firstOctet >= 37 && firstOctet <= 79) return continents[1]; // Europe  
    if (firstOctet >= 80 && firstOctet <= 150) return continents[2]; // Asia
    if (firstOctet >= 151 && firstOctet <= 190) return continents[3]; // South America
    if (firstOctet >= 191 && firstOctet <= 223) return continents[4]; // Africa
    if (firstOctet >= 224 && firstOctet <= 239) return continents[5]; // Oceania
  }
  
  console.log(`Could not determine continent for IP ${ip}, defaulting to North America`);
  return continents[0]; // Default to North America
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      'https://zhmlliieewayqtnafmfl.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpobWxsaWllZXdheXF0bmFmbWZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MzM2NzksImV4cCI6MjA2ODQwOTY3OX0.hxZhy_3RztYeGCj7qoPUuDK4ama4IGmt1gU5ts78MDw'
    );

    // Get client IP from various headers
    const xForwardedFor = req.headers.get('x-forwarded-for');
    const xRealIP = req.headers.get('x-real-ip');
    const cfConnectingIP = req.headers.get('cf-connecting-ip');
    
    // Extract the actual client IP (first IP in the chain)
    let clientIP = '127.0.0.1';
    
    if (cfConnectingIP) {
      clientIP = cfConnectingIP;
    } else if (xRealIP) {
      clientIP = xRealIP;
    } else if (xForwardedFor) {
      clientIP = xForwardedFor.split(',')[0].trim();
    }

    console.log(`Processing tap from IP: ${clientIP}`);
    console.log('Headers:', {
      'x-forwarded-for': xForwardedFor,
      'x-real-ip': xRealIP,
      'cf-connecting-ip': cfConnectingIP
    });

    // Determine continent from IP
    const continent = await getContinentFromIP(clientIP);
    
    console.log(`Mapped to continent: ${continent.name} (${continent.code})`);

    // Call the database function to increment continent taps
    const { error } = await supabase.rpc('increment_continent_taps', {
      p_continent_code: continent.code,
      p_continent_name: continent.name,
      p_flag_emoji: continent.emoji
    });

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log(`Successfully incremented taps for ${continent.name}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        continent: continent.name,
        code: continent.code,
        ip: clientIP
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        }, 
        status: 500 
      }
    );
  }
});
