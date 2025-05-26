import { Telegraf } from "telegraf";
import getPosts from "../lib/utils.js";

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) =>
  ctx.reply("Hi! Just send me a topic like 'travel' or 'food' and It fetches recent 5 Instagram posts.")
);

function cleanText(text) {
  if (!text) return "";
  return text
    .normalize("NFKC")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]+/g, '')
    .trim();
}

bot.on("text", async (ctx) => {
  const keyword = ctx.message.text.trim();

  if (!keyword) {
    return ctx.reply("Please send a valid topic.");
  }

  await ctx.reply(`Scraping Instagram posts for "${keyword}"...`);

  try {
    const posts = await getPosts(keyword);

    if (!posts || posts.length === 0) {
      return ctx.reply("No posts found for that keyword.");
    }

    const replyMessage = posts.map((post, index) => {
      const url = cleanText(post.url);
      const caption = cleanText(post.caption);
      return `${index + 1}. ${url}\n📄 ${caption.slice(0, 80) || "No caption"}...`;
    }).join("\n\n");

    return ctx.reply(replyMessage);
  } catch (error) {
    console.error("Error fetching posts:", error.message);
    return ctx.reply("Something went wrong while fetching Instagram posts.");
  }
});


bot.launch();
console.log("BOT IS RUNNING");

export default bot;
