from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.conf import settings
import os


def download_file_view(request, file_name):
    file_path = os.path.join(settings.MEDIA_ROOT, 'uploads', file_name)
    print(f"Download file path: {file_path}")  # 파일 경로 출력

    if os.path.exists(file_path):
        with open(file_path, 'rb') as file:
            response = HttpResponse(file.read(), content_type='application/octet-stream')
            response['Content-Disposition'] = f'attachment; filename="{file_name}"'
            return response
    else:
        print("File not found.")  # 파일이 없을 경우 메시지 출력
        return HttpResponse(status=404)

def download_notice_file(request, file_name):
    file_path = os.path.join(settings.MEDIA_ROOT, 'notice_uploads', file_name)
    print(f"Download notice file path: {file_path}")  # 파일 경로 출력

    if os.path.exists(file_path):
        with open(file_path, 'rb') as file:
            response = HttpResponse(file.read(), content_type='application/octet-stream')
            response['Content-Disposition'] = f'attachment; filename="{file_name}"'
            return response
    else:
        print("Notice file not found.")  # 파일이 없을 경우 메시지 출력
        return HttpResponse(status=404)