export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            subscriptions: {
                Row: {
                    id: string
                    user_id: string
                    podcast_id: number
                    podcast_title: string
                    podcast_image: string | null
                    podcast_url: string | null
                    podcast_guid: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    podcast_id: number
                    podcast_title: string
                    podcast_image?: string | null
                    podcast_url?: string | null
                    podcast_guid?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    podcast_id?: number
                    podcast_title?: string
                    podcast_image?: string | null
                    podcast_url?: string | null
                    podcast_guid?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}
