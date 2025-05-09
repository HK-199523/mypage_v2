from django.test import TestCase, Client
from django.urls import reverse
from unittest.mock import patch
from ..models import T_Article, T_Article_Detail, T_Tag_Detail, M_Tag, T_News
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
        T_News.objects.create(Title='Test A', News_body='testest')
        T_News.objects.create(Title='Test B', News_body='testest')
        T_News.objects.create(Title='Test C', News_body='testest')
        T_News.objects.create(Title='Test D', News_body='testest')
        T_News.objects.create(Title='Test E', News_body='testest')

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