import imp
from django.urls import path
from . import views

from django.conf import settings
from django.conf.urls.static import static

urlpatterns=[
    path('upload/', views.fileUpload, name='fileupload'),
    path('operatorList/', views.get_operator),
    path('', views.Home),
    path('run', views.test),
    path('result/', views.result_view),
    path('userwork/', views.get_user_work),
    path('userwork/<str:selected_folder>/', views.get_selected_work),
    path('userwork/<str:selected_folder>/<str:selected_operator>/', views.get_selected_operator),
]