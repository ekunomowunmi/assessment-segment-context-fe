'use client'

import { useState, useEffect, useCallback } from 'react'
import { eventsApi, Event } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPolling, setIsPolling] = useState(true)

  const fetchEvents = useCallback(async () => {
    try {
      const data = await eventsApi.list(undefined, 50, 0)
      setEvents(data.events || [])
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch events')
      console.error('Error fetching events:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  useEffect(() => {
    if (!isPolling) return

    const interval = setInterval(() => {
      fetchEvents()
    }, 2000) // Poll every 2 seconds

    return () => clearInterval(interval)
  }, [isPolling, fetchEvents])

  const handleIngestTestEvent = async () => {
    try {
      const testEvent = {
        event_id: `test-${Date.now()}`,
        user_id: `user-${Math.floor(Math.random() * 1000)}`,
        event_type: 'page_view',
        event_data: {
          page: '/dashboard',
          timestamp: new Date().toISOString(),
        },
      }

      // Optimistic update
      const optimisticEvent: Event = {
        id: `temp-${Date.now()}`,
        event_id: testEvent.event_id,
        user_id: testEvent.user_id,
        event_type: testEvent.event_type,
        event_data: testEvent.event_data,
        created_at: new Date().toISOString(),
      }
      setEvents((prev) => [optimisticEvent, ...prev])

      await eventsApi.ingest(testEvent)
      
      // Refresh to get the real event
      await fetchEvents()
    } catch (err: any) {
      setError(err.message || 'Failed to ingest event')
      // Remove optimistic update on error
      setEvents((prev) => prev.filter((e) => !e.id.startsWith('temp-')))
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading events...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Real-time Event Dashboard</h1>
          <p className="text-gray-600">Live stream of ingested events</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={isPolling ? 'default' : 'outline'}
            onClick={() => setIsPolling(!isPolling)}
          >
            {isPolling ? 'Pause' : 'Resume'}
          </Button>
          <Button onClick={handleIngestTestEvent}>Ingest Test Event</Button>
          <Link href="/">
            <Button variant="outline">Home</Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      <div className="grid gap-4">
        {events.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              No events yet. Click "Ingest Test Event" to create one.
            </CardContent>
          </Card>
        ) : (
          events.map((event) => (
            <Card key={event.id} className="transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{event.event_type}</CardTitle>
                    <CardDescription>
                      User: {event.user_id} • Event ID: {event.event_id}
                    </CardDescription>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(event.created_at).toLocaleTimeString()}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
                  {JSON.stringify(event.event_data, null, 2)}
                </pre>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
