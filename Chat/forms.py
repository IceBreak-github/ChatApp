from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import Profile, Account
from django.core.exceptions import ValidationError
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import User
        
class CreateUserForm(UserCreationForm):
    def __init__(self, *args, **kwargs):
        super(CreateUserForm, self).__init__(*args, **kwargs)
        self.fields['password1'].widget = forms.PasswordInput(attrs={'placeholder':' '})
        self.fields['password2'].widget = forms.PasswordInput(attrs={'placeholder':' '})

    class Meta:
        model = Account
        fields = ['username', 'email', 'password1', 'password2']
        widgets = {
            'username': forms.TextInput(attrs={
                        'placeholder':' ',
                        'autofocus': 'autofocus'
                        }),
            'email': forms.TextInput(attrs={
                        'placeholder':' ',
                        })
            }
    
    def clean_email(self):
        email = self.cleaned_data['email'].lower()
        try:
            account = Account.objects.get(email=email)
        except Exception as e:
            return email
        raise ValidationError("Email is already in use.")

    def clean_username(self):
        username = self.cleaned_data['username']
        try:
            account = Account.objects.get(username=username)
        except Exception as e:
            return username
        raise ValidationError("Username already taken")

class UserUpdateUsername(forms.ModelForm):
    class Meta:
        model = Account
        fields = ['username']

        help_texts = {
            'username': None,
        }
        labels = {
            "username": ""
        }

class UserUpdateEmail(forms.ModelForm):
    confirm_password = forms.CharField(widget=forms.PasswordInput())

    class Meta:
        model = Account
        fields = ['email', 'confirm_password']
    
class ProfileUpdateForm(forms.ModelForm):
    image = forms.ImageField(label= (''), error_messages = {'invalid':("Image files only")}, widget=forms.FileInput)
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('label_suffix', '')
        super(ProfileUpdateForm, self).__init__(*args, **kwargs)
        self.fields['image'].help_text = None
    
    class Meta:
        model = Profile
        fields = ['image']
        labels = {
            "image": ""
        }


        