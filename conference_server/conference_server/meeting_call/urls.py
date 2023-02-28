from django.urls import path
from . import views


urlpatterns = [
    path('', views.index, name='index'),
    path('meeting', views.ServerConnection.meeting, name='meeting'),
    path('statistics', views.statistics, name='statistics')
]