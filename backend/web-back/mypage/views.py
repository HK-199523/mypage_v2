# Create your views here.
from django.shortcuts import render
from rest_framework import generics
from django.core.mail import send_mail
from django.db.models import Prefetch
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from .models import T_Article, T_Article_Detail, T_Tag_Detail, M_Tag, T_News
import json
from django.views.decorators.csrf import csrf_exempt #一時的に設定。後で削除。




def send_email_view(request):
    print(request.body)
    if request.method == 'POST':
        print("OK1\n")
        try:
            data = json.loads(request.body)
            name = data.get('name')
            email = data.get('email')
            print("送信先:", email)
            message = '送信メッセージ：' + '\n' + data.get('message')
            print("OK2\n")
            send_mail(
                'お問い合わせありがとうございます',  # 件名
                message,  # メール本文
                'example@chacon.com',  # 送信元
                [email],  # 送信先
                fail_silently=False,
            )
            print("OK3\n")
            subject = name + '様からメッセージが届いています。'
            message2 = '氏         名：' + name + '様' + '\n' + \
                       'メールアドレス：' + email + '\n' + \
                       'メッセージ    ：' + '\n' + message
            send_mail(
                subject,
                message2,
                'example@chacon.com',  # 送信元
                ['maybe2809me@gmail.com'],
                fail_silently=False,
            )
            print("OK4\n")
            return JsonResponse({'message': 'メールが送信されました！'}, status=200)
        except Exception as e:
            print("SendMail Error:", e)
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request'}, status=400)

def get_news_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        if data['record_num'] == 3:
            try:
                news = T_News.objects.filter(Del_flg='0').order_by('-Create_date')[:3]
                data = []
                for item in news:
                    dict = {
                        'Id':item.Id,
                        'Title':item.Title,
                        'News_body':item.News_body[:50],
                        'Image':item.Image.url,
                        'Create_date':item.Create_date.strftime('%Y年%m月%d日')
                    }
                    data.append(dict)


                print(JsonResponse(data, safe=False, status=200))
                return JsonResponse(data, safe=False, status=200)
            except Exception as e:
                print('DB Error')   
                return JsonResponse({'error': 'DB Error'}, status=500)
        else:
            try:
                news = T_News.objects.order_by('-Create_date')[:20]
                data = []
                for item in news:
                    dict = {
                        'Id':item.Id,
                        'Title':item.Title,
                        'News_body':item.News_body,
                        'Image':item.Image.url,
                        'Create_date':item.Create_date.strftime('%Y年%m月%d日')
                    }
                    data.append(dict)
                print(JsonResponse(data, safe=False, status=200))
                return JsonResponse(data, safe=False, status=200)
            except Exception as e:
                print('DB Error')
                return JsonResponse({'error': 'DB Error'}, status=500)

def get_tech_news_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        if data['record_num'] == 10:
            try:
                tech_news = (
                    T_Article.objects
                    .select_related("detail")
                    .prefetch_related(
                        Prefetch(
                            'detail__tag_details',
                            queryset=T_Tag_Detail.objects.select_related("Tag"),
                            to_attr='filtered_tags'
                        )
                    )
                    .filter(Del_flg="0", detail__Del_flg="0")
                    .order_by("-Create_date")[:10]
                )
                data = []
                tags = []
                for item in tech_news:
                    for td in item.detail.filtered_tags:
                        tags.append({
                            "Tag_id": td.Tag.Tag_id,
                            "Tag_name": td.Tag.Tag_name
                        })

                    dict = {
                        'Id':item.Id,
                        'Title':item.Title,
                        'Article_id':item.detail.Article_id,
                        'Article_body':item.detail.Detail,
                        'Image':item.detail.Article_image.url,
                        'Create_date':item.Create_date.strftime('%Y年%m月%d日'),
                        'Tags' : tags
                    }
                    data.append(dict)


                print(JsonResponse(data, safe=False, status=200))
                return JsonResponse(data, safe=False, status=200)
            except Exception as e:
                print('DB Error')  
                return JsonResponse({'error': 'DB Error'}, status=500)
        else:
            try:
                tech_news = (
                    T_Article.objects
                    .select_related("detail")
                    .prefetch_related(
                        Prefetch(
                            'detail__tag_details',
                            queryset=T_Tag_Detail.objects.select_related("Tag"),
                            to_attr='filtered_tags'
                        )
                    )
                    .filter(Del_flg="0", detail__Del_flg="0")
                    .order_by("-Create_date")[:10]
                )
                data = []
                
                for item in tech_news:
                    tags = []
                    for td in item.detail.filtered_tags:
                        tags.append({
                            "Tag_id": td.Tag.Tag_id,
                            "Tag_name": td.Tag.Tag_name
                        })

                    dict = {
                        'Id':item.Id,
                        'Title':item.Title,
                        'Article_id':item.detail.Article_id,
                        'Article_body':item.detail.Detail,
                        'Image':item.detail.Article_image.url,
                        'Create_date':item.Create_date.strftime('%Y年%m月%d日'),
                        'Tags' : tags
                    }
                    data.append(dict)
                print(JsonResponse(data, safe=False, status=200))
                return JsonResponse(data, safe=False, status=200)
            except Exception as e:
                print('DB Error')
                return JsonResponse({'error': 'DB Error'}, status=500)