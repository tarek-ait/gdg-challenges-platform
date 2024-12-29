from rest_framework import serializers
from challenges_app.models import Challenge

class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = ['id', 'title', 'category', 'description', 'resources', 'status', 'deadline', 'inserted_at']
