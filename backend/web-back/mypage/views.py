# Create your views here.
from django.shortcuts import render, get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail
from django.db.models import Prefetch
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from .models import T_Article, T_Article_Detail, T_Tag_Detail, M_Tag, T_News
from .permissions import IsStaffOrReadOnly, IsSuperuser
from .serializers import (
    M_TagSerializer, T_ArticleSerializer, T_Article_DetailSerializer,
    T_Tag_DetailSerializer, ArticleWithDetailsSerializer
)
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

@api_view(['GET'])
def get_news_detail_view(request, pk):
    """ニュース詳細取得（ID指定）"""
    news = get_object_or_404(T_News, Id=pk, Del_flg='0')
    data = {
        'Id': news.Id,
        'Title': news.Title,
        'News_body': news.News_body,
        'Image': news.Image.url,
        'Create_date': news.Create_date.strftime('%Y年%m月%d日'),
    }
    return Response(data)


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

@api_view(['GET'])
def get_article_detail_view(request, pk):
    """記事詳細取得（UUID指定）"""
    try:
        article = T_Article.objects.select_related('detail').prefetch_related(
            'detail__tag_details__Tag'
        ).get(Id=pk, Del_flg='0')
    except T_Article.DoesNotExist:
        return Response({'error': 'Article not found'}, status=status.HTTP_404_NOT_FOUND)

    if not hasattr(article, 'detail') or article.detail.Del_flg != '0':
        return Response({'error': 'Article detail not found'}, status=status.HTTP_404_NOT_FOUND)

    tags = []
    for td in article.detail.tag_details.all():
        tags.append({
            "Tag_id": td.Tag.Tag_id,
            "Tag_name": td.Tag.Tag_name
        })

    data = {
        'Id': str(article.Id),
        'Title': article.Title,
        'Detail': article.detail.Detail,
        'Article_image': article.detail.Article_image.url if article.detail.Article_image else None,
        'Create_date': article.Create_date.strftime('%Y年%m月%d日'),
        'Tags': tags,
    }
    return Response(data)


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


# ==================== 管理用APIエンドポイント ====================

# タグマスタ管理API
@api_view(['GET', 'POST'])
@permission_classes([IsStaffOrReadOnly])
def tag_list_create(request):
    """タグ一覧取得とタグ作成"""
    if request.method == 'GET':
        tags = M_Tag.objects.all()
        serializer = M_TagSerializer(tags, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = M_TagSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsStaffOrReadOnly])
