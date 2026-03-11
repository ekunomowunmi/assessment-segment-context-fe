'use client'

import { useState } from 'react'
import { personasApi, Persona } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export default function PersonasPage() {
  const [userId, setUserId] = useState('')
  const [persona, setPersona] = useState<Persona | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!userId.trim()) {
      setError('Please enter a user ID')
      return
    }

    setLoading(true)
    setError(null)
    setPersona(null)

    try {
      // Optimistic update - show loading state immediately
      const data = await personasApi.get(userId.trim())
      setPersona(data)
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError(`No persona found for user: ${userId}`)
      } else {
        setError(err.message || 'Failed to fetch persona')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Persona Viewer</h1>
        <p className="text-gray-600">Search for a user and view their AI-generated persona</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search User</CardTitle>
          <CardDescription>Enter a user ID to view their persona</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter user ID (e.g., user-123)"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
            <Link href="/">
              <Button variant="outline">Home</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-4">
            <p className="text-red-800">{error}</p>
          </CardContent>
        </Card>
      )}

      {persona && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Persona Details</CardTitle>
              <CardDescription>
                Generated: {new Date(persona.generated_at).toLocaleString()} • Model: {persona.model_version}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{persona.persona_data.persona_type}</h3>
                <p className="text-gray-600">{persona.persona_data.summary}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Confidence Score</h4>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${persona.persona_data.confidence_score * 100}%` }}
                      />
                    </div>
                    <span className="text-sm">{(persona.persona_data.confidence_score * 100).toFixed(1)}%</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Engagement Level</h4>
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {persona.persona_data.engagement_level}
                  </span>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Purchase Intent</h4>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                    {persona.persona_data.purchase_intent}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Key Behaviors</h4>
                <div className="flex flex-wrap gap-2">
                  {persona.persona_data.key_behaviors.map((behavior, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                    >
                      {behavior}
                    </span>
                  ))}
                </div>
              </div>

              {persona.persona_data.risk_factors.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-red-600">Risk Factors</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {persona.persona_data.risk_factors.map((risk, idx) => (
                      <li key={idx} className="text-sm text-gray-700">{risk}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-2">Recommendations</h4>
                <ul className="list-disc list-inside space-y-1">
                  {persona.persona_data.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-gray-700">{rec}</li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t">
                <h4 className="font-semibold mb-2 text-sm text-gray-500">Events Analyzed</h4>
                <p className="text-xs text-gray-500">
                  {persona.events_analyzed?.length || 0} events used for persona generation
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
