from django.db import models
from django.db.models.signals import post_save
from home.signals import send_http_push_notification


class DBHttpPush(models.Model):
    id = models.AutoField('Id', primary_key=True)
    description = models.CharField('Description', max_length=250)

post_save.connect(send_http_push_notification, sender=DBHttpPush)
