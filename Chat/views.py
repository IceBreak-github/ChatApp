from django.shortcuts import render, redirect
from .forms import *
from .models import *
from django.contrib.auth.forms import UserCreationForm, PasswordChangeForm
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from .forms import UserUpdateUsername, ProfileUpdateForm, UserUpdateEmail
from django.contrib.auth.models import User
from django.contrib.auth.views import PasswordChangeView
from django.urls import reverse_lazy
from django.contrib.auth import update_session_auth_hash
from django.core.exceptions import ValidationError
from django.contrib.auth.hashers import check_password
from django.contrib.sites.shortcuts import get_current_site

# Create your views here.
def Home(request):
    if request.user.is_authenticated:
        return redirect('chat-index')
    else:
        if request.method == 'POST':
            email = request.POST.get('email')
            password = request.POST.get('password')

            user = authenticate(request, email=email, password=password)

            if user is not None:
                login(request, user)
                return redirect('chat-index')
            else:
                messages.error(request, "Login Invalid")
                return redirect('chat-index')
        context = {

        }
        return render(request, "index.html", context)

def Register(request):
    if request.user.is_authenticated:
        return redirect('chat-index')
    else:
        form = CreateUserForm()
        if request.method == 'POST':
            form = CreateUserForm(request.POST)
            if form.is_valid():
                recaptcha_response = request.POST.get('g-recaptcha-response')
                url = 'https://www.google.com/recaptcha/api/siteverify'
                values = {
                    'secret': settings.RECAPTCHA_PRIVATE_KEY,
                    'response': recaptcha_response
                    }
                data = urllib.parse.urlencode(values).encode()
                req =  urllib.request.Request(url, data=data)
                response = urllib.request.urlopen(req)
                result = json.loads(response.read().decode())
                if result['success']:
                    form.save()
                    user = form.cleaned_data.get('username')
                    messages.success(request, 'Account was created for ' + user)
                    return redirect('index')
                else:
                    messages.error(request, 'Invalid reCAPTCHA. Please try again.')
                    return redirect('register')

        context = {
            'form': form
        }
        return render(request, "register.html", context)

def logoutUser(request):
    logout(request)
    return redirect('index')

@login_required(login_url = 'index')
def Chat(request):
    return redirect(request._current_scheme_host +'/chat/General')

@login_required(login_url = 'index')
def room(request, room_name):
    superusers = Account.objects.filter(is_superuser=True)
    messages_filtered = Message.objects.filter(room = room_name)
    total_msgs = len(messages_filtered)

    if total_msgs > 25:
        last_msgs = messages_filtered[total_msgs-25::]
    else:
        last_msgs = messages_filtered

    message_rooms = ['General', 'Memes', 'Questions', 'Coding', 'Off_topic', 'Gaming', 'Announcements']
    messages_list = []
    for name in range(len(message_rooms)):
        try:
            last_msg = Message.objects.filter(room = message_rooms[name])[len(Message.objects.filter(room = message_rooms[name]))-1::] if len(Message.objects.filter(room = message_rooms[name])) >= 1 else Message.objects.filter(message_rooms[name])
            for m in last_msg:
                result = [m.content] + [m.author.username] + [m.date_added.strftime("%H:%M")]
                messages_list.append(result)
        except:
            messages_list.append(None)
            
    if request.method == 'POST':
            if 'Edit_Profile_Submit' in request.POST:
                u_form = UserUpdateUsername(request.POST, instance=request.user)
                p_form = ProfileUpdateForm(request.POST, request.FILES,  instance=request.user.profile)
                if u_form.is_valid() and p_form.is_valid():
                    u_form.save()
                    p_form.save()
                    return redirect('chat-index')
                else:
                    return redirect('chat-index')

            elif 'Change_Password_Submit' in request.POST:
                c_form = PasswordChangeForm(request.user, request.POST)
                if c_form.is_valid():
                    user = c_form.save()
                    update_session_auth_hash(request, user)
                    messages.success(request, 'Your password was successfully updated!')
                    logout(request)
                    return redirect('index')
                else:
                    messages.error(request, 'Your password was not changed, please fill in valid information')
                    return redirect('chat-index')
            elif 'Change_Email_Submit' in request.POST:
                e_form = UserUpdateEmail(request.POST, instance=request.user)
                if e_form.is_valid():
                    cleaned_data = e_form.cleaned_data.get('confirm_password')
                    instance=request.user
                    if check_password(cleaned_data, instance.password):
                        e_form.save()
                        return redirect('chat-index')
                    else:
                        messages.error(request, 'Password does not match')
                        return redirect('chat-index')
                else:
                    return redirect('chat-index')
    else:
        u_form = UserUpdateUsername(instance=request.user)
        p_form = ProfileUpdateForm(instance=request.user.profile)
        c_form = PasswordChangeForm(request.user)
        e_form = UserUpdateEmail(instance=request.user)

    return render(request, 'chat.html', {
            'room_name': room_name,
            'messages': last_msgs,
            'superusers': superusers,
            'user': request.user,
            'messages_list': messages_list,

            'u_form': u_form,
            'p_form': p_form,
            'c_form': c_form,
            'e_form': e_form,
        })

def lockout(request, credentials, *args, **kwargs):
    messages.error(request, "Account locked. Try again in 6 minutes")
    return redirect('index')
