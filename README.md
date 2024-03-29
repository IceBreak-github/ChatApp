# ChatApplication
Web Chat application built with Django, Channels, Postgresql, Redis and TailwindCSS. Designed in Adobe XD.

**Pictures**

White Mode:
![alt text](https://i.ibb.co/wd2YrPV/Web-1920-11.png)
![alt text](https://i.ibb.co/5cwmpBM/Web-1920-37.png)

Dark Mode:
![alt text](https://i.ibb.co/TL45198/Web-1920-12.png)
![alt text](https://i.ibb.co/G5c626s/Web-1920-45.png)

# Setup
Please install the required dependencies by running:

``pip install -r requirements.txt``

# Deployment
If you want to deploy the app using Railway or some other hosting provider you still need to change a few variables in **settings.py**

1) Set ``CSRF_TRUSTED_ORIGINS`` to your website's URL
2) Add your website's domain to ``ALLOWED_HOSTS``
3) Set ``DEBUG`` to False after collecting the static
4) You most likely want to change the ``TIME_ZONE`` as well
5) Change all the environ variables *os.environ*:
  <br> </br>
  ``SECRET_KEY``   - You can generate one at https://miniwebtool.com/django-secret-key-generator/. It is recommended to set it to your own environ variable using your hosting service
  <br> </br>
   Change the environ variables in ``DATABASES``, ``CHANNEL_LAYERS`` and ``CACHES``
   
# Basic commands
Create a superuser by running ``python manage.py createsuperuser``  
Run the server: ``python manage.py runserver``  
Collect static: ``python manage.py collectstatic``  
<br> </br>
**You can support me by signing up on Railway using this link: https://railway.app?referralCode=SxBLZE**
