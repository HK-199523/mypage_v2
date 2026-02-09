from django.test import TestCase, Client, RequestFactory
from django.urls import reverse
from unittest.mock import patch
from ..models import T_Article, T_Article_Detail, T_Tag_Detail, M_Tag, T_News
from ..views import get_tech_news_view
import json

class SendEmailViewTest(TestCase):
    def setUp(self):
        self.client = Client()
        self.url = reverse('send_email')  # URL設定で name='send_email' にしている前提
        self.valid_payload = {
            'name': '太郎',
            'email': 'taro@example.com',
            'message': 'これはテストメッセージです。'
        }

    @patch('mypage.views.send_mail')
    def test_send_email_success(self, mock_send_mail):
        mock_send_mail.return_value = 1  # メールが送信されたと仮定

        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_payload),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        self.assertIn('メールが送信されました', response.json()['message'])

        # メールが2回送信されたかを確認
        self.assertEqual(mock_send_mail.call_count, 2)

        # 最初のメール内容を確認
        first_call = mock_send_mail.call_args_list[0]
        self.assertIn('お問い合わせありがとうございます', first_call[0])  # 件名
        args, kwargs = mock_send_mail.call_args_list[0]
        self.assertIn(self.valid_payload['email'], args[3])  # 第4引数 = recipient_list


    def test_invalid_method(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 400)
        self.assertIn('Invalid request', response.json()['error'])

    @patch('mypage.views.send_mail')
    def test_send_email_failure(self, mock_send_mail):
        mock_send_mail.side_effect = Exception("メール送信エラー")

        response = self.client.post(
            self.url,
            data=json.dumps(self.valid_payload),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 500)
        self.assertIn('メール送信エラー', response.json()['error'])

class GetNewsTest(TestCase):
    def setUp(self):
        T_News.objects.create(Title='Test A', News_body='testesttestesttest2021')
        T_News.objects.create(Title='Test B', News_body='testesttestesttest2021')
        T_News.objects.create(Title='Test C', News_body='testesttestesttest2021')
        T_News.objects.create(Title='Test D', News_body='testesttestesttest2021')
        T_News.objects.create(Title='Test E', News_body='testesttestesttest2021')

    def test_get_news_3record(self):
        data1 = {
            'record_num' : 3
        }
        response1 = self.client.post(
            reverse('get_news'),
            data1,
            content_type='application/json'  # JSON形式として送信
        )
        self.assertEqual(response1.status_code,200)
        res = response1.json()
        print(res)
        print(len(res))

    def test_get_news_execept_3record(self):
        data2 = {
            'record_num' : 4
        }
        response2 = self.client.post(
            reverse('get_news'),
            data2,
            content_type='application/json'  # JSON形式として送信
        )
        self.assertEqual(response2.status_code,200)
        res2 = response2.json()
        print(res2)
        print(len(res2))

class GetTechNewsViewTests(TestCase):

    def setUp(self):
        self.factory = RequestFactory()

    # 1. POST 以外のメソッド
    def test_get_method_returns_none(self):
        req = self.factory.get('/tech')
        response = get_tech_news_view(req)
        self.assertIsNone(response)

    # ---------------------------------------------------------
    # 2. POST + record_num == 10 正常系
    # ---------------------------------------------------------
    @patch("mypage.views.T_Article.objects")
    def test_post_recordnum_10_success(self, mock_article):
        # queryset を空で返すようにセット
        mock_article.select_related.return_value.prefetch_related.return_value.filter.return_value.order_by.return_value.__getitem__.return_value = []

        payload = {"record_num": 10}
        req = self.factory.post(
            "/tech",
            data=json.dumps(payload),
            content_type="application/json"
        )

        res = get_tech_news_view(req)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(json.loads(res.content), [])

    # ---------------------------------------------------------
    # 3. POST + record_num != 10 正常系
    # ---------------------------------------------------------
    @patch("mypage.views.T_Article.objects")
    def test_post_recordnum_not_10_success(self, mock_article):
        mock_article.select_related.return_value.prefetch_related.return_value.filter.return_value.order_by.return_value.__getitem__.return_value = []

        payload = {"record_num": 5}
        req = self.factory.post(
            "/tech",
            data=json.dumps(payload),
            content_type="application/json"
        )

        res = get_tech_news_view(req)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(json.loads(res.content), [])

    # ---------------------------------------------------------
    # 4. POST + record_num == 10 例外発生 → 500
    # ---------------------------------------------------------
    @patch("mypage.views.T_Article.objects")
    def test_post_recordnum_10_exception(self, mock_article):
        # DB エラーを強制発生
        mock_article.select_related.side_effect = Exception("DB Error")

        payload = {"record_num": 10}
        req = self.factory.post(
            "/tech",
            data=json.dumps(payload),
            content_type="application/json"
        )

        res = get_tech_news_view(req)
        self.assertEqual(res.status_code, 500)
        self.assertEqual(json.loads(res.content), {"error": "DB Error"})

    # ---------------------------------------------------------
    # 5. POST + record_num != 10 例外発生 → 500
    # ---------------------------------------------------------
    @patch("mypage.views.T_Article.objects")
    def test_post_recordnum_not_10_exception(self, mock_article):
        mock_article.select_related.side_effect = Exception("DB Error")

        payload = {"record_num": 3}
        req = self.factory.post(
            "/tech",
            data=json.dumps(payload),
            content_type="application/json"
        )

        res = get_tech_news_view(req)
        self.assertEqual(res.status_code, 500)
        self.assertEqual(json.loads(res.content), {"error": "DB Error"})