from django.urls import path, include
from django.conf.urls import handler404, handler500, handler403

urlpatterns = [
    path('', include('ml_version.urls'))
]

handler404 = 'mockgram_django.views.error404'
handler500 = 'mockgram_django.views.error500'
handler403 = 'mockgram_django.views.error403'
