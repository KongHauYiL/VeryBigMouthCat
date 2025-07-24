
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// IP to continent mapping (simplified)
const getContinentFromIP = (ip: string): { code: string, name: string, emoji: string } => {
  // In a real implementation, you'd use a proper IP geolocation service
  // For demo purposes, we'll use a simple mapping based on IP ranges
  
  // Default to North America for now
  // In production, you'd integrate with services like MaxMind, IPinfo, etc.
  const continents = [
    { code: 'NA', name: 'North America', emoji: '🌎' },
    { code: 'EU', name: 'Europe', emoji: '🌍' },
    { code: 'AS', name: 'Asia', emoji: '🌏' },
    { code: 'SA', name: 'South America', emoji: '🌎' },
    { code: 'AF', name: 'Africa', emoji: '🌍' },
    { code: 'OC', name: 'Oceania', emoji: '🌏' },
    { code: 'AN', name: 'Antarctica', emoji: '🐧' },
  ];
  
  // Simple demo logic - randomly assign for now
  // In production, parse IP and map to actual continent
  const randomIndex = Math.floor(Math.random() * continents.length);
  return continents[randomIndex];
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

    // Get client IP
    const clientIP = req.headers.get('x-forwarded-for') || 
                    req.headers.get('x-real-ip') || 
                    '127.0.0.1';

    console.log(`Processing tap from IP: ${clientIP}`);

    // Determine continent from IP
    const continent = getContinentFromIP(clientIP);
    
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
        code: continent.code 
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
