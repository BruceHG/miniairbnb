from django import forms

from .models import User, Host

class UserCreateForm(forms.ModelForm):

    class Meta:
        model = User
        fields = ('username', 'password', 'firstname', 'lastname', 'birthday', 'email',)
        
class UserUpdateForm(forms.ModelForm):

    class Meta:
        model = User
        fields = ('username', 'firstname', 'lastname', 'email',)
#        widgets = {
#            'date': DateWidget(usel10n=True, bootstrap_version=3,),
#            'name': forms.TextInput(attrs={'disabled': True}),
#        }

class HostCreateForm(forms.ModelForm):

    class Meta:
        model = Host
        fields = ('user', 'phone',)

class HostRegisterForm(forms.ModelForm):

    class Meta:
        model = Host
        fields = ('phone',)