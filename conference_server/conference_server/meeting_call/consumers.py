import json

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from channels.layers import get_channel_layer
from .models import RoomInfo

channel_layer = get_channel_layer()


class ConnectConsumer(WebsocketConsumer):
    def connect(self):
        try:
            user = RoomInfo.objects.get(user=self.scope['url_route']['kwargs']['user'])
        except RoomInfo.DoesNotExist:
            RoomInfo.objects.create(
                user=self.scope['url_route']['kwargs']['user'],
                call_id=self.channel_name
            )
        else:
            user.call_id = self.channel_name
            user.save()

        async_to_sync(channel_layer.send)(self.channel_name, {
            "type": "chat.message",
            "channel": self.channel_name,
        })
        self.accept()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await channel_layer.send(self.channel_name, {
            "type": "send.sdp",
            "data": {'channel': self.channel_name},
        })
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
