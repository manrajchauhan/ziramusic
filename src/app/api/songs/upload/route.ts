import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/app/lib/cloudinary';
import { supabase } from '@/app/lib/supabaseClient';
import { Database } from '@/app/types/supabase';

type SongInsert = Database['public']['Tables']['songs']['Insert'];

const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET!;

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const title = form.get('title') as string;
  const artist = form.get('artist') as string;
  const image = form.get('image') as File;
  const audio = form.get('audio') as File;

  if (!title || !artist || !image || !audio) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }


  const uploadToCloudinary = async (file: File, resourceType: 'image' | 'video') => {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const upload = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          upload_preset: CLOUDINARY_UPLOAD_PRESET,
          folder: 'zira',
          resource_type: resourceType,
        },
        (error, result) => {
          if (error || !result) reject(error);
          else resolve(result as any);
        }
      ).end(buffer);
    });

    return upload.secure_url;
  };

  try {
    const [image_url, audio_url] = await Promise.all([
      uploadToCloudinary(image, 'image'),
      uploadToCloudinary(audio, 'video'),
    ]);

    const payload: SongInsert = {
      title,
      artist,
      image_url,
      audio_url,
    //   uploaded_by: 'Manraj Chauhan',
    };

    const { error } = await supabase.from('songs').insert([payload]);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 });
  }
}
