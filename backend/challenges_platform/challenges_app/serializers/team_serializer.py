from rest_framework import serializers
from ..models import Team

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['id', 'name', 'team_leader', 'submission_id', 'challenge_id']
