export default defineEventHandler(async (event) => {
  const { tgChatId, tgBotToken } = useRuntimeConfig();
  const { text } = await readBody(event);

  const data: any = await $fetch(`https://api.telegram.org/bot${tgBotToken}/sendMessage`, {
    method: 'POST',
    body: JSON.stringify({
      chat_id: tgChatId,
      text,
    }),
  });

  return { status: data.ok };
});
