from django.urls import path

from . import views

urlpatterns = [
    path('', views.Chat, name='chat-index'),
    path('<str:room_name>/', views.room, name='room'),
    
]