import React from 'react';
import YouTube from 'react-youtube';

interface Props {
  url: string;
}

export function extractVideoId(url: string) {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
  return match ? match[1] : null;
}

export const YoutubePlayer: React.FC<Props> = ({ url }) => {
  const videoId = extractVideoId(url);

  if (!videoId) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
        <svg className="w-12 h-12 text-white/5 mb-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">AWAITING AUDIO SOURCE</p>
        <p className="text-[10px] text-gray-600 mt-2">Paste a YouTube URL in settings</p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      <YouTube
        videoId={videoId}
        opts={{
          width: '100%',
          height: '100%',
          playerVars: {
            autoplay: 1,
            controls: 1,
            rel: 0,
            showinfo: 0,
            mute: 0,
            loop: 1,
          },
        }}
        containerClassName="w-full h-full"
        className="w-full h-full object-cover"
      />
    </div>
  );
};
