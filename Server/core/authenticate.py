from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed


class CustomCookiesAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token = request.COOKIES.get("access_token")
        if not access_token:
            return None  

        try:
            validated_token = self.get_validated_token(access_token)
            
            user = self.get_user(validated_token)
            if user is None:
                raise AuthenticationFailed("User not found.")

            return (user, validated_token)
        except Exception as e:
           
            return None
