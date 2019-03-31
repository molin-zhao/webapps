from django.http import HttpResponse

def error404(request, exception):
    return HttpResponse('404')

def error500(request, exception):
    return HttpResponse('500')

def error403(request, exception):
    return HttpResponse('403')
