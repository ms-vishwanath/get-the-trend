import { Telegraf } from "telegraf";
import getPosts from "../lib/utils.js";

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) =>
  ctx.reply("Hi! Just send me a topic like 'travel' or 'food' and I’ll fetch top 10 Instagram posts.")
);

bot.on("text", async (ctx) => {
  const keyword = ctx.message.text.trim();

  if (!keyword) {
    return ctx.reply("Please send a valid topic.");
  }

  // Send an immediate reply before scraping
  await ctx.reply(`Scraping Instagram posts for "${keyword}"...`);

  try {
    const posts = await getPosts(keyword);

    if (!posts || posts.length === 0) {
      return ctx.reply("No posts found for that keyword.");
    }

    const replyMessage = posts.slice(0, 11).map((post, index) => {
      return `${index + 1}. ${post.url}\n📄 ${post.caption?.slice(0, 80) || "No caption"}...`;
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
