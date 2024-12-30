from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from challenges_app.serializers import UserSerializer
from challenges_app.models import UserProfile, Team

@api_view(['POST'])
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        # Save the user instance (this will automatically create the user profile if provided)
        user = serializer.save()

        # Create authentication token after successful user creation
        token, _ = Token.objects.get_or_create(user=user)

        user_profile = user.profile 
        # Return the token and user data in the response
        response_data = {
            'token': token.key,
            'user': serializer.data,  # Basic user info (from UserSerializer)
            'user_profile': {
                'phone_number': user_profile.phone_number,
                'team_id': user_profile.team.id if user_profile.team else None,
            }
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED)

    # If serializer is invalid, return validation errors
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def login(request):
    try:
        username = request.data['userName']
        password = request.data['password']
    except KeyError:
        return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    user = get_object_or_404(User, username=username)
    if not user.check_password(password):
        return Response({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

    print(f"User: {user}")

    # Retrieve the UserProfile to get phone_number and team_id
    try:
        user_profile = UserProfile.objects.get(user=user)
        phone_number = user_profile.phone_number
        team_id = user_profile.team.id if user_profile.team else None  # Get the team ID if exists
    except UserProfile.DoesNotExist:
        phone_number = None
        team_id = None

    print(f"UserProfile: {user_profile}")
    print(f"Phone Number: {phone_number}")
    print(f"Team ID: {team_id}")

    token, _ = Token.objects.get_or_create(user=user)  # Ensure idempotent token creation
    serializer = UserSerializer(user)

    print(f"Token: {token.key}")
    print(f"Serialized User: {serializer.data}")

    return Response({
        'token': token.key,
        'user': serializer.data,
        'phone_number': phone_number,
        'team_id': team_id
    }, status=status.HTTP_200_OK)

# there is no need for this function, since we are requiring the token each time the user tries to run a feature.
@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response("passed!")

@api_view(['POST'])
def admin_login(request):
    try:
        username = request.data['username']
        password = request.data['password']
    except KeyError:
        return Response({'error': 'Username and password are required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Authenticate the user
    user = authenticate(request, username=username, password=password)
    
    if user is None:
        return Response({'error': 'Invalid credentials.'}, status=status.HTTP_401_UNAUTHORIZED)

    # Check if the user is a superuser (admin)
    if not user.is_superuser:
        return Response({'error': 'You must be an admin to log in.'}, status=status.HTTP_403_FORBIDDEN)

    # Retrieve the UserProfile to get phone_number
    try:
        user_profile = UserProfile.objects.get(user=user)
        phone_number = user_profile.phone_number
    except UserProfile.DoesNotExist:
        phone_number = None

    # Create or get the token
    token, _ = Token.objects.get_or_create(user=user)
    
    return Response({
        'token': token.key,
        'user': {
            'username': user.username,
            'is_superuser': user.is_superuser,
            'phone_number': phone_number
        }
    }, status=status.HTTP_200_OK)


# this functions are all working  

# the superuser 
# username= tarek2005
# email= tarekaitahmed0@gmail.com
# password=bac231877

