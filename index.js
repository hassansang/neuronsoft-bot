const { Telegraf } = require("telegraf");
const config = require("config");

const bot = new Telegraf("7941758563:AAGIUiq25TsfeLiFs_hZFYlTzYVk_yxJYjI");
adminID = 7419619814;
const { startMessage } = require("./MessageHandler");
const userState = {};

// Command /start
bot.start((ctx) => {
  console.log(ctx.chat.id);

  ctx.reply(startMessage(), {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "ارتباط با پشتیبانی", callback_data: "support" },
          { text: "درخواست مشاوره یا جلسه", callback_data: "request" },
        ],
        [
          { text: "راهنما", callback_data: "help" },
          { text: "نمونه کارهای ما", callback_data: "worksample" },
        ],
      ],
    },
  });
});

// Handle callback queries
bot.on("callback_query", (ctx) => {
  const callbackData = ctx.callbackQuery.data;

  switch (callbackData) {
    case "request":
      handleRequestCommand(ctx);
      break;
    case "support":
      ctx.reply(
        "برای ارتباط با پشتیبانی یکی از گزینه های زیر را انتخاب کنید : ",
        {
          reply_markup: {
            inline_keyboard: [
              [
                { text: "ارتباط تلفنی", callback_data: "communication" },
                { text: "پیگیری", callback_data: "tracking" },
              ],
            ],
          },
        }
      );
      break;
    case "tracking":
      handleTrackingCommand(ctx);
      break;
    case "communication":
      handleCommunicationCommand(ctx);
      break;
    case "worksample":
      ctx.reply(
        "بزودی این قسمت راه اندازی می شود،\nاز همراهی شما سپاس گذاریم 💙",
        {
          reply_markup: {
            inline_keyboard: [
              [
                { text: "ارتباط با پشتیبانی", callback_data: "support" },
                { text: "درخواست مشاوره یا جلسه", callback_data: "request" },
              ],
              [
                { text: "راهنما", callback_data: "help" },
                { text: "نمونه کارهای ما", callback_data: "worksample" },
              ],
            ],
          },
        }
      );
      break;
    case "help":
      ctx.replyWithPhoto({
        source: "./assets/img/help.jpg",
      });
      ctx.reply("از همراهی شما سپاس گذاریم 💙 ", {
        reply_markup: {
          inline_keyboard: [
            [
              { text: "ارتباط با پشتیبانی", callback_data: "support" },
              { text: "درخواست مشاوره یا جلسه", callback_data: "request" },
            ],
            [
              { text: "راهنما", callback_data: "help" },
              { text: "نمونه کارهای ما", callback_data: "worksample" },
            ],
          ],
        },
      });
      break;
    default:
      ctx.reply("گزینه نامعتبر است.");
  }
});

// Function to handle the request process
function handleRequestCommand(ctx) {
  const userId = ctx.from.id;
  userState[userId] = { step: 1, type: "request" };
  ctx.reply("لطفا نام خود را ارسال نمایید.");
}

// Function to handle the tracking process
function handleTrackingCommand(ctx) {
  const userId = ctx.from.id;
  userState[userId] = { step: 1, type: "tracking" };
  ctx.reply("لطفاً شماره پیگیری خود را ارسال نمایید.");
}

// Function to handle the tracking process
function handleCommunicationCommand(ctx) {
  const userId = ctx.from.id;
  userState[userId] = { step: 1, type: "communication" };
  ctx.reply("لطفاً شماره تماس خود را ارسال نمایید.");
}

