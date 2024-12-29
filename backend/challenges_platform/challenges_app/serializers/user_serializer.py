from rest_framework import serializers
from ..models import User, UserProfile, Team

class UserProfileSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team_id.name', read_only=True)

    class Meta:
        model = UserProfile
        fields = ['phone_number', 'team_name']  # Only team_name and phone_number are shown in the response

class UserSerializer(serializers.ModelSerializer):
    user_profile = UserProfileSerializer(source='userprofile', required=False)  # Optional profile data

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'password', 'is_staff', 'user_profile']

    def create(self, validated_data):
        # Extract UserProfile data
        user_profile_data = validated_data.pop('user_profile', None)

        # Create the User object with password handling
        user = User.objects.create_user(**validated_data)

        # Create UserProfile if data is provided
        if user_profile_data:
            user_profile = UserProfile.objects.create(
                user=user,
                phone_number=user_profile_data.get('phone_number', None),
                team_id=user_profile_data.get('team_id', None)
            )

        return user

    def update(self, instance, validated_data):
        # Extract UserProfile data
        user_profile_data = validated_data.pop('user_profile', None)

        # Update the User object
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.is_staff = validated_data.get('is_staff', instance.is_staff)
        instance.save()

        # Update the UserProfile if necessary
        if user_profile_data:
            # Get the user's existing profile, or create one if it doesn't exist
            user_profile, created = UserProfile.objects.get_or_create(user=instance)
            
            # Update fields of the profile
            user_profile.phone_number = user_profile_data.get('phone_number', user_profile.phone_number)
            user_profile.team_id = user_profile_data.get('team_id', user_profile.team_id)
            user_profile.save()

        return instance
