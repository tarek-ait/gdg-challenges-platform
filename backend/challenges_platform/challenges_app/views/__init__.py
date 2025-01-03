from .team_views import (
    create_team, 
    team_space_info, 
    join_team,
    leave_team,
    get_teams
)

from .challenge_views import (
    update_challenge,
    add_challenge,
    list_challenges, 
    delete_challenge,
    assign_challenge
)

from .submission_views import (
    add_submission, 
    update_submission,
    get_submissions,
    delete_submission
)

from .auth_views import (
    signup,
    login,
    test_token,
    admin_login,
    get_users
)
__all__ = [
    'create_team', 
    'team_space_info',
    'join_team',
    'leave_team', 
    'update_challenge',
    'add_challenge',
    'list_challenges', 
    'delete_challenge',
    'assign_challenge',
    'add_submission',
    'get_submissions',
    'update_submission',
    'delete_submission',
    'signup',
    'login',
    'admin_login',
    'test_token',
    'get_users',
    'get_teams'
]