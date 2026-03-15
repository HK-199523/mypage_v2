from rest_framework import serializers
from .models import T_Article, T_Article_Detail, T_Tag_Detail, M_Tag

# タグマスタシリアライザー
class M_TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = M_Tag
        fields = ['Tag_id', 'Tag_name']

# タグ詳細シリアライザー
class T_Tag_DetailSerializer(serializers.ModelSerializer):
    Tag_name = serializers.CharField(source='Tag.Tag_name', read_only=True)

    class Meta:
        model = T_Tag_Detail
        fields = ['id', 'Tag', 'Tag_name']

# 記事詳細シリアライザー（タグを含む）
class T_Article_DetailSerializer(serializers.ModelSerializer):
    tags = T_Tag_DetailSerializer(source='tag_details', many=True, read_only=True)
    tag_ids = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = T_Article_Detail
        fields = ['id', 'Article_image', 'Overview', 'Detail', 'Related_tag_id',
                 'Create_date', 'Del_flg', 'tags', 'tag_ids']
        read_only_fields = ['Create_date']

# 記事シリアライザー（詳細とタグを含む）
class T_ArticleSerializer(serializers.ModelSerializer):
    detail = T_Article_DetailSerializer(read_only=True)

    class Meta:
        model = T_Article
        fields = ['Id', 'Title', 'Article_id', 'Create_date', 'Del_flg', 'detail']
        read_only_fields = ['Id', 'Create_date']

# 記事作成・更新用の統合シリアライザー
class ArticleWithDetailsSerializer(serializers.Serializer):
    # 記事フィールド
    Title = serializers.CharField(max_length=200)
    Article_id = serializers.IntegerField(required=False)

    # 記事詳細フィールド
    Article_image = serializers.ImageField(required=False, allow_null=True)
    Overview = serializers.CharField(max_length=100)
    Detail = serializers.CharField()
    Related_tag_id = serializers.IntegerField(required=False)

    # タグIDリスト
    tag_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        allow_empty=True,
        allow_null=True
    )

    def validate_tag_ids(self, value):
        """tag_idsのバリデーション"""
        print(f"tag_idsバリデーション: {value}, 型: {type(value)}")
        if value is None:
            return []
        if not isinstance(value, list):
            raise serializers.ValidationError(f"tag_idsはリストである必要があります（受信: {type(value)}）")

        # 各要素が整数であることを確認
        try:
            validated_ids = [int(tid) for tid in value]
            print(f"tag_ids バリデーション完了: {validated_ids}")
            return validated_ids
        except (ValueError, TypeError) as e:
            raise serializers.ValidationError(f"tag_idsの要素はすべて整数である必要があります: {str(e)}")

    def validate(self, data):
        """全体のバリデーション"""
        print(f"全体バリデーション: {data}")
        return data

    def create(self, validated_data):
        from django.db.models import Max
        tag_ids = validated_data.pop('tag_ids', [])

        # 新規作成時は画像が必須
        if 'Article_image' not in validated_data or validated_data['Article_image'] is None:
            raise serializers.ValidationError({'Article_image': '画像は必須です'})

        # Article_idを自動採番（最大値+1）
        if 'Article_id' not in validated_data or validated_data['Article_id'] is None:
            max_article_id = T_Article.objects.aggregate(Max('Article_id'))['Article_id__max']
            article_id = (max_article_id or 0) + 1
        else:
            article_id = validated_data['Article_id']

        # Related_tag_idを自動採番（最大値+1）
        if 'Related_tag_id' not in validated_data or validated_data['Related_tag_id'] is None:
            max_related_tag_id = T_Article_Detail.objects.aggregate(Max('Related_tag_id'))['Related_tag_id__max']
            related_tag_id = (max_related_tag_id or 0) + 1
        else:
            related_tag_id = validated_data['Related_tag_id']

        # 記事を作成
        article_data = {
            'Title': validated_data['Title'],
            'Article_id': article_id
        }
        article = T_Article.objects.create(**article_data)

        # 記事詳細を作成
        detail_data = {
            'Article': article,
            'Article_image': validated_data['Article_image'],
            'Overview': validated_data['Overview'],
            'Detail': validated_data['Detail'],
            'Related_tag_id': related_tag_id
        }
        detail = T_Article_Detail.objects.create(**detail_data)

        # タグを関連付け
        for tag_id in tag_ids:
            T_Tag_Detail.objects.create(
                Article_detail=detail,
                Tag_id=tag_id
            )

        return article

    def update(self, instance, validated_data):
        tag_ids = validated_data.pop('tag_ids', None)

        # 記事を更新
        instance.Title = validated_data.get('Title', instance.Title)
        instance.Article_id = validated_data.get('Article_id', instance.Article_id)
        instance.save()

        # 記事詳細を更新
        detail = instance.detail
        # 画像は新しいファイルが送られた場合のみ更新
        if 'Article_image' in validated_data and validated_data['Article_image'] is not None:
            detail.Article_image = validated_data['Article_image']
        detail.Overview = validated_data.get('Overview', detail.Overview)
        detail.Detail = validated_data.get('Detail', detail.Detail)
        detail.Related_tag_id = validated_data.get('Related_tag_id', detail.Related_tag_id)
        detail.save()

        # タグを更新（既存のタグを削除して新しいタグを追加）
        if tag_ids is not None:
            detail.tag_details.all().delete()
            for tag_id in tag_ids:
                T_Tag_Detail.objects.create(
                    Article_detail=detail,
                    Tag_id=tag_id
                )

        return instance

