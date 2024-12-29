from django import forms
from .models import Challenge
from .models import Team
from .models import User
from .models import Submission

# CRUD = Create, Read, Update, Delete
# Create a view
# Read a view
# Update a view
# Delete a veiw

class ChallengeForm(forms.ModelForm):
    resources_list = forms.CharField(
        widget=forms.Textarea(attrs={'placeholder': 'Enter resources separated by commas'}),
        required=False,
        label='Resources'
    )

    class Meta:
            model = Challenge
            fields = ['category', 'description', 'resources_list']

    def clean_resources_list(self):
        """Validate and clean the resources input."""
        resources = self.cleaned_data.get('resources_list')
        if resources:
            return [r.strip() for r in resources.split(',')]
        return []

# class UserForm(forms.ModelForm):
#     class Meta:
#         model = User
#         fields = ['name', 'email', 'is_admin', 'team', 'phone_number']
#         widgets = {
#             'name': forms.TextInput(attrs={'placeholder': 'Enter full name'}),
#             'email': forms.EmailInput(attrs={'placeholder': 'Enter email address'}),
#             'is_admin': forms.CheckboxInput(),
#             'team': forms.Select(attrs={'placeholder': 'Select team'}),
#             'phone_number': forms.NumberInput(attrs={'placeholder': 'Enter phone number'}),
#         }

#     def clean_phone_number(self):
#         phone_number = self.cleaned_data.get('phone_number')
#         if phone_number and len(str(phone_number)) != 10:
#             raise forms.ValidationError("Phone number must be exactly 10 digits.")
#         return phone_number


class SubmissionForm(forms.ModelForm):
    class Meta:
        model = Submission
        fields = ['Challenge', 'team', 'video_url', 'resources_links']
        widgets = {
            'Challenge': forms.Select(attrs={'placeholder': 'Select a challenge'}),
            'team': forms.Select(attrs={'placeholder': 'Select a team'}),
            'video_url': forms.URLInput(attrs={'placeholder': 'Enter video URL'}),
            'resources_links': forms.Textarea(attrs={'placeholder': 'Enter resource links, separated by commas'}),
        }

    def clean_resources_links(self):
        resources_links = self.cleaned_data.get('resources_links')
        if resources_links:
            # Validates the format (comma-separated URLs) or applies any additional checks
            links = [link.strip() for link in resources_links.split(',')]
            for link in links:
                if not link.startswith("http"):
                    raise forms.ValidationError("Each resource link must be a valid URL starting with 'http' or 'https'.")
        return resources_links


class TeamForm(forms.ModelForm):
    class Meta:
        model = Team
        fields = ['name', 'Team_leader', 'submission', 'challenge_id']
        widgets = {
            'name': forms.TextInput(attrs={'placeholder': 'Enter team name'}),
            'Team_leader': forms.Select(attrs={'placeholder': 'Select the team leader'}),
            'submission': forms.Select(attrs={'placeholder': 'Select submission'}),
            'challenge_id': forms.Select(attrs={'placeholder': 'Select a challenge'}),
        }

    def clean_name(self):
        name = self.cleaned_data.get('name')
        if Team.objects.filter(name=name).exists():
            raise forms.ValidationError("A team with this name already exists.")
        return name
