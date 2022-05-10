import json
from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer, JsonWebsocketConsumer
from asgiref.sync import sync_to_async, async_to_sync
from .models import Message, Account
from channels.db import database_sync_to_async
import datetime
from django.dispatch import receiver
from django.db.models.signals import post_save
from channels.layers import get_channel_layer
import channels.layers
import datetime
import base64
from django.core.files.base import ContentFile
from django.db.models import Min

class ChatRoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        print(self.room_group_name)

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    @database_sync_to_async
    def get_user_profile(self):
        return self.scope['user'].profile

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        username = self.scope['user'].username
        profile = await self.get_user_profile()
        profile_pic = profile.image.url
        room = text_data_json['room']
        date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")
        image_url = text_data_json['image_url']

        await self.save_message(username, room, message, date, image_url)

        await self.delete_old_msgs()

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chatroom_message',
                'message': message,
                'username': username,
                'profile_pic': profile_pic,
                'date': date,
                'room': room,
                'image_url': image_url,
            }
        )

    async def chatroom_message(self, event):
        message = event['message']
        username = event['username']
        profile_pic = event['profile_pic']
        room = event['room']
        date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")
        image_url = event['image_url']

        await self.send(text_data=json.dumps({
            'message': message,
            'username': username,
            'profile_pic': profile_pic,
            'room': room,
            'date': date,
            'image_url': image_url,
        }))

    @sync_to_async
    def save_message(self, username, room, message, date, image_url):
        user = Account.objects.get(username = username)
        if(image_url == ''):
            data = None
        else:
            format, imgstr = image_url.split(';base64,') 
            ext = format.split('/')[-1] 
            data = ContentFile(base64.b64decode(imgstr), name='temp.' + ext)
        Message.objects.create(author = user, room = room, content = message, date_added = date, image=data)

    @sync_to_async
    def delete_old_msgs(self):
        message_rooms = ['General', 'Memes', 'Questions', 'Coding', 'Off_topic', 'Gaming', 'Announcements']
        for name in range(len(message_rooms)):
            total_count = len(Message.objects.filter(room = message_rooms[name]))
            message_remove = total_count - 25
            if(total_count > 25):
                for i in range(message_remove):
                    messages = Message.objects.filter(room = message_rooms[name])
                    remove = (messages.aggregate(Min('date_added')).get('date_added__min')).strftime("%Y-%m-%d %H:%M:%S.%f")
                    removed_msg = Message.objects.filter(room = message_rooms[name]).filter(date_added=remove)
                    removed_msg.delete()
            
channel_layer = get_channel_layer()

class MessagePreviewConsumer(JsonWebsocketConsumer):
    def connect(self):
        async_to_sync(self.channel_layer.group_add)(
            'chat',
            self.channel_name
        )
        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            'chat',
            self.channel_name
        )
        self.close()

    def receive_json(self, content, **kwargs):
        print(f"Received event: {content}")

    def events_alarm(self, event):
        self.send_json(event['data'])
        
    @staticmethod
    @receiver(post_save, sender=Message)
    def message_created(sender, instance, created, **kwargs):
        layer = channels.layers.get_channel_layer()
        if created:
            print(sender, instance, created)
            room = instance.room.lower()
            time = datetime.datetime.strptime(instance.date_added, '%Y-%m-%d %H:%M:%S.%f')
            result = instance.content, instance.author.username, time.strftime("%H:%M")
            async_to_sync(layer.group_send)('chat', {
                'type': 'events.alarm',
                'data': {
                    'last_message_%s' % room: result
                }
            })


    
