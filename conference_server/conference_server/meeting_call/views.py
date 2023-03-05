import requests
from django.http import HttpRequest, HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from .forms import RoomInfoForm


# Create your views here.
def index(request):
    error = 'Forms was filled incorrect'
    if request.method == "POST":
        form = RoomInfoForm(request.POST)
        if form.is_valid():
            form.save()
            room_url = form.cleaned_data.get('call_id')
            return HttpResponseRedirect(f'meeting/{room_url}')
        else:
            return error

    form = RoomInfoForm()
    data = {
        'form': form,
        'error': error
    }
    return render(request, 'index.html', data)


@csrf_exempt
def sdpconnection(request):
    if request.method == 'POST':
        url = 'http://127.0.0.1:8080/offer'
        print(request.body)
        resp = requests.post(url, request.body)
        return HttpResponse(resp.content)
    return HttpResponse('')


def get_room_meeting(request, room_url):
    return render(request, 'meeting.html', {})
    # content = open("meeting.html", "r").read()
    # return web.Response(content_type="text/html", text=content)


def statistics(request: HttpRequest):
    return render(request, 'statistics.html', {})
