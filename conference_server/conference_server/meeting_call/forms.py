from .models import RoomInfo
from django.forms import ModelForm, TextInput


class RoomInfoForm(ModelForm):
    class Meta:
        model = RoomInfo
        fields = ['user', 'call_id']

        widgets = {
            "user": TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Enter your login',
                'aria-describedby': 'input-group-button-right'
            }),
            "call_id": TextInput(attrs={
                'class': 'form-control',
                'placeholder': 'Create ID for room',
                'aria-describedby': 'input-group-button-left'
            })
        }