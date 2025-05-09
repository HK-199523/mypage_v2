# Create your views here.
from django.shortcuts import render
from rest_framework import generics
from django.core.mail import send_mail
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
                news = T_News.objects.order_by('-Create_date')[:3]
                res = list(news.values())
                print(JsonResponse(res, safe=False, status=200))
                return JsonResponse(res, safe=False, status=200)
            except Exception as e:
                print('DB Error')  
        else:
            try:
                news = T_News.objects.order_by('-Create_date')
                res = list(news.values())
                print(JsonResponse(res, safe=False, status=200))
                return JsonResponse(res, safe=False, status=200)
            except Exception as e:
                print('DB Error')