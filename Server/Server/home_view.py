from django.http import HttpResponse

def home_view(request):
    return HttpResponse("<h1> <center> This is Meet-me-backend <center/><h1/>")