from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('meeting/<room_url>', views.get_room_meeting, name='meeting'),
    path('statistics', views.statistics, name='statistics'),
    path('offer', views.sdpconnection, name='offer')
]