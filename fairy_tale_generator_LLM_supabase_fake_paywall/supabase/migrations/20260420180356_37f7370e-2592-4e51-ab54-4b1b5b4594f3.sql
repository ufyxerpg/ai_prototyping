-- Stories table
CREATE TABLE public.stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  context TEXT NOT NULL,
  result TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own stories"
ON public.stories FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stories"
ON public.stories FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stories"
ON public.stories FOR DELETE
USING (auth.uid() = user_id);

CREATE INDEX idx_stories_user_id ON public.stories(user_id);

-- Payment events table (analytics)
CREATE TABLE public.payment_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payment events"
ON public.payment_events FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment events"
ON public.payment_events FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE INDEX idx_payment_events_user_id ON public.payment_events(user_id);