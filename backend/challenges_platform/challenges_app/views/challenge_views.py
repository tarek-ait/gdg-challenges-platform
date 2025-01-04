from django.http import  JsonResponse
from django.views.decorators.csrf  import csrf_exempt # for cookies 
from django.contrib.auth.decorators import login_required
from challenges_app.models import  Challenge, Team
from django.contrib.auth import authenticate
import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.core.paginator import Paginator
from rest_framework.authtoken.models import Token
 # Authenticate the user based on the token
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

def list_challenges(request):
    # Extract the Authorization header
    auth_header = request.headers.get('Authorization')
    
    # Debug: Log the headers to confirm if Authorization is received
    # print(f"Headers: {request.headers}")
    # print(f"Authorization Header: {auth_header}")
    
    # Check if Authorization header exists
    if not auth_header or not auth_header.startswith('Token '):
        return JsonResponse({'error': 'Authentication required.'}, status=401)
    
    # Extract the token from the header
    try:
        token_key = auth_header.split(' ')[1]  # Extract the token
        print(f"Token Key: {token_key}")
    except IndexError:
        return JsonResponse({'error': 'Invalid token format.'}, status=401)

   
    try:
        token = Token.objects.get(key=token_key)
        user = token.user  # Retrieve the associated user
        # print(f"Authenticated User: {user.username}")
    except Token.DoesNotExist:
        return JsonResponse({'error': 'Invalid or expired token.'}, status=401)

    # Retrieve challenges
    challenges = Challenge.objects.all()

    # Pagination
    paginator = Paginator(challenges, 10)  # Show 10 challenges per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    # Organizing the challenges list into a JSON dictionary
    challenges_list = []
    for challenge in page_obj:
        challenges_list.append({
            'id': challenge.id,
            'title': challenge.title,
            'category': challenge.category,
            'description': challenge.description,
            'resources': challenge.resources,
            'status': challenge.status,
            'inserted_at': challenge.inserted_at,
            'deadline': challenge.deadline if challenge.deadline else "Not Available"
        })

    # Return the paginated challenges list in JSON format
    return JsonResponse({
        'challenges': challenges_list,
        'total_pages': paginator.num_pages,
        'current_page': page_obj.number,
        'has_next': page_obj.has_next(),
        'has_previous': page_obj.has_previous(),
    }, status=200)
    
# adding a challenge for the admin only 
@csrf_exempt
def add_challenge(request):
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

        # Check if the user is a superuser
        if not user.is_superuser:
            return JsonResponse({'error': 'Permission denied. Admins only.'}, status=403)

        # Parse the request body data
        if not request.body:
            return JsonResponse({'error': 'Request body is empty.'}, status=400)
        
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format.'}, status=400)

        # Extract fields and check if required ones are present
        title = data.get('title')
        description = data.get('description')
        resources = data.get('resources')

        if not title or not description or not resources:
            return JsonResponse({'error': 'Missing required fields: title, description, resources.'}, status=400)

        # Create the new challenge
        challenge = Challenge.objects.create(
            title=title,
            description=description,
            resources=resources,
            status=False  # Default to False
        )

        return JsonResponse({
            'message': 'Challenge successfully added!',
            'challenge_id': challenge.id,
            'challenge_data': {
                'title': challenge.title,
                'description': challenge.description,
                'resources': challenge.resources
            }
        }, status=201)

    return JsonResponse({'error': 'Invalid request method. Only POST allowed.'}, status=405)

# updating and editing a challenge 
@api_view(['PUT', 'PATCH'])
def update_challenge(request):
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

    # Check if the user is a superuser
    if not user.is_superuser:
        return JsonResponse({'error': 'Permission denied. Admins only.'}, status=403)

    # Parse the request body data
    if not request.body:
        return JsonResponse({'error': 'Request body is empty.'}, status=400)
    
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format.'}, status=400)

    # Extract fields from the request
    challenge_id = data.get('challenge_id')
    title = data.get('title')
    category = data.get('category')
    description = data.get('description')
    resources = data.get('resources')

    # Check if the challenge exists in the database
    try:
        challenge = Challenge.objects.get(id=challenge_id)
    except Challenge.DoesNotExist:
        return JsonResponse({'error': 'Challenge does not exist'}, status=404)

    # Update fields if provided
    if title:
        challenge.title = title
    if description:
        challenge.description = description
    if resources:
        challenge.resources = resources
    if category:
        challenge.category = category
    # Save the updated challenge
    challenge.save()

    return JsonResponse({
        'message': 'Challenge successfully updated!',
        'challenge_id': challenge.id,
        'challenge_data': {
            'title': challenge.title,
            'description': challenge.description,
            'resources': challenge.resources,
            'category': challenge.category
        }
    }, status=200)

# deleting a challenge by the admins

@api_view(['DELETE'])
def delete_challenge(request):
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

    # Check if the user is a superuser
    if not user.is_superuser:
        return JsonResponse({'error': 'Permission denied. Admins only.'}, status=403)

    # Parse the request body data
    if not request.body:
        return JsonResponse({'error': 'Request body is empty.'}, status=400)
    
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format.'}, status=400)

    # Extract challenge ID from the request
    challenge_id = data.get('challenge_id')

    # Check if the challenge exists in the database
    try:
        challenge = Challenge.objects.get(id=challenge_id)
    except Challenge.DoesNotExist:
        return JsonResponse({'error': 'Challenge does not exist'}, status=404)

    # Delete the challenge
    challenge.delete()

    return JsonResponse({
        'message': 'Challenge successfully deleted.',
        'challenge_id': challenge_id
    }, status=200)
    
# the function for assiging a challenge to a team 
@api_view(['PUT', 'PATCH'])
def assign_challenge(request):
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

    # Check if the user is a superuser
    if not user.is_superuser:
        return JsonResponse({'error': 'Permission denied. Admins only.'}, status=403)

    # Parse the request body data
    if not request.body:
        return JsonResponse({'error': 'Request body is empty.'}, status=400)
    
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format.'}, status=400)

    # Extract fields from the request
    challenge_id = data.get('challenge_id')
    team_id  = data.get('team_id')
    
    # gettting the team 
    try:
        team = Team.objects.get(id=team_id)
    except Team.DoesNotExist:
        return JsonResponse({'error': 'Invalid team ID.'}, status=404)

    
    # Check if the challenge exists in the database
    try:
        challenge = Challenge.objects.get(id=challenge_id)
    except Challenge.DoesNotExist:
        return JsonResponse({'error': 'Challenge does not exist'}, status=404)
   
    team.challenge = challenge
    # update the challenge status
    challenge.status = False
    challenge.save()
    team.save()

    return JsonResponse({
        'message': 'Challenge successfully updated!',
        'challenge_id': challenge.id,
        'challenge_data': {
            'title': challenge.title,
            'description': challenge.description,
            'resources': challenge.resources
        }
    }, status=200)
