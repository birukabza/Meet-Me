from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed, InvalidToken
from rest_framework.exceptions import AuthenticationFailed as DRFAuthenticationFailed


class CustomHeaderAuthentication(JWTAuthentication):
    def authenticate(self, request):
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return None

        access_token = auth_header.split(" ")[1]

        try:
            validated_token = self.get_validated_token(access_token)
            user = self.get_user(validated_token)
            if user is None:
                raise DRFAuthenticationFailed("User not found.")
            return (user, validated_token)

        except InvalidToken:
            raise AuthenticationFailed("Invalid or expired access token.")
        except Exception as e:
            raise AuthenticationFailed(f"Authentication error: {str(e)}")
