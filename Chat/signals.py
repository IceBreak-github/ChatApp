from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Profile,  Message, Account

@receiver(post_save, sender=Account)
def create_profile(sender, instance, created, **krwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=Account)
def save_profile(sender, instance, **krwargs):
    instance.profile.save()




    