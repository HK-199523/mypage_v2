from django.urls import path, include
from .views import (
    send_email_view, get_news_view, get_news_detail_view,
    get_article_detail_view, get_tech_news_view,
    get_articles_by_tag_view,
    tag_list_create, tag_detail,
    article_list_create, article_detail_view,
    news_list_create, news_detail_admin_view,
    login_view, logout_view, check_auth,
    user_list_create, user_detail,
)
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('send_email/',send_email_view, name='send_email'),
    path('get_news/',get_news_view, name='get_news'),
    path('get_news/<int:pk>/', get_news_detail_view, name='get_news_detail'),
    path('get_article/<uuid:pk>/', get_article_detail_view, name='get_article_detail'),
    path('get_tech_news/',get_tech_news_view, name='get_tech_news'),
    path('get_articles_by_tag/<int:tag_id>/', get_articles_by_tag_view, name='get_articles_by_tag'),

    # 認証APIエンドポイント
    path('auth/login/', login_view, name='login'),
    path('auth/logout/', logout_view, name='logout'),
    path('auth/check/', check_auth, name='check_auth'),
    path('auth/users/', user_list_create, name='user_list_create'),
    path('auth/users/<int:pk>/', user_detail, name='user_detail'),

    # 管理用APIエンドポイント
    path('admin/tags/', tag_list_create, name='tag_list_create'),
    path('admin/tags/<int:pk>/', tag_detail, name='tag_detail'),
    path('admin/articles/', article_list_create, name='article_list_create'),
    path('admin/articles/<uuid:pk>/', article_detail_view, name='article_detail'),
    path('admin/news/', news_list_create, name='news_list_create'),
    path('admin/news/<int:pk>/', news_detail_admin_view, name='news_detail_admin'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
