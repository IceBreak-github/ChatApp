"""
ASGI config for ChatTest project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/howto/deployment/asgi/
"""

import os
import django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ChatTest.settings')
django.setup()

from channels.routing import get_default_application

from django.urls import re_path

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import OriginValidator
from Chat import consumers

application = ProtocolTypeRouter({
    "websocket": OriginValidator(
        AuthMiddlewareStack(
            URLRouter([
                re_path(r'ws/chat/(?P<room_name>\w+)/$', consumers.ChatRoomConsumer.as_asgi()),
                re_path(r'^ws/chat/$', consumers.MessagePreviewConsumer.as_asgi()),
            ])
        ),
        ['.railway.app','.localhost', '127.0.0.1'],
    ),

})


