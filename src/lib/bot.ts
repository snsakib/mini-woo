import { Markup, Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { LabeledPrice } from "@telegraf/types";
import woo from "@/lib/woo";

export const SECRET_HASH = process.env.TELEGRAM_BOT_SECRET!!;
const BASE_PATH =
  process.env.NEXT_PUBLIC_BASE_PATH ||
  `https://${process.env.NEXT_PUBLIC_VERCEL_URL!!}`;
const WEBHOOK_URL = `${BASE_PATH}/api/telegram-hook?secret_hash=${SECRET_HASH}`;
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!!;
const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => {
  ctx.reply("Let's get started", {
    reply_markup: {
      keyboard: [
        ["Coffee & Sweet", "Foods & Drinks"],
        ["Area Shops", "My Location"],
        ["Profile", "T&C"],
      ],
    },
  });
});
bot.help((ctx) => ctx.reply("Type /start or /menu command!"));
bot.command("menu", (ctx) =>
  ctx.setChatMenuButton({
    text: "Store",
    type: "web_app",
    web_app: { url: BASE_PATH },
  })
);
bot.command("changelanguage", async (ctx) => {
  await ctx.reply("Select your preferred language:", {
    reply_markup: {
      inline_keyboard: [
        [{ text: "English", callback_data: "language_en" }],
        [{ text: "Spanish", callback_data: "language_es" }],
        [{ text: "French", callback_data: "language_fr" }],
        [{ text: "German", callback_data: "language_de" }],
        [{ text: "Italian", callback_data: "language_it" }],
        [{ text: "Russian", callback_data: "language_ru" }],
      ],
    },
  });
});

bot.on(message("text"), (ctx) =>
  ctx.reply("Hi, I`m KazBot. Please type /help")
);

bot.on("shipping_query", async (ctx) => {
  const payload = JSON.parse(ctx.update.shipping_query.invoice_payload);
  const shippingOptions = await woo.getShippingOptions(payload.shippingZone);
  if (shippingOptions.length)
    ctx.answerShippingQuery(true, shippingOptions, undefined);
  else
    ctx.answerShippingQuery(
      false,
      undefined,
      "No shipping option available at your zone!"
    );
});

bot.on("pre_checkout_query", async (ctx) => {
  const payload = JSON.parse(ctx.update.pre_checkout_query.invoice_payload);
  const orderInfo = ctx.update.pre_checkout_query.order_info!!;
  const res = await woo.updateOrderInfo(payload.orderId, orderInfo);
  if (res.status === 200) await ctx.answerPreCheckoutQuery(true);
  else
    await ctx.answerPreCheckoutQuery(
      false,
      "Problem occurred during update order, contact support!"
    );
});

bot.on(message("successful_payment"), async (ctx) => {
  const payload = JSON.parse(
    ctx.update.message.successful_payment.invoice_payload
  );
  const res = await woo.setOrderPaid(payload.orderId);
  if (res.status === 200) {
    ctx.reply("Order successfully registered!");
  } else
    ctx.reply(`Error registering payment, contact support!\n
        orderId:${payload.orderId}\n
        ${ctx.update.message.successful_payment.telegram_payment_charge_id}\n
        ${ctx.update.message.successful_payment.provider_payment_charge_id}
        `);
});

export function initWebhook() {
  return bot.telegram.setWebhook(WEBHOOK_URL);
}

export async function createInvoiceLink(
  orderId: number,
  orderKey: string,
  currency: string,
  prices: LabeledPrice[],
  shippingZone: number
) {
  const telegramInvoice = {
    provider_token: process.env.TELEGRAM_PAYMENT_PROVIDER_TOKEN!!,
    title: `Order Invoice ${orderId}`,
    description: `Payment invoice for ${orderKey}`,
    currency,
    photo_url: undefined, //TODO: env
    is_flexible: false, //TODO: env
    prices,
    payload: JSON.stringify({ orderId, shippingZone }),
    need_name: true,
    need_email: true,
    need_phone_number: true,
    need_shipping_address: true,
  };

  //https://core.telegram.org/bots/api#createinvoicelink
  return await bot.telegram.createInvoiceLink(telegramInvoice);
}

export default bot;
