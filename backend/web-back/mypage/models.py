import uuid
from django.db import models

# Create your models here.

# tech Article関連モデル(記事テーブル)
class T_Article(models.Model):
    Id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    Title = models.CharField(max_length=200)
    Article_id = models.IntegerField(unique=True)
    Create_date = models.DateTimeField(auto_now_add=True)
    Del_flg = models.CharField(max_length=1, default="0")

    def __str__(self):
        return self.Title

# 記事詳細テーブル
class T_Article_Detail(models.Model):
    # ✅ 結合条件①: T_Article.Article_id = T_Article_Detail.Article_id
    Article = models.OneToOneField(
        T_Article,
        to_field="Article_id",
        on_delete=models.CASCADE,
        related_name="detail"
    )

    Article_image = models.ImageField(upload_to="product_images/")
    Overview = models.CharField(max_length=100)
    Detail = models.TextField()

    # ✅ 結合条件②: T_Article_Detail.Related_tag_id = T_Tag_Detail.Related_tag_id
    Related_tag_id = models.IntegerField(unique=True)

    Create_date = models.DateTimeField(auto_now_add=True)
    Del_flg = models.CharField(max_length=1, default="0")

    def __str__(self):
        return f"Detail of {self.Article.Title}"
    

# タグテーブル
class T_Tag_Detail(models.Model):
    # ✅ 結合条件②: Related_tag_id → T_Article_Detail.Related_tag_id
    Article_detail = models.ForeignKey(
        T_Article_Detail,
        to_field="Related_tag_id",
        on_delete=models.CASCADE,
        related_name="tag_details"
    )

    # ✅ 結合条件③: Tag_id → M_Tag.Tag_id
    Tag = models.ForeignKey(
        "M_Tag",
        to_field="Tag_id",
        on_delete=models.CASCADE,
        related_name="tag_links"
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["Article_detail", "Tag"], name="unique_tag")
        ]

    def __str__(self):
        return f"{self.Article_detail} - {self.Tag.Tag_name}"

# タグマスタテーブル
class M_Tag(models.Model):
    Tag_id = models.AutoField(primary_key=True)
    Tag_name = models.CharField( max_length=50)
    def __str__(self):
        return self.Tag_name
    
#tech Article関連モデル(ここまで)


# News関連モデル
class T_News(models.Model):
    Id = models.AutoField(primary_key=True)
    Title = models.CharField(max_length=50)
    News_body = models.TextField()
    Image = models.ImageField(upload_to='news_images/')
    Create_date = models.DateTimeField(auto_now_add=True)
    Del_flg = models.CharField(max_length=1,default="0")
    def __str__(self):
        return self.Title

# News関連モデル（ここまで）