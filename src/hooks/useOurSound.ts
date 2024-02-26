import { useCallback, useEffect, useRef } from "react"

const useOurSound = (src: string) => {
  const el = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    const audio = new Audio(src);

    if (!el.current) {
      el.current = audio;
    }

    return () => {
      el.current = null;
    }
  }, [src]);

  const play = useCallback(() => {
    el?.current?.play();
  }, []);

  return [play];
}

export default useOurSound;