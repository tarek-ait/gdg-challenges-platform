from rest_framework import serializers
from ..models import Submission

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = ['id', 'challenge_id', 'team_id', 'video_url', 'resources_links']
