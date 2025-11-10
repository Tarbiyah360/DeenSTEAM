-- Create saved_lessons table
CREATE TABLE public.saved_lessons (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  topic TEXT NOT NULL,
  lesson_content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.saved_lessons ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own saved lessons" 
ON public.saved_lessons 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saved lessons" 
ON public.saved_lessons 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved lessons" 
ON public.saved_lessons 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_saved_lessons_updated_at
BEFORE UPDATE ON public.saved_lessons
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_saved_lessons_user_id ON public.saved_lessons(user_id);
CREATE INDEX idx_saved_lessons_created_at ON public.saved_lessons(created_at DESC);