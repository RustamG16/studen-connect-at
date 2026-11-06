import { asset } from "@/lib/asset";
import { useEffect, useRef, useState } from "react";

/** A blog row's still: 528 × 298, `-192` for the 96 px phone slot. Decorative. A file that fails leaves no box. */
const PostPoster = ({ name, className }: { name: string; className?: string }) => {
  const image = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<"pending" | "ok" | "failed">("pending");

  useEffect(() => {
    const img = image.current;
    if (img?.complete) setState(img.naturalWidth > 0 ? "ok" : "failed");
  }, []);

  if (state === "failed") return null;

  return (
    <img
      ref={image}
      src={asset(`/media/posters/${name}.webp`)}
      srcSet={`${asset(`/media/posters/${name}-192.webp`)} 192w, ${asset(`/media/posters/${name}.webp`)} 528w`}
      sizes="(min-width: 768px) 264px, 96px"
      alt=""
      width={528}
      height={298}
      loading="lazy"
      decoding="async"
      data-media={state}
      onLoad={() => setState("ok")}
      onError={() => setState("failed")}
      className={`media-still h-auto w-24 md:w-full md:max-w-[264px] ${className ?? ""}`}
    />
  );
};

export default PostPoster;