// Handle text messages
bot.on("text", (ctx) => {
  const userId = ctx.from.id;
  const state = userState[userId];

  if (!state) return;

  if (state.type === "request") {
    const trackingNumber = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    if (state.step === 1) {
      state.name = ctx.message.text;
      state.step = 2;
      ctx.reply("لطفا شماره تماس خود را ارسال نمایید.");
    } else if (state.step === 2) {
      state.phoneNumber = ctx.message.text;
      state.step = 3;
      ctx.reply("لطفا موضوع درخواست خود را ارسال نمایید.");
    } else if (state.step === 3) {
      state.subject = ctx.message.text;

      const message = `🔔 درخواست مشاوره جدید\n\n👤 نام: ${state.name}\n✉️ شماره پیگیری : ${trackingNumber}\n📞 شماره تماس: ${state.phoneNumber}\n📝 موضوع درخواست: ${state.subject}`;
      const chatId = adminID;
      bot.telegram
        .sendMessage(chatId, message)
        .then(() => {
          ctx.reply(
            `درخواست شما با موفقیت ثبت شد ✅\nشماره پیگیری شما ✉️ : ${trackingNumber}\n\nدر اسرع وقت با شما تماس گرفته خواهد شد\nاز همراهی شما سپاسگذاریم💙`
          );
          ctx.reply("از همراهی شما سپاس گذاریم 💙 ", {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: "ارتباط با پشتیبانی", callback_data: "support" },
                  { text: "درخواست مشاوره یا جلسه", callback_data: "request" },
                ],
                [
                  { text: "راهنما", callback_data: "help" },
                  { text: "نمونه کارهای ما", callback_data: "worksample" },
                ],
              ],
            },
          });
        })
        .catch((err) => {
          ctx.reply(
            "متاسفانه ثبت درخواست به مشکل خورده است\nدوباره تلاش کنید ‼\n/request"
          );
          console.error(err);
        });

      delete userState[userId];
    }
  } else if (state.type === "tracking") {
    if (state.step === 1) {
      state.trackingNumber = ctx.message.text;
      state.step = 2;
      ctx.reply("لطفا شماره تماس خود را ارسال نمایید.");
    } else if (state.step === 2) {
      state.phoneNumber = ctx.message.text;
      state.step = 3;
      ctx.reply("لطفاً جزئیات بیشتری درباره درخواست خود ارسال نمایید.");
    } else if (state.step === 3) {
      state.details = ctx.message.text;

      const message = `🔔 پیگیری درخواست\n\n📦 شماره پیگیری: ${state.trackingNumber}\n📞 شماره تماس: ${state.phoneNumber}\n📝 جزئیات: ${state.details}`;
      const chatId = adminID;
      bot.telegram
        .sendMessage(chatId, message)
        .then(() => {
          ctx.reply(
            "پیگیری شما با موفقیت ثبت شد ✅\nپس از بررسی به شما اطلاع رسانی می شود\nاز همراهی شما سپاسگذاریم💙 "
          );
          ctx.reply("از همراهی شما سپاس گذاریم 💙 ", {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: "ارتباط با پشتیبانی", callback_data: "support" },
                  { text: "درخواست مشاوره یا جلسه", callback_data: "request" },
                ],
                [
                  { text: "راهنما", callback_data: "help" },
                  { text: "نمونه کارهای ما", callback_data: "worksample" },
                ],
              ],
            },
          });
        })
        .catch((err) => {
          ctx.reply(
            "متاسفانه ثبت پیگیری به مشکل خورده است\nدوباره تلاش کنید ‼"
          );
          ctx.reply("از همراهی شما سپاس گذاریم 💙 ", {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: "ارتباط با پشتیبانی", callback_data: "support" },
                  { text: "درخواست مشاوره یا جلسه", callback_data: "request" },
                ],
                [
                  { text: "راهنما", callback_data: "help" },
                  { text: "نمونه کارهای ما", callback_data: "worksample" },
                ],
              ],
            },
          });
          console.error(err);
        });

      delete userState[userId];
    }
  } else if (state.type === "communication") {
    if (state.step === 1) {
      state.phoneNumber = ctx.message.text;
      state.step = 2;
      ctx.reply("لطفاً پیغام خود را ارسال نمایید.");
    } else if (state.step === 2) {
      state.message = ctx.message.text;

      const message = `🔔 درخواست ارتباط تلفنی\n\n📞 شماره تماس: ${state.phoneNumber}\n📝 پیغام: ${state.message}`;
      const chatId = adminID;
      bot.telegram
        .sendMessage(chatId, message)
        .then(() => {
          ctx.reply(
            "درخواست شما با موفقیت ثبت شد ✅\nبه زودی با شما تماس گرفته خواهد شد.\nاز همراهی شما سپاس گذاریم💙"
          );
          ctx.reply("از همراهی شما سپاس گذاریم 💙 ", {
            reply_markup: {
              inline_keyboard: [
                [
                  { text: "ارتباط با پشتیبانی", callback_data: "support" },
                  { text: "درخواست مشاوره یا جلسه", callback_data: "request" },
                ],
                [
                  { text: "راهنما", callback_data: "help" },
                  { text: "نمونه کارهای ما", callback_data: "worksample" },
                ],
              ],
            },
          });
        })
        .catch((err) => {
          ctx.reply(
            "متاسفانه ثبت درخواست به مشکل خورده است\nدوباره تلاش کنید ‼"
          );
          console.error(err);
        });

      delete userState[userId];
    }
  }
});

bot.launch();
