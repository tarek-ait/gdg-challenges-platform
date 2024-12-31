from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from challenges_app.models import Team, Challenge, Submission, UserProfile
import json
from django.contrib.auth.hashers import make_password, check_password
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.authtoken.models import Token
from django.shortcuts import get_object_or_404



@csrf_exempt
def create_team(request):
    if request.method == 'POST':
        # Extract the Authorization header
        auth_header = request.headers.get('Authorization')
        token_key = auth_header.split(' ')[1] if auth_header and auth_header.startswith('Token ') else None
        
        if not token_key:
            return JsonResponse({'error': 'Invalid or missing token.'}, status=401)

        # Validate token and get the associated user
        try:
            token = Token.objects.get(key=token_key)
            user = token.user
        except Token.DoesNotExist:
            return JsonResponse({'error': 'Invalid or expired token.'}, status=401)

        # Ensure the user has a UserProfile, create if missing
        user_profile, created = UserProfile.objects.get_or_create(user=user)

        # Check if the user already has a team assigned
        if user_profile.team_id:
            return JsonResponse({'error': 'You are already part of a team.'}, status=400)

        # Check if the user already has a team assigned
        if user_profile.team_id:
            return JsonResponse({'error': 'You are already part of a team.'}, status=400)

        # Parse the request body
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format.'}, status=400)

        team_name = data.get('name')
        team_password = data.get('password')

        if not team_name or not team_password:
            return JsonResponse({'error': 'Missing required fields: name and password.'}, status=400)

        # Check if a team with the same name already exists
        if Team.objects.filter(name=team_name).exists():
            return JsonResponse({'error': 'A team with this name already exists.'}, status=400)

        # Hash the team password before storing it
        hashed_password = make_password(team_password)

        # Create the team
        team = Team.objects.create(
            team_leader=user,
            name=team_name,
            team_password=hashed_password,
        )

        # Update the user's profile to reference the newly created team
        user_profile.team_id = team
        user_profile.save()

        # Respond with success and the team details
        return JsonResponse({
            'message': 'Team successfully created!',
            'team_id': team.id,
            'team_name': team.name,
            'team_leader': team.team_leader.username,
        }, status=201)

    return JsonResponse({'error': 'Invalid request method. Only POST is allowed.'}, status=405)

# getting the infos of a team (the team space)
@csrf_exempt
def team_space_info(request,team_id):
# Check if the request method is GET
    if request.method != 'GET':
        return JsonResponse({'error': 'Invalid request method'}, status=405)

    auth_header = request.headers.get('Authorization') 
    # Check if Authorization header exists and is correctly formatted
    token_key = auth_header.split(' ')[1] if auth_header and auth_header.startswith('Token ') else None
    if not token_key:
        return JsonResponse({'error': 'Invalid or missing token.'}, status=401)
    # Validate token and get the associated user
    try:
        token = Token.objects.get(key=token_key)
        user = token.user
    except Token.DoesNotExist:
        return JsonResponse({'error': 'Invalid or expired token.'}, status=401)
    
    # Ensure the user has a UserProfile, create if missing
    user_profile, created = UserProfile.objects.get_or_create(user=user)
    
    # Check if the user already has a team assigned
    if not user_profile.team_id:
            return JsonResponse({'error': 'You are not a part of a team.'}, status=400)
    try:
        # Retrieve the team using the provided team_id
        team = Team.objects.get(id=team_id)
    except Team.DoesNotExist:
        return JsonResponse({'error': 'Team not found'}, status=404)

    
    # Check if the user has a team and if their team matches the requested team_id
    if user_profile.team_id is None:
        return JsonResponse({'error': 'You are not a part of a team.'}, status=400)
    
    
    # Compare the team_id of the user with the team_id in the URL
    if user_profile.team_id != int(team_id):
        return JsonResponse({'error': 'You are not allowed to review this team.'}, status=400)

    

    user_profiles = UserProfile.objects.filter(team_id=team)
    members = [user_profile.user for user_profile in user_profiles]
    # Get the team leader information
    team_leader = team.team_leader.username if team.team_leader else None  # Username of the team leader

    # Get the challenge and submission objects using their respective ids
    challenge = None
    submission = None
    if team.challenge_id:
        try:
            challenge = Challenge.objects.get(id=team.challenge_id)
        except Challenge.DoesNotExist:
            return JsonResponse({'error': 'Challenge not found'}, status=404)

    if team.submission_id:
        try:
            submission = Submission.objects.get(id=team.submission_id.id)
        except Submission.DoesNotExist:
            return JsonResponse({'error': 'Submission not found'}, status=404)

    # Prepare the response data
    team_info = {
        'team_id': team.id,
        'team_name': team.name,
        'team_leader': team_leader,
        'members': [
            {
                'username': member.username,
                'first_name': member.first_name,
                'last_name': member.last_name,
                'email': member.email,
                'profile': {
                    'phone_number': member.profile.phone_number if hasattr(member.profile, 'phone_number') else None
                }
            }
            for member in members
        ],
    }

    if challenge:
        team_info['challenge'] = {
            'id': challenge.id,
            'title': challenge.title,
            'category': challenge.category,
            'description': challenge.description,
            'resources': challenge.resources,
            'status': challenge.status
        }

    if submission:
        team_info['submission'] = {
            'id': submission.id,
            'team_id': submission.team_id.id,
            'challenge_id': submission.challenge_id.id,
            'video_url': submission.video_url,
            'resources_links': submission.resources_links,
        }


    # Return the team information as a JSON response
    return JsonResponse({'team_info': team_info}, status=200)
