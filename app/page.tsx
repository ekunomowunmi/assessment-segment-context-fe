'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Segment-to-Context Service
          </h1>
          <p className="text-xl text-gray-600">
            Real-time event ingestion and AI-powered persona generation
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Dashboard</CardTitle>
              <CardDescription>
                View live stream of ingested events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard">
                <Button className="w-full">View Dashboard</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Persona Viewer</CardTitle>
              <CardDescription>
                Search for a user and view their AI-generated persona
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/personas">
                <Button className="w-full">View Personas</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
