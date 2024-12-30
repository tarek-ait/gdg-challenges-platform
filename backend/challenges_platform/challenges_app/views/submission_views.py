from django.shortcuts import render
from django.http import  JsonResponse
from django.views.decorators.csrf  import csrf_exempt # for cookies 
from django.contrib.auth.decorators import login_required
from challenges_app.models import Submission, Team, Challenge
import json
from rest_framework.authtoken.models import Token
from django.core.exceptions import ObjectDoesNotExist
from django.core.paginator import Paginator
from rest_framework.decorators import api_view
#  ensuring that the user is logged in

# submitting a soluton for  team
@csrf_exempt
def add_submission(request):
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

        # Parse the request body data
        if not request.body:
            return JsonResponse({'error': 'Request body is empty.'}, status=400)

        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format.'}, status=400)

        # Extract fields and check if required ones are present
        team_id = data.get('team_id')
        challenge_id = data.get('challenge_id')
        video_url = data.get('video_url')
        resources_links = data.get('resources_links')

        if not team_id or not challenge_id or not video_url or not resources_links:
            return JsonResponse({'error': 'Missing required fields: team_id, challenge_id, video_url, resources_links.'}, status=400)

        # Validate the team and challenge
        try:
            team = Team.objects.get(id=team_id)
        except Team.DoesNotExist:
            return JsonResponse({'error': 'Invalid team ID.'}, status=404)

        try:
            challenge = Challenge.objects.get(id=challenge_id)
        except Challenge.DoesNotExist:
            return JsonResponse({'error': 'Invalid challenge ID.'}, status=404)


        # Check if the user is the team leader
        if team.team_leader != user:
            return JsonResponse({'error': 'Only the team leader can submit.'}, status=403)

        # Create the submission
        submission = Submission.objects.create(
            team_id=team,          # Correct field name: team_id
            challenge_id=challenge,  # Correct field name: challenge_id
            video_url=video_url,
            resources_links=resources_links
        )
        
        # Assign the submission ID to the team
        team.submission_id = submission
        team.save()


        return JsonResponse({
            'message': 'Submission successfully added!',
            'submission_id': submission.id,
            'submission_data': {
                'team': submission.team_id.id,  # Correctly use the foreign key reference
                'challenge': submission.challenge_id.id,
                'video_url': submission.video_url,
                'resources_links': submission.resources_links,
            }
        }, status=201)

    return JsonResponse({'error': 'Invalid request method. Only POST allowed.'}, status=405)


# removing a submission@csrf_exempt
@api_view(['DELETE'])
def delete_submission(request):
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

    # Parse the request body data
    if not request.body:
        return JsonResponse({'error': 'Request body is empty.'}, status=400)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format.'}, status=400)

    # Extract submission ID from the request
    submission_id = data.get('submission_id')

    if not submission_id:
        return JsonResponse({'error': 'Missing required field: submission_id.'}, status=400)

    # Check if the submission exists and belongs to the team
    try:
        submission = Submission.objects.get(id=submission_id)
    except Submission.DoesNotExist:
        return JsonResponse({'error': 'Submission does not exist.'}, status=404)

    # Check if the user is the leader of the team associated with the submission
    if submission.team_id.team_leader != user:
        return JsonResponse({'error': 'Permission denied. Only the team leader can delete this submission.'}, status=403)

    # Delete the submission
    submission.delete()

    return JsonResponse({
        'message': 'Submission successfully deleted.',
        'submission_id': submission_id
    }, status=200)

@csrf_exempt
@api_view(['PUT', 'PATCH'])
def update_submission(request):
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

    # Parse the request body data
    if not request.body:
        return JsonResponse({'error': 'Request body is empty.'}, status=400)

    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON format.'}, status=400)

    # Extract fields from the request
    submission_id = data.get('submission_id')
    video_url = data.get('video_url')
    resources_links = data.get('resources_links')

    if not submission_id:
        return JsonResponse({'error': 'Missing required field: submission_id.'}, status=400)

    # Check if the submission exists and belongs to the team
    try:
        submission = Submission.objects.get(id=submission_id)
    except Submission.DoesNotExist:
        return JsonResponse({'error': 'Submission does not exist.'}, status=404)

    # Check if the user is the leader of the team associated with the submission
    if submission.team_id.team_leader != user:
        return JsonResponse({'error': 'Permission denied. Only the team leader can update this submission.'}, status=403)

    # Update fields if provided
    if video_url:
        submission.video_url = video_url
    if resources_links:
        submission.resources_links = resources_links

    # Save the updated submission
    submission.save()

    return JsonResponse({
        'message': 'Submission successfully updated!',
        'submission_id': submission.id,
        'submission_data': {
            'video_url': submission.video_url,
            'resources_links': submission.resources_links
        }
    }, status=200)

# getting the lists of submissions for the admin user 

@csrf_exempt
def get_submissions(request):
    # Extract the Authorization header
    auth_header = request.headers.get('Authorization')
    
    # Check if Authorization header exists and is properly formatted
    if not auth_header or not auth_header.startswith('Token '):
        return JsonResponse({'error': 'Authentication required.'}, status=401)
    
    # Extract the token from the header
    try:
        token_key = auth_header.split(' ')[1]  # Extract the token
    except IndexError:
        return JsonResponse({'error': 'Invalid token format.'}, status=401)

    # Validate the token and retrieve the associated user
    try:
        token = Token.objects.get(key=token_key)
        user = token.user  # Retrieve the associated user
    except Token.DoesNotExist:
        return JsonResponse({'error': 'Invalid or expired token.'}, status=401)

    # Check if the user is a superuser (admin)
    if not user.is_superuser:
        return JsonResponse({'error': 'Permission denied. Admins only.'}, status=403)

    # Retrieve all submissions
    submissions = Submission.objects.all()  # Assumes a Submission model exists

    # Pagination
    paginator = Paginator(submissions, 10)  # Show 10 submissions per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    # Organize the submissions into a JSON-friendly format
    submissions_list = []
    for submission in page_obj:
        # Accessing the team name using the team_id ForeignKey
       
        submissions_list.append({
            'id': submission.id,
            'team_id': submission.challenge_id,  # Team name from the related Team model
            'challenge_id': submission.challenge_id,  # Assuming a related `challenge` model
            'submitted_at': submission.submitted_at.strftime('%Y-%m-%d %H:%M:%S'),  # Format timestamp
            'video_url': submission.video_url,  # Example: video URL field
            'resources_links': submission.resources_links,  # Example: resources links
        })

    # Return the paginated submissions list in JSON format
    return JsonResponse({
        'submissions': submissions_list,
        'total_pages': paginator.num_pages,
        'current_page': page_obj.number,
        'has_next': page_obj.has_next(),
        'has_previous': page_obj.has_previous(),
    }, status=200)
# and thats it for the submissions list