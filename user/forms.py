from django import forms

from .models import User

class UserCreateForm(forms.ModelForm):

    class Meta:
        model = User
        fields = ('username', 'password', 'firstname', 'lastname', 'email',)
        
class UserUpdateForm(forms.ModelForm):

    class Meta:
        model = User
        fields = ('username', 'firstname', 'lastname', 'email',)
#        widgets = {
#            'date': DateWidget(usel10n=True, bootstrap_version=3,),
#            'name': forms.TextInput(attrs={'disabled': True}),
#        }
