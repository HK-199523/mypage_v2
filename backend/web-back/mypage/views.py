# Create your views here.
from django.shortcuts import render
from rest_framework import generics
#from .models import Todo
from django.core.mail import send_mail
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
import json
from django.views.decorators.csrf import csrf_exempt #一時的に設定。後で削除。





#@require_POST
#@method_decorator(csrf_protect, name='dispatch')
@csrf_exempt
def send_email_view(request):
    if request.method == 'POST':
        print("OK1\n")
        try:
            data = json.loads(request.body)
            name = data.get('name')
            email = data.get('email')
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
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Invalid request'}, status=400)
