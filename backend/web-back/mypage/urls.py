from django.urls import path, include
from .views import send_email_view, get_news_view, get_tech_news_view
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('send_email/',send_email_view, name='send_email'),
    path('get_news/',get_news_view, name='get_news'),
    path('get_tech_news/',get_tech_news_view, name='get_tech_news')
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
