export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name?: string;
          created_at?: string;
        };
        Update: {
          email?: string;
          full_name?: string;
          created_at?: string;
        };
      };

      songs: {
        Row: {
          id: string;
          title: string;
          artist: string;
          image_url: string;
          audio_url: string;
          uploaded_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          artist: string;
          image_url: string;
          audio_url: string;
        //   uploaded_by: string;
          created_at?: string;
        };
        Update: {
          title?: string;
          artist?: string;
          image_url?: string;
          audio_url?: string;
          uploaded_by?: string;
          created_at?: string;
        };
      };

      playlists: {
        Row: {
          id: string;
          title: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          title?: string;
          user_id?: string;
          created_at?: string;
        };
      };

      playlist_songs: {
        Row: {
          id: string;
          playlist_id: string;
          song_id: string;
          added_at: string;
        };
        Insert: {
          id?: string;
          playlist_id: string;
          song_id: string;
          added_at?: string;
        };
        Update: {
          playlist_id?: string;
          song_id?: string;
          added_at?: string;
        };
      };
    };
  };
}
