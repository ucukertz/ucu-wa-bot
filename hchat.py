# nohup python hugchat.py &
# pkill -9 python

from hugchat import hugchat
from hugchat.login import Login
from aiohttp import web

import os

user = os.environ["HF_USER"]
pwd = os.environ["HF_PASS"]

s = Login(user, pwd)
c = s.login()

bot = hugchat.ChatBot(c.get_dict())
conv = bot.get_conversation_list()
bot.change_conversation(conv[0])

async def handle_bot(req):
  query = await req.text()
  return web.Response(status=200, body=bot.chat(query), content_type="binary/octet-stream")

httpd = web.Application()
httpd.router.add_get("/", handle_bot)
web.run_app(httpd, port=3001)