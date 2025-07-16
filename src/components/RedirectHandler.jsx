// src/components/RedirectHandler.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function RedirectHandler() {
  const { code } = useParams();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!code) {
      setError('No short code provided');
      setLoading(false);
      return;
    }

    async function handleRedirect() {
      try {
        // Query the database directly
        const { data: urlRecord, error } = await supabase
          .from('urls')
          .select('id, long_url, short_code, custom_slug')
          .or(`short_code.eq.${code},custom_slug.eq.${code}`)
          .single();

        if (error || !urlRecord) {
          setError('URL not found');
          setLoading(false);
          return;
        }

        // Increment click counter (optional, might fail due to RLS)
        try {
          await supabase.rpc('increment_clicks', {
            url_id: urlRecord.id
          });
        } catch (rpcError) {
          console.log('Click tracking failed:', rpcError);
          // Continue with redirect even if click tracking fails
        }

        // Redirect to the long URL
        window.location.href = urlRecord.long_url;

      } catch (error) {
        console.error('Redirect error:', error);
        setError('An error occurred while redirecting');
        setLoading(false);
      }
    }

    handleRedirect();
  }, [code]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold">Redirecting...</h2>
          <p className="text-gray-600">Please wait while we redirect you to your destination.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <h2 className="font-bold">Page not found</h2>
            <p>{error}</p>
          </div>
          <p className="text-gray-600">
            Looks like you've followed a broken link or entered a URL that doesn't exist on this site.
          </p>
        </div>
      </div>
    );
  }

  return null;
}