# consumers.py

import json
from .models import Message, Room
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f"chat_{self.room_name}"

        # Adicione a conexão à sala do grupo
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Remova a conexão da sala do grupo
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receba a mensagem do WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_id = text_data_json['message_id']

        # Obtenha a mensagem do banco de dados
        message = Message.objects.get(id=message_id)

        # Envie a mensagem para a sala do grupo
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat.message',
                'message': message.text
            }
        )

    # Receba a mensagem do grupo
    async def chat_message(self, event):
        message = event['message']

        # Envie a mensagem para o WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))
