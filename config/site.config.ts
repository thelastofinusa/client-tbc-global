export const siteConfig = {
  title: "The Burning Church Global Ministries",
  description:
    "The Burning Church Global Ministries is a house of worship rooted in Kudenda, Kaduna. We believe faith should change the way we love our neighbors, raise our kids, and build our future.",
  about:
    "A generation set on fire. Join Burning Church Global Ministries in Kudenda, Kaduna — a community where faith turns into action.",
  slogan: "Living Flames",
  map: {
    direction:
      "https://www.google.com/maps/search/?api=1&query=10.47837,7.368477",
    embed:
      "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d773.2637856498449!2d7.368035125773172!3d10.478444737176677!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTDCsDI4JzQyLjIiTiA3wrAyMicwNi41IkU!5e1!3m2!1sen!2sng!4v1795293027987!5m2!1sen!2sng",
  },
  author: {
    name: "Abdullahi Salihu",
    username: "thelastofinusa",
    nickname: "Osilama",
    url: "https://thelastofinusa.vercel.app",
  },
  url:
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_BASE_URL || "https://tbcg.vercel.app"
      : "http://localhost:3000",
};
