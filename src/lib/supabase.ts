import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@busungtk/supabase-types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''

const _client = supabaseUrl && supabaseAnonKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null

// Mock query builder for build-time
const mockQueryBuilder = () => ({
  select: mockQueryBuilder,
  insert: mockQueryBuilder,
  update: mockQueryBuilder,
  delete: mockQueryBuilder,
  order: mockQueryBuilder,
  eq: mockQueryBuilder,
  or: mockQueryBuilder,
  single: mockQueryBuilder,
  limit: mockQueryBuilder,
  range: mockQueryBuilder,
  then: (resolve: any) => resolve({ data: null, error: null }),
})

export const supabase = _client ?? ({
  from: mockQueryBuilder,
  auth: {
    signInWithPassword: () => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
  },
} as unknown as SupabaseClient)
