import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

const _adminClient = supabaseUrl && serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey)
  : null

// Mock query builder for build-time
const mockQueryBuilder = () => ({
  select: mockQueryBuilder,
  insert: mockQueryBuilder,
  update: mockQueryBuilder,
  delete: mockQueryBuilder,
  order: mockQueryBuilder,
  eq: mockQueryBuilder,
  single: mockQueryBuilder,
  limit: mockQueryBuilder,
  then: (resolve: any) => resolve({ data: null, error: null }),
})

export const supabaseAdmin = _adminClient ?? ({
  from: mockQueryBuilder,
  auth: {
    signInWithPassword: () => Promise.resolve({ data: null, error: null }),
    signOut: () => Promise.resolve({ error: null }),
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
  },
} as unknown as SupabaseClient)
