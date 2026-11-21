export const siteConfig = {
  title: "The Burning Church Global Ministries",
  description:
    "The Burning Church Global Ministries is a house of worship rooted in Kudenda, Kaduna. We believe faith should change the way we love our neighbors, raise our kids, and build our future.",
  about:
    "A generation set on fire. Join Burning Church Global Ministries in Kudenda, Kaduna — a community where faith turns into action.",
  slogan: "Living Flames",
  author: {
    name: "Abdullahi Salihu",
    username: "thelastofinusa",
    nickname: "Osilama",
    nicknameShorten: "Osi",
    namePronunciationUrl:
      "https://cdn.sanity.io/files/l1eyjyqo/production/5bc4adb49053f62e13529d23fa46de67382dc887.mp3",
    position: "Web3 Frontend Developer",
    email: "dGhlbGFzdG9maW51c2FAZ21haWwuY29t",
    phone: "KzIzNDgxMjgxNTc1MTA=",
    avatar: "/logo.png",
  },
  url:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_BASE_URL || "https://tbcg.vercel.app"
      : "http://localhost:3000",
  socials: [
    { platform: "whatsApp", url: "https://wa.link/bjgckl" },
    { platform: "twitter", url: "https://twitter.com/thelastofinusa" },
    { platform: "gitHub", url: "https://github.com/thelastofinusa" },
    { platform: "instagram", url: "https://www.instagram.com/thelastofinusa/" },
    { platform: "telegram", url: "https://t.me/thelastofinusa" },
    {
      platform: "linkedIn",
      url: "https://www.linkedin.com/in/thelastofinusa/",
    },
    { platform: "youtube", url: "https://www.youtube.com/@thelastofinusa" },
    { platform: "medium", url: "https://medium.com/@thelastofinusa" },
    {
      platform: "productHunt",
      url: "https://www.producthunt.com/@thelastofinusa",
    },
  ],
};
