from django.urls import path, include
from .views import send_email_view, get_news_view

urlpatterns = [
    path('send_email/',send_email_view, name='send_email'),
    path('get_news/',get_news_view, name='get_news')
]
