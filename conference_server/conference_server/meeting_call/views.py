from django.shortcuts import render
from django.http import HttpResponse, HttpRequest
import os
from aiohttp import web


# Create your views here.
def index(request):
    return render(request, 'index.html', {})


class ServerConnection:

    def sdpconnection(request):
        return render(HttpRequest, os.path.join('video-meeting-app/sdp_server', 'server.py'))

    async def meeting(request):
        content = open(os.path.join("video-meeting-app", "meeting.html"), "r").read()
        return web.Response(content_type="text/html", text=content)

    async def javascript(request):
        content = open(os.path.join("video-meeting-app", "client.js"), "r").read()
        return web.Response(content_type="application/javascript", text=content)


def statistics(request):
    return render(request, os.path.join('/templates', 'statistics.html'), {})
