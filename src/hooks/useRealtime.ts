import { useEffect, useRef } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'

export const useRealtime = (
  table: string,
  event: '*' | 'INSERT' | 'UPDATE' | 'DELETE',
  callback: (payload: any) => void
) => {
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    // Create realtime channel
    const channel = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes' as any,
        {
          event,
          schema: 'public',
          table,
        },
        callback
      )
      .subscribe()

    channelRef.current = channel

    // Cleanup on unmount
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [table, event, callback])

  return channelRef.current
}