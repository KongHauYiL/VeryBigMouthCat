
-- Add unique constraint for party_members to fix the ON CONFLICT error
ALTER TABLE public.party_members ADD CONSTRAINT party_members_room_username_unique UNIQUE (room_id, username);
