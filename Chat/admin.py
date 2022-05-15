from django.contrib.auth.admin import UserAdmin
from django.contrib import admin

# Register your models here.
from .models import Message, Profile, Account

class AccountAdmin(UserAdmin):
    list_display = ('username', 'email', 'date_joined', 'last_login', 'is_admin', 'is_staff', 'is_superuser')
    search_fields = ('email', 'username')
    readonly_fields = ('id', 'date_joined', 'last_login')

    filter_horizontal = ()
    list_filter = ()
    fieldsets = ()

admin.site.register(Message)
admin.site.register(Profile)
admin.site.register(Account, AccountAdmin)
