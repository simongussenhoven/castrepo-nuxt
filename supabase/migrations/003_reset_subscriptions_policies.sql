-- First, disable RLS temporarily to check if that's the issue
ALTER TABLE public.subscriptions DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view their own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can create their own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can delete their own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscriptions" ON public.subscriptions;

-- Re-enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create simpler, more permissive policies
CREATE POLICY "Enable read access for authenticated users"
    ON public.subscriptions
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Enable insert for authenticated users"
    ON public.subscriptions
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Enable delete for users based on user_id"
    ON public.subscriptions
    FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Enable update for users based on user_id"
    ON public.subscriptions
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