@csrf_exempt
def join_team(request):
    if request.method == 'POST':
        # Extract the Authorization header
        auth_header = request.headers.get('Authorization')

        # Check if Authorization header exists and is correctly formatted
        token_key = auth_header.split(' ')[1] if auth_header and auth_header.startswith('Token ') else None
        if not token_key:
            return JsonResponse({'error': 'Invalid or missing token.'}, status=401)

        # Validate token and get the associated user
        try:
            token = Token.objects.get(key=token_key)
            user = token.user
        except Token.DoesNotExist:
            return JsonResponse({'error': 'Invalid or expired token.'}, status=401)

        # Parse the request body
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format.'}, status=400)

        team_name = data.get('name')
        team_password = data.get('password')

        # Check if both fields are provided
        if not team_name or not team_password:
            return JsonResponse({'error': 'Missing required fields: name and password.'}, status=400)

        # Get the team by name
        team = get_object_or_404(Team, name=team_name)

        # Check if the password matches
        if not check_password(team_password, team.team_password):
            return JsonResponse({'error': 'Invalid team password.'}, status=400)

        # Ensure the user has a UserProfile, create if missing
        user_profile, created = UserProfile.objects.get_or_create(user=user)

        # Check if the user already has a team assigned
        if user_profile.team_id:
            return JsonResponse({'error': 'You are already part of a team.'}, status=400)

        # Assign the user to the team by setting the team_id
        user_profile.team_id = team
        user_profile.save()

        # Respond with success
        return JsonResponse({
            'message': 'Successfully joined the team!',
            'team_id': team.id,
            'team_name': team.name,
            'team_leader': team.team_leader.username,
        }, status=200)

    return JsonResponse({'error': 'Invalid request method. Only POST is allowed.'}, status=405)

# leaving a team function 
@csrf_exempt
def leave_team(request):
    if request.method == 'POST':
        # Extract the Authorization header
        auth_header = request.headers.get('Authorization')

        # Check if Authorization header exists and is correctly formatted
        token_key = auth_header.split(' ')[1] if auth_header and auth_header.startswith('Token ') else None
        if not token_key:
            return JsonResponse({'error': 'Invalid or missing token.'}, status=401)

        # Validate token and get the associated user
        try:
            token = Token.objects.get(key=token_key)
            user = token.user
        except Token.DoesNotExist:
            return JsonResponse({'error': 'Invalid or expired token.'}, status=401)

        # Ensure the user has a UserProfile, create if missing
        user_profile, created = UserProfile.objects.get_or_create(user=user)

        # Check if the user already has a team assigned
        if not user_profile.team_id:
            return JsonResponse({'error': 'You are not a part of a team.'}, status=400)

        # Get the team the user is part of
        team = user_profile.team

        # Update the user's profile to reference the newly created team
        user_profile.team_id = None
        user_profile.save()

        # Optionally, check if the team leader is leaving the team
        if team.team_leader == user:
            team.delete()  # Disband the team (optional)

        return JsonResponse({'message': f'You have successfully left the team {team.name}.'}, status=200)

    return JsonResponse({'error': 'Invalid request method. Only POST is allowed.'}, status=405)