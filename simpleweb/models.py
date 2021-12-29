from django.db import models
from django.conf import settings

# Create your models here.
class FileUpload(models.Model):
    title = models.TextField(max_length=40, null=True)
    explain = models.TextField(max_length=40, null=True)
    language = models.TextField(max_length=40, null=True)
    code = models.FileField(upload_to="script")

    def __str__(self):
        return self.title

