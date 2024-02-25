#python
import json

#django 
from django.shortcuts import render
from django.http import HttpResponse , JsonResponse
from django.views.generic.detail import DetailView

#locais
from .models import Message, Room

# Create your views here.
def index(request):
    rooms  = Room.objects.all().order_by('-created_at')


    return render(request, 'chat/home.html',{
        'user': request.user.username,
        'rooms': rooms,
    })


class RoomDetailView(DetailView):
    model = Room
    template_name = 'chat/chat-list-message.html'


    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        return context
    

def send_message(request, pk):
    data = json.loads(request.body)
    room = Room.objects.get(id = pk)
    new_message = Message.objects.create(user = request.user, text = data['message'])

    room.messages.add(new_message)
    print(pk, data)

    return render(request, 'chat/message.html',{
        'message': new_message,
    })

def create_room(request,):
    data = json.loads(request.body)
    room = Room.objects.create(user = request.user, title = data['title'])

    return render(request, 'chat/room.html',{
        'room': room, 
    })

