# views.py
from django.http import JsonResponse
from django.views import View
from django.core.files.storage import FileSystemStorage
from file_versions.models import FileVersion


class UploadView(View):
    authentication_classes = []
    permission_classes = []
    def post(self, request):
        if 'file' in request.FILES and 'version' in request.POST:
            uploaded_file = request.FILES['file']
            version = request.POST['version']

            # Store the file in a local directory
            fs = FileSystemStorage()
            file_name = fs.save(uploaded_file.name, uploaded_file)

            # Create a database record for the uploaded file
            file_version = FileVersion(file_name=file_name, version_number=version)
            file_version.save()
            return JsonResponse({'message': 'File uploaded and inserted successfully.'})

        return JsonResponse({'message': 'Invalid request.'}, status=400)
    

