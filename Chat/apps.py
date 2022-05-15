from django.apps import AppConfig


class ChatConfig(AppConfig):
    name = 'Chat'

    def ready(self):
        import Chat.signals
