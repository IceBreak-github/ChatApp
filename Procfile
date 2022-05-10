web: daphne ChatTest.asgi:application --port $PORT --bind 0.0.0.0 -v2
chatworker: python manage.py runworker --settings=ChatTest.settings -v2