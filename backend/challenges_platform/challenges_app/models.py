from django.db import models
from django.contrib.auth.models import User


# Challenge model
class Challenge(models.Model):
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=255)
    description = models.TextField()
    resources = models.TextField(blank=True, null=True)  # Resources link (optional), to the pdf file
    status = models.BooleanField(default=False)  # Status of the challenge
    inserted_at = models.DateTimeField(auto_now_add=True)  # Creation timestamp
    deadline = models.DateTimeField(null=True, blank=True)  # Optional deadline

    def __str__(self):
        return self.title


# Team model
class Team(models.Model):
    name = models.CharField(max_length=255)
    team_leader = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name="led_teams",  # To track teams where the user is a leader
    )
    submission = models.ForeignKey(
        "Submission",
        related_name="teams",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
    )
    team_password = models.CharField(max_length=255)  # Hashed password for the team
    challenge = models.ForeignKey(
        "Challenge",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="teams",  # To link challenges to their teams
    )

    def __str__(self):
        return self.name


# UserProfile model
class UserProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile",  # Link user to profile
    )
    phone_number = models.CharField(max_length=15, blank=True, null=True)  # Optional
    team = models.ForeignKey(
        Team,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="members",  # Link team to its members
    )

    def __str__(self):
        return self.user.username


# Submission model
class Submission(models.Model):
    challenge = models.ForeignKey(
        Challenge,
        on_delete=models.CASCADE,
        related_name="submissions",  # Link challenge to its submissions
    )
    team = models.ForeignKey(
        Team,
        on_delete=models.CASCADE,
        related_name="submissions",  # Link team to its submissions
    )
    video_url = models.URLField()  # Link to the video
    resources_links = models.TextField()  # Additional resources
    submitted_at = models.DateTimeField(auto_now_add=True)  # Submission timestamp

    def __str__(self):
        return f"Submission by {self.team.name} for {self.challenge.title}"