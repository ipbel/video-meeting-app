from django.db import models


# Create your models here.
class RoomInfo(models.Model):
    user = models.CharField('User_login', max_length=50)
    call_id = models.IntegerField('Room ID')

