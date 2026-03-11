import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID || 'default-tenant'

const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: {
    'X-Tenant-ID': TENANT_ID,
    'Content-Type': 'application/json',
  },
})

export interface Event {
  id: string
  event_id: string
  user_id: string
  event_type: string
  event_data: Record<string, any>
  created_at: string
}

export interface Persona {
  id: string
  tenant_id: string
  user_id: string
  persona_data: {
    persona_type: string
    confidence_score: number
    key_behaviors: string[]
    engagement_level: string
    purchase_intent: string
    risk_factors: string[]
    recommendations: string[]
    summary: string
  }
  events_analyzed: string[]
  generated_at: string
  model_version: string
}

export const eventsApi = {
  ingest: async (event: {
    event_id: string
    user_id: string
    event_type: string
    event_data: Record<string, any>
  }) => {
    const response = await api.post('/events/ingest', event)
    return response.data
  },
  
  list: async (user_id?: string, limit = 100, offset = 0) => {
    const params: any = { limit, offset }
    if (user_id) params.user_id = user_id
    
    const response = await api.get('/events/', { params })
    return response.data
  },
}

export const personasApi = {
  get: async (user_id: string): Promise<Persona> => {
    const response = await api.get(`/personas/${user_id}`)
    return response.data
  },
  
  list: async (limit = 100, offset = 0) => {
    const response = await api.get('/personas/', { params: { limit, offset } })
    return response.data
  },
}
