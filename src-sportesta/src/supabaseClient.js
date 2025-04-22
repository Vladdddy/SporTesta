import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://hdnakcynlahyohviqunq.supabase.co";
const supabaseAnonKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkbmFrY3lubGFoeW9odmlxdW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5OTExMDksImV4cCI6MjA2MDU2NzEwOX0.egZUSJnARbAMHw5HxNQWKODapYp6WsGq4EIF0yi0-iw";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
