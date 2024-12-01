from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed


class CustomCookiesAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get("access_token")

        if not access_token:
            raise AuthenticationFailed("Access token not provided in cookies.")

        validated_token = self.get_validated_token(access_token)

        try:
            user = self.get_user(validated_token=validated_token)
            if not user:
                raise AuthenticationFailed("User not found.")

            return (user, validated_token)
        except Exception as e:
            raise AuthenticationFailed(f"Authentication failed: {str(e)}")
