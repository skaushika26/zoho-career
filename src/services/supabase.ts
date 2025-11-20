import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const submitContest = async (
  userId: string,
  contestId: string,
  html: string,
  css: string,
  js: string,
  timeTaken: number,
  cheatingFlags: any,
  tabSwitchCount: number,
  videoUrl?: string
) => {
  const { data, error } = await supabase
    .from('submissions')
    .insert({
      user_id: userId,
      contest_id: contestId,
      html_code: html,
      css_code: css,
      js_code: js,
      time_taken: timeTaken,
      cheating_flags: cheatingFlags,
      tab_switch_count: tabSwitchCount,
      video_url: videoUrl,
      score: Math.random() > 0.5 ? 85 : 70,
      submitted_at: new Date().toISOString(),
    })
    .select();

  if (error) throw error;
  return data?.[0];
};

export const uploadResume = async (userId: string, file: File) => {
  const fileName = `${userId}-${Date.now()}`;
  const { error: uploadError } = await supabase.storage
    .from('resumes')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data: resumeData, error: updateError } = await supabase
    .from('users')
    .update({ resume_url: fileName })
    .eq('id', userId)
    .select();

  if (updateError) throw updateError;
  return resumeData;
};

export const uploadVideo = async (userId: string, videoBlob: Blob) => {
  const fileName = `${userId}-${Date.now()}.webm`;
  const { error: uploadError } = await supabase.storage
    .from('videos')
    .upload(fileName, videoBlob);

  if (uploadError) throw uploadError;

  const { data: publicData } = supabase.storage
    .from('videos')
    .getPublicUrl(fileName);

  return publicData.publicUrl;
};
