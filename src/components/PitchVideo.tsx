import React, { useMemo, useState } from "react";

export type PitchVideoProps = {
  youtubeUrl: string;
  title?: string;
};

const getEmbedUrl = (youtubeUrl: string) => {
  try {
    if (!youtubeUrl.startsWith("http")) {
      return `https://www.youtube.com/embed/${youtubeUrl}`;
    }

    const url = new URL(youtubeUrl);
    const vParam = url.searchParams.get("v");
    if (vParam) return `https://www.youtube.com/embed/${vParam}`;

    const parts = url.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1];
    if (last) return `https://www.youtube.com/embed/${last}`;
  } catch {
    // fall through
  }

  return `https://www.youtube.com/embed/${youtubeUrl}`;
};

export const PitchVideo: React.FC<PitchVideoProps> = ({ youtubeUrl, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const embedUrl = useMemo(() => {
    const base = getEmbedUrl(youtubeUrl);
    return isPlaying ? `${base}?autoplay=1` : base;
  }, [youtubeUrl, isPlaying]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-border/60 bg-background/80 shadow-sm">
      <div className="aspect-video w-full">
        <iframe
          className="h-full w-full"
          src={embedUrl}
          title={title || "Pitch video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
      {!isPlaying && (
        <button
          type="button"
          className="absolute inset-0 flex items-center justify-center bg-black/25 backdrop-blur-sm transition-colors hover:bg-black/35"
          onClick={() => setIsPlaying(true)}
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
            <span className="ml-1 text-xl">▶</span>
          </div>
        </button>
      )}
    </div>
  );
};

export default PitchVideo;
