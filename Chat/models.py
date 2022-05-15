from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, User
from django.db import models
from PIL import Image
from datetime import datetime
from django.core.files import File 
import urllib.request
import os
import base64
from django.core.files.base import ContentFile
from django.contrib.auth import get_user_model

class AccountManager(BaseUserManager):
    def create_user(self, username, email, password=None):
        if not email:
            raise ValueError("User must have an email address")
        if not username:
            raise ValueError("User must have a username")
        user = self.model(
            username=username,
            email=self.normalize_email(email),
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password):
        user = self.create_user(
            username=username,
            email=self.normalize_email(email),
            password=password,
        )
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class Account(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=25, unique=True)
    email = models.EmailField(verbose_name="Email", max_length=60, unique=True)
    date_joined = models.DateTimeField(auto_now_add=True, verbose_name = "Date joined")
    last_login = models.DateTimeField(auto_now=True, verbose_name = "Last login")
    is_admin = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)

    objects = AccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username

class Message(models.Model):
    author = models.ForeignKey(Account, on_delete=models.CASCADE)
    room = models.CharField(max_length = 255)
    content = models.TextField(null=True, blank=True)
    date_added = models.DateTimeField(null=True, blank=True)
    image = models.FileField(null=True, blank=True, upload_to='message_images')

    class Meta:
        ordering = ('date_added', )

class Profile(models.Model):
    user = models.OneToOneField(Account, on_delete=models.CASCADE)
    image = models.ImageField(default='default.png', upload_to='profile_pics')

    def __str__(self):
        return f'{self.user.username} Profile'

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)

        img = Image.open(self.image.path)
        print(self.image.path)

        if img.height > 300 or img.width > 300:
            output_size = (300, 300)
            img.thumbnail(output_size)
            img.save(self.image.path)
