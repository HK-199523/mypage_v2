from django.contrib import admin
from .models import T_Article, T_Article_Detail, T_Tag_Detail, M_Tag, T_News

# Register your models here.
#from .models import Todo

admin.site.register(T_Article)
admin.site.register(T_Article_Detail)
admin.site.register(T_Tag_Detail)
admin.site.register(M_Tag)
admin.site.register(T_News)


