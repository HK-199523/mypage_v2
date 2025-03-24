import uuid
from django.db import models

# Create your models here.

# tech Article関連モデル
class T_Article(models.Model):
    Id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    Title = models.CharField(max_length=200)
    Article_id = models.IntegerField(unique=True)
    Create_date = models.DateTimeField(auto_now_add=True)
    Del_flg = models.CharField(max_length=1,default="0")

    def __str__(self):
        return self.title
    
class T_Article_Detail(models.Model):
    Article_id = models.AutoField(primary_key=True)
    Article_image = models.ImageField(upload_to='product_images/') 
    Overview = models.CharField(max_length=100)
    Detail = models.TextField()
    Related_tag_id = models.IntegerField(unique=True)
    Create_date = models.DateTimeField(auto_now_add=True)
    Del_flg = models.CharField(max_length=1,default="0")

    def __str__(self):
        return self.Article_id
    
class T_Tag_Detail(models.Model):
    Related_tag_id = models.IntegerField()
    Tag_id = models.IntegerField()

    class Meta:
        constraints = [
            models.UniqueConstraint(fields = ['Related_tag_id','Tag_id'],name = 'unique_tag')
        ]
        def __str__(self):
            return self.constraints
        
class M_Tag:
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