from django.http import HttpResponse

def home_view(request):
    return HttpResponse("<h1> <center> This is Meet-me-backend <center/><h1/><br/> <h3> You can access the frontend here <a href='https://meet-me-lx8v.onrender.com'>Frontend<a/><h3/>")