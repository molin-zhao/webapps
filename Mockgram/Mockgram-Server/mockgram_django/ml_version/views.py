from django.http import HttpResponse
from django.views.decorators.http import require_http_methods
from .object_detection.object_detection_image import detect_image
import json

def indexView(request):
  return HttpResponse('ml-version app')

@require_http_methods(['GET'])
def objectDetectionView(request):
  try:
    thr = 0.5 # init value for threshold
    image = request.GET['image']
    result = detect_image(image, thr)
    res = {}
    res['status'] = 200
    res['msg'] = 'success'
    res['data'] = result
    res_json = json.dumps(res)
    return HttpResponse(res_json, content_type="application/json")
  except:
    res = {}
    res['status'] = 500
    res['msg'] = 'request error'
    res_json = json.dumps(res)
    return HttpResponse(res_json, content_type="application/json")