def tag_detail(request, pk):
    """タグの取得、更新、削除"""
    try:
        tag = M_Tag.objects.get(Tag_id=pk)
    except M_Tag.DoesNotExist:
        return Response({'error': 'Tag not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = M_TagSerializer(tag)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = M_TagSerializer(tag, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        tag.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# 記事管理API
@api_view(['GET', 'POST'])
@permission_classes([IsStaffOrReadOnly])
def article_list_create(request):
    """記事一覧取得と記事作成"""
    if request.method == 'GET':
        try:
            articles = (
                T_Article.objects
                .select_related("detail")
                .prefetch_related(
                    Prefetch(
                        'detail__tag_details',
                        queryset=T_Tag_Detail.objects.select_related("Tag")
                    )
                )
                .filter(Del_flg="0")
                .order_by("-Create_date")
            )

            data = []
            for article in articles:
                try:
                    if not hasattr(article, 'detail'):
                        continue

                    tags = []
                    for td in article.detail.tag_details.all():
                        tags.append({
                            "Tag_id": td.Tag.Tag_id,
                            "Tag_name": td.Tag.Tag_name
                        })

                    data.append({
                        'Id': str(article.Id),
                        'Title': article.Title,
                        'Article_id': article.Article_id,
                        'Overview': article.detail.Overview,
                        'Detail': article.detail.Detail,
                        'Article_image': article.detail.Article_image.url if article.detail.Article_image else None,
                        'Related_tag_id': article.detail.Related_tag_id,
                        'Create_date': article.Create_date.strftime('%Y年%m月%d日'),
                        'Tags': tags
                    })
                except Exception as e:
                    print(f"記事処理エラー (ID: {article.Id}): {e}")
                    continue

            return Response(data)
        except Exception as e:
            print(f"記事一覧取得エラー: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    elif request.method == 'POST':
        try:
            import json
            # FormDataから送られてくるデータを処理
            data = {}
            for key in request.data:
                data[key] = request.data[key]

            print(f"受信データ: {data}")

            # tag_idsがJSON文字列として送られている場合はパース
            if 'tag_ids' in data:
                print(f"tag_ids (パース前): {data['tag_ids']}, 型: {type(data['tag_ids'])}")
                if isinstance(data['tag_ids'], str):
                    try:
                        parsed_tag_ids = json.loads(data['tag_ids'])
                        print(f"tag_idsをパース: {parsed_tag_ids}, 型: {type(parsed_tag_ids)}")
                        # 整数の配列であることを保証
                        if isinstance(parsed_tag_ids, list):
                            data['tag_ids'] = [int(tid) for tid in parsed_tag_ids]
                            print(f"tag_ids (整数変換後): {data['tag_ids']}")
                        else:
                            data['tag_ids'] = []
                    except (json.JSONDecodeError, ValueError) as e:
                        print(f"tag_ids パースエラー: {e}")
                        return Response(
                            {'tag_ids': f'Invalid format: {str(e)}'},
                            status=status.HTTP_400_BAD_REQUEST
                        )

            print(f"処理後データ: {data}")

            serializer = ArticleWithDetailsSerializer(data=data)
            if serializer.is_valid():
                article = serializer.save()
                return Response(
                    {'message': 'Article created successfully', 'Id': str(article.Id)},
                    status=status.HTTP_201_CREATED
                )
            print(f"バリデーションエラー: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            import traceback
            print(f"記事作成エラー: {e}")
            print(traceback.format_exc())
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsStaffOrReadOnly])
def article_detail_view(request, pk):
    """記事の取得、更新、削除"""
    try:
        article = T_Article.objects.select_related('detail').prefetch_related(
            'detail__tag_details__Tag'
        ).get(Id=pk)
    except T_Article.DoesNotExist:
        return Response({'error': 'Article not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        tags = []
        if hasattr(article, 'detail'):
            for td in article.detail.tag_details.all():
                tags.append({
                    "Tag_id": td.Tag.Tag_id,
                    "Tag_name": td.Tag.Tag_name
                })

            data = {
                'Id': str(article.Id),
                'Title': article.Title,
                'Article_id': article.Article_id,
                'Overview': article.detail.Overview,
                'Detail': article.detail.Detail,
                'Article_image': article.detail.Article_image.url if article.detail.Article_image else None,
                'Related_tag_id': article.detail.Related_tag_id,
                'Create_date': article.Create_date.strftime('%Y年%m月%d日'),
                'Tags': tags,
                'tag_ids': [tag['Tag_id'] for tag in tags]
            }
            return Response(data)
        else:
            return Response({'error': 'Article detail not found'}, status=status.HTTP_404_NOT_FOUND)

    elif request.method == 'PUT':
        try:
            import json
            # FormDataから送られてくるデータを処理
            data = {}
            for key in request.data:
                data[key] = request.data[key]

            print(f"受信データ（更新）: {data}")

            # tag_idsがJSON文字列として送られている場合はパース
            if 'tag_ids' in data:
                print(f"tag_ids (パース前・更新): {data['tag_ids']}, 型: {type(data['tag_ids'])}")
                if isinstance(data['tag_ids'], str):
                    try:
                        parsed_tag_ids = json.loads(data['tag_ids'])
                        print(f"tag_idsをパース（更新）: {parsed_tag_ids}, 型: {type(parsed_tag_ids)}")
                        # 整数の配列であることを保証
                        if isinstance(parsed_tag_ids, list):
                            data['tag_ids'] = [int(tid) for tid in parsed_tag_ids]
                            print(f"tag_ids (整数変換後・更新): {data['tag_ids']}")
                        else:
                            data['tag_ids'] = []
                    except (json.JSONDecodeError, ValueError) as e:
                        print(f"tag_ids パースエラー（更新）: {e}")
                        return Response(
                            {'tag_ids': f'Invalid format: {str(e)}'},
                            status=status.HTTP_400_BAD_REQUEST
                        )

            print(f"処理後データ（更新）: {data}")

            serializer = ArticleWithDetailsSerializer(article, data=data)
            if serializer.is_valid():
                serializer.save()
                return Response({'message': 'Article updated successfully'})
            print(f"バリデーションエラー (更新): {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            import traceback
            print(f"記事更新エラー: {e}")
            print(traceback.format_exc())
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    elif request.method == 'DELETE':
        # 論理削除
        article.Del_flg = "1"
        article.save()
        if hasattr(article, 'detail'):
            article.detail.Del_flg = "1"
            article.detail.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ==================== ニュース管理APIエンドポイント ====================

@api_view(['GET', 'POST'])
@permission_classes([IsStaffOrReadOnly])
def news_list_create(request):
    """ニュース一覧取得とニュース作成"""
    if request.method == 'GET':
        try:
            news_list = T_News.objects.filter(Del_flg='0').order_by('-Create_date')
            data = []
            for item in news_list:
                data.append({
                    'Id': item.Id,
                    'Title': item.Title,
                    'News_body': item.News_body,
                    'Image': item.Image.url if item.Image else None,
                    'Create_date': item.Create_date.strftime('%Y年%m月%d日'),
                })
            return Response(data)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    elif request.method == 'POST':
        try:
            title = request.data.get('Title')
            news_body = request.data.get('News_body')
            image = request.data.get('Image')

            if not title or not news_body:
                return Response(
                    {'error': 'タイトルと本文は必須です'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            news = T_News(Title=title, News_body=news_body)
            if image:
                news.Image = image
            news.save()

            return Response(
                {'message': 'ニュースを作成しました', 'Id': news.Id},
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsStaffOrReadOnly])
def news_detail_admin_view(request, pk):
    """ニュースの取得、更新、削除"""
    try:
        news = T_News.objects.get(Id=pk, Del_flg='0')
    except T_News.DoesNotExist:
        return Response({'error': 'ニュースが見つかりません'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        data = {
            'Id': news.Id,
            'Title': news.Title,
            'News_body': news.News_body,
            'Image': news.Image.url if news.Image else None,
            'Create_date': news.Create_date.strftime('%Y年%m月%d日'),
        }
        return Response(data)

    elif request.method == 'PUT':
        try:
            title = request.data.get('Title')
            news_body = request.data.get('News_body')
            image = request.data.get('Image')

            if title:
                news.Title = title
            if news_body:
                news.News_body = news_body
            if image:
                news.Image = image

            news.save()
            return Response({'message': 'ニュースを更新しました'})
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    elif request.method == 'DELETE':
        news.Del_flg = '1'
        news.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ==================== 認証APIエンドポイント ====================

@api_view(['POST'])
def login_view(request):
    """ログイン"""
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {'error': 'ユーザー名とパスワードを入力してください'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(request, username=username, password=password)

    if user is not None:
        login(request, user)
        if user.is_superuser:
            role = 'superuser'
        elif user.is_staff:
            role = 'staff'
        else:
            role = 'viewer'
        return Response({
            'message': 'ログインに成功しました',
            'username': user.username,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
            'role': role,
        })
    else:
        return Response(
            {'error': 'ユーザー名またはパスワードが間違っています'},
            status=status.HTTP_401_UNAUTHORIZED
        )


@api_view(['POST'])
def logout_view(request):
    """ログアウト"""
    logout(request)
    return Response({'message': 'ログアウトしました'})


@api_view(['GET'])
def check_auth(request):
    """認証状態確認"""
    if request.user.is_authenticated:
        user = request.user
        if user.is_superuser:
            role = 'superuser'
        elif user.is_staff:
            role = 'staff'
        else:
            role = 'viewer'
        return Response({
            'authenticated': True,
            'username': user.username,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
            'role': role,
        })
    else:
        return Response({'authenticated': False}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET', 'POST'])
@permission_classes([IsSuperuser])
def user_list_create(request):
    """ユーザー一覧取得とユーザー作成（スーパーユーザーのみ）"""
    if request.method == 'GET':
        users = User.objects.all().order_by('id')
        data = []
        for u in users:
            if u.is_superuser:
                role = 'superuser'
            elif u.is_staff:
                role = 'staff'
            else:
                role = 'viewer'
            data.append({
                'id': u.id,
                'username': u.username,
                'email': u.email,
                'is_staff': u.is_staff,
                'is_superuser': u.is_superuser,
                'role': role,
            })
        return Response(data)

    elif request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email', '')
        role = request.data.get('role', 'viewer')

        if not username or not password:
            return Response(
                {'error': 'ユーザー名とパスワードは必須です'},
                status=status.HTTP_400_BAD_REQUEST
            )
        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'このユーザー名は既に使用されています'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.create_user(username=username, password=password, email=email)
        if role == 'superuser':
            user.is_superuser = True
            user.is_staff = True
        elif role == 'staff':
            user.is_staff = True
        user.save()

        return Response(
            {'message': 'ユーザーを作成しました', 'id': user.id},
            status=status.HTTP_201_CREATED
        )


@api_view(['PUT', 'DELETE'])
@permission_classes([IsSuperuser])
def user_detail(request, pk):
    """ユーザーの更新・削除（スーパーユーザーのみ）"""
    try:
        user = User.objects.get(id=pk)
    except User.DoesNotExist:
        return Response({'error': 'ユーザーが見つかりません'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        role = request.data.get('role')
        email = request.data.get('email')
        password = request.data.get('password')

        if role == 'superuser':
            user.is_superuser = True
            user.is_staff = True
        elif role == 'staff':
            user.is_superuser = False
            user.is_staff = True
        elif role == 'viewer':
            user.is_superuser = False
            user.is_staff = False

        if email is not None:
            user.email = email
        if password:
            user.set_password(password)

        user.save()
        return Response({'message': 'ユーザーを更新しました'})

    elif request.method == 'DELETE':
        if user == request.user:
            return Response(
                {'error': '自分自身は削除できません'},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def get_articles_by_tag_view(request, tag_id):
    """タグIDに紐づく記事一覧を取得"""
    tag = get_object_or_404(M_Tag, Tag_id=tag_id)
    articles = (
        T_Article.objects
        .select_related("detail")
        .prefetch_related(
            Prefetch(
                'detail__tag_details',
                queryset=T_Tag_Detail.objects.select_related("Tag"),
                to_attr='filtered_tags'
            )
        )
        .filter(Del_flg="0", detail__Del_flg="0",
                detail__tag_details__Tag__Tag_id=tag_id)
        .distinct()
        .order_by("-Create_date")
    )

    data = []
    for item in articles:
        tags = []
        for td in item.detail.filtered_tags:
            tags.append({
                "Tag_id": td.Tag.Tag_id,
                "Tag_name": td.Tag.Tag_name
            })
        data.append({
            'Id': str(item.Id),
            'Title': item.Title,
            'Article_id': item.detail.Article_id,
            'Article_body': item.detail.Detail,
            'Image': item.detail.Article_image.url if item.detail.Article_image else None,
            'Create_date': item.Create_date.strftime('%Y年%m月%d日'),
            'Tags': tags
        })

    return Response({
        'tag': {
            'Tag_id': tag.Tag_id,
            'Tag_name': tag.Tag_name
        },
        'articles': data
    })