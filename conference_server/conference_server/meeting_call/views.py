from django.shortcuts import render


# Create your views here.
def index(request):
    return render(request, 'index.html', {})


def meeting(request):
    return render(request, 'meeting.html', {})


def statistics(request):
    return render(request, 'statistics.html', {})
