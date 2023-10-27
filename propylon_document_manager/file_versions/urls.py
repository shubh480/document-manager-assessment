from django.urls import path
from file_versions.views import UploadView
from django.urls import path



urlpatterns = [
    path('api/upload/', UploadView.as_view(), name='upload_view'),
]