import { Image } from "keltra/image/next";

export default function HomePage() {
  return (
    <div className="">
      <Image
        className="h-5 w-25 dark:invert"
        src="/next.svg"
        alt="Next.js logo"
        width={100}
        height={20}
        preload
      />
    </div>
  );
}
