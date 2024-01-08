from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.conf import settings
import os

def download_file_view(request, file_name):
    # 다운로드할 파일의 경로
    file_path = os.path.join(settings.MEDIA_ROOT, file_name)  # 또는 settings.STATIC_ROOT를 사용할 수 있습니다.

    # 파일이 존재하는지 확인
    # backend\media\uploads\고정자산관리규칙.hwp
    if os.path.exists("./media/uploads/test.txt"):
        with open("./media/uploads/test.txt", 'rb') as file:
            response = HttpResponse(file.read(), content_type='application/octet-stream')
            response['Content-Disposition'] = f'attachment; filename="{file_name}"'
            return response
    else:
        # 파일이 존재하지 않을 경우 404 에러 반환
        return HttpResponse(status=404)